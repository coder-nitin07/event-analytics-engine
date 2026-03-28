import express from 'express';
import dotenv from 'dotenv';
import eventRouter from './routes/events.routes.js';
import analyticsRouter from './routes/analytics.routes.js';
import connectDB from '../config/db.js';
const app = express();

dotenv.config();

// connect db
await connectDB();

// middleware
app.use(express.json());

// routes
app.use('/api', eventRouter);
app.use('/api', analyticsRouter);

app.get('/', (req, res)=>{
    res.send("Analytics Event Tracking System is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT,  ()=>{
    console.log(`Server running on PORT ${ PORT }`);
});
