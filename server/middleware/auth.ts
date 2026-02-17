import { getUserFromToken } from "../utils/auth";
export default defineEventHandler(async(event)=>{
    const url = getRequestURL(event)
    const publicRoutes = ['/api/auth/register','/api/auth/login','/api/auth/refresh','/api/auth/google-login']
    if(publicRoutes.some((route)=>url.pathname.startsWith(route))){
        return;
    }
    if(url.pathname.startsWith('/api')){
        const user = await getUserFromToken(event)
        if(!user){
            throw createError({
                statusCode:401,
                statusMessage:"Unauthorized"
            })
        }
        event.context.user=user
    }
})