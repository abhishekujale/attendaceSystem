import { prisma } from "../config/dbconfig";
import bcrypt from 'bcrypt';
export async function createAdmin() {
    const email = 'superadmin@gmail.com';
    const password = 'Pass@123';
    const role = 'superAdmin';
    try {
        const existingAdmin = await prisma.admin.findUnique({
            where: { email: email },
        });
        if (existingAdmin) {
            return;
        }
      const salt = await bcrypt.genSalt(Number(process.env.SALT));
      const hashedPassword = await bcrypt.hash(password, salt);
      const admin = await prisma.admin.create({
        data: {
          email: email,
          password: hashedPassword,
          role: role,
        },
      });
  
    } catch (error) {
      console.error('Error creating admin:', error);
    }
  }
