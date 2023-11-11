
import alumni from '../models/alumniModel.js';

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
        const alumniPrefix = await alumni.find({ userName: { $regex: '^' + req.query.prefix, $options: 'i' } });

        const result = { alumniPrefix };
        console.log(result);
        res.status(200).json(result);
        return result;
    
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while filtering the profiles.' });
    }
};

const filter = async (req, res) => {
    try {
        const { branch, batch, currentWork } = req.query;
        const filters = {};

        //adding filters to query on database
        if (branch) {
            filters.branch = branch;
        }
        if (batch) {
            filters.batch = parseInt(batch);
        }
        if (currentWork) {
            filters.current_work = currentWork;
        }
        //find profiles matching the filters in the database
        const result = await alumni.find(filters);
        res.status(200).json({ result });
        return result;
    
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while filtering the profiles.' });
    }
};

export { values, filter, prefix };