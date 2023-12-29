import React, { useState, useEffect } from "react";
import { IconButton, Typography, Button, Card } from "@mui/material";
import TodayIcon from "@mui/icons-material/Today";
import { useSocketContext } from "../context/SocketContext";
import { useUserContext } from "../context/UserContext";

import axios from "axios";

const CalendarDisplay = (props) => {
  const [meetingFixed, setMeetingFixed] = useState(false);
  const [meetingStatus, setMeetingStatus] = useState([]);
  const [events, setEvents] = useState([]);
  const [slots, setSlots] = useState([]);
  const { socket } = useSocketContext();
  const { user } = useUserContext();

  const cancelMeeting = async (event, index) => {
    try {
      // Update the event's attendees by removing the current user
      const updatedEvent = { ...event };
      updatedEvent.attendees = [];
      console.log("event before cancellation", event);
      for (let i = 0; i < event.attendees.length; i++) {
        if (event.attendees[i]._id.toString() !== user._id.toString()) {
          updatedEvent.attendees.push(event.attendees[i]);
        }
      }

      console.log("updatedEvent after cancellation", updatedEvent);
      // Update event in the database or Google Calendar
      const baseUrl = "http://localhost:4000/api/v1/updateEvent/update";
      const apiUrl = `${baseUrl}?eventId=${updatedEvent.id}`;

      const response = await axios.post(apiUrl, {
        headers: {
          "Content-Type": "application/json",
        },
        event: updatedEvent,
      });

      if (response.status === 200) {
        console.log("Event updated successfully in the database!");
        // Update the event in the local state as well, if required
        const updatedEvents = [...events];
        updatedEvents[index] = updatedEvent;
        setEvents(updatedEvents);

        // Update the meeting status
        const newMeetingStatus = [...meetingStatus];
        newMeetingStatus[index] = false;
        setMeetingStatus(newMeetingStatus);
        alert("Meeting successfully cancelled with " + props.cardUser.name);
        socket.emit("fixMeeting", {
          receiverId: props.cardUser._id,
          senderId: user._id,
          senderName: user.name,
          messageType: "Meeting",
          message: `Your meeting with ${user.name} has been cancelled`,
        });
      } else {
        console.error(
          "Failed to update event in the database:",
          response.status
        );
      }
    } catch (error) {
      console.error("Error cancelling meeting:", error);
    }
  };

  const showCalendar = () => {
    try {
      //fetch availability slots of this alumni from database
      const baseUrl = "http://localhost:4000/api/v1/fetchSlots/details";
      const userId = props.cardUser._id;
      const apiUrl = `${baseUrl}?userId=${userId}`;
      console.log(apiUrl);
      axios
        .get(apiUrl)
        .then((response) => {
          // console.log(response.data);
          if (response.status == 200) {
            console.log("Slots fetched successfully!", response.data);
            setSlots(response.data);
            const fetchedEvents = response.data.events; // Replace 'events' with the actual key containing events in your response
            const initialStatus = fetchedEvents.map(() => false);
            setMeetingStatus(initialStatus);
            setEvents(fetchedEvents);
            if (fetchedEvents.length === 0) {
              // Display an alert if there are no events
              alert(props.cardUser.name + " has no available meetings slots.");
            }
          } else {
            console.error(
              "Failed to fetch slots details from the database:",
              response.status
            );
            const errorData = response.json();
            console.error("Error details:", errorData);
          }
        })
        .catch((error) => {
          console.error(
            "Failed to fetch slots details from the database:",
            error
          );
        });
    } catch (error) {
      console.error("Error details:", error);
    }
  };

  const fixMeeting = async (event, index) => {
    console.log("fixMeeting", event);

    const bookingStudent = {
      _id: user._id,
      email: user.email,
    };

    // Update the event's attendees
    const updatedEvent = { ...event };

    // Check the current status for this event

    // Check if attendees array exists, if not create it
    if (!updatedEvent.attendees) {
      updatedEvent.attendees = [];
    }
    console.log(
      "updatedEvent ok",
      updatedEvent.attendees[0]?._id,
      "bookingStudent ok",
      bookingStudent?._id.toString(),
      updatedEvent.attendees[0]?._id === bookingStudent?._id.toString()
    );
    console.log("Booking Student:", bookingStudent);
    console.log(
      "Comparing IDs:",
      updatedEvent.attendees?.map((attendee) => attendee?._id)
      // bookingStudent?._id.toString(), "ok", typeof bookingStudent?._id, typeof updatedEvent.attendees?.map((attendee) => attendee?._id.toString())
    );
    // Check if the booking student is not already in the attendees list
    const isStudentAlreadyAttendee = updatedEvent.attendees.some(
      (attendee) => attendee._id === bookingStudent._id.toString()
    );
    console.log("isStudentAlreadyAttendee", isStudentAlreadyAttendee);

    if (!isStudentAlreadyAttendee) {
      // Add the booking student to the attendees list
      updatedEvent.attendees.push(bookingStudent);
      // Update event in the database or Google Calendar
      try {
        const baseUrl = "http://localhost:4000/api/v1/updateEvent/update";
        const apiUrl = `${baseUrl}?eventId=${updatedEvent.id}`;

        const response = await axios.post(apiUrl, {
          headers: {
            "Content-Type": "application/json",
          },
          event: updatedEvent,
        });

        if (response.status === 200) {
          console.log("Event updated successfully in the database!");
          // Update the event in the local state as well, if required
          // setEvents([...events]); // Assuming events state exists
        } else {
          console.error(
            "Failed to update event in the database:",
            response.status
          );
        }
        // Toggle the meeting status for this specific event
        const newMeetingStatus = [...meetingStatus];
        newMeetingStatus[index] = true;
        setMeetingStatus(newMeetingStatus);

        alert("Meeting successfully fixed with " + props.cardUser.name);

        console.log(typeof event.endDateTime);
        socket.emit("fixMeeting", {
          receiverId: props.cardUser._id,
          senderId: user._id,
          senderName: user.name,
          messageType: "Meeting",
          message: `${new Date(
            new Date(event.startDateTime).getTime()
          ).toLocaleString([], {
            dateStyle: "long",
            timeStyle: "short",
          })}, has been booked`,
        });
      } catch (error) {
        console.error("Error updating event:", error);
      }
    }
  };

  useEffect(() => {
    // This code will execute when the component mounts or updates
    showCalendar(); // Call the function to fetch calendar data
  }, []); // Empty dependency array means it will run only on mount

  return (
    <div>
      {events.length > 0 &&(
        <Card style={{ margin: "20px auto", maxWidth: "300px" }}>
          <Typography
            variant="h6"
            style={{
              textAlign: "center",
              position: "relative",
              display: "inline-block",
              padding: "8px 16px",
              background: "#FFFF00",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              borderRadius: "8px",
              marginBottom: "25px",
              marginLeft: "40px",
              margin: "0 auto",
            }}
          >
            Upcoming Events
          </Typography>
          <ul>
            {events.map((event, index) => (
              <li key={index}>
                <p>
                  Start Date/Time:{" "}
                  {new Date(event.startDateTime).toLocaleString([], {
                    dateStyle: "long",
                    timeStyle: "short",
                  })}
                </p>
                <p>
                  End Date/Time:{" "}
                  {new Date(event.endDateTime).toLocaleString([], {
                    dateStyle: "long",
                    timeStyle: "short",
                  })}
                </p>
                <p>Summary: {event.summary}</p>
                {event.description && <p>Description: {event.description}</p>}
                {event.attendees &&
                event.attendees.some(
                  (attendee) => attendee?._id === user._id.toString()
                ) ? (
                  <Button
                    variant="contained"
                    color="secondary"
                    style={{ backgroundColor: "#b71c1c", color: "#fff" }}
                    onClick={() => cancelMeeting(event, index)}
                  >
                    Cancel Meeting
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    style={{ backgroundColor: "#4caf50", color: "#fff" }}
                    onClick={() => fixMeeting(event, index)}
                  >
                    Fix Meeting
                  </Button>
                )}
              </li>
            ))}
          </ul>
          <Button variant="contained" onClick={props.onClose}>
            Close Calendar
          </Button>
        </Card>
      )}
    </div>
  );
};

export default CalendarDisplay;