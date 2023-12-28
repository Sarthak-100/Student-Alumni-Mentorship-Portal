import { Reports } from "../models/reportsModel.js";
import mongoose from "mongoose";

export const getReports = async (req, res, next) => {
  // unresolved reports would be returned here
  try {
    const reports = await Reports.find({ resolved: false });
    res.status(200).json(reports);
  } catch (error) {
    next(error);
  }
};

export const countUnresolvedReports = async (req, res, next) => {
  // unresolved reports would be counted here
  try {
    const count = await Reports.countDocuments({ resolved: false });
    res.status(200).json(count);
  } catch (error) {
    next(error);
  }
};

export const updateResolvedStatus = async (req, res, next) => {
  try {
    const report = await Reports.findByIdAndUpdate(
      new mongoose.Types.ObjectId(req.query.id),
      { resolved: true },
      { new: true }
    );
    res.status(200).json(report);
  } catch (error) {
    next(error);
  }
};