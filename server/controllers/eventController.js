import { Alumni, Student } from "../models/userModel.js";
import { Event, studentEvent } from "../models/eventModel.js";

export const setEventDetails = async (req, res) => {
    try {
        const { userId, summary, description, startDateTime, endDateTime, googleEventId } = req.body;
        const alumni = await Alumni.find({ "email": userId });
        
        if (alumni.length === 0) {
            return res.status(404).json({ error: 'Alumni not found' });
          }
      
          const alumniJSON = alumni.map(doc => doc.toJSON());
          
          const newEvent = {
            googleEventId,
            summary,
            description,
            startDateTime,
            endDateTime,
            alumni: alumniJSON[0]._id,
           };

          const event = new Event(newEvent);
          await event.save();

          res.status(201).json({ message: 'Event added to alumni calendar' });
        } catch (error) {
          console.error('Error adding event to alumni calendar:', error);
          res.status(500).json({ error: 'An error occurred while adding event to alumni calendar' });
        }
}

export const setStudentEventDetails = async (req, res) => {
    try {
        const { userId, summary, description, startDateTime, endDateTime, googleEventId, alumni } = req.body;
        
        const student = await Student.find({ _id: userId });
        
        if (student.length === 0) {
            return res.status(404).json({ error: 'Student not found' });
          }
              
          const newEvent = {
            googleEventId,
            summary,
            description,
            startDateTime,
            endDateTime,
            alumni: alumni
           };

          const event = new studentEvent(newEvent);
          await event.save();

          res.status(201).json({ message: 'Event added to student calendar' });
        } catch (error) {
          console.error('Error adding event to alumni calendar:', error);
          res.status(500).json({ error: 'An error occurred while adding event to alumni calendar' });
        }
}

export const getEventDetails = async (req, res) => {
    const { userId } = req.query;
    try {
        const currentDate = new Date();

        const events = await Event.find({
            alumni: userId,
            endDateTime: { $gte: currentDate },
        }).sort({ startDateTime: 1 });
        
        res.status(200).json({ events });
    } catch (error) {
      console.error('Error fetching event details:', error);
      res.status(500).json({ error: 'An error occurred while fetching event details' });
    }
};

export const updateEventDetails = async (req, res) => {
    try {
        const updatedEvent = req.body.event;
        console.log("eventId", updatedEvent, updatedEvent._id);
        const event = await Event.findOne({ "_id": updatedEvent._id });
        if (event.length === 0) {
            return res.status(404).json({ error: 'Event not found' });
        }
        await Event.updateOne({ "_id": event._id }, { $set: updatedEvent });
        res.status(200).json({ message: 'Event updated successfully' });
    } catch(error) {
        console.error('Error updating event details:', error);
        res.status(500).json({ error: 'An error occurred while updating event details' });
    }
}

export const deleteEvent = async (req, res) => {
    try {
        const { eventId } = req.query;

        const deletedEvent = await Event.findByIdAndDelete(eventId);

        if (!deletedEvent) {
            return res.status(404).json({ error: 'Event not found' });
        }

        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ error: 'An error occurred while deleting the event' });
    }
};

export const getPastEvents = async (req, res) => {
    const currentDate = new Date();
    try {
        const { userId } = req.query;
        console.log("userId", userId, req.query);

        const events = await Event.find(
            { 'attendees._id': userId,
            endDateTime: { $lt: currentDate },
            }
        ).sort({ endDateTime: -1 });

        res.status(200).json({ events });
    } catch (error) {
        console.error('Error fetching event details:', error);
        res.status(500).json({ error: 'An error occurred while fetching event details' });
    }
}