import express from 'express';
import { setEventDetails, getEventDetails } from '../controllers/eventController.js';

const eventRouter = express.Router();

// Define a route to add event details

eventRouter.post('/details', setEventDetails);
eventRouter.get('/details', getEventDetails);

export default eventRouter;