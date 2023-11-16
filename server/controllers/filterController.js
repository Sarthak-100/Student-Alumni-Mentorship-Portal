// import alumni from "../models/alumniModel.js";
import { Alumni } from "../models/userModel.js";
import mongoose from "mongoose";

const filter = async (req, res) => {
  try {
    const { batch, branch, current_role, current_organization } = req.query;
    // const { batch, branch, current_role, current_organization } = req.params;
    console.log(batch, branch, current_role, current_organization);
    console.log(req.params);
    const filters = {};

    if (branch) {
      filters.branch = branch;
    }
    if (batch) {
      filters.batch = parseInt(batch);
    }

    if (current_role) {
      filters["work.role"] = current_role;
    }
    if (current_organization) {
      filters["work.organization"] = current_organization;
    }
    console.log(filters);
    const result = await Alumni.find(filters);

    res.status(200).json({ result });
    return result;
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while filtering the profiles." });
  }
};

export default filter;
