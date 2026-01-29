import { and, eq } from "drizzle-orm"
import { z} from "zod"
import { db } from "~~/server/database"
import { workspaceMembers, workspaces } from "~~/server/database/schema"

export default defineEventHandler(async(event)=>{
    const updateWorkspaceSchema=z.object({
        name:z.string().min(3).max(255).optional(),
        description:z.string().max(255).optional()

    })
    const user = event.context.user
    const workspaceId = getRouterParam(event,"id")
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

    const body = await readBody(event)
    const data = updateWorkspaceSchema.parse(body)

    const member = await db.query.workspaceMembers.findFirst({
        where:and(
            eq(workspaceMembers.userId,user.id),
            eq(workspaceMembers.workspaceId,workspaceId)
        )
    })

    if(!member || (member.role!=="admin" && member.role!=="owner")){
        throw createError({
            statusCode:403,
            statusMessage:"You dont have permission to update workspace!"
        })
    }

    const [updatedWorkspace]=await db.update(workspaces).set({
        ...data,
        updatedAt:new Date()
    }).where(eq(workspaces.id,workspaceId)).returning()

    return {
        success:true,
        workspace:updatedWorkspace,
        message:"Workspace updated successfully!"
    }

})