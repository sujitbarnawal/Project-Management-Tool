import { db } from "~~/server/database";
import { taskAssignees, tasks, lists, boards, workspaceMembers } from "~~/server/database/schema";
import { eq, and } from "drizzle-orm";
import { createActivityLog } from "~~/server/utils/activity";

export default defineEventHandler(async (event) => {
  const user = event.context.user;
  const taskId = getRouterParam(event, "id");
  const userId = getRouterParam(event, "userId");

  if (!user) {
    throw createError({
      statusCode: 401,
      message: "Unauthorized",
    });
  }

  if (!taskId || !userId) {
    throw createError({
      statusCode: 400,
      message: "Task ID and User ID are required",
    });
  }


  const task = await db.query.tasks.findFirst({
    where: eq(tasks.id, taskId),
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


  await db
    .delete(taskAssignees)
    .where(
      and(
        eq(taskAssignees.taskId, taskId),
        eq(taskAssignees.userId, userId)
      )
    );

  await createActivityLog(
    board.workspaceId,
    user.id,
    "unassigned",
    "task",
    taskId,
    {
      unassignedUserId: userId,
    }
  );

  return {
    success: true,
    message: "User unassigned from task successfully",
  };
});