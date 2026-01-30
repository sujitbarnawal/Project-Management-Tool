import { z } from "zod";
import { db } from "~~/server/database";
import { boards, workspaceMembers } from "~~/server/database/schema";
import { eq, and } from "drizzle-orm";

const updateBoardSchema = z.object({
  name: z.string().min(2).max(255).optional(),
  description: z.string().max(500).optional(),
  backgroundColor: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i)
    .optional(),
});

export default defineEventHandler(async (event) => {
  const user = event.context.user;
  const boardId = getRouterParam(event, "id");

  if (!user) {
    throw createError({
      statusCode: 401,
      message: "Unauthorized",
    });
  }

  if (!boardId) {
    throw createError({
      statusCode: 400,
      message: "Board ID is required",
    });
  }

  const body = await readBody(event);
  const data = updateBoardSchema.parse(body);

  const board = await db.query.boards.findFirst({
    where: eq(boards.id, boardId),
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
      eq(workspaceMembers.userId, user.id),
    ),
  });

  if (!member || member.role === "member") {
    throw createError({
      statusCode: 403,
      message: "You do not have permission to update this board",
    });
  }

  const [updatedBoard] = await db
    .update(boards)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(boards.id, boardId))
    .returning();

  return {
    success: true,
    board: updatedBoard,
    message: "Board updated successfully",
  };
});
