import express from 'express';
import { setEventDetails, setStudentEventDetails, getEventDetails, 
    updateEventDetails, deleteEvent, getPastEvents
} from '../controllers/eventController.js';

const eventRouter = express.Router();

// Define a route to add event details

eventRouter.post('/details', setEventDetails);
eventRouter.post('/studentEvents', setStudentEventDetails);
eventRouter.get('/details', getEventDetails);
eventRouter.post('/update', updateEventDetails);
eventRouter.get('/meetings', getPastEvents);
eventRouter.delete('/details', deleteEvent);

export default eventRouter;