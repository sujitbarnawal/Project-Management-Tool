import { and, eq } from "drizzle-orm";
import {z} from "zod";
import { db } from "~~/server/database";
import { boards, workspaceMembers } from "~~/server/database/schema";


 const createBoardSchema = z.object({
    workspaceId: z.string().uuid("Invalid workspace ID"),
    name: z.string().min(2, "Name must be at least 2 characters").max(255),
    description: z.string().max(500).optional(),
    backgroundColor: z
      .string()
      .regex(/^#[0-9A-F]{6}$/i)
      .optional(),
  });

export default defineEventHandler(async (event) => {
    const user = event.context.user
    if(!user){
        throw createError({
            statusCode:401,
            statusMessage:'Unauthorized!'
        })
    }
    const body = await readBody(event)
    const data = createBoardSchema.parse(body)

    const member = await db.query.workspaceMembers.findFirst({
        where:and(
            eq(workspaceMembers.userId,user.id),
            eq(workspaceMembers.workspaceId,data.workspaceId)
        )
    })

    if(!member){
        throw createError({
            statusCode:403,
            statusMessage:"You dont have permission to create board in this workspace"
        })
    }

    const existingBoards = await db.query.boards.findMany({
      where: eq(boards.workspaceId, data.workspaceId),
    });

    const maxPosition = existingBoards.length > 0 
      ? Math.max(...existingBoards.map(b => b.position)) 
      : -1;

      const [newBoard] = await db
      .insert(boards)
      .values({
        workspaceId: data.workspaceId,
        name: data.name,
        description: data.description || null,
        backgroundColor: data.backgroundColor || "#0079BF",
        position: maxPosition + 1,
      })
      .returning();

    return {
      success: true,
      board: newBoard,
      message: "Board created successfully",
    };

});
