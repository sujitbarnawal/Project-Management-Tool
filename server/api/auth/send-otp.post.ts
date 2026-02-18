import { eq } from "drizzle-orm";
import { db } from "~~/server/database";
import { users } from "~~/server/database/schema";
import { sendOtp } from "~~/server/utils/email";
import {z} from "zod"

const sendSchema=z.object({
    email:z.string().email("Invalid Email Address")
})

export default eventHandler(async(event)=>{
    const body = await readBody(event);
    const data =  sendSchema.safeParse(body)
    if(!data.success){
        throw createError({
            statusCode:400,
            statusMessage:data.error.issues[0]?.message
        })
    }



    const user = await db.query.users.findFirst({
        where:eq(users.email,data?.data.email!)
    })
    if(!user){
        throw createError({
            statusCode:404,
            statusMessage:"User not found"
        })
    }
    let otp=""
    for(let i=0;i<6;i++){
        let a = Math.floor(Math.random()*10)
        otp = otp + String(a)
    }
    await sendOtp(otp,data?.data.email!)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getMinutes() + 10);
    await db.update(users).set({
        otp:otp,
        otp_expiry:expiresAt
    }).where(eq(users.email,data.data.email))
    return {
        success:true,
        message:"OTP sent successfully!"
    }
})