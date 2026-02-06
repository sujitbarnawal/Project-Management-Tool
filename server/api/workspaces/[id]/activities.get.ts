import { db } from "~~/server/database";
import { activityLogs, workspaceMembers, users } from "~~/server/database/schema";
import { eq, and, desc } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const user = event.context.user;
  const workspaceId = getRouterParam(event, "id");

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

  // Check if user has access to workspace
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

  // Get activity logs with user info
  const activities = await db
    .select({
      id: activityLogs.id,
      action: activityLogs.action,
      entityType: activityLogs.entityType,
      entityId: activityLogs.entityId,
      metadata: activityLogs.metadata,
      createdAt: activityLogs.createdAt,
      userId: activityLogs.userId,
      userName: users.name,
      userEmail: users.email,
      userAvatarUrl: users.avatar_url,
    })
    .from(activityLogs)
    .innerJoin(users, eq(activityLogs.userId, users.id))
    .where(eq(activityLogs.workspaceId, workspaceId))
    .orderBy(desc(activityLogs.createdAt))
    .limit(50);

  return {
    success: true,
    activities,
  };
});