import express from "express";
import { trackEvent } from "../controllers/event.controller.js";
const eventRouter = express.Router();

eventRouter.post('/track-event', trackEvent);

export default eventRouter;