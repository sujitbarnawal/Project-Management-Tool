import { z } from "zod";
import { db } from "~~/server/database";
import { users } from "~~/server/database/schema";
import { eq } from "drizzle-orm";

const updateProfileSchema = z.object({
  name: z.string().min(2).max(255).optional(),
});

export default defineEventHandler(async (event) => {
  const user = event.context.user;
  const userId = getRouterParam(event, "id");

  if (!user) {
    throw createError({
      statusCode: 401,
      message: "Unauthorized",
    });
  }

  if (!userId || userId !== user.id) {
    throw createError({
      statusCode: 403,
      message: "You can only update your own profile",
    });
  }

  try {
    const body = await readBody(event);
    const data = updateProfileSchema.parse(body);

    const [updatedUser] = await db
      .update(users)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();

      if(!updatedUser){
        throw createError({
          statusCode:400,
          message: "Failed to update profile",
        });
      }

    const { password,otp,otp_expiry, ...userWithoutPassword } = updatedUser;

    return {
      success: true,
      user: userWithoutPassword,
      message: "Profile updated successfully",
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