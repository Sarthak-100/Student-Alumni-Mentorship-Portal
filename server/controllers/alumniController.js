import Alumni from "../models/alumniModel.js";

const register = async (req, res) => {

    try {
        const { userName, email, password, batch, branch, currentWork } = req.body;

        const alumni = await Alumni.create({
            userName,
            email,
            password,
            batch,
            branch,
            currentWork,
        });

        res.status(201).json('Alumni created successfully.');

    } catch (error) {
        res.status(500).json({ error: 'An error occurred while registering the user.' });
    }
};

export default register;