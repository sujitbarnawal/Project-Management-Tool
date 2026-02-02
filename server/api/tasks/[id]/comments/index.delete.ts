import { db } from "~~/server/database";
import { comments } from "~~/server/database/schema";
import { eq, and } from "drizzle-orm";

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

  await db.delete(comments).where(eq(comments.id, commentId));

  return {
    success: true,
    message: "Comment deleted successfully",
  };
});