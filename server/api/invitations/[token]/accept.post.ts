import { and, eq } from "drizzle-orm";
import { db } from "~~/server/database";
import {
  workspaceInvitations,
  workspaceMembers,
} from "~~/server/database/schema";

export default eventHandler(async (event) => {
  const user = event.context.user;
  const token = getRouterParam(event, "token");
  if (!user) {
    throw createError({
      statusCode: 400,
      statusMessage: "Unauthorized",
    });
  }
  if (!token) {
    throw createError({
      statusCode: 400,
      statusMessage: "Token is required",
    });
  }

  const invitation = await db.query.workspaceInvitations.findFirst({
    where: eq(workspaceInvitations.token, token),
  });

  if (!invitation) {
    throw createError({
      statusCode: 404,
      statusMessage: "Invitation not found",
    });
  }
  if (invitation.accepted) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invitation already accepted",
    });
  }
  if (new Date() > invitation.expiresAt) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invitation link already expired",
    });
  }
  if (invitation.email !== user.email) {
    throw createError({
      statusCode: 403,
      statusMessage: "This invitation is not for your account",
    });
  }
  const existingMember = await db.query.workspaceMembers.findFirst({
    where: and(
      eq(workspaceMembers.workspaceId, invitation.workspaceId!),
      eq(workspaceMembers.userId, user.id),
    ),
  });
  if (existingMember) {
    throw createError({
      statusCode: 403,
      statusMessage: "This user is already a member of workspace",
    });
  }
  if (!existingMember) {
    await db.insert(workspaceMembers).values({
      workspaceId: invitation.workspaceId!,
      userId: user.id,
      role: invitation.role,
    });
  }
  await db
    .update(workspaceInvitations)
    .set({
      accepted: true,
    })
    .where(eq(workspaceInvitations.id, invitation.id));
  return {
    success: true,
    message: `You have successfuly joined to workspace`,
    workspaceId: invitation.workspaceId,
  };
});
