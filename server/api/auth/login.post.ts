import { eq } from "drizzle-orm"
import { db } from "~~/server/database"
import { users } from "~~/server/database/schema"

export default defineEventHandler(async(event)=>{
    const body = await readBody(event)
    const result = loginSchema.safeParse(body)
    if(!result.success){
        throw createError({
            statusCode:400,
            statusMessage: result.error.issues[0]!.message
        })
    }
    const validatedData = result.data
    const existingUser= await db.query.users.findFirst({
        where:eq(users.email,validatedData.email)
    })
    if(!existingUser){
        throw createError({
            statusCode:404,
            statusMessage:"User not found!"
        })
    }
    const isValid =await verifyPassword(validatedData.password,existingUser.password!)
    if(!isValid){
        throw createError({
            statusCode:401,
            statusMessage:"Invalid Password!"
        })
    }
    const accessToken= generateAccessToken(existingUser.id)
    const refreshToken = generateRefreshToken(existingUser.id)
    setAuthCookies(event,accessToken,refreshToken)
    const {password,otp,otp_expiry,...userWithoutPassword}=existingUser
    return{
        success:true,
        user:userWithoutPassword,
        message:"Login successful"
    }
})