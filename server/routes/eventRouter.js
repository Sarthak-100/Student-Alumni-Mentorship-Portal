import express from 'express';
import { setEventDetails, setStudentEventDetails, getEventDetails, updateEventDetails, deleteEvents, getPastEvents } from '../controllers/eventController.js';

const eventRouter = express.Router();

// Define a route to add event details

eventRouter.post('/details', setEventDetails);
eventRouter.post('/studentEvents', setStudentEventDetails);
eventRouter.get('/details', getEventDetails);
eventRouter.post('/update', updateEventDetails);
eventRouter.post('/delete', deleteEvents);
eventRouter.get('/details', getPastEvents);

export default eventRouter;