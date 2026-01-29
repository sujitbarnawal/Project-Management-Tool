import {z} from "zod"
import { db } from "~~/server/database"
import {  workspaces } from "~~/server/database/schema"

export default defineEventHandler(async(event)=>{
    const createWorkspaceSchema = z.object({
        name:z.string().min(3,"Name must be atleast 3 characters").max(255),
        description:z.string().max(500).optional()
    })
    const user = event.context.user
    if(!user){
        throw createError({
            statusCode:401,
            statusMessage:"Unauthorized!"
        })
    }
    const body = await readBody(event);
    const data = createWorkspaceSchema.parse(body);

    const [newWorkspace]=await db.insert(workspaces).values({
        name:data.name,
        description:data.description||null,
        ownerId:user.id
    }).returning()
    return {
        success:true,
        workspace:newWorkspace,
        message:"Workspace created successfully"
    }
})