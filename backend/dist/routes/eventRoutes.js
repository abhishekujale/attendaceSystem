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
const adminMiddleware_1 = require("../middleware/adminMiddleware");
const dbconfig_1 = require("../config/dbconfig");
const zod_1 = require("zod");
const router = require('express').Router();
exports.router = router;
// In-memory storage for file chunks
let chunks = {};
// Validation schema for event input
const eventSchema = zod_1.z.object({
    compony: zod_1.z.string().min(1, 'Company name is required'),
    date: zod_1.z.string().min(1, 'Date is required'),
    round: zod_1.z.string().min(1, 'Round name is required'),
});
// Get all events
router.get('/', authMiddleware_1.authenticatejwt, adminMiddleware_1.adminMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const events = (yield dbconfig_1.prisma.event.findMany()) || [];
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
        const newEvent = yield dbconfig_1.prisma.event.create({
            data: {
                compony: eventData.compony,
                date: new Date(eventData.date).toISOString(),
                round: eventData.round,
            }
        });
        return res.status(201).send({
            success: true,
            data: Object.assign({}, newEvent), // Include the ID in the response
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
router.post('/upload-chunk/:eventId', authMiddleware_1.authenticatejwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { eventId } = req.params;
        const { chunkData } = req.body;
        console.log(`Received chunk data for event ID: ${eventId}`);
        // Prepare the data for bulk insert
        const studentsData = chunkData.map(student => ({
            eventId: parseInt(eventId),
            emailId: student.email,
            prn: student.prn,
            name: student.name,
            branch: student.branch,
            present: false // Default to false
        }));
        // Perform bulk insert
        const result = yield dbconfig_1.prisma.studentRaw.createMany({
            data: studentsData,
            skipDuplicates: true, // This will skip records that would cause a unique constraint violation
        });
        console.log(`Inserted ${result.count} records`);
        return res.status(200).send({
            success: true,
            message: `Chunk processed. ${result.count} records added to database successfully`
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).send({ success: false, message: "Internal server error", error });
    }
}));
router.delete('/:id', authMiddleware_1.authenticatejwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const eventId = Number(id);
        const deletedEvent = yield dbconfig_1.prisma.event.delete({
            where: { id: eventId }
        });
        if (!deletedEvent) {
            return res.status(404).send({ success: false, message: "Event not found" });
        }
        return res.status(200).send({
            success: true,
            data: deletedEvent,
            message: "Event and associated student data deleted successfully"
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).send({ success: false, message: "Internal server error", error });
    }
}));
router.get('/:eventId', authMiddleware_1.authenticatejwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { eventId } = req.params;
        const event = yield dbconfig_1.prisma.event.findUnique({
            //@ts-ignore
            where: { id: Number(eventId) },
            include: {
                students: {
                    where: {
                        present: true
                    }
                }
            },
        });
        if (!event) {
            return res.status(404).send({ success: false, message: "Event not found" });
        }
        return res.status(200).send({
            success: true,
            data: event,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).send({ success: false, message: "Internal server error", error });
    }
}));
router.patch('/:id/end', authMiddleware_1.authenticatejwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const eventId = Number(id);
        const updatedEvent = yield dbconfig_1.prisma.event.update({
            where: { id: eventId },
            data: { status: 'ended' }
        });
        if (!updatedEvent) {
            return res.status(404).send({ success: false, message: "Event not found" });
        }
        return res.status(200).send({
            success: true,
            data: updatedEvent,
            message: "Event status updated to ended successfully"
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).send({ success: false, message: "Internal server error", error });
    }
}));
