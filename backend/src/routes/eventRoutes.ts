import { Request, Response } from 'express';
import { authenticatejwt } from '../middleware/authMiddleware';
import { prisma } from '../config/dbconfig';
import { z } from 'zod';

const router = require('express').Router();

// Validation schema for event input
const eventSchema = z.object({
    compony: z.string().min(1, 'Company name is required'),
    date: z.string().min(1, 'Date is required'),
    round: z.string().min(1, 'Round name is required'),
});

// Get all events
router.get('/', authenticatejwt, async (req: Request, res: Response) => {
    try {
        const events = await prisma.event.findMany();
        return res.status(200).send({
            success: true,
            data: events
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ success: false, message: "Internal server error", error });
    }
});

// Create a new event
router.post('/', authenticatejwt, async (req: Request, res: Response) => {
    try {
        const eventData = eventSchema.parse(req.body);
        console.log(req.body.fileData)
        const newEvent = await prisma.event.create({
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
    } catch (error) {
        if (error instanceof z.ZodError) {
            const validationErrors: Record<string, string[]> = {};
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
});

// Delete a single event by ID
router.delete('/:id', authenticatejwt, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deletedEvent = await prisma.event.delete({
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
    } catch (error) {
        console.error(error);
        return res.status(500).send({ success: false, message: "Internal server error", error });
    }
});

export { router };