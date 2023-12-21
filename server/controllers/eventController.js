import { Alumni, Student } from "../models/userModel.js";
import { Event, studentEvent } from "../models/eventModel.js";
import dayjs from 'dayjs';

export const setEventDetails = async (req, res) => {
    try {
        // console.log("req.body", req.body);
        const { userId, summary, description, startDateTime, endDateTime, googleEventId } = req.body;
        // console.log("google event id", googleEventId);
        // Find the alumni by email
        const alumni = await Alumni.find({ "email": userId });
        
        if (alumni.length === 0) {
            return res.status(404).json({ error: 'Alumni not found' });
          }
      
          // Convert each alumni document to JSON
          const alumniJSON = alumni.map(doc => doc.toJSON());
          
          const newEvent = {
            googleEventId,
            summary,
            description,
            startDateTime,
            endDateTime,
            alumni: alumniJSON[0]._id,
            // Add other event details here as needed
           };

          const event = new Event(newEvent);
          await event.save();
        //   console.log("event", event);

          res.status(201).json({ message: 'Event added to alumni calendar' });
        } catch (error) {
          console.error('Error adding event to alumni calendar:', error);
          res.status(500).json({ error: 'An error occurred while adding event to alumni calendar' });
        }
}

export const setStudentEventDetails = async (req, res) => {
    try {
        // console.log("req.body", req.body);
        const { userId, summary, description, startDateTime, endDateTime, googleEventId, alumni } = req.body;
        // console.log("google event id", googleEventId);
        // Find the alumni by email
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
            // Add other event details here as needed
           };

          const event = new studentEvent(newEvent);
          await event.save();
        //   console.log("event", event);

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

        //Fetch events where endTime is greater than the current time
        const events = await Event.find({
            alumni: userId,
            endDateTime: { $gte: currentDate }, // Filter based on endTime being greater than the current time
        });
        
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

export const deleteEvents = async (req, res) => {
    try {
        const { userId } = req.query;
        // console.log("userId", userId, req.query);

        //delete all events of this user which have been past
        const events = await Event.find({ "alumni": userId });
        console.log("events", events);
        
        if (events.length > 0) {
            // Get current date and time
            const currentDate = dayjs();

            // Filter events that are in the past based on their endDateTime
            console.log("currentDate", currentDate, dayjs(events[0].endDateTime));
            const pastEvents = events.filter(event => dayjs(event.endDateTime) < currentDate);
            console.log("pastEvents", pastEvents);

            // Extract event IDs of past events
            const eventIdsToDelete = pastEvents.map(event => event._id);
            console.log("eventIdsToDelete", eventIdsToDelete);

            // Delete past events from the database
            await Event.deleteMany({ _id: { $in: eventIdsToDelete } });

            res.status(200).json({ message: 'Past events deleted successfully' });
        }
    } catch(error) {
        console.error('Error deleting events:', error);
        res.status(500).json({ error: 'An error occurred while deleting events' });
    }
}

export const getPastEvents = async (req, res) => {
    const currentDate = new Date();
    try {
        const { userId } = req.query;
        console.log("userId", userId, req.query);

        const events = await Event.find(
            { 'attendees._id': userId,
            endDateTime: { $lt: currentDate },
            }
        );

        console.log("past events", events);
        res.status(200).json({ events });
    } catch (error) {
        console.error('Error fetching event details:', error);
        res.status(500).json({ error: 'An error occurred while fetching event details' });
    }
}