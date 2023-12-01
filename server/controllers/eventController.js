import { Alumni } from "../models/userModel.js";
import { Event } from "../models/eventModel.js";

export const setEventDetails = async (req, res) => {
    try {
        const { userId, summary, description, startDateTime, endDateTime } = req.body;
        // Find the alumni by email
        const alumni = await Alumni.find({ "email": userId });
        
        if (alumni.length === 0) {
            return res.status(404).json({ error: 'Alumni not found' });
          }
      
          // Convert each alumni document to JSON
          const alumniJSON = alumni.map(doc => doc.toJSON());
          
          const newEvent = {
            summary,
            description,
            startDateTime,
            endDateTime,
            alumni: alumniJSON[0]._id,
            // Add other event details here as needed
        };

        const event = new Event(newEvent);
        await event.save();
        console.log("event", event);

          res.status(201).json({ message: 'Event added to alumni calendar' });
        } catch (error) {
          console.error('Error adding event to alumni calendar:', error);
          res.status(500).json({ error: 'An error occurred while adding event to alumni calendar' });
        }
}

export const getEventDetails = async (req, res) => {
    console.log("see ", req.query);
    const { userId } = req.query;
    try {
        console.log("userId", userId);
        const events = await Event.find({ "alumni": userId });
        console.log("events", events);
        res.status(200).json({ events });
    } catch(error) {
        console.error('Error fetching event details:', error);
        res.status(500).json({ error: 'An error occurred while fetching event details' });
    }
}
