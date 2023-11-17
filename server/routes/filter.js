import express from 'express';
import alumni from '../models/userModel.js';

const router = express.Router();

// Define a route to filter profiles based on branch
router.get('/', async (req, res) => {
    try {
        const { branch, batch } = req.query;
        const filters = {};

        if (branch) {
            filters.branch = branch;
        }
        if (batch) {
            filters.batch = parseInt(batch);
        }

        const result = await alumni.find(filters);
        console.log(profiles);
        res.status(200).json({ result });
        return result;
    
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while filtering the profiles.' });
    }
});

export default router;