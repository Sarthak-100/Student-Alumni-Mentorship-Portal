// import alumni from "../models/alumniModel.js";
import { Alumni } from "../models/userModel.js";
import mongoose from "mongoose";

const values = async (req, res) => {
    try {
        //find all distinct alumni branches, batches, roles, companies in the database
        const branches = await alumni.distinct('branch');
        const batches = await alumni.distinct('batch');
        const currentWorks = await alumni.distinct('currentWork');

        const result = { branches, batches, currentWorks };
        console.log(result);
        res.status(200).json(result);
        return result;
    
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while filtering the profiles.' });
    }
};

const prefix = async (req, res) => {
    try {
        //filter alumni based on userName's prefix
        console.log(req.query.prefix);
        const result = await alumni.find({ userName: { $regex: '^' + req.query.prefix, $options: 'i' } });

        console.log(result);
        res.status(200).json({result});
        return result;
    
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while filtering the profiles.' });
    }
};

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

//     try {
//         const { branch, batch, currentWork } = req.query;
//         const filters = {};

//         //adding filters to query on database
//         if (branch) {
//             filters.branch = branch;
//         }
//         if (batch) {
//             filters.batch = parseInt(batch);
//         }
//         if (currentWork) {
//             filters.current_work = currentWork;
//         }
//         //find profiles matching the filters in the database
//         const result = await alumni.find(filters);
//         console.log(result);
//         res.status(200).json({ result });
//         return result;
    
//     } catch (error) {
//         res.status(500).json({ error: 'An error occurred while filtering the profiles.' });

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

// export { values, filter, prefix };

