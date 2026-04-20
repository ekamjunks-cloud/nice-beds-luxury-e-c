import { neon } from '@neondatabase/serverless'

export async function query(text: string, params?: any[]) {
  const connectionString = process.env.DATABASE_URL
  
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set')
  }

  const sql = neon(connectionString)
  const start = Date.now()
  
  try {
    const res = await sql(text, params || [])
    const duration = Date.now() - start
    console.log('Executed query', { duration, rows: res.length })
    return res
  } catch (error) {
    console.error('Database query error:', error)
    throw error
  }
}
