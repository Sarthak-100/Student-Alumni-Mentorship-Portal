
import alumni from '../models/alumniModel.js';

const filter = async (req, res) => {
    try {
        const { branch, batch, current_work } = req.query;
        const filters = {};

        //adding filters to query on database
        if (branch) {
            filters.branch = branch;
        }
        if (batch) {
            filters.batch = parseInt(batch);
        }
        if (current_work) {
            filters.current_work = current_work;
        }
        //find profiles matching the filters in the database
        const result = await alumni.find(filters);
        res.status(200).json({ result });
        return result;
    
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while filtering the profiles.' });
    }
};

export default filter;