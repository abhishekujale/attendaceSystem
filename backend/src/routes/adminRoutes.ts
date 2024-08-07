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
        const id = req.headers.id
        //@ts-ignore
        const admin = await prisma.admin.findUnique({ where: { id }});
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


router.post('/', authenticatejwt, async (req: Request, res: Response) => {
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

        const admin = await prisma.admin.findUnique({
            where:{ 
                email: req.body.email
            }
        })

        if(admin)return res.status(409).send({ errors: { email: 'Admin with given email already exists' }, success: false });
        
        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const newAdmin = await prisma.admin.create({
            data: {
                email: req.body.email,
                password: hashedPassword,
                role: 'admin',
            },
        });

        return res.status(201).send({ 
            data: {
                id: newAdmin.id, 
                email: newAdmin.email 
            }, 
            message: "Account created successfully", 
            success: true 
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: "Internal server error", success: false });
    }
});


router.get('/', authenticatejwt, async (req: Request, res: Response) => {
    try {
        
        const adminData = await prisma.admin.findMany({
            select: {
                id:true,
                email: true, 
            }
        });

        return res.status(200).send({
            success: true,
            data: adminData
        });
        
    } catch (error) {
        console.log(error);
        return res.status(400).send({ success: false, message: "Error getting accounts", error });
    }
});


router.put('/:adminId', authenticatejwt, async (req: Request, res: Response) => {
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
        const adminId = req.params.adminId.split(':')[1]
        
        const admin = await prisma.admin.findUnique({
            where:{ 
                email: req.body.email
            }
        })

        if(admin)return res.status(409).send({ errors: { name: 'Admin with given email already exists' }, success: false });
        
        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const newAdmin = await prisma.admin.update({
            where:{
                id:Number(adminId)
            },
            data: {
                email: req.body,
                password: hashedPassword,
                role: 'admin',
            },
        });

        return res.status(201).send({ 
            data: {
                id: newAdmin.id, 
                email: newAdmin.email 
            }, 
            message: "Account updated successfully", 
            success: true 
        });

    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: "Internal server error", success: false });
    }
});

router.delete('/:adminId', authenticatejwt, async (req: Request, res: Response) => {
    try {
        
        const adminId = req.params.adminId
        
        const deletedAccount = await prisma.admin.delete({
            where:{
                id:Number(adminId)
            }
        })
        
        if (!deletedAccount)
            return res.status(500).send({ message: "No account found for this user with given id", success: false });

        return res.status(200).send({
            success: true,
            data: deletedAccount,
            message:"Account deleted"
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: "Internal server error", success: false });
    }
});

router.post('/bulkdelete', authenticatejwt, async (req: Request, res: Response) => {
    try {

        const adminIds = req.body.Ids.map((id:string)=>Number(id)); 

        await prisma.admin.deleteMany({
            where:{
                id:{
                    in:adminIds
                }
            }
        })
        
        const adminData = await prisma.admin.findMany({
            select: {
                id:true,
                email: true, 
            }
        });

        return res.status(200).send({
            success: true,
            data:adminData
        });
        
    } catch (error) {
        console.log(error);
        return res.status(400).send({ success: false, message: "Error deleting accounts", error });
    }
});

export {router};
