"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const adminRoutes_1 = require("./routes/adminRoutes");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 7000;
const corsOptions = {
    origin: '*',
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    credentials: true,
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use("/api/admin", adminRoutes_1.router);
app.get('/', (req, res) => {
    res.json("server is running");
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
