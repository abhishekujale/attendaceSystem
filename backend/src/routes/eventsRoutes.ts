import { Request, Response } from 'express';
import { authenticatejwt } from '../middleware/authMiddleware';
import { prisma } from '../config/dbconfig';

const router = require('express').Router();

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
        const { compony, date, round } = req.body;
        const newEvent = await prisma.event.create({
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
    } catch (error) {
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

export { router as eventsRouter };
