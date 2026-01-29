import { eq, or } from "drizzle-orm";
import { db } from "~~/server/database";
import { workspaceMembers, workspaces } from "~~/server/database/schema";

export default defineEventHandler(async (event) => {
  const user = event.context.user;
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized!",
    });
  }
  const userWorkspaces = await db
    .select({
      id: workspaces.id,
      name: workspaces.name,
      description: workspaces.description,
      ownerId: workspaces.ownerId,
      createdAt: workspaces.createdAt,
      updatedAt: workspaces.updatedAt,
      role: workspaceMembers.role,
    })
    .from(workspaces)
    .leftJoin(workspaceMembers, eq(workspaces.id, workspaceMembers.workspaceId))
    .where(
      or(eq(workspaces.ownerId, user.id), eq(workspaceMembers.userId, user.id)),
    );
  return {
    success: true,
    workspaces: userWorkspaces,
  };
});
