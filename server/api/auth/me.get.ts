import { eq } from "drizzle-orm";
import { db } from "~~/server/database";
import { users } from "~~/server/database/schema";

export default defineEventHandler(async (event) => {
  const user = await getUserFromToken(event);
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }
  // check subscription plan
  const now = new Date();
  let currentUser = user;
  
  if (user.subscription_expiry && user.subscription_expiry < now) {

    if (user.subscription_plan !== "free") {
      const [updatedUser] = await db
        .update(users)
        .set({
          subscription_expiry: null,
          subscription_plan: "free",
        })
        .where(eq(users.id, user.id))
        .returning(); 
      
      currentUser = updatedUser!;
    } else {
      currentUser = { ...user, subscription_expiry: null };
    }
  }

  return {
    success: true,
    user: currentUser,
  };
});
