import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import {
  useSession,
  useSupabaseClient,
  useSessionContext,
} from "@supabase/auth-helpers-react";
import { v4 as uuid } from "uuid";
import { IconButton, Typography, TextField, Grid, Button } from "@mui/material";
import dayjs from "dayjs";
import { useUserContext } from "../context/UserContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "react-calendar/dist/Calendar.css";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@mui/material";
import MeetingCard from "./MeetingCard";

const Calendar = () => {
  const [startDate, setStart] = useState(new Date());
  const [endDate, setEnd] = useState(new Date());
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [apiResponse, setApiResponse] = useState({});
  const { user } = useUserContext();
  const [pastMeetings, setPastMeetings] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  // const [effectCount, setEffectCount] = useState(0);

  const navigate = useNavigate();
  const session = useSession(); // tokens, when session exists we have a user
  const supabase = useSupabaseClient(); // talk to supabase!
  const { isLoading } = useSessionContext();

  if ((session === null || session.provider_token === undefined) && user?.user_type === "alumni") {
    console.log("signing in");
    signIn();
  }

  const fetchAlumniNameById = async (alumniId) => {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/v1/student/filter-alumni/getAlumniNameById?alumniId=${alumniId}`
      );
      return response.data.alumniName;
    } catch (error) {
      console.error("Error fetching alumni name:", error);
      return ""; // Return an empty string if there's an error
    }
  };

  const fetchStudentNameById = async (studentId) => {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/v1/filter-student/getStudentNameById?studentId=${studentId}`
      );
      return response.data.studentName;
    } catch (error) {
      console.error("Error fetching student name:", error);
      return ""; // Return an empty string if there's an error
    }
  };

  const handleShowPastMeetings = async () => {
    console.log("in past meetings", user._id);
    try {
      const response = await axios.get(
        `http://localhost:4000/api/v1/fetchPastMeetings/meetings?userId=${user._id}`
      );

      if (response.status === 200) {
        const pastMeetings = response.data;
        console.log("Past meetings:", pastMeetings);

        // Fetch alumni names and update pastMeetings
        const meetingsWithAlumniNames = await Promise.all(
          pastMeetings.events.map(async (meeting) => {
            const alumniName = await fetchAlumniNameById(meeting.alumni);
            return { ...meeting, alumniName };
          })
        );

        setPastMeetings({ ...pastMeetings, events: meetingsWithAlumniNames });
      } else {
        console.error("Failed to fetch past meetings:", response.status);
      }
    } catch (error) {
      console.error("Error fetching past meetings:", error);
    }
  };

  useEffect(() => {
    // Fetch past meetings when component mounts
    handleShowPastMeetings();
  }, []); // Run this effect only once on component mount


  // useEffect(() => {
  //   // console.log("in use effect sync calendar");
  //   // // setEffectCount((prevCount) => prevCount + 1);
  //   // console.log("effect count kitna h", effectCount);
  //   // if (session !== null && session?.provider_token !== undefined && effectCount === 0) {
  //   //   syncCalendar(); // Call the syncCalendar function on component mount
  //   // }
  //   signIn();
  // }, []);

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

  async function createCalendarEvent() {
    // Check if start time is before end time
    if (startDate > endDate) {
      alert("Invalid event, start time must be before end time");
      return;
    }

    console.log("Creating calendar event");
    try {
      // Save event details in the database without creating it in Google Calendar
      const response = await axios.post(
        "http://localhost:4000/api/v1/saveEvent/details",
        {
          headers: {
            "Content-Type": "application/json",
          },
          // Include necessary event details here for storage in the database
          userId: session.user.email,
          summary: eventName,
          description: eventDescription,
          startDateTime: startDate.toISOString(),
          endDateTime: endDate.toISOString(),
        }
      );

      if (response.status === 201) {
        alert("Event details saved!");
        navigate("/");
      } else {
        console.error("Failed to save event details:", response.status);
        const errorData = response.json();
        console.error("Error details:", errorData);
      }
    } catch (error) {
      console.error("Error saving event details:", error);
    }
  }

  async function syncCalendar() {
    if (session !== null && session?.provider_token !== undefined) {
      try {
        const baseUrl = "http://localhost:4000/api/v1/fetchSlots/details";
        const userId = user._id;
        const apiUrl = `${baseUrl}?userId=${userId}`;
        const response = await axios.get(apiUrl);

        if (response.status === 200) {
          const events = response.data.events;

          if (events.length === 0) {
            console.log("No events to sync");
            return;
          }

          console.log("Syncing events with Google Calendar");

          events.forEach(async (event) => {
            // console.log("event", event, event.attendees.length, event.attendees);
            // Check if this event has attendees booked
            if (event.attendees && event.attendees.length > 0) {
              console.log(
                "checking event creation",
                event.googleEventId,
                event.googleEventId === null
              );
              if (
                event.googleEventId === undefined ||
                event.googleEventId === null
              ) {
                console.log("Creating calendar event");

                const newEvent = {
                  calendarId: "primary",
                  summary: event.summary,
                  description: event.description,
                  start: {
                    dateTime: event.startDateTime,
                    timeZone: "Asia/Kolkata",
                  },
                  end: {
                    dateTime: event.endDateTime,
                    timeZone: "Asia/Kolkata",
                  },
                  attendees: event.attendees.map((attendee) => ({
                    email: attendee.email,
                    responseStatus: "accepted", // Assuming all attendees are accepted
                  })),
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
                      body: JSON.stringify(newEvent),
                    }
                  );
                  if (response.ok) {
                    const eventData = await response.json();
                    console.log("Event created in google calendar", eventData);
                    const googleEventId = eventData.id;
                    const updatedEvent = { ...event };
                    updatedEvent.googleEventId = googleEventId;
                    console.log("event", updatedEvent);

                    //update this event in the database
                    const apiUrl =
                      "http://localhost:4000/api/v1/updateEvent/update";
                    axios
                      .post(apiUrl, {
                        headers: {
                          "Content-Type": "application/json",
                        },
                        event: updatedEvent,
                      })
                      .then((response) => {
                        // setApiResponse(response.data);
                        console.log(response.data);
                        if (response.status == 200) {
                          console.log("Event updated in database");
                        } else {
                          // Handle errors while saving to MongoDB
                          console.error(
                            "Failed to update event in the database:",
                            response.status
                          );
                        }
                      })
                      .catch((error) => {
                        // Handle errors while saving to MongoDB
                        console.error(
                          "Failed to update event in the database:",
                          error
                        );
                      });
                  } else {
                    console.error("Error details:", response);
                  }
                } catch (error) {
                  console.error("Error details:", error);
                }
              } else {
                // Update event in Google Calendar
                try {
                  const googleCalendarUrl = `https://www.googleapis.com/calendar/v3/calendars/primary/events/${event.googleEventId}`;
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
                    attendees: event.attendees.map((attendee) => ({
                      email: attendee.email,
                      responseStatus: "accepted", // Assuming all attendees are accepted
                    })),
                    // Other event details to update
                  };
                  console.log("updated event", updatedEvent);

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
                      `Event ${event.googleEventId} updated in Google Calendar`
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
              }
            } else {
              //delete event from the google calendar if attendees.length === 0 and event is created in google calendar
              if (
                event.attendees.length === 0 &&
                event.googleEventId !== undefined &&
                event.googleEventId !== null
              ) {
                console.log(
                  "Deleting event from Google Calendar",
                  event.googleEventId
                );
                try {
                  const googleCalendarUrl = `https://www.googleapis.com/calendar/v3/calendars/primary/events/${event.googleEventId}`;
                  const deleteResponse = await fetch(googleCalendarUrl, {
                    method: "DELETE",
                    headers: {
                      Authorization: "Bearer " + session.provider_token,
                      "Content-Type": "application/json",
                    },
                  });

                  if (deleteResponse.ok) {
                    console.log(
                      `Event ${event.googleEventId} deleted from Google Calendar`
                    );
                    //remove google event id from the database for this event
                    const updatedEvent = { ...event };
                    updatedEvent.googleEventId = null;
                    console.log("event after deletion", updatedEvent);

                    //update this event in the database
                    const apiUrl =
                      "http://localhost:4000/api/v1/updateEvent/update";
                    axios
                      .post(apiUrl, {
                        headers: {
                          "Content-Type": "application/json",
                        },
                        event: updatedEvent,
                      })
                      .then((response) => {
                        // setApiResponse(response.data);
                        console.log(response.data);
                        if (response.status == 200) {
                          console.log("Event updated in database");
                        } else {
                          // Handle errors while saving to MongoDB
                          console.error(
                            "Failed to update event in the database:",
                            response.status
                          );
                        }
                      })
                      .catch((error) => {
                        // Handle errors while saving to MongoDB
                        console.error(
                          "Failed to update event in the database:",
                          error
                        );
                      });
                  } else {
                    console.error(
                      "Failed to delete event from Google Calendar:",
                      deleteResponse.status
                    );
                  }
                } catch (error) {
                  console.error(
                    "Error deleting event from Google Calendar:",
                    error
                  );
                }
              }
            }
          });

          console.log("All events synced with Google Calendar");
        } else {
          console.error(
            "Failed to fetch events from the database:",
            response.status
          );
        }
      } catch (error) {
        console.error("Failed to fetch events from the database:", error);
      }
    }
  }

  async function showUpcomingEvents() {
    console.log("in show upcoming events");
    try {
      const baseUrl = "http://localhost:4000/api/v1/fetchSlots/details";
      const userId = user._id;
      const apiUrl = `${baseUrl}?userId=${userId}`;
      const response = await axios.get(apiUrl);

      if (response.status === 200) {
        const events = response.data.events;
        //add attendee name with the event
        const eventsWithAttendeeNames = await Promise.all(
          events.map(async (event) => {
            const attendeeNames = await Promise.all(
              event.attendees.map(async (attendee) => {
                // if (attendee.userType === "student") {
                //   const studentName = await fetchStudentNameById(attendee.userId);
                //   return { ...attendee, name: studentName };
                // } else {
                //   const alumniName = await fetchAlumniNameById(attendee.userId);
                //   return { ...attendee, name: alumniName };
                // }
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
      // Delete the event from the database
      const deleteResponse = await axios.delete(
        `http://localhost:4000/api/v1/deleteEvent/details?eventId=${eventId}`
      );

      if (deleteResponse.status === 200) {
        console.log("Event deleted from the database");

        // if (googleEventId) {
        //   // Delete event from Google Calendar if it has a googleEventId
        //   const googleCalendarUrl = `https://www.googleapis.com/calendar/v3/calendars/primary/events/${googleEventId}`;
        //   const googleDeleteResponse = await fetch(googleCalendarUrl, {
        //     method: "DELETE",
        //     headers: {
        //       Authorization: "Bearer " + session.provider_token,
        //       "Content-Type": "application/json",
        //     },
        //   });

        //   if (googleDeleteResponse.ok) {
        //     console.log("Event deleted from Google Calendar");
        //   } else {
        //     console.error(
        //       "Failed to delete event from Google Calendar:",
        //       googleDeleteResponse.status
        //     );
        //   }
        // }

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
            {session && session?.provider_token !== undefined ? (
              <>
                <Grid container spacing={4}>
                  <Grid item xs={12}>
                    <Typography variant="h5" style={{ fontWeight: "bold" }}>
                      Hey! {user?.name}, mark your availability here
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body1" style={{ fontWeight: "bold" }}>
                      Event Start Time
                    </Typography>
                    <DatePicker
                      selected={startDate}
                      onChange={(date) => setStart(date)}
                      showTimeSelect
                      dateFormat="Pp"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="body1" style={{ fontWeight: "bold" }}>
                      Event End Time
                    </Typography>

                    {/* <input type="text" onChange={(e) => setStart(new Date(e.target.value))} /> */}
                    <DatePicker
                      selected={endDate}
                      onChange={(date) => setEnd(date)}
                      showTimeSelect
                      dateFormat="Pp"
                    />
                    {/* <input type="text" onChange={(e) => setEnd(new Date(e.target.value))} /> */}
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body1" style={{ fontWeight: "bold" }}>
                      Event Name
                    </Typography>
                    <TextField
                      type="text"
                      value={eventName}
                      onChange={(e) => setEventName(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body1" style={{ fontWeight: "bold" }}>
                      Event Description{" "}
                      <span style={{ fontWeight: "normal" }}>(optional)</span>
                    </Typography>
                    <TextField
                      type="text"
                      value={eventDescription}
                      onChange={(e) => setEventDescription(e.target.value)}
                    />
                  </Grid>
                  <hr />
                  <Grid item xs={12} style={{ marginTop: "10px" }}>
                    <Button
                      variant="contained"
                      color="primary"
                      style={{ marginRight: "10px" }}
                      onClick={() => createCalendarEvent()}
                    >
                      Create Calendar Event
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => syncCalendar()}
                    >
                      Sync Calendar
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => showUpcomingEvents()}
                    >
                      Show Upcoming Events
                    </Button>

                    {upcomingEvents.map((event) => (
                      <div key={event._id}>
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
                        {event.description && (
                          <p>Description: {event.description}</p>
                        )}
                        {event.attendees && event.attendees.length > 0 && (
                          <div>
                            <p>Attendees:</p>
                            <ul>
                              {event.attendees.map((attendee, index) => (
                                <li key={index}>
                                  {attendee.name} ({attendee.email})
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {event.attendees.length === 0 && (
                          <p> Attendees: None</p>
                        )}
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() =>
                            deleteEvent(event._id, event.googleEventId)
                          }
                        >
                          Delete Event
                        </Button>
                      </div>
                    ))}
                  </Grid>
                </Grid>
              </>
            ) : null}
          </>
        ) : (
          <>
            
            {(
              <div>
                <Typography variant="h6" sx={{ marginBottom: 3 }}>
                  Past Meetings
                </Typography>
                {pastMeetings &&
                pastMeetings.events &&
                pastMeetings.events.length > 0 ? (
                  <Grid container spacing={3}>
                    {pastMeetings.events.map((meeting) => (
                      <Grid key={meeting._id} item xs={12}>
                        <MeetingCard meeting={meeting} />
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Typography variant="body1">
                    No past meetings available
                  </Typography>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Calendar;
