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
exports.router = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const dbconfig_1 = require("../config/dbconfig");
const adminMiddleware_1 = require("../middleware/adminMiddleware");
const router = require('express').Router();
exports.router = router;
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error } = (0, authMiddleware_1.loginValidate)(req.body);
        if (error) {
            const errors = {};
            error.forEach((err) => {
                errors[err.path[0]] = err.message;
            });
            return res.status(400).send({ errors, success: false });
        }
        const admin = yield dbconfig_1.prisma.admin.findUnique({ where: { email: req.body.email } });
        if (!admin)
            return res.status(401).send({ errors: { email: 'Admin with given email does not exist' }, success: false });
        const validatePassword = yield bcrypt_1.default.compare(req.body.password, admin.password);
        if (!validatePassword)
            return res.status(401).send({ errors: { password: 'Incorrect password' }, success: false });
        const token = (0, authMiddleware_1.generateAuthToken)(admin.id);
        res.status(200).send({ authToken: token, message: "Logged in successfully", success: true });
    }
    catch (err) {
        console.log(err);
        return res.status(500).send({ message: "Internal server error", success: false });
    }
}));
router.get('/me', authMiddleware_1.authenticatejwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.headers.id;
        //@ts-ignore
        const admin = yield dbconfig_1.prisma.admin.findUnique({ where: { id } });
        if (!admin)
            return res.status(400).send({ message: "Admin does not exist", success: false });
        else {
            return res.status(200).send({
                success: true,
                data: {
                    id: admin.id,
                    email: admin.email,
                    role: admin.role
                }
            });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(400).send({ success: false, message: "Error getting admin", error });
    }
}));
router.post('/', authMiddleware_1.authenticatejwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error } = (0, authMiddleware_1.loginValidate)(req.body);
        if (error) {
            const errors = {};
            error.forEach((err) => {
                errors[err.path[0]] = err.message;
            });
            return res.status(400).send({ errors, success: false });
        }
        const admin = yield dbconfig_1.prisma.admin.findUnique({
            where: {
                email: req.body.email
            }
        });
        if (admin)
            return res.status(409).send({ errors: { email: 'Admin with given email already exists' }, success: false });
        const salt = yield bcrypt_1.default.genSalt(Number(process.env.SALT));
        const hashedPassword = yield bcrypt_1.default.hash(req.body.password, salt);
        const newAdmin = yield dbconfig_1.prisma.admin.create({
            data: {
                email: req.body.email,
                password: hashedPassword,
                role: 'admin',
            },
        });
        return res.status(201).send({
            data: {
                id: newAdmin.id,
                email: newAdmin.email
            },
            message: "Account created successfully",
            success: true
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).send({ message: "Internal server error", success: false });
    }
}));
router.get('/', authMiddleware_1.authenticatejwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const adminData = yield dbconfig_1.prisma.admin.findMany({
            select: {
                id: true,
                email: true,
            }
        });
        return res.status(200).send({
            success: true,
            data: adminData
        });
    }
    catch (error) {
        console.log(error);
        return res.status(400).send({ success: false, message: "Error getting accounts", error });
    }
}));
router.put('/:adminId', authMiddleware_1.authenticatejwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error } = (0, authMiddleware_1.updateValidate)(req.body);
        if (error) {
            const errors = {};
            error.forEach((err) => {
                errors[err.path[0]] = err.message;
            });
            return res.status(400).send({ errors, success: false });
        }
        const adminId = req.params.adminId.split(':')[1];
        const adminIdNumber = Number(adminId);
        if (isNaN(adminIdNumber)) {
            return res.status(400).send({ message: "Invalid admin ID", success: false });
        }
        const { email, password } = req.body;
        if (email && email.trim() !== '') {
            const existingAdmin = yield dbconfig_1.prisma.admin.findUnique({
                where: {
                    email
                }
            });
            if (existingAdmin) {
                return res.status(409).send({ errors: { email: 'Admin with given email already exists' }, success: false });
            }
        }
        let hashedPassword;
        if (password && password.trim() !== '') {
            const salt = yield bcrypt_1.default.genSalt(Number(process.env.SALT));
            hashedPassword = yield bcrypt_1.default.hash(password, salt);
        }
        const updateData = {};
        if (email && email.trim() !== '')
            updateData.email = email;
        if (password && password.trim() !== '')
            updateData.password = hashedPassword;
        const updatedAdmin = yield dbconfig_1.prisma.admin.update({
            where: {
                id: adminIdNumber
            },
            data: updateData
        });
        return res.status(201).send({
            data: {
                id: updatedAdmin.id,
                email: updatedAdmin.email
            },
            message: "Account updated successfully",
            success: true
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).send({ message: "Internal server error", success: false });
    }
}));
router.delete('/:adminId', authMiddleware_1.authenticatejwt, adminMiddleware_1.adminMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const adminId = req.params.adminId;
        const deletedAccount = yield dbconfig_1.prisma.admin.delete({
            where: {
                id: Number(adminId)
            }
        });
        if (!deletedAccount)
            return res.status(500).send({ message: "No account found for this user with given id", success: false });
        return res.status(200).send({
            success: true,
            data: deletedAccount,
            message: "Account deleted"
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).send({ message: "Internal server error", success: false });
    }
}));
router.post('/bulkdelete', authMiddleware_1.authenticatejwt, adminMiddleware_1.adminMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const adminIds = req.body.Ids.map((id) => Number(id));
        yield dbconfig_1.prisma.admin.deleteMany({
            where: {
                id: {
                    in: adminIds
                }
            }
        });
        const adminData = yield dbconfig_1.prisma.admin.findMany({
            select: {
                id: true,
                email: true,
            }
        });
        return res.status(200).send({
            success: true,
            data: adminData
        });
    }
    catch (error) {
        console.log(error);
        return res.status(400).send({ success: false, message: "Error deleting accounts", error });
    }
}));
