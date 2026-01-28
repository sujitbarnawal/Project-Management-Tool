import { db } from "~~/server/database";
import { eq } from "drizzle-orm";
import { users } from "~~/server/database/schema";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const validatedData = registerSchema.parse(body);

  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, validatedData.email),
  });

  if (existingUser) {
    throw createError({
      statusCode: 400,
      statusMessage: "User already exists!",
    });
  }

  const hashedPassword = await hashPassword(validatedData.password);

  const [newUser] = await db
    .insert(users)
    .values({
      name: validatedData.name,
      email: validatedData.email,
      password: hashedPassword,
    })
    .returning();

  if (!newUser) {
    throw createError({
      statusCode: 500,
      statusMessage: "User creation failed",
    });
  }

  const accessToken = generateAccessToken(newUser.id);
  const refreshToken = generateRefreshToken(newUser.id);

  setAuthCookies(event, accessToken, refreshToken);

  const { password, ...userWithoutPassword } = newUser;

  return {
    success: true,
    user: userWithoutPassword,
    message: "Registration successful",
  };
});
