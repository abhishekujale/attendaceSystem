import { Request, Response, NextFunction } from "express";
import { PrismaClient } from '@prisma/client';
import { z } from "zod";

const prisma = new PrismaClient();

interface AuthenticatedRequest extends Request {
  headers: {
    id: string;
    [key: string]: string | string[] | undefined;
  };
}

const adminRoleSchema = z.object({
  role: z.enum(['admin', 'superAdmin'])
});

type AdminRole = z.infer<typeof adminRoleSchema>;

async function getAdminById(id: string): Promise<AdminRole | null> {
  try {
    const admin = await prisma.admin.findUnique({
      where: { id: parseInt(id, 10) },
      select: { role: true }
    });
    return admin ? adminRoleSchema.parse(admin) : null;
  } catch (error) {
    console.error('Error fetching admin:', error);
    return null;
  }
}

export const superAdminMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const adminId = req.headers.id;
    if (!adminId) {
      res.status(401).json({ success: false, message: "User not authenticated" });
      return;
    }

    const admin = await getAdminById(adminId);
    if (!admin) {
      res.status(404).json({ success: false, message: "Admin not found" });
      return;
    }

    if (admin.role !== 'superAdmin') {
      res.status(403).json({ success: false, message: "Access denied. Super admin role required." });
      return;
    }

    next();
  } catch (error) {
    console.error('Error in superAdminMiddleware:', error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};