import { and, eq } from "drizzle-orm"
import { db } from "~~/server/database"
import { workspaceMembers, workspaces } from "~~/server/database/schema"

export default defineEventHandler(async(event)=>{
    const user = event.context.user
    const workspaceId=getRouterParam(event,"id")
    if(!user){
        throw createError({
            statusCode:401,
            statusMessage:"Unauthorized!"
        })
    }
    if(!workspaceId){
        throw createError({
            statusCode:400,
            statusMessage:"WorkspaceId is required!"
        })
    }
    const workspace = await db.query.workspaces.findFirst({
        where:eq(workspaces.id,workspaceId)
    })
    if(!workspace){
        throw createError({
            statusCode:404,
            statusMessage:"Workspace not found!"
        })
    }
    if(workspace.ownerId!==user.id){
        throw createError({
            statusCode:403,
            statusMessage:"You dont have permission to delete the workspace"
        })
    }

    await db.delete(workspaces).where(eq(workspaces.id,workspaceId))
    return {
        success:true,
        message:"Workspace deleted successfully!"
    }
})