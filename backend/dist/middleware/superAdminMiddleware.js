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
exports.superAdminMiddleware = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const prisma = new client_1.PrismaClient();
const adminRoleSchema = zod_1.z.object({
    role: zod_1.z.enum(['admin', 'superAdmin'])
});
function getAdminById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const admin = yield prisma.admin.findUnique({
                where: { id: parseInt(id, 10) },
                select: { role: true }
            });
            return admin ? adminRoleSchema.parse(admin) : null;
        }
        catch (error) {
            console.error('Error fetching admin:', error);
            return null;
        }
    });
}
const superAdminMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const adminId = req.headers.id;
        if (!adminId) {
            res.status(401).json({ success: false, message: "User not authenticated" });
            return;
        }
        const admin = yield getAdminById(adminId);
        if (!admin) {
            res.status(404).json({ success: false, message: "Admin not found" });
            return;
        }
        if (admin.role !== 'superAdmin') {
            res.status(403).json({ success: false, message: "Access denied. Super admin role required." });
            return;
        }
        next();
    }
    catch (error) {
        console.error('Error in superAdminMiddleware:', error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});
exports.superAdminMiddleware = superAdminMiddleware;
