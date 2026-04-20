import type { VercelRequest, VercelResponse } from '@vercel/node'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { query } from '../../config/database'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' })
    }

    const users = await query(
      `SELECT id, email, password_hash, first_name, last_name, phone, is_active
       FROM customers
       WHERE email = $1`,
      [email.toLowerCase()]
    )

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const user = users[0]

    if (!user.is_active) {
      return res.status(403).json({ error: 'Account is inactive' })
    }

    const validPassword = await bcrypt.compare(password, user.password_hash)

    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    await query(
      'UPDATE customers SET last_login_at = CURRENT_TIMESTAMP WHERE id = $1',
      [user.id]
    )

    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email 
      },
      JWT_SECRET,
      { expiresIn: '30d' }
    )

    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone
      },
      token
    })
  } catch (error: any) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'An error occurred during login' })
  }
}
