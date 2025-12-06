import { clerkClient } from '@clerk/clerk-sdk-node'
import { clerkMiddleware } from '@clerk/express'
import { NextFunction, Request, Response } from 'express'

export const clerkAuthMiddleware = clerkMiddleware()

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.auth().userId) {
    return res.status(401).json({ message: 'Unauthenticated' })
  }
  next()
}

// Async admin check that fetches the user from Clerk
export const requireAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.auth().userId
    console.log('Here is the UserId : ', req.auth().userId)
    if (!userId) return res.status(401).json({ message: 'Unauthenticated' })

    const user = await clerkClient.users.getUser(userId)
    // Clerk user object exposes `publicMetadata` (camelCase)
    const role = user.publicMetadata?.role

    if (role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: admin only' })
    }

    // optionally attach role to req for downstream handlers
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(req as any).userRole = role
    next()
  } catch (err) {
    console.error('requireAdmin error', err)
    return res.status(500).json({ message: 'Internal server error' })
  }
}
