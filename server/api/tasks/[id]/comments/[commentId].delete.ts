import { db } from "~~/server/database";
import { comments, tasks, lists, boards } from "~~/server/database/schema";
import { eq, and } from "drizzle-orm";
import { createActivityLog } from "~~/server/utils/activity";

export default defineEventHandler(async (event) => {
  const user = event.context.user;
  const commentId = getRouterParam(event, "commentId");

  if (!user) {
    throw createError({
      statusCode: 401,
      message: "Unauthorized",
    });
  }

  if (!commentId) {
    throw createError({
      statusCode: 400,
      message: "Comment ID is required",
    });
  }

  const comment = await db.query.comments.findFirst({
    where: eq(comments.id, commentId),
  });

  if (!comment) {
    throw createError({
      statusCode: 404,
      message: "Comment not found",
    });
  }

  if (comment.userId !== user.id) {
    throw createError({
      statusCode: 403,
      message: "You can only delete your own comments",
    });
  }

  // Fetch task to get workspaceId for activity log
  const task = await db.query.tasks.findFirst({
    where: eq(tasks.id, comment.taskId),
  });
  
  if (task) {
      const list = await db.query.lists.findFirst({
        where: eq(lists.id, task.listId),
      });
      
      if (list) {
          const board = await db.query.boards.findFirst({
            where: eq(boards.id, list.boardId),
          });
          
          if (board) {
               await db.delete(comments).where(eq(comments.id, commentId));
               
               await createActivityLog(
                board.workspaceId,
                user.id,
                "deleted",
                "task",
                task.id,
                {
                    commentId,
                    type: "comment",
                    content: comment.content.substring(0, 50)
                }
               );
               
               return {
                success: true,
                message: "Comment deleted successfully",
               };
          }
      }
  }

  // Fallback if structure is broken (should not happen if data integrity is good)
  await db.delete(comments).where(eq(comments.id, commentId));

  return {
    success: true,
    message: "Comment deleted successfully",
  };
});