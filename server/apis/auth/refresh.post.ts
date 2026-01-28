import { eq } from "drizzle-orm"
import { db } from "~~/server/database"
import { users } from "~~/server/database/schema"

export default defineEventHandler(async(event)=>{
    const refreshToken =  getCookie(event,"refreshToken")
    if(!refreshToken){
        throw createError({
            statusCode:401,
            statusMessage:"No refresh token provided"
        })
    }
    const decoded = verifyRefreshToken(refreshToken)
    if(!decoded){
        throw createError({
            statusCode:401,
            statusMessage:"Invalid refresh token"
        })
    }
    const user = await db.query.users.findFirst({
        where:eq(users.id,decoded.userId)
    })
    if(!user){
        throw createError({
            statusCode:404,
            statusMessage:"User not found"
        })
    }
    const newAccessToken=generateAccessToken(user.id)
    const newRefreshToken=generateRefreshToken(user.id)
    setAuthCookies(event,newAccessToken,newRefreshToken)
    const {password,...userWithoutPassword}=user
    return {
        sucess:true,
        user:userWithoutPassword
    }
})