import { db } from "~~/server/database";
import { boards, workspaceMembers } from "~~/server/database/schema";
import { eq, and } from "drizzle-orm";

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
      eq(workspaceMembers.userId, user.id)
    ),
  });

  if (!member || (member.role !== "owner" && member.role !== "admin")) {
    throw createError({
      statusCode: 403,
      message: "Only workspace owners and admins can delete boards",
    });
  }

  await db.delete(boards).where(eq(boards.id, boardId));

  return {
    success: true,
    message: "Board deleted successfully",
  };
});