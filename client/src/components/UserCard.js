import { React, useEffect } from "react";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Typography,
  CardActions,
  IconButton,
  Grid,
  Button,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import TodayIcon from "@mui/icons-material/Today";
import EventBusyIcon from '@mui/icons-material/EventBusy';
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import { useReceiverIdContext } from "../context/ReceiverIdContext";
import ProfileDisplay from "./ProfileDisplay"; // Importing your ProfileDisplay component
import axios from "axios";
import { useSocketContext } from "../context/SocketContext";

const UserCard = (props) => {
  const navigate = useNavigate();
  const { user } = useUserContext();
  const { receiverId, setReceiverIdValue } = useReceiverIdContext();
  const [openProfile, setOpenProfile] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [showEvents, setShowEvents] = useState(false);
  const [meetingStatus, setMeetingStatus] = useState([]);
  const { socket } = useSocketContext();
  const [calendarIcon, setCalendarIcon] = useState(<TodayIcon />);

  useEffect(() => {
    // Clear events when a new user is selected
    setEvents([]);
    setShowEvents(false);
    setCalendarIcon(<TodayIcon />);
  }, [props.cardUser]);

  const handleChat = async () => {
    await setReceiverIdValue(props.cardUser._id);
    navigate("/chat/welcome");
  };

  // Destructure the nested location object
  const { city, state, country } = props.cardUser.location || {};

  const handleProfile = () => {
    setSelectedUser(props.cardUser); // Store the selected user data
    setOpenProfile(true); // Open the profile dialog
  };

  const handleCalendarDisplay = () => {
    if (showEvents) {
      setEvents([]); // Clear events if they are displayed
    }
    setCalendarIcon(() =>
      showEvents ? <TodayIcon /> : <EventBusyIcon style={{ color: "#C41E3A" }} /> // Toggle calendar icon based on showEvents state
    );
    setShowEvents((prevShowEvents) => !prevShowEvents); // Toggle events display
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
          if (response.status == 200) {
            console.log("Slots fetched successfully!", response.data);
            const fetchedEvents = response.data.events; // Replace 'events' with the actual key containing events in your response
            const initialStatus = fetchedEvents.map(() => false);
            setMeetingStatus(initialStatus);
            setEvents(fetchedEvents);
            if (fetchedEvents.length === 0) {
              // Display an alert if there are no events
              alert(props.cardUser.name + " has no available meetings slots.");
            }else {
              handleCalendarDisplay(fetchedEvents.length);
              if (!showEvents) {
                props.setSelectedUserCalenderDisplay(props.cardUser._id);
              } else {
                props.setSelectedUserCalenderDisplay(null);
              }
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

  const cardStyle = {
    padding: "0px",
    margin: "20px auto",
    border: "1px solid #ddd",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  };

  const titleStyle = {
    fontFamily: "Arial, sans-serif",
    fontWeight: "bold",
    color: "#333",
  };

  const subheaderStyle = {
    fontFamily: "Arial, sans-serif",
    color: "#555",
  };

  const contentStyle = {
    fontFamily: "Arial, sans-serif",
    color: "#777",
  };

  return (
    <Card style={cardStyle}>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div style={{ width: "300px" }}>
          <CardHeader
            avatar={
              <Avatar>
                {props.cardUser?.name ? props.cardUser.name.charAt(0) : ""}
              </Avatar>
            }
            title={
              <Typography variant="h6" style={titleStyle}>
                {props.cardUser?.name || "No Name"}
              </Typography>
            }
            subheader={
              <Typography variant="body2" style={subheaderStyle}>
                {props.cardUser?.email}
              </Typography>
            }
          />
          <div>
            <CardContent>
              <Grid container spacing={1}>
                {/* Display user information */}
                <Grid item xs={12}>
                  <Typography variant="body1" style={contentStyle}>
                    <strong>Batch:</strong> {props.cardUser?.batch}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1" style={contentStyle}>
                    <strong>Branch:</strong> {props.cardUser?.branch}
                  </Typography>
                </Grid>
                <Grid item xs={12} style={{ minHeight: "64px" }}>
                  <Typography variant="body1" style={contentStyle}>
                    <strong>Current Work:</strong>{" "}
                    {props.cardUser?.work?.role || "Role not specified"}
                  </Typography>
                </Grid>
                <Grid item xs={12} style={{ minHeight: "64px" }}>
                  <Typography variant="body1" style={contentStyle}>
                    <strong>Organization:</strong>{" "}
                    {props.cardUser?.work?.organization ||
                      "Organization not specified"}
                  </Typography>
                </Grid>
                <Grid item xs={12} style={{ minHeight: "64px" }}>
                  <Typography variant="body1" style={contentStyle}>
                    <strong>Location:</strong> {city}, {state}, {country}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
            <CardActions style={{ justifyContent: "center" }}>
              {/* IconButton to start a chat */}
              <IconButton
                color="primary"
                aria-label="Chat"
                title="Start Chat"
                onClick={handleChat}
              >
                <ChatIcon />
              </IconButton>
              {/* IconButton to view user profile */}
              <IconButton
                color="primary"
                aria-label="Profile"
                title="View Profile"
                onClick={handleProfile}
              >
                <AccountCircleIcon />
              </IconButton>
              <IconButton
                color="primary"
                aria-label="Calendar"
                title="View Calendar"
                onClick={() => { showCalendar(); }}
              >
                {calendarIcon}
              </IconButton>
            </CardActions>
          </div>
        </div>
        {events.length > 0 && (
          <div
            style={{
              marginTop: "10px",
              display: "flex",
              flexDirection: "column",
              alignContent: "left",
            }}
          >
            <Typography
              variant="h6"
              style={{
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
                  {/* Displaying start date with time */}
                  <p>
                    Start Date/Time:{" "}
                    {new Date(event.startDateTime).toLocaleString([], {
                      dateStyle: "long",
                      timeStyle: "short",
                    })}
                  </p>
                  {/* Displaying end date with time */}
                  <p>
                    End Date/Time:{" "}
                    {new Date(event.endDateTime).toLocaleString([], {
                      dateStyle: "long",
                      timeStyle: "short",
                    })}
                  </p>
                  <p>Summary: {event.summary}</p>
                  {event.description && <p>Description: {event.description}</p>}
                  {/* Render the meeting fixing/cancelation buttons */}
                  {/* Add a IconButton to fix a meeting for this slot */}
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
          </div>
        )}
      </div>

      {selectedUser && (
        <ProfileDisplay
          open={openProfile}
          onClose={() => setOpenProfile(false)}
          userData={selectedUser}
        />
      )}
    </Card>
  );
};

export default UserCard;