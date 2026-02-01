import { db } from "~~/server/database";
import { workspaces, workspaceMembers } from "~~/server/database/schema";
import { eq, and } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const user = event.context.user;
  const workspaceId = getRouterParam(event, "id");
  const memberId = getRouterParam(event, "memberId");

  if (!user) {
    throw createError({
      statusCode: 401,
      message: "Unauthorized",
    });
  }

  if (!workspaceId || !memberId) {
    throw createError({
      statusCode: 400,
      message: "Workspace ID and Member ID are required",
    });
  }

  const workspace = await db.query.workspaces.findFirst({
    where: eq(workspaces.id, workspaceId),
  });

  if (!workspace) {
    throw createError({
      statusCode: 404,
      message: "Workspace not found",
    });
  }

  const currentMember = await db.query.workspaceMembers.findFirst({
    where: and(
      eq(workspaceMembers.workspaceId, workspaceId),
      eq(workspaceMembers.userId, user.id)
    ),
  });

  if (!currentMember || (currentMember.role !== "owner" && currentMember.role !== "admin")) {
    throw createError({
      statusCode: 403,
      message: "Only workspace owners and admins can remove members",
    });
  }

  const memberToRemove = await db.query.workspaceMembers.findFirst({
    where: and(
      eq(workspaceMembers.workspaceId, workspaceId),
      eq(workspaceMembers.userId, memberId)
    ),
  });

  if (!memberToRemove) {
    throw createError({
      statusCode: 404,
      message: "Member not found in this workspace",
    });
  }

  if (memberToRemove.role === "owner") {
    throw createError({
      statusCode: 403,
      message: "Cannot remove workspace owner",
    });
  }

  if (currentMember.role === "admin" && memberToRemove.role === "admin") {
    throw createError({
      statusCode: 403,
      message: "Admins cannot remove other admins",
    });
  }

  await db
    .delete(workspaceMembers)
    .where(
      and(
        eq(workspaceMembers.workspaceId, workspaceId),
        eq(workspaceMembers.userId, memberId)
      )
    );

  return {
    success: true,
    message: "Member removed from workspace",
  };
});