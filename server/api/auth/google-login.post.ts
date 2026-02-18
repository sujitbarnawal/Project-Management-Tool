import { eq } from "drizzle-orm"
import { db } from "~~/server/database"
import { users } from "~~/server/database/schema"
import { createClient } from "@supabase/supabase-js"

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body.access_token) {
    throw createError({
      statusCode: 400,
      statusMessage: "Access token required"
    })
  }

  const config = useRuntimeConfig()

  const supabase = createClient(
    config.supabaseUrl,
    config.public.supabaseAnonKey
  )

  const { data, error } = await supabase.auth.getUser(body.access_token)

  if (error || !data.user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Invalid Google token"
    })
  }

  const googleUser = data.user

  let existingUser = await db.query.users.findFirst({
    where: eq(users.email, googleUser.email!)
  })

  if (!existingUser) {
    const inserted = await db.insert(users).values({
      email: googleUser.email!,
      name: googleUser.user_metadata.full_name,
      avatar_url: googleUser.user_metadata.avatar_url,
      password: null, 
    }).returning()

    existingUser = inserted[0]
  }


  const accessToken = generateAccessToken(existingUser?.id!)
  const refreshToken = generateRefreshToken(existingUser?.id!)

  setAuthCookies(event, accessToken, refreshToken)

  if(existingUser?.password){
    
  }
  const { password,otp,otp_expiry, ...userWithoutPassword } = existingUser!

  return {
    success: true,
    user: userWithoutPassword,
    message: "Google login successful"
  }
})
