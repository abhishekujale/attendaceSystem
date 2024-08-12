import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { authenticatejwt, generateAuthToken, loginValidate, updateValidate } from '../middleware/authMiddleware';
import { prisma } from '../config/dbconfig';

const router = require('express').Router();

router.post('/signup', async (req: Request, res: Response) => {
    try {
        const { error } = loginValidate(req.body);

        if (error) {
            const errors: Record<string, string> = {};
            error.forEach((err: { path: string[], message: string }) => {
                errors[err.path[0]] = err.message;
            });
            return res.status(400).send({ errors, success: false });
        }

        const user = await prisma.user.findUnique({ where: { email: req.body.email }});

        if (user)
            return res.status(401).send({ errors: { email: 'User with given email already exists' }, success: false });

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = await prisma.user.create({
            data: {
                email: req.body.email,
                password: hashedPassword,
                role: 'user', // Ensure role is added here
            }
        });

        const token = generateAuthToken(newUser.id);

        res.status(200).send({ authToken: token, message: "Sign Up successfully", success: true });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: "Internal server error", success: false });
    }
});


router.post('/signin', async (req: Request, res: Response) => {
    try {
        const { error } = loginValidate(req.body);

        if (error) {
            const errors:Record<string,string>= {}
            error.forEach((err:{
                path:string[],
                message:string
            })=>{
                errors[err.path[0]]=err.message
            })
            return res.status(400).send({ errors, success: false });
        }

        const user = await prisma.user.findUnique({ where: { email: req.body.email}});
              
        if (!user)
            return res.status(401).send({ errors: {email: 'User with given email does not exist' }, success: false });

        const validatePassword = await bcrypt.compare(req.body.password, user.password);
        if (!validatePassword)
            return res.status(401).send({ errors: { password: 'Incorrect password' }, success: false });

        const token = generateAuthToken(user.id);

        res.status(200).send({ authToken: token, message: "Logged in successfully", success: true });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: "Internal server error", success: false });
    }
});

router.get('/me', authenticatejwt, async (req: Request, res: Response) => {
    try {
        const id = req.headers.id
        //@ts-ignore
        const user = await prisma.user.findUnique({ where: { id }});
        if (!user) return res.status(400).send({ message: "User does not exist", success: false });
        else {
            return res.status(200).send({
                success: true,
                data: {
                    id: user.id,
                    email: user.email,
                    role: user.role
                }
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(400).send({ success: false, message: "Error getting user", error });
    }
});

// ... other imports and existing routes ...

// Mark attendance route
router.post('/mark-attendance/:eventId', authenticatejwt, async (req: Request, res: Response) => {
    try {
        const { eventId } = req.params;
        const userId = req.headers.id;

        if (!userId) {
            return res.status(401).send({ success: false, message: "Unauthorized" });
        }

        // Check if the user exists in the User table
        //@ts-ignore
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            return res.status(404).send({ success: false, message: "User not found" });
        }

        // Check if the event exists and its status
        const event = await prisma.event.findUnique({
            where: { id: Number(eventId) }
        });

        if (!event) {
            return res.status(404).send({ success: false, message: "Event not found" });
        }

        if (event.status === 'ended') {
            return res.status(400).send({ success: false, message: "Cannot mark attendance for an ended event" });
        }

        // Check if there's an entry in StudentRaw table with the eventId and user's email
        const studentEntry = await prisma.studentRaw.findFirst({
            where: {
                eventId: Number(eventId),
                emailId: user.email // Using the email from the found user
            }
        });

        if (!studentEntry) {
            return res.status(404).send({ success: false, message: "Student not registered for this event" });
        }

        // Update the presence
        const updatedEntry = await prisma.studentRaw.update({
            where: { id: studentEntry.id },
            data: { present: true }
        });

        return res.status(200).send({
            success: true,
            message: "Attendance marked successfully",
            data: updatedEntry
        });

    } catch (error) {
        console.error(error);
        return res.status(500).send({ success: false, message: "Internal server error", error });
    }
});


export {router};