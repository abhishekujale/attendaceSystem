import { PrismaClient, User } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const prisma = new PrismaClient();

interface AuthenticatedRequest extends Request {
  headers: {
    id: string;
    [key: string]: string | string[] | undefined;
  };
}

const userRoleSchema = z.object({
  role: z.enum(['user', 'admin', 'superAdmin'])
});

type UserRole = z.infer<typeof userRoleSchema>;

async function getUserById(id: string): Promise<User | null> {
  try {
    const user = await prisma.admin.findUnique({
      where: { id: parseInt(id, 10) },
    });
    console.log(user)
    return user;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

export const adminMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.headers.id;
    
    const user = await getUserById(userId);
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    const parsedUser = userRoleSchema.safeParse({ role: user.role });
    if (!parsedUser.success) {
      res.status(500).json({ success: false, message: "Invalid user data" });
      return;
    }
    console.log(parsedUser.data.role)
    if (parsedUser.data.role !== 'admin' && parsedUser.data.role !== 'superAdmin') {
      res.status(403).json({ success: false, message: "Access denied. Admin or Super admin role required." });
      return;
    }

    next();
  } catch (error) {
    console.error('Error in adminMiddleware:', error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};