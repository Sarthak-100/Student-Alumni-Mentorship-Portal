import express from 'express';
import {values,filter,prefix,getAlumniNameById} from '../controllers/filterAlumniController.js';

const filterRouter = express.Router();

// Define a route to filter alumni profiles

filterRouter.get('/search', filter);
filterRouter.get('/values', values);
filterRouter.get('/alumniPrefix', prefix);
filterRouter.get('/getAlumniNameById', getAlumniNameById);

export default filterRouter;