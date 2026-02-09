import { z } from "zod";
import { db } from "~~/server/database";
import { comments, tasks, lists, boards, workspaceMembers } from "~~/server/database/schema";
import { eq, and } from "drizzle-orm";
import { createActivityLog } from "~~/server/utils/activity";

const createCommentSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty").max(2000),
});

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
    const body = await readBody(event);
    const data = createCommentSchema.parse(body);

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

    const [newComment] = await db
      .insert(comments)
      .values({
        taskId: taskId,
        userId: user.id,
        content: data.content,
      })
      .returning();

    if (newComment) {
        await createActivityLog(
        board.workspaceId,
        user.id,
        "commented",
        "task",
        taskId,
        {
            commentId: newComment.id,
            content: newComment.content.substring(0, 50) + (newComment.content.length > 50 ? "..." : "")
        }
        );
    }

    return {
      success: true,
      comment: {
        ...newComment,
        userName: user.name,
        userEmail: user.email,
        userAvatarUrl: user.avatar_url
      },
      message: "Comment added successfully",
    };
  } catch (error: any) {
    if (error.issues) {
      throw createError({
        statusCode: 400,
        message: error.issues[0].message,
      });
    }
    throw error;
  }
});