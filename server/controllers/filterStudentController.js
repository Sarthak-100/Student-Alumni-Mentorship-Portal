import mongoose from "mongoose";
import { Student } from "../models/userModel.js";

const studentValues = async (req, res) => {
  try {
    const branches = await Student.distinct("branch");
    const batches = await Student.distinct("batch");

    const result = { branches, batches };
    res.status(200).json(result);
    return result;
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while filtering the profiles." });
  }
};

const studentPrefix = async (req, res) => {
  try {
    const result = await Student.find({
      name: { $regex: "^" + req.query.prefix, $options: "i" },
      removed: false,
    });

    res.status(200).json({ result });
    return result;
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while filtering the profiles." });
  }
};

const studentFilter = async (req, res) => {
  try {
    const { batch, branch } = req.query;
    const filters = {};

    if (branch) {
      filters.branch = branch;
    }
    if (batch) {
      filters.batch = parseInt(batch);
    }

    filters.removed = false;

    const result = await Student.find(filters);

    res.status(200).json({ result });
    return result;
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while filtering the profiles." });
  }
};

const getStudentNameById = async (req, res) => {
  try {
    const { studentId } = req.query; // Change to req.query instead of req.params

    // Query the database to find the alumni's name by ID
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Extract the name from the retrieved student data
    const studentName = student.name;

    res.status(200).json({ studentName });
    return studentName;
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching the student name.' });
  }
}

export { studentFilter, studentPrefix, studentValues, getStudentNameById };
