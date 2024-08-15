import { Request, Response } from 'express';
import { authenticatejwt } from '../middleware/authMiddleware';
import { superAdminMiddleware } from '../middleware/superAdminMiddleware';
import { adminMiddleware } from '../middleware/adminMiddleware';
import { prisma } from '../config/dbconfig';
import { z } from 'zod';

const router = require('express').Router();


// In-memory storage for file chunks
let chunks: Record<string, Uint8Array[]> = {};

// Validation schema for event input
const eventSchema = z.object({
    compony: z.string().min(1, 'Company name is required'),
    date: z.string().min(1, 'Date is required'),
    round: z.string().min(1, 'Round name is required'),
});

interface StudentChunkData {
    email: string;
    prn: string;
    name: string;
    branch: string;
}

// Get all events
router.get('/', authenticatejwt, adminMiddleware, async (req: Request, res: Response) => {
    try {
        const events = await prisma.event.findMany() || [];
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
router.post('/', authenticatejwt, adminMiddleware, async (req: Request, res: Response) => {
    try {
        const eventData = eventSchema.parse(req.body);
        const newEvent = await prisma.event.create({
            data: {
                compony: eventData.compony,
                date: new Date(eventData.date).toISOString(),
                round: eventData.round,
            }
        });
        return res.status(201).send({
            success: true,
            data: {...newEvent },  // Include the ID in the response
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

router.post('/upload-chunk/:eventId', authenticatejwt, adminMiddleware, async (req: Request, res: Response) => {
    try {
        const { eventId } = req.params;
        const { chunkData } :{chunkData:StudentChunkData[]} = req.body;

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
        const result = await prisma.studentRaw.createMany({
            data: studentsData,
            skipDuplicates: true, // This will skip records that would cause a unique constraint violation
        });

        console.log(`Inserted ${result.count} records`);

        return res.status(200).send({
            success: true,
            message: `Chunk processed. ${result.count} records added to database successfully`
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ success: false, message: "Internal server error", error });
    }
});

router.delete('/:id', authenticatejwt, adminMiddleware, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const eventId = Number(id);

        const deletedEvent = await prisma.event.delete({
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
    } catch (error) {
        console.error(error);
        return res.status(500).send({ success: false, message: "Internal server error", error });
    }
});

router.get('/:eventId', authenticatejwt, adminMiddleware, async (req: Request, res: Response) => {
    try {
        const { eventId } = req.params;

        const event = await prisma.event.findUnique({
            //@ts-ignore
            where: { id: Number(eventId) },
            include: {
                students:{
                    where:{
                        present:true
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
    } catch (error) {
        console.error(error);
        return res.status(500).send({ success: false, message: "Internal server error", error });
    }
});

router.patch('/:id/end', authenticatejwt,adminMiddleware, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const eventId = Number(id);

        const updatedEvent = await prisma.event.update({
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
    } catch (error) {
        console.error(error);
        return res.status(500).send({ success: false, message: "Internal server error", error });
    }
});

export { router };