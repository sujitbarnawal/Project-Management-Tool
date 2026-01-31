
import { eq, and, asc } from "drizzle-orm";
import { db } from "~~/server/database";
import { boards, workspaceMembers } from "~~/server/database/schema";

export default defineEventHandler(async (event) => {
  const user = event.context.user;
  const workspaceId = getRouterParam(event, "workspaceId");

  if (!user) {
    throw createError({
      statusCode: 401,
      message: "Unauthorized",
    });
  }

  if (!workspaceId) {
    throw createError({
      statusCode: 400,
      message: "Workspace ID is required",
    });
  }

  const member = await db.query.workspaceMembers.findFirst({
    where: and(
      eq(workspaceMembers.workspaceId, workspaceId),
      eq(workspaceMembers.userId, user.id)
    ),
  });

  if (!member) {
    throw createError({
      statusCode: 403,
      message: "You do not have access to this workspace",
    });
  }

  const workspaceBoards = await db.query.boards.findMany({
    where: eq(boards.workspaceId, workspaceId),
    orderBy: [asc(boards.position)],
  });

  return {
    success: true,
    boards: workspaceBoards,
  };
});