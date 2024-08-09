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
exports.router = void 0;
const authMiddleware_1 = require("../middleware/authMiddleware");
const dbconfig_1 = require("../config/dbconfig");
const zod_1 = require("zod");
const router = require('express').Router();
exports.router = router;
// Validation schema for event input
const eventSchema = zod_1.z.object({
    compony: zod_1.z.string().min(1, 'Company name is required'),
    date: zod_1.z.string().min(1, 'Date is required'),
    round: zod_1.z.string().min(1, 'Round name is required'),
});
// Get all events
router.get('/', authMiddleware_1.authenticatejwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const events = yield dbconfig_1.prisma.event.findMany();
        return res.status(200).send({
            success: true,
            data: events
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).send({ success: false, message: "Internal server error", error });
    }
}));
// Create a new event
router.post('/', authMiddleware_1.authenticatejwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const eventData = eventSchema.parse(req.body);
        console.log(req.body.fileData);
        const newEvent = yield dbconfig_1.prisma.event.create({
            data: {
                compony: eventData.compony,
                date: new Date(eventData.date).toISOString(),
                round: eventData.round,
            }
        });
        return res.status(201).send({
            success: true,
            data: newEvent,
            message: "Event created successfully"
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            const validationErrors = {};
            for (const issue of error.issues) {
                if (!validationErrors[issue.path[0]]) {
                    validationErrors[issue.path[0]] = [];
                }
                validationErrors[issue.path[0]].push(issue.message);
            }
            return res.status(400).send({ success: false, message: "Validation error", error: validationErrors });
        }
        console.error(error);
        return res.status(500).send({ success: false, message: "Internal server error", error });
    }
}));
// Delete a single event by ID
router.delete('/:id', authMiddleware_1.authenticatejwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deletedEvent = yield dbconfig_1.prisma.event.delete({
            where: { id: Number(id) }
        });
        if (!deletedEvent) {
            return res.status(404).send({ success: false, message: "Event not found" });
        }
        return res.status(200).send({
            success: true,
            data: deletedEvent,
            message: "Event deleted successfully"
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).send({ success: false, message: "Internal server error", error });
    }
}));
