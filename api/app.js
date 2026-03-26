import express from 'express';
import dotenv from 'dotenv';
const app = express();

dotenv.config();

// middleware
app.use(express.json());

app.get('/', (req, res)=>{
    res.send("Analytics Event Tracking System is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT,  ()=>{
    console.log(`Server running on PORT ${ PORT }`);
});
