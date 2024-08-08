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
exports.eventsRouter = void 0;
const authMiddleware_1 = require("../middleware/authMiddleware");
const dbconfig_1 = require("../config/dbconfig");
const router = require('express').Router();
exports.eventsRouter = router;
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
        const { compony, date, round } = req.body;
        const newEvent = yield dbconfig_1.prisma.event.create({
            data: {
                compony,
                date,
                round
            }
        });
        return res.status(201).send({
            success: true,
            data: newEvent,
            message: "Event created successfully"
        });
    }
    catch (error) {
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
