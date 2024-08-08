import express from 'express';
import compression from 'compression';
import cors, { CorsOptions } from 'cors'; 
import dotenv from 'dotenv';
import { router as adminRouter } from "./routes/adminRoutes";
import { router as userRouter } from "./routes/userRoutes";
import { router as eventRouter } from "./routes/eventRoutes";
import { createAdmin } from './utils/createAdmin';

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
app.use("/api/admin", adminRouter);
app.use("/api/user", userRouter);  // Keep userRouter
app.use("/api/event", eventRouter); // Keep eventRouter
app.get('/', (req, res) => {
  res.json("server is running");
});
app.use(compression());
createAdmin();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
