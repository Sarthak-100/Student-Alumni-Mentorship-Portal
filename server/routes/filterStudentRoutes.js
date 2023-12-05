import express from "express";
import {
    student_filter,
    student_prefix,
    student_values,
  } from "../controllers/filterStudentController.js";

  const filterStudentRouter = express.Router();

  filterStudentRouter.get("/student_filter", student_filter);
  filterStudentRouter.get("/student_prefix", student_prefix);
  filterStudentRouter.get("/student_values", student_values);

  export default filterStudentRouter;