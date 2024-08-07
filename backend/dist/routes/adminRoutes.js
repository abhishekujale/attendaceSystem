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
        const admin = yield dbconfig_1.prisma.admin.findUnique({ where: { id: req.body.id } });
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
