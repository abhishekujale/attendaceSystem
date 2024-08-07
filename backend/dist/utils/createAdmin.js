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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAdmin = createAdmin;
const dbconfig_1 = require("../config/dbconfig");
const bcrypt_1 = __importDefault(require("bcrypt"));
function createAdmin() {
    return __awaiter(this, void 0, void 0, function* () {
        const email = 'superadmin@gmail.com';
        const password = 'Pass@123';
        const role = 'superAdmin';
        try {
            const existingAdmin = yield dbconfig_1.prisma.admin.findUnique({
                where: { email: email },
            });
            if (existingAdmin) {
                return;
            }
            const salt = yield bcrypt_1.default.genSalt(Number(process.env.SALT));
            const hashedPassword = yield bcrypt_1.default.hash(password, salt);
            const admin = yield dbconfig_1.prisma.admin.create({
                data: {
                    email: email,
                    password: hashedPassword,
                    role: role,
                },
            });
        }
        catch (error) {
            console.error('Error creating admin:', error);
        }
    });
}
