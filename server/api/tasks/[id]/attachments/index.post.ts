import { db } from "~~/server/database";
import { attachments, tasks, lists, boards, workspaceMembers } from "~~/server/database/schema";
import { eq, and } from "drizzle-orm";
import { uploadToCloudinary } from "~~/server/utils/cloudinary";

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

  try {
    const formData = await readMultipartFormData(event);

    if (!formData || formData.length === 0) {
      throw createError({
        statusCode: 400,
        message: "No file uploaded",
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

    const fileData = formData[0];
    const filename = fileData?.filename || 'attachment';
    
    
    const base64File = `data:${fileData?.type};base64,${fileData?.data.toString('base64')}`;

    const uploadResult = await uploadToCloudinary(base64File, 'taskflow/attachments');

    const [newAttachment] = await db
      .insert(attachments)
      .values({
        taskId: taskId,
        filename: filename,
        url: uploadResult.url,
        publicId: uploadResult.publicId,
      })
      .returning();

    return {
      success: true,
      attachment: newAttachment,
      message: "File uploaded successfully",
    };
  } catch (error: any) {
    console.error('Upload error:', error);
    throw createError({
      statusCode: 500,
      message: error.message || "Failed to upload file",
    });
  }
});