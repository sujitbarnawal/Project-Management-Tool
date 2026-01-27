import {drizzle} from "drizzle-orm/node-postgres"
import * as schema from "./schema"
import {Pool} from "pg"

import * as dotenv from "dotenv"
dotenv.config()

const config=useRuntimeConfig()

const pool = new Pool ({
    connectionString:process.env.DATABASE_URL!,
})

export const db= drizzle(pool,{schema})