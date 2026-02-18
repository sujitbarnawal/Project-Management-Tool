import { eq } from "drizzle-orm";
import { db } from "~~/server/database";
import { users } from "~~/server/database/schema";
import { z } from "zod";
import bcrypt from "bcrypt";

const resetSchema = z.object({
    otp: z.string().length(6, "OTP must be 6 digits"),
    password: z.string().min(8, "Password must be at least 8 characters")
});

export default eventHandler(async (event) => {

    const body = await readBody(event);

    const data = resetSchema.safeParse(body);

    if (!data.success) {
        throw createError({
            statusCode: 400,
            statusMessage: data.error.issues[0]?.message
        });
    }

    const user = await db.query.users.findFirst({
        where: eq(users.otp, data.data.otp)
    });

    if (!user) {
        throw createError({
            statusCode: 400,
            statusMessage: "Invalid OTP"
        });
    }

    if (!user.otp_expiry || new Date() > user.otp_expiry) {
        throw createError({
            statusCode: 400,
            statusMessage: "OTP expired"
        });
    }

    const hashedPassword = await bcrypt.hash(data.data.password, 10);

    await db.update(users).set({
        password: hashedPassword,
        otp: null,
        otp_expiry: null
    }).where(eq(users.id, user.id));

    return {
        success: true,
        message: "Password reset successfully!"
    };
});
