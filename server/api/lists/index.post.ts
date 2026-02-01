import { and, eq } from "drizzle-orm"
import { z} from  "zod"
import { db } from "~~/server/database"
import { boards, lists, workspaceMembers } from "~~/server/database/schema"

export default defineEventHandler(async(event)=>{
    const createListSchema = z.object({
        boardId:z.string().uuid(),
        title:z.string().min(1,"List title is required").max(255),  
    })

    const user = event.context.user
    if(!user){
        throw createError({
            statusCode:401,
            statusMessage:"Unauthorized"
        })
    }  
    
    const body =await  readBody(event)
    const data = createListSchema.parse(body)
    const board = await db.query.boards.findFirst({
        where:eq(boards.id,data.boardId)
    })

    if(!board){
        throw createError({
            statusCode:404,
            statusMessage:"Board not found"
        })
    }
    const member = await db.query.workspaceMembers.findFirst({
      where: and(
        eq(workspaceMembers.workspaceId, board.workspaceId),
        eq(workspaceMembers.userId, user.id)
      ),
    });
    if(!member){
        throw createError({
            statusCode:403,
            statusMessage:"Forbidden"
        })
    }
    const existingLists = await db.query.lists.findMany({
        where:eq(lists.boardId,data.boardId)
    })

     const maxPosition = existingLists.length > 0
      ? Math.max(...existingLists.map((l) => l.position))
      : -1;

    const [newList]= await db.insert(lists).values({
        title:data.title,
        boardId:data.boardId,
        position:maxPosition+1
    }).returning()

    return({
        success:true,
        list:newList,
        message:"List Created Successfully!"
    })

})