import { db } from "~~/server/database";
import { attachments, tasks, lists, boards, workspaceMembers } from "~~/server/database/schema";
import { eq, and } from "drizzle-orm";
import { deleteFromCloudinary } from "~~/server/utils/cloudinary";

export default defineEventHandler(async (event) => {
  const user = event.context.user;
  const attachmentId = getRouterParam(event, "attachmentId");

  if (!user) {
    throw createError({
      statusCode: 401,
      message: "Unauthorized",
    });
  }

  if (!attachmentId) {
    throw createError({
      statusCode: 400,
      message: "Attachment ID is required",
    });
  }

  const attachment = await db.query.attachments.findFirst({
    where: eq(attachments.id, attachmentId),
  });

  if (!attachment) {
    throw createError({
      statusCode: 404,
      message: "Attachment not found",
    });
  }

  const task = await db.query.tasks.findFirst({
    where: eq(tasks.id, attachment.taskId),
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

  if (attachment.publicId) {
    try {
      await deleteFromCloudinary(attachment.publicId);
    } catch (error) {
      console.error('Failed to delete from Cloudinary:', error);
    }
  }

  await db.delete(attachments).where(eq(attachments.id, attachmentId));

  return {
    success: true,
    message: "Attachment deleted successfully",
  };
});