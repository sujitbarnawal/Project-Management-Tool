import { z } from "zod";
import { db } from "~~/server/database";
import { workspaces, workspaceMembers } from "~~/server/database/schema";
import { eq, and } from "drizzle-orm";

const updateMemberSchema = z.object({
  role: z.enum(["owner", "admin", "member"]),
});

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

  try {
    const body = await readBody(event);
    const data = updateMemberSchema.parse(body);

    const workspace = await db.query.workspaces.findFirst({
      where: eq(workspaces.id, workspaceId),
    });

    if (!workspace) {
      throw createError({
        statusCode: 404,
        message: "Workspace not found",
      });
    }

    if (workspace.ownerId !== user.id) {
      throw createError({
        statusCode: 403,
        message: "Only workspace owner can change member roles",
      });
    }

    if (memberId === workspace.ownerId && data.role !== "owner") {
      throw createError({
        statusCode: 403,
        message: "Cannot change workspace owner's role",
      });
    }

    const [updatedMember] = await db
      .update(workspaceMembers)
      .set({ role: data.role })
      .where(
        and(
          eq(workspaceMembers.workspaceId, workspaceId),
          eq(workspaceMembers.userId, memberId)
        )
      )
      .returning();

    if (!updatedMember) {
      throw createError({
        statusCode: 404,
        message: "Member not found in this workspace",
      });
    }

    return {
      success: true,
      message: "Member role updated successfully",
      member: updatedMember,
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