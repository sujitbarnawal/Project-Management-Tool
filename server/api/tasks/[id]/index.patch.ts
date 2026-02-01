import { z } from "zod";
import { db } from "~~/server/database";
import { tasks, lists, boards, workspaceMembers } from "~~/server/database/schema";
import { eq, and } from "drizzle-orm";

const updateTaskSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().max(2000).optional(),
  dueDate: z.string().datetime().optional().nullable(),
  position: z.number().optional(),
  listId: z.string().uuid().optional(), // For moving between lists
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


    const body = await readBody(event);
    const data = updateTaskSchema.parse(body);

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
        message: "You do not have permission to update this task",
      });
    }


    const updateData: any = {
      ...data,
      updatedAt: new Date(),
    };


    if (data.dueDate !== undefined) {
      updateData.dueDate = data.dueDate ? new Date(data.dueDate) : null;
    }

 
    const [updatedTask] = await db
      .update(tasks)
      .set(updateData)
      .where(eq(tasks.id, taskId))
      .returning();

    return {
      success: true,
      task: updatedTask,
      message: "Task updated successfully",
    };

});