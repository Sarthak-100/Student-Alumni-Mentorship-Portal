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
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import TodayIcon from "@mui/icons-material/Today";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import { useReceiverIdContext } from "../context/ReceiverIdContext";
import ProfileDisplay from "./ProfileDisplay"; // Importing your ProfileDisplay component

import axios from "axios";
import Calendar from "react-calendar";

const UserCard = (props) => {
  const navigate = useNavigate();

  const { user } = useUserContext();
  const { receiverId, setReceiverIdValue } = useReceiverIdContext();
  const [openProfile, setOpenProfile] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [slots, setSlots] = useState([]);
  const [events, setEvents] = useState([]);

  // const handleChat = () => {
  //   useReceiverIdContext(props.cardUser._id);
  //   navigate("/chat/welcome");
  // };

  const handleChat = async () => {
    console.log("USER CARD inside handleChat", props.cardUser._id, user._id);
    await setReceiverIdValue(props.cardUser._id);
    navigate("/chat/welcome");
  };

  // Destructure the nested location object
  const { city, state, country } = props.cardUser.location || {};

  const handleProfile = () => {
    setSelectedUser(props.cardUser); // Store the selected user data
    setOpenProfile(true); // Open the profile dialog
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
            console.log("Slots fetched successfully!");
            //display the slots in a
            setSlots(response.data);
            const fetchedEvents = response.data.events; // Replace 'events' with the actual key containing events in your response
            setEvents(fetchedEvents);
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

  const fixMeeting = async (event) => {
    console.log("fixMeeting", event);
    const updatedEvent = { ...event };

    // Assuming 'user' is the user object with necessary details
    if (!updatedEvent.attendees) {
      updatedEvent.attendees = [];
    }
    if (!updatedEvent.attendees.includes(user)) {
      updatedEvent.attendees.push(user);
      //change event description
      // updatedEvent.description = "Meeting fixed with ";
    }
    console.log("updatedEvent", updatedEvent);

    //update event in google calendar of alumni
    // try {
    //   const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${updatedEvent.googleEventId}`, {
    //     method: "PATCH",
    //     headers: {
    //       'Authorization': 'Bearer ' + session.provider_token,
    //       'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify(updatedEvent)
    //   });

    //   if (response.ok) {
    //     const eventData = await response.json();
    //     console.log('Event updated in Google Calendar:', eventData);

    //     // Update the event details in your database if required
    //     // ...
    //   } else {
    //     console.error('Failed to update event in Google Calendar:', response.status);
    //   }
    // } catch (error) {
    //   console.error('Error updating event in Google Calendar:', error);
    // }

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
    } catch (error) {
      console.error("Error updating event in the database:", error);
    }
  };
  const cardStyle = {
    maxWidth: 300,
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
      <CardContent>
        <Grid container spacing={1}>
          {/* Display user information */}
          <Grid item xs={12}>
            <Typography variant="body1" style={contentStyle}>
              <strong>Current Work:</strong>{" "}
              {props.cardUser?.work?.role || "Role not specified"}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1" style={contentStyle}>
              <strong>Branch:</strong> {props.cardUser?.branch}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1" style={contentStyle}>
              <strong>Batch:</strong> {props.cardUser?.batch}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1" style={contentStyle}>
              <strong>Organization:</strong>{" "}
              {props.cardUser?.work?.organization ||
                "Organization not specified"}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1" style={contentStyle}>
              <strong>Location:</strong> {city}, {state}, {country}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
      <CardActions style={{ justifyContent: "center" }}>
        {/* Button to start a chat */}
        <IconButton color="primary" aria-label="Chat" onClick={handleChat}>
          <ChatIcon />
        </IconButton>
        {/* Button to view user profile */}
        <IconButton
          color="primary"
          aria-label="Profile"
          onClick={handleProfile}
        >
          <AccountCircleIcon />
        </IconButton>
        <IconButton
          color="primary"
          aria-label="Calendar"
          onClick={showCalendar}
        >
          <TodayIcon />
        </IconButton>
      </CardActions>
      {events.length > 0 && (
        <div style={{ margin: "20px auto", maxWidth: "300px" }}>
          <Typography variant="h6" style={{ textAlign: "center" }}>
            Events
          </Typography>
          <ul>

          {events.map((event, index) => (
        <li key={index}>
          {/* Displaying start date with time */}
          <p>
            Start Date/Time:{" "}
            {new Date(
              new Date(event.startDateTime).getTime()
            ).toLocaleString([], {
              dateStyle: "long",
              timeStyle: "short",
            })}
          </p>
          {/* Displaying end date with time */}
          <p>
            End Date/Time:{" "}
            {new Date(
              new Date(event.endDateTime).getTime()
            ).toLocaleString([], {
              dateStyle: "long",
              timeStyle: "short",
            })}
          </p>
          <p>Summary: {event.summary}</p>
          <p>Description: {event.description}</p>
          {/* Add a button to fix a meeting for this slot */}
          <button onClick={() => fixMeeting(event)}>Fix Meeting</button>
        </li>
      ))}

        </ul>

        </div>
      )}
      {/* Display the profile dialog */}
      {/* Display the user's profile */}
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
