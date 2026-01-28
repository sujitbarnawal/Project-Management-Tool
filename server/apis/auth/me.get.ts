export default defineEventHandler(async(event)=>{
    const user = await getUserFromToken(event)
    if(!user){
        throw createError({
            statusCode:401,
            statusMessage:"Unauthorized"
        })
    }
    return {
        success:true,
        user
    }
})