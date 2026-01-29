import { z } from "zod";
import { db } from "~~/server/database";
import { workspaceMembers, workspaces } from "~~/server/database/schema";

export default defineEventHandler(async (event) => {
  const createWorkspaceSchema = z.object({
    name: z.string().min(3, "Name must be atleast 3 characters").max(255),
    description: z.string().max(500).optional(),
  });
  const user = event.context.user;
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized!",
    });
  }
  const body = await readBody(event);
  const data = createWorkspaceSchema.parse(body);

  const [newWorkspace] = await db
    .insert(workspaces)
    .values({
      name: data.name,
      description: data.description || null,
      ownerId: user.id,
    })
    .returning();
  if (!newWorkspace) {
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to create workspace",
    });
  }
  await db.insert(workspaceMembers).values({
    workspaceId: newWorkspace.id,
    userId: user.id,
    role: "owner",
  });
  return {
    success: true,
    workspace: {...newWorkspace,role:"owner"},
    message: "Workspace created successfully",
  };
});
