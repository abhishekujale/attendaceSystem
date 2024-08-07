"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateValidate = exports.loginValidate = exports.generateAuthToken = exports.authenticatejwt = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = require("zod");
const authenticatejwt = (req, res, next) => {
    var _a;
    try {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        if (!token)
            return res.status(401).send({ success: false, error: new Error("No token exists"), message: "No token exists" });
        const { id } = jsonwebtoken_1.default.verify(token, process.env.JWTPRIVATEKEY);
        req.headers.id = id;
        next();
    }
    catch (err) {
        console.log(err);
        return res.status(401).send({ success: false, error: err, message: "Authentication failed" });
    }
};
exports.authenticatejwt = authenticatejwt;
const generateAuthToken = function (id) {
    const token = jsonwebtoken_1.default.sign({ id }, process.env.JWTPRIVATEKEY);
    return token;
};
exports.generateAuthToken = generateAuthToken;
const passwordComplexity = zod_1.z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');
const loginValidate = (data) => {
    const schema = zod_1.z.object({
        email: zod_1.z
            .string()
            .email({ message: 'Please enter a valid email address' })
            .min(1, { message: 'Email is required' }),
        password: passwordComplexity
            .min(1, { message: 'Password is required' }),
    });
    try {
        schema.parse(data);
        return { error: null };
    }
    catch (e) {
        return { error: e.errors };
    }
};
exports.loginValidate = loginValidate;
const updateValidate = (data) => {
    const schema = zod_1.z.object({
        email: zod_1.z
            .string()
            .transform((val) => val === '' ? undefined : val)
            .refine(val => val === undefined || zod_1.z.string().email().safeParse(val).success, {
            message: 'Please enter a valid email address',
        })
            .optional(),
        password: zod_1.z
            .string()
            .transform((val) => val === '' ? undefined : val)
            .optional()
            .refine(val => !val || passwordComplexity.safeParse(val).success, {
            message: 'Password must meet complexity requirements',
        }),
    }).refine((data) => data.email || data.password, {
        message: 'Either email or password must be provided',
        path: ['email', 'password'],
    }).refine((data) => !(data.email && data.password), {
        message: 'You cannot update both email and password at the same time',
        path: ['email', 'password'],
    });
    try {
        schema.parse(data);
        return { error: null };
    }
    catch (e) {
        return { error: e.errors };
    }
};
exports.updateValidate = updateValidate;
