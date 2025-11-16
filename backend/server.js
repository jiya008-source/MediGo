// server.js
import express from 'express';
import cors from 'cors';
import 'dotenv/config'; // make sure this line is BEFORE using process.env

import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import adminRouter from './routes/adminRoute.js';
import doctorRouter from './routes/doctorRoute.js';
import userRouter from './routes/userRoute.js';
import symptomRouter from './routes/symptomRoute.js';
import aiRouter from './routes/aiRoutes.js';

const app = express();
const port = process.env.PORT || 4000;

connectDB(); // connect to MongoDB
connectCloudinary(); // your cloudinary setup

// CORS configuration - must be before other middleware
const allowedOrigins = [
  "https://medi-go-two.vercel.app",     // your frontend
  "http://localhost:3000",              // local development
  "http://localhost:5173",              // Vite default port
  "http://localhost:5175"               // Vite configured port
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: "GET,POST,PUT,PATCH,DELETE",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true,
  })
);

app.options("*", cors()); // handle preflight

app.use(express.json());

app.use('/api/admin', adminRouter);
app.use('/api/doctor', doctorRouter);
app.use('/api/user', userRouter);
app.use('/api/symptom', symptomRouter);
app.use('/api/ai', aiRouter);

app.get('/', (req, res) => {
  res.send('API is working...');
});

app.listen(port, () => console.log(`🚀 Server started on port ${port}`));




            // local development


