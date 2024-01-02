import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import socket from "../chatSocket.js";
import { useUserContext } from "../context/UserContext";
import { useSession } from "@supabase/auth-helpers-react";
import MeetingCard from "./AlumniMeetingCard.js";
import { Grid, Typography } from "@mui/material";

const UpcomingEvents = () => {
  
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const { user } = useUserContext();
  const session = useSession();

  const fetchStudentNameById = async (studentId) => {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/v1/filter-student/getStudentNameById?studentId=${studentId}`
      );
      return response.data.studentName;
    } catch (error) {
      console.error("Error fetching student name:", error);
      return "";
    }
  };

  useEffect(() => {
    showUpcomingEvents();
  }, []);

  async function showUpcomingEvents() {
    console.log("in show upcoming events");
    try {
      const baseUrl = "http://localhost:4000/api/v1/fetchSlots/details";
      const userId = user._id;
      const apiUrl = `${baseUrl}?userId=${userId}`;
      const response = await axios.get(apiUrl);

      if (response.status === 200) {
        const events = response.data.events;
        if (events.length === 0) {
          console.log("No upcoming events");
          return;
        }
          
        //add attendee name with the event
        const eventsWithAttendeeNames = await Promise.all(
          events.map(async (event) => {
            const attendeeNames = await Promise.all(
              event.attendees.map(async (attendee) => {
                const studentName = await fetchStudentNameById(attendee._id);
                return { ...attendee, name: studentName };
              })
            );
            return { ...event, attendees: attendeeNames };
          })
        );
        console.log("events", eventsWithAttendeeNames);
        setUpcomingEvents(eventsWithAttendeeNames);
      } else {
        console.error("Failed to fetch upcoming events:", response.status);
      }
    } catch (error) {
      console.error("Error fetching upcoming events:", error);
    }
  }

  async function deleteEvent(eventId, googleEventId) {
    try {

      //notify all attendees about the cancellation of the event
      socket.emit("getUpdateDeletedEvent", { eventId, userId: user._id, userName: user.name });

      // Delete the event from the database
      const deleteResponse = await axios.delete(
        `http://localhost:4000/api/v1/deleteEvent/details?eventId=${eventId}`
      );

      if (deleteResponse.status === 200) {
        console.log("Event deleted from the database");

        if (googleEventId) {
          // Delete event from Google Calendar if it has a googleEventId
          const googleCalendarUrl = `https://www.googleapis.com/calendar/v3/calendars/primary/events/${googleEventId}`;
          const googleDeleteResponse = await fetch(googleCalendarUrl, {
            method: "DELETE",
            headers: {
              Authorization: "Bearer " + session.provider_token,
              "Content-Type": "application/json",
            },
          });

          if (googleDeleteResponse.ok) {
            console.log("Event deleted from Google Calendar");
          } else {
            console.error(
              "Failed to delete event from Google Calendar:",
              googleDeleteResponse.status
            );
          }
        }

        // Update the state to remove the deleted event from the UI
        setUpcomingEvents((prevEvents) =>
          prevEvents.filter((event) => event._id !== eventId)
        );

      } else {
        console.error("Failed to delete event:", deleteResponse.status);
      }
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  }

  return (
    <div className="App">
      <div style={{ width: '600px', margin: '30px auto' }}>
        <h2>Upcoming Events</h2>
        {/* Display upcoming events */}
        {upcomingEvents.length > 0 ? (
          <Grid container spacing={3}>
            {upcomingEvents.map((meeting) => (
              <Grid key={meeting._id} item xs={12}>
                <MeetingCard meeting={meeting} onDelete={deleteEvent}/>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="body1">
            No upcoming events
          </Typography>
        )}
        <br />
        <Link to="/calendar">
          <Button variant="contained" color="primary">
            Back to Calendar
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default UpcomingEvents;