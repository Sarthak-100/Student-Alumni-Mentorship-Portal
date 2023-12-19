import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { useSession, useSupabaseClient, useSessionContext } from '@supabase/auth-helpers-react';
import { v4 as uuid } from 'uuid';
import { IconButton, Typography, TextField, Grid, Button } from '@mui/material';
import dayjs from 'dayjs';
import { useUserContext } from '../context/UserContext';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-calendar/dist/Calendar.css';
import { useNavigate } from 'react-router-dom';


const Calendar = () => {
  const [startDate, setStart] = useState(new Date());
  const [endDate, setEnd] = useState(new Date());
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [apiResponse, setApiResponse] = useState({});
  const { user } = useUserContext();
  const [pastMeetings, setPastMeetings] = useState([]);
  const [showPastMeetings, setShowPastMeetings] = useState(false);

  const navigate = useNavigate();
  const session = useSession(); // tokens, when session exists we have a user
  const supabase = useSupabaseClient(); // talk to supabase!
  const { isLoading } = useSessionContext();

  const handleShowPastMeetings = async () => {
    console.log("in past meetings", user._id);
    try {
      // Fetch past meetings
      const response = await axios.get(`http://localhost:4000/api/v1/fetchPastMeetings/meetings?userId=${user._id}`);

      if (response.status === 200) {
        // const pastMeetings = response.data

        console.log("Past meetings:", response.data);
        setPastMeetings(pastMeetings);
        setShowPastMeetings(true); // Show past meetings when fetched
      } else {
        console.error('Failed to fetch past meetings:', response.status);
      }
    } catch (error) {
      console.error('Error fetching past meetings:', error);
    }
  };

  useEffect(() => {
    syncCalendar(); // Call the syncCalendar function on component mount
  }, []);

  if (isLoading) {
    return <></>;
  }

  const handleStartDateChange = (date) => {
    setStart(date);
  };

  const handleEndDateChange = (date) => {
    setEnd(date);
  };

  function signIn() {
    const { error } = supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        scopes: [
          "https://www.googleapis.com/auth/calendar",
          "https://www.googleapis.com/auth/meetings.space.created",
        ],
      },
    });
    if (error) {
      alert("Error logging in to Google provider with Supabase");
      console.log(error);
    } else {
      console.log("Supabase login successful");
    }
  }

  //write a function to sync calendar
  async function syncCalendar() {
    if (session !== null) {

      const baseUrl = "http://localhost:4000/api/v1/fetchSlots/details";
      const userId = user._id;
      const apiUrl = `${baseUrl}?userId=${userId}`;
      console.log(apiUrl);
      axios
        .get(apiUrl)
        .then((response) => {
          if (response.status === 200) {
            const events = response.data.events;
            //check length of events
            if (events.length === 0) {
              console.log("No events to sync");
              return;
            }
            console.log("Syncing events with Google Calendar");
            // console.log("events", events);
            // Assuming you have retrieved events from the database
            events.forEach(async (event) => {
              const googleEventId = event.googleEventId; // Assuming you have a unique Google Event ID
              // console.log("meet link", event.meetLink);
              const googleCalendarUrl = `https://www.googleapis.com/calendar/v3/calendars/primary/events/${googleEventId}`;
              const updatedEvent = {
                summary: event.summary,
                description: event.description,
                start: {
                  dateTime: event.startDateTime,
                  timeZone: "Asia/Kolkata", // Modify timezone as needed
                },
                end: {
                  dateTime: event.endDateTime,
                  timeZone: "Asia/Kolkata", // Modify timezone as needed
                },
                attendees: event.attendees.map(attendee => ({
                  email: attendee.email,
                  responseStatus: "accepted" // Assuming all attendees are accepted
                })),
                // Other event details to update
              };
              console.log("updated event", updatedEvent);
              try {
                const patchResponse = await fetch(googleCalendarUrl, {
                  method: "PATCH",
                  headers: {
                    Authorization: "Bearer " + session.provider_token,
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(updatedEvent),
                });

                if (patchResponse.ok) {
                  console.log(
                    `Event ${googleEventId} updated in Google Calendar`
                  );
                } else {
                  console.error(
                    "Failed to update event in Google Calendar:",
                    patchResponse.status
                  );
                }
              } catch (error) {
                console.error(
                  "Error updating event in Google Calendar:",
                  error
                );
              }
            });

            console.log("All events synced with Google Calendar");
          } else {
            console.error(
              "Failed to fetch events from the database:",
              response.status
            );
          }
        })
        .catch((error) => {
          console.error("Failed to fetch events from the database:", error);
        });
    }
  }

  async function createCalendarEvent() {
    console.log("Creating calendar event");

    const event = {
      calendarId: "primary",
      summary: eventName,
      description: eventDescription,
      start: {
        dateTime: startDate.toISOString(),
        timeZone: "Asia/Kolkata",
      },
      end: {
        dateTime: endDate.toISOString(),
        timeZone: "Asia/Kolkata",
      },
      attendees: [],
      reminders: {
        useDefault: false,
        overrides: [
          { method: "email", minutes: 24 * 60 },
          { method: "popup", minutes: 10 },
        ],
      },
    };

    try {
      const response = await fetch(
        "https://www.googleapis.com/calendar/v3/calendars/primary/events",
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + session.provider_token, // Access token for Google
            "Content-Type": "application/json",
          },
          body: JSON.stringify(event),
        }
      );

      if (response.ok) {
        const eventData = await response.json();
        const googleEventId = eventData.id;
        console.log(
          "Event created and saved in MongoDB:",
          eventData,
          session.user.email,
          googleEventId,
          eventData.attendees,
          eventData.hangoutLink
        );
        const apiUrl = "http://localhost:4000/api/v1/saveEvent/details";
        axios
          .post(apiUrl, {
            headers: {
              "Content-Type": "application/json",
            },
            googleEventId: googleEventId,
            userId: session.user.email,
            summary: eventName,
            description: eventDescription,
            startDateTime: startDate.toISOString(),
            endDateTime: endDate.toISOString(),
          })
          .then((response) => {
            // setApiResponse(response.data);
            console.log(response.data);
            if (response.status == 201) {
              alert("Event created and saved, check your Google Calendar!");
              navigate("/");
            } else {
              // Handle errors while saving to MongoDB
              console.error(
                "Failed to save event in the database:",
                response.status
              );
              const errorData = response.json();
              console.error("Error details:", errorData);
            }
          })
          .catch((error) => {
            // Handle errors while saving to MongoDB
            console.error(
              "Failed to save event in the database:",
              response.status
            );
            // const errorData = res.json();
            console.error("Error details:", error);
          });
      }
    } catch (error) {
      console.error("Error details:", error);
    }
  }

  console.log(session);
  console.log(startDate);
  console.log(endDate);
  console.log(eventName);
  console.log(eventDescription);

  return (
    <div className="App">
      <div style={{ width: "600px", margin: "30px auto" }}>
        {user?.user_type === "alumni" ? (
              <>
                {session ?
                  <>
                    <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="h5">
                      Hey {user?.name}, mark your calendar here
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body1">Start of your event</Typography>
                    <DatePicker selected={startDate} onChange={(date) => setStart(date)} showTimeSelect dateFormat="Pp" />
                  </Grid>
                    
                  <Grid item xs={12}>
                    <Typography variant="body1">End of your event</Typography>
                  
                    {/* <input type="text" onChange={(e) => setStart(new Date(e.target.value))} /> */}
                    <DatePicker selected={endDate} onChange={(date) => setEnd(date)} showTimeSelect dateFormat="Pp" />
                    {/* <input type="text" onChange={(e) => setEnd(new Date(e.target.value))} /> */}
                    </Grid>
                    <Grid item xs={12}>
                    <Typography variant="body1">Event name</Typography>
                    <TextField
                      type="text"
                      value={eventName}
                      onChange={(e) => setEventName(e.target.value)}
                    />
                    </Grid>
                    <Grid item xs={12}>
                    <Typography variant="body1">Event description</Typography>
                    <TextField
                      type="text"
                      value={eventDescription}
                      onChange={(e) => setEventDescription(e.target.value)}
                    />
                  </Grid>
                    <hr />
                    <Grid item xs={12}>
                      <Button variant="contained" color="primary" onClick={() => createCalendarEvent()}>
                        Create Calendar Event
                      </Button>
                    </Grid>
                  </Grid>
                  </>
                  :
                  <>
                    <Button variant="contained" color="primary" onClick={() => signIn()}>
                    Sign In
                  </Button>
                  </>
                }
            </>
        ) : (
          <>
            <Button onClick={() => handleShowPastMeetings()}>Show Past Meetings</Button>
            {showPastMeetings && (
            <div>
              <Typography variant="h6">Past Meetings</Typography>
            </div>
          )}
        </>
          
        )}
      </div>
    </div>
  );
};

export default Calendar;
