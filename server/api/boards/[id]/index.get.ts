import { and, asc, eq } from "drizzle-orm";
import { db } from "~~/server/database";
import { boards, lists, tasks, workspaceMembers } from "~~/server/database/schema";

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

  if (!member) {
    throw createError({
      statusCode: 403,
      message: "You do not have access to this board",
    });
  }

  const boardLists = await db.query.lists.findMany({
    where: eq(lists.boardId, boardId),
    orderBy: [asc(lists.position)],
    with: {
      tasks: {
        orderBy: [asc(tasks.position)],
      },
    },
  });

  return {
    success: true,
    board: {
      ...board,
      lists: boardLists,
      userRole: member.role,
    },
  };
});