"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminMiddleware = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const prisma = new client_1.PrismaClient();
const userRoleSchema = zod_1.z.object({
    role: zod_1.z.enum(['user', 'admin', 'superAdmin'])
});
function getUserById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield prisma.admin.findUnique({
                where: { id: parseInt(id, 10) },
            });
            console.log(user);
            return user;
        }
        catch (error) {
            console.error('Error fetching user:', error);
            return null;
        }
    });
}
const adminMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.headers.id;
        const user = yield getUserById(userId);
        if (!user) {
            res.status(404).json({ success: false, message: "User not found" });
            return;
        }
        const parsedUser = userRoleSchema.safeParse({ role: user.role });
        if (!parsedUser.success) {
            res.status(500).json({ success: false, message: "Invalid user data" });
            return;
        }
        console.log(parsedUser.data.role);
        if (parsedUser.data.role !== 'admin' && parsedUser.data.role !== 'superAdmin') {
            res.status(403).json({ success: false, message: "Access denied. Admin or Super admin role required." });
            return;
        }
        next();
    }
    catch (error) {
        console.error('Error in adminMiddleware:', error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});
exports.adminMiddleware = adminMiddleware;
