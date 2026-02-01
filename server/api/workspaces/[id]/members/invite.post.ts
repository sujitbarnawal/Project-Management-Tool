import { z } from "zod";
import { db } from "~~/server/database";
import { workspaceMembers, users } from "~~/server/database/schema";
import { eq, and } from "drizzle-orm";

const inviteMemberSchema = z.object({
  email: z.string().email("Invalid email address"),
  role: z.enum(["admin", "member"]).default("member"),
});

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

  try {
    const body = await readBody(event);
    const data = inviteMemberSchema.parse(body);

    const currentMember = await db.query.workspaceMembers.findFirst({
      where: and(
        eq(workspaceMembers.workspaceId, workspaceId),
        eq(workspaceMembers.userId, user.id)
      ),
    });

    if (!currentMember || (currentMember.role !== "owner" && currentMember.role !== "admin")) {
      throw createError({
        statusCode: 403,
        message: "Only workspace owners and admins can invite members",
      });
    }

    const invitedUser = await db.query.users.findFirst({
      where: eq(users.email, data.email),
    });

    if (!invitedUser) {
      throw createError({
        statusCode: 404,
        message: "User with this email not found. They need to register first.",
      });
    }

    const existingMember = await db.query.workspaceMembers.findFirst({
      where: and(
        eq(workspaceMembers.workspaceId, workspaceId),
        eq(workspaceMembers.userId, invitedUser.id)
      ),
    });

    if (existingMember) {
      throw createError({
        statusCode: 400,
        message: "User is already a member of this workspace",
      });
    }

    await db.insert(workspaceMembers).values({
      workspaceId: workspaceId,
      userId: invitedUser.id,
      role: data.role,
    });

    return {
      success: true,
      message: `${invitedUser.name} has been added to the workspace`,
      member: {
        userId: invitedUser.id,
        name: invitedUser.name,
        email: invitedUser.email,
        avatarUrl: invitedUser.avatar_url,
        role: data.role,
      },
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