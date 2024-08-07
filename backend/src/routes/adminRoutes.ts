import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { authenticatejwt, generateAuthToken, loginValidate } from '../middleware/authMiddleware';
import { prisma } from '../config/dbconfig';

const router = require('express').Router();

router.post('/login', async (req: Request, res: Response) => {
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

        const admin = await prisma.admin.findUnique({ where: { email: req.body.email}});
              
        if (!admin)
            return res.status(401).send({ errors: {email: 'Admin with given email does not exist' }, success: false });

        const validatePassword = await bcrypt.compare(req.body.password, admin.password);
        if (!validatePassword)
            return res.status(401).send({ errors: { password: 'Incorrect password' }, success: false });

        const token = generateAuthToken(admin.id);

        res.status(200).send({ authToken: token, message: "Logged in successfully", success: true });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: "Internal server error", success: false });
    }
});

router.get('/me', authenticatejwt, async (req: Request, res: Response) => {
    try {
        const admin = await prisma.admin.findUnique({ where: { id: req.body.id}});
        if (!admin) return res.status(400).send({ message: "Admin does not exist", success: false });
        else {
            return res.status(200).send({
                success: true,
                data: {
                    id: admin.id,
                    email: admin.email,
                    role : admin.role
                }
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(400).send({ success: false, message: "Error getting admin", error });
    }
});

export {router};
