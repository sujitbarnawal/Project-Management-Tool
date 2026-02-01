import { db } from "~~/server/database";
import { lists, boards, workspaceMembers } from "~~/server/database/schema";
import { eq, and } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const user = event.context.user;
  const listId = getRouterParam(event, "id");

  if (!user) {
    throw createError({
      statusCode: 401,
      message: "Unauthorized",
    });
  }

  if (!listId) {
    throw createError({
      statusCode: 400,
      message: "List ID is required",
    });
  }

  const list = await db.query.lists.findFirst({
    where: eq(lists.id, listId),
  });

  if (!list) {
    throw createError({
      statusCode: 404,
      message: "List not found",
    });
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
      message: "You do not have permission to delete this list",
    });
  }
  await db.delete(lists).where(eq(lists.id, listId));

  return {
    success: true,
    message: "List deleted successfully",
  };
});