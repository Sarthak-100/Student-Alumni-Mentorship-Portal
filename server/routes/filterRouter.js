import express from 'express';
import filter from '../controllers/filterController.js';

const filterRouter = express.Router();

// Define a route to filter alumni profiles

filterRouter.get('/search', filter);

export default filterRouter;