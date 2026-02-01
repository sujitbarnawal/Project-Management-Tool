import { and, eq } from "drizzle-orm";
import {z} from "zod";
import { db } from "~~/server/database";
import { boards, lists, tasks, workspaceMembers } from "~~/server/database/schema";

const createTaskSchema = z.object({
    listId: z.string().uuid("Invalid listId"),
    title: z.string().min(1,"Title is required").max(255),
    description: z.string().max(2000).optional(),
    dueDate:z.string().datetime().optional()
})

export default defineEventHandler(async(event)=>{
    const user = event.context.user
    if(!user){
        throw createError({
            statusCode:401,
            statusMessage:"Unauthorized"
        })
    }
    const body = await readBody(event)
    const data = createTaskSchema.parse(body)
    const list = await db.query.lists.findFirst({
        where:eq(lists.id,data.listId)
    })
    if(!list){
        throw createError({
            statusCode:404,
            statusMessage:"List not found"
        })
    }
     const board = await db.query.boards.findFirst({
      where: eq(boards.id, list.boardId),
    });

    if (!board) {
      throw createError({
        statusCode: 404,
        message: "Board not found",
      });
    }

    const member = await db.query.workspaceMembers.findFirst({
      where: and(
        eq(workspaceMembers.workspaceId, board.workspaceId),
        eq(workspaceMembers.userId, user.id)
      ),
    });

    if (!member) {
      throw createError({
        statusCode: 403,
        message: "You do not have access to this board",
      });
    }


    const existingTasks = await db.query.tasks.findMany({
      where: eq(tasks.listId, data.listId),
    });

    const maxPosition = existingTasks.length > 0
      ? Math.max(...existingTasks.map((t) => t.position))
      : -1;

    const [newTask] = await db
      .insert(tasks)
      .values({
        listId: data.listId,
        title: data.title,
        description: data.description || null,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        position: maxPosition + 1,
      })
      .returning();

    return {
      success: true,
      task: newTask,
      message: "Task created successfully",
    };
})