import { and, eq } from "drizzle-orm"
import { db } from "~~/server/database"
import { users, workspaceMembers, workspaces } from "~~/server/database/schema"

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

    const member = await db.query.workspaceMembers.findFirst({
        where: and(
            eq(workspaceMembers.workspaceId,workspaceId),
            eq(workspaceMembers.userId,user.id)
        )
    })

    if(!member){
        throw createError({
            statusCode:403,
            statusMessage:"You donot have access to this workspace"
        })
    }
    const workspace=await db.query.workspaces.findFirst({
        where:eq(workspaces.id,workspaceId)
    })
    if(!workspace){
        throw createError({
            statusCode:404,
            message:"Workspace not found!"
        })
    }

    const members = await db.select({
        userId:workspaceMembers.userId,
        role:workspaceMembers.role,
        joinedAt:workspaceMembers.joinedAt,
        name:users.name,
        email:users.email,
        avatar_url:users.avatar_url
    }).from(workspaceMembers)
    .innerJoin(users,eq(workspaceMembers.userId,users.id))
    .where(eq(workspaceMembers.workspaceId,workspaceId))

    return {
        success:true,
        workspace:{
            ...workspace,
            members,
            userRole:member.role
        }
    }

})