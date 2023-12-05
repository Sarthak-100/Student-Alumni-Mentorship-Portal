import mongoose from "mongoose";
import { Student } from "../models/userModel.js";

const student_values = async (req, res) => {
  try {
    const branches = await Student.distinct('branch');
    const batches = await Student.distinct('batch');

    const result = { branches, batches };
    res.status(200).json(result);
    return result;
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while filtering the profiles.' });
  }
};

const student_prefix = async (req, res) => {
  try {
    const result = await Student.find({ name: { $regex: '^' + req.query.prefix, $options: 'i' } });

    res.status(200).json({ result });
    return result;
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while filtering the profiles.' });
  }
};

const student_filter = async (req, res) => {
  try {
    const { batch, branch } = req.query;
    const filters = {};

    if (branch) {
      filters.branch = branch;
    }
    if (batch) {
      filters.batch = parseInt(batch);
    }

    const result = await Student.find(filters);

    res.status(200).json({ result });
    return result;
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while filtering the profiles.' });
  }
};

export { student_values, student_prefix, student_filter };
