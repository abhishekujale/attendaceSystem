import express from 'express';
import cors, { CorsOptions } from 'cors'; 
import dotenv from 'dotenv';
import {router as adminRouter} from "./routes/adminRoutes"
dotenv.config();


const app = express();
const port = process.env.PORT || 7000;

const corsOptions: CorsOptions = {
  origin: '*', 
  methods: ['GET','HEAD','PUT','PATCH','POST','DELETE'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use("/api/admin",adminRouter)
app.get('/',(req,res)=>{
    res.json("server is running")
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});