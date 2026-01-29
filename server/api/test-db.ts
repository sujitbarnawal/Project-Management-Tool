import { Client } from 'pg';

export default defineEventHandler(async () => {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  try {
    await client.connect();
    await client.end();
    return { success: true };
  } catch (err:any) {
    return { success: false, error: err.message };
  }
});