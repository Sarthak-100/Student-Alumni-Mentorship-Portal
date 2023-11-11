import express from 'express';
import meeting from '../controllers/meetingController.js';

const meetingRouter = express.Router();

// Define a route to create online meeting b/w student and alumni

meetingRouter.get('/redirect', meeting);

export default meetingRouter;