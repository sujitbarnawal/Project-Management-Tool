import { db } from "~~/server/database";
import { tasks, lists, boards, workspaceMembers } from "~~/server/database/schema";
import { eq, and } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const user = event.context.user;
  const taskId = getRouterParam(event, "id");

  if (!user) {
    throw createError({
      statusCode: 401,
      message: "Unauthorized",
    });
  }

  if (!taskId) {
    throw createError({
      statusCode: 400,
      message: "Task ID is required",
    });
  }

  const task = await db.query.tasks.findFirst({
    where: eq(tasks.id, taskId),
    with: {
      comments: {
        with: {
          user: {
            columns: {
              id: true,
              name: true,
              email: true,
              avatar_url: true,
            },
          },
        },
      },
      attachments: true,
      assignees: {
        with: {
          user: {
            columns: {
              id: true,
              name: true,
              email: true,
              avatar_url: true,
            },
          },
        },
      },
    },
  });

  if (!task) {
    throw createError({
      statusCode: 404,
      message: "Task not found",
    });
  }

  const list = await db.query.lists.findFirst({
    where: eq(lists.id, task.listId),
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
      message: "You do not have access to this task",
    });
  }

  return {
    success: true,
    task,
  };
});