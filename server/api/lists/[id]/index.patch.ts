import { and, eq } from "drizzle-orm"
import {z} from "zod"
import { db } from "~~/server/database"
import { boards, lists, workspaceMembers } from "~~/server/database/schema"

export default defineEventHandler(async(event)=>{
    const updateSchema=z.object({
        title:z.string().min(1).max(255).optional(),
        position:z.number().optional()
    })

    const user = event.context.user
    const listId = getRouterParam(event,"id")
    if(!user){
        throw createError({
            statusCode:401,
            statusMessage:"Unauthorized"
        })
    }
    if(!listId){
        throw createError({
            statusCode:400,
            statusMessage:"ListId is required"
        })
    }
    const body = await readBody(event)
    const data = updateSchema.parse(body)

    const list= await db.query.lists.findFirst({
        where:eq(lists.id,listId)
    })
    if(!list){
        throw createError({
            statusCode:404,
            statusMessage:"List not found"
        })
    }
    const board=await db.query.boards.findFirst({
        where:eq(boards.id,list.boardId)
    })
    if(!board){
        throw createError({
            statusCode:404,
            statusMessage:"Board not found"
        })
    }
    const member = await db.query.workspaceMembers.findFirst({
        where:and(
            eq(workspaceMembers.userId,user.id),
            eq(workspaceMembers.workspaceId,board.workspaceId)
        )
    })
    if(!member){
        throw createError({
            statusCode:401,
            statusMessage:"Forbidden"
        })
    }
    const [updatedList] = await db.update(lists).set({
       ...data,
        updatedAt:new Date()
    }).where(eq(lists.id,listId)).returning()
    return{
        success:true,
        list:updatedList,
        message:"List updated successfully"
    }
})