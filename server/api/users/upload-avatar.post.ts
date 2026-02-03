import { db } from "~~/server/database";
import { users } from "~~/server/database/schema";
import { eq } from "drizzle-orm";
import { uploadToCloudinary, deleteFromCloudinary } from "~~/server/utils/cloudinary";

export default defineEventHandler(async (event) => {
  const user = event.context.user;

  if (!user) {
    throw createError({
      statusCode: 401,
      message: "Unauthorized",
    });
  }

  try {
    const formData = await readMultipartFormData(event);

    if (!formData || formData.length === 0) {
      throw createError({
        statusCode: 400,
        message: "No file uploaded",
      });
    }

    const fileData = formData[0];

    if (!fileData?.type?.startsWith('image/')) {
      throw createError({
        statusCode: 400,
        message: "Only image files are allowed",
      });
    }

    const base64File = `data:${fileData.type};base64,${fileData.data.toString('base64')}`;


    const currentUser = await db.query.users.findFirst({
      where: eq(users.id, user.id),
    });


    if (currentUser?.avatar_url) {
      const publicIdMatch = currentUser.avatar_url.match(/\/v\d+\/(.+)\.\w+$/);
      if (publicIdMatch) {
        try {
          await deleteFromCloudinary(publicIdMatch[1]!);
        } catch (error) {
          console.error('Failed to delete old avatar:', error);
        }
      }
    }

    const uploadResult = await uploadToCloudinary(base64File, 'taskflow/avatars');

    const [updatedUser] = await db
      .update(users)
      .set({
        avatar_url: uploadResult.url,
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id))
      .returning();

    if(!updatedUser){
        throw createError({
            statusCode:400,
            message: "Failed to upload avatar",
        })
    }

    const { password, ...userWithoutPassword } = updatedUser;

    return {
      success: true,
      user: userWithoutPassword,
      message: "Avatar uploaded successfully",
    };
  } catch (error: any) {
    console.error('Avatar upload error:', error);
    throw createError({
      statusCode: 500,
      message: error.message || "Failed to upload avatar",
    });
  }
});