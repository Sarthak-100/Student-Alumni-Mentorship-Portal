import Alumni from "../models/alumniModel.js";

const register = async (req, res) => {

    try {
        const { user_name, email, password, batch, branch, current_work } = req.body;

        const alumni = await Alumni.create({
            user_name,
            email,
            password,
            batch,
            branch,
            current_work,
        });

        res.status(201).json('Alumni created successfully.');

    } catch (error) {
        res.status(500).json({ error: 'An error occurred while registering the user.' });
    }

//   more_info = alumni._id;

//   const user = await User.create({
//     user_name,
//     email,
//     password,
//     user_type,
//     more_info,
//   });
};

export default register;