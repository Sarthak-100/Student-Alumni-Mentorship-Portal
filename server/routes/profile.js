import express from 'express';
import Profile from '../models/userModel.js';

const router = express.Router();

router.post('/create-profile', async (req, res) => {
  try {
    const { username, email, password, branch, batch, company } = req.body;
    console.log(req.body);

    if (!username || !email || !password || !branch || !batch || !company) {
      return res.status(400).json({ error: 'Please provide all the required fields.' });
    }

    await Profile.create({
        username,
        email,
        password,
        branch,
        batch,
        company
    });

    res.status(201).json({ message: 'Profile created successfully' });

  } catch (error) {
    res.status(500).json({ error: 'An error occurred while creating the profile.' });
  }
});

export default router;
