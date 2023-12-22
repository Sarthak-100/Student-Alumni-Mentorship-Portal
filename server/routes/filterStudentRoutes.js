import express from "express";
import {
    studentFilter,
    studentPrefix,
    studentValues,
    getStudentNameById,
  } from "../controllers/filterStudentController.js";

  const filterStudentRouter = express.Router();

  filterStudentRouter.get("/student_filter", studentFilter);
  filterStudentRouter.get("/student_prefix", studentPrefix);
  filterStudentRouter.get("/student_values", studentValues);
  filterStudentRouter.get('/getStudentNameById', getStudentNameById);

  export default filterStudentRouter;