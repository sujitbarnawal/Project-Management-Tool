import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";
import { H3Event } from "h3";
import * as dotenv from "dotenv";
dotenv.config();

// hash the password
export const hashPassword = async (password: string): Promise<string> => {
  const hashed = await bcrypt.hash(password, 10);
  return hashed;
};

// verify the password
export const verifyPassword = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  const isValid = await bcrypt.compare(password, hashedPassword);
  return isValid;
};

// generate JWT access token
export const generateAccessToken = (userId: string): string => {
  const config = useRuntimeConfig();
  if (!config.jwtSecret) {
    throw createError({
      statusMessage: "JWT Secret is missing",
    });
  }
  const options: SignOptions = {
    expiresIn: config.jwtExpiresIn as any,
  };
  return jwt.sign({ userId }, config.jwtSecret, options);
};

// generate JWT refresh token
export const generateRefreshToken = (userId: string): string => {
  const config = useRuntimeConfig();
  if (!config.jwtRefreshSecret) {
    throw createError({
      statusMessage: "JWT Refresh secret is missing",
    });
  }
  const options: SignOptions = {
    expiresIn: config.jwtRefreshExpiresIn as any,
  };
  return jwt.sign({ userId }, config.jwtRefreshSecret, options);
};

// verify JWT access token
export const verifyAccessToken = (token: string): { userId: string } | null => {
  const config = useRuntimeConfig();
  try {
    const decoded = jwt.verify(token, config.jwtSecret) as { userId: string };
    return decoded;
  } catch (error) {
    return null;
  }
};

// verify JWT refresh token
export const verifyRefreshToken = (
  token: string,
): { userId: string } | null => {
  const config = useRuntimeConfig();
  try {
    const decoded = jwt.verify(token, config.jwtRefreshSecret) as {
      userId: string;
    };
    return decoded;
  } catch (error) {
    return null;
  }
};

// set cookies
export const setAuthCookies = (
  event: H3Event,
  accessToken: string,
  refreshToken: string,
) => {
  setCookie(event, "accessToken", accessToken, {
    sameSite: "lax",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 15,
    path: "/",
  });
  setCookie(event, "refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
};

// clear cookies
export const clearAuthCookies = (event: H3Event) => {
  deleteCookie(event, "accessToken");
  deleteCookie(event, "refreshToken");
};

// get user from token
export const getUserFromToken = async (event: H3Event) => {
  const accessToken = getCookie(event, "accessToken");
  if (!accessToken) {
    throw createError({
        statusCode:401,
        statusMessage:"Access token is required!"
    });
  }
  const decoded = verifyAccessToken(accessToken);
  if (!decoded) {
    throw createError({
        statusCode:401,
        statusMessage:"Invalid access token!"
    });
  }
  const { db } = await import("../database");
  const { users } = await import("../database/schema");
  const { eq } = await import("drizzle-orm");

  const user = await db.query.users.findFirst({
    where:eq(users.id,decoded.userId)
  })
  if (!user) {
    throw createError({
        statusCode:404,
        statusMessage:"User not found!"
    });
  }
  const { password,otp,otp_expiry, ...userWithoutPassword } = user;
  return userWithoutPassword;
};
