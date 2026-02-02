import { and, desc, eq } from "drizzle-orm";
import { db } from "~~/server/database";
import { boards, comments, lists, tasks, users, workspaceMembers } from "~~/server/database/schema";

export default defineEventHandler(async (event) => {
    const user = event.context.user;
    const taskId = getRouterParam(event, 'id');
    if(!user){
        throw createError({
            statusCode: 401,
            statusMessage: 'Unauthorized'
        })
    }
    if(!taskId){
        throw createError({
            statusCode: 400,
            statusMessage: 'TaskId is required'
        })
    }

    const task = await db.query.tasks.findFirst({
        where: eq(tasks.id, taskId)
    })
    if(!task){
        throw createError({
            statusCode: 404,
            statusMessage: 'Task not found'
        })
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

  const taskComments = await db
    .select({
      id: comments.id,
      content: comments.content,
      createdAt: comments.createdAt,
      updatedAt: comments.updatedAt,
      userId: comments.userId,
      userName: users.name,
      userEmail: users.email,
      userAvatarUrl: users.avatar_url,
    })
    .from(comments)
    .innerJoin(users, eq(comments.userId, users.id))
    .where(eq(comments.taskId, taskId))
    .orderBy(desc(comments.createdAt));

  return {
    success: true,
    comments: taskComments,
  };
})