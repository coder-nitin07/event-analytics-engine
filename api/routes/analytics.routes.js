import express from "express";
import { getAnalytics } from "../controllers/analytics.controller.js";
import { getJobs } from "../controllers/jobs.controller.js";
const analyticsRouter = express.Router();

analyticsRouter.get("/analytics", getAnalytics);
analyticsRouter.get("/jobs", getJobs);

export default analyticsRouter;