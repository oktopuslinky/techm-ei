import { cookies } from 'next/headers'
import { sql, type User } from './db'
import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'

const SESSION_COOKIE = 'reflectai_session'

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function createSession(userId: string): Promise<string> {
  const sessionId = uuidv4()
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
  
  await sql`
    INSERT INTO sessions (id, user_id, expires_at)
    VALUES (${sessionId}, ${userId}, ${expiresAt.toISOString()})
  `
  
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: expiresAt,
    path: '/',
  })
  
  return sessionId
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies()
    const sessionId = cookieStore.get(SESSION_COOKIE)?.value
    
    if (!sessionId) return null
    
    const sessions = await sql`
      SELECT s.*, u.* 
      FROM sessions s
      JOIN users u ON s.user_id = u.id
      WHERE s.id = ${sessionId}
        AND s.expires_at > NOW()
    `
    
    if (sessions.length === 0) return null
    
    const session = sessions[0]
    return {
      id: session.user_id,
      email: session.email,
      name: session.name,
      avatar_url: session.avatar_url,
      age_group: session.age_group,
      onboarding_completed: session.onboarding_completed,
      created_at: session.created_at,
      updated_at: session.updated_at,
    }
  } catch {
    return null
  }
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value
  
  if (sessionId) {
    await sql`DELETE FROM sessions WHERE id = ${sessionId}`
  }
  
  cookieStore.delete(SESSION_COOKIE)
}

export async function createUser(
  email: string,
  password: string,
  name: string
): Promise<User> {
  const id = uuidv4()
  const passwordHash = await hashPassword(password)
  
  const users = await sql`
    INSERT INTO users (id, email, password_hash, name)
    VALUES (${id}, ${email}, ${passwordHash}, ${name})
    RETURNING *
  `
  
  // Initialize related records
  await sql`INSERT INTO personality (id, user_id) VALUES (${uuidv4()}, ${id})`
  await sql`INSERT INTO points (id, user_id) VALUES (${uuidv4()}, ${id})`
  await sql`INSERT INTO streaks (id, user_id) VALUES (${uuidv4()}, ${id})`
  
  return users[0] as User
}
