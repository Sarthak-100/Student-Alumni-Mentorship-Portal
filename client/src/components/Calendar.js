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

const Calendar = () => {
  const [startDate, setStart] = useState(new Date());
  const [endDate, setEnd] = useState(new Date());
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [apiResponse, setApiResponse] = useState({});
  const [showContent, setShowContent] = useState(false);
  const { user } = useUserContext();
  const [pastMeetings, setPastMeetings] = useState([]);
  const [showPastMeetings, setShowPastMeetings] = useState(false);
  // const [effectCount, setEffectCount] = useState(0);

  const navigate = useNavigate();
  const session = useSession(); // tokens, when session exists we have a user
  const supabase = useSupabaseClient(); // talk to supabase!
  const { isLoading } = useSessionContext();

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
        setShowPastMeetings(true);
        setShowContent(true);
      } else {
        console.error("Failed to fetch past meetings:", response.status);
      }
    } catch (error) {
      console.error("Error fetching past meetings:", error);
    }
  };

  // useEffect(() => {
  //   console.log("in use effect sync calendar");
  //   // setEffectCount((prevCount) => prevCount + 1);
  //   console.log("effect count kitna h", effectCount);
  //   if (session !== null && session?.provider_token !== undefined && effectCount === 0) {
  //     syncCalendar(); // Call the syncCalendar function on component mount
  //   }
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

  // //write a function to sync calendar
  // async function syncCalendar() {
  //   if (session !== null) {

  //     const baseUrl = "http://localhost:4000/api/v1/fetchSlots/details";
  //     const userId = user._id;
  //     const apiUrl = `${baseUrl}?userId=${userId}`;
  //     console.log(apiUrl);
  //     axios
  //       .get(apiUrl)
  //       .then((response) => {
  //         if (response.status === 200) {
  //           const events = response.data.events;
  //           //check length of events
  //           if (events.length === 0) {
  //             console.log("No events to sync");
  //             return;
  //           }
  //           console.log("Syncing events with Google Calendar");
  //           // console.log("events", events);
  //           // Assuming you have retrieved events from the database
  //           events.forEach(async (event) => {
  //             const googleEventId = event.googleEventId; // Assuming you have a unique Google Event ID
  //             // console.log("meet link", event.meetLink);
  //             const googleCalendarUrl = `https://www.googleapis.com/calendar/v3/calendars/primary/events/${googleEventId}`;
  //             const updatedEvent = {
  //               summary: event.summary,
  //               description: event.description,
  //               start: {
  //                 dateTime: event.startDateTime,
  //                 timeZone: "Asia/Kolkata", // Modify timezone as needed
  //               },
  //               end: {
  //                 dateTime: event.endDateTime,
  //                 timeZone: "Asia/Kolkata", // Modify timezone as needed
  //               },
  //               attendees: event.attendees.map(attendee => ({
  //                 email: attendee.email,
  //                 responseStatus: "accepted" // Assuming all attendees are accepted
  //               })),
  //               // Other event details to update
  //             };
  //             console.log("updated event", updatedEvent);
  //             try {
  //               const patchResponse = await fetch(googleCalendarUrl, {
  //                 method: "PATCH",
  //                 headers: {
  //                   Authorization: "Bearer " + session.provider_token,
  //                   "Content-Type": "application/json",
  //                 },
  //                 body: JSON.stringify(updatedEvent),
  //               });

  //               if (patchResponse.ok) {
  //                 console.log(
  //                   `Event ${googleEventId} updated in Google Calendar`
  //                 );
  //               } else {
  //                 console.error(
  //                   "Failed to update event in Google Calendar:",
  //                   patchResponse.status
  //                 );
  //               }
  //             } catch (error) {
  //               console.error(
  //                 "Error updating event in Google Calendar:",
  //                 error
  //               );
  //             }
  //           });

  //           console.log("All events synced with Google Calendar");
  //         } else {
  //           console.error(
  //             "Failed to fetch events from the database:",
  //             response.status
  //           );
  //         }
  //       })
  //       .catch((error) => {
  //         console.error("Failed to fetch events from the database:", error);
  //       });
  //   }
  // }

  // async function createCalendarEvent() {
  //   console.log("Creating calendar event");

  //   const event = {
  //     calendarId: "primary",
  //     summary: eventName,
  //     description: eventDescription,
  //     start: {
  //       dateTime: startDate.toISOString(),
  //       timeZone: "Asia/Kolkata",
  //     },
  //     end: {
  //       dateTime: endDate.toISOString(),
  //       timeZone: "Asia/Kolkata",
  //     },
  //     attendees: [],
  //     reminders: {
  //       useDefault: false,
  //       overrides: [
  //         { method: "email", minutes: 24 * 60 },
  //         { method: "popup", minutes: 10 },
  //       ],
  //     },
  //   };

  //   try {
  //     const response = await fetch(
  //       "https://www.googleapis.com/calendar/v3/calendars/primary/events",
  //       {
  //         method: "POST",
  //         headers: {
  //           Authorization: "Bearer " + session.provider_token, // Access token for Google
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(event),
  //       }
  //     );

  //     if (response.ok) {
  //       const eventData = await response.json();
  //       const googleEventId = eventData.id;
  //       console.log(
  //         "Event created and saved in MongoDB:",
  //         eventData,
  //         session.user.email,
  //         googleEventId,
  //         eventData.attendees,
  //         eventData.hangoutLink
  //       );
  //       const apiUrl = "http://localhost:4000/api/v1/saveEvent/details";
  //       axios
  //         .post(apiUrl, {
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //           googleEventId: googleEventId,
  //           userId: session.user.email,
  //           summary: eventName,
  //           description: eventDescription,
  //           startDateTime: startDate.toISOString(),
  //           endDateTime: endDate.toISOString(),
  //         })
  //         .then((response) => {
  //           // setApiResponse(response.data);
  //           console.log(response.data);
  //           if (response.status == 201) {
  //             alert("Event created and saved, check your Google Calendar!");
  //             navigate("/");
  //           } else {
  //             // Handle errors while saving to MongoDB
  //             console.error(
  //               "Failed to save event in the database:",
  //               response.status
  //             );
  //             const errorData = response.json();
  //             console.error("Error details:", errorData);
  //           }
  //         })
  //         .catch((error) => {
  //           // Handle errors while saving to MongoDB
  //           console.error(
  //             "Failed to save event in the database:",
  //             response.status
  //           );
  //           // const errorData = res.json();
  //           console.error("Error details:", error);
  //         });
  //     }
  //   } catch (error) {
  //     console.error("Error details:", error);
  //   }
  // }

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
    // }
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
                  </Grid>
                </Grid>
              </>
            ) : (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => signIn()}
                >
                  Sign In
                </Button>
              </>
            )}
          </>
        ) : (
          <>
            {!showContent && (
              <Button variant="contained" onClick={handleShowPastMeetings}>
                Show Past Meetings
              </Button>
            )}
            {showContent && showPastMeetings && (
              <div>
                <Typography variant="h6" sx={{ marginBottom: 3 }}>
                  Past Meetings
                </Typography>
                {pastMeetings &&
                pastMeetings.events &&
                pastMeetings.events.length > 0 ? (
                  <Grid container spacing={3}>
                    {pastMeetings.events.map((meeting) => (
                      <Grid key={meeting._id} item xs={12} sm={6} md={4} lg={3}>
                        <Card
                          variant="outlined"
                          sx={{ minWidth: 280, width: "100%" }}
                        >
                          <CardContent>
                            <Typography variant="subtitle1" gutterBottom>
                              <strong>Alumni: </strong>
                              {meeting.alumniName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              <strong>Summary:</strong> {meeting.summary}
                              <br />
                              <strong>Description:</strong>{" "}
                              {meeting.description}
                              <br />
                              <strong>Start Time:</strong>{" "}
                              {new Date(meeting.startDateTime).toLocaleString()}
                              <br />
                              <strong>End Time:</strong>{" "}
                              {new Date(meeting.endDateTime).toLocaleString()}
                              <br />
                            </Typography>
                          </CardContent>
                        </Card>
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
