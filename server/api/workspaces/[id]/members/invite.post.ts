import { z } from "zod";
import { db } from "~~/server/database";
import { workspaceMembers, workspaceInvitations, workspaces } from "~~/server/database/schema";
import { eq, and } from "drizzle-orm";
import { sendInviteEmail } from "~~/server/utils/email";
import crypto from "crypto"

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

    const existingInvite = await db.query.workspaceInvitations.findFirst({
    where: and(
      eq(workspaceInvitations.workspaceId, workspaceId),
      eq(workspaceInvitations.email, data.email),
      eq(workspaceInvitations.accepted, false)
    ),
  });

  if (existingInvite) {
    throw createError({
      statusCode: 400,
      message: "User already invited",
    });
  }

  const token = crypto.randomBytes(32).toString("hex");

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await db.insert(workspaceInvitations).values({
    workspaceId,
    email: data.email,
    role: data.role,
    token,
    invitedBy: user.id,
    expiresAt,
  });
 const config = useRuntimeConfig()
  const inviteLink = `${config.public.baseUrl}/invite/${token}`;
  console.log(inviteLink)

  const workspace= await db.query.workspaces.findFirst({
    where:eq(workspaces.id,workspaceId)
  })

  try {
    await sendInviteEmail(
      data.email,
      user.name,
      workspace?.name!,
      inviteLink
    );
  } catch (error) {
    console.error("Email failed:", error);
  }

  return {
    success: true,
    message: "Invitation Email sent successfully",
  };
});