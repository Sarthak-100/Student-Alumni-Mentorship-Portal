import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { useSession, useSupabaseClient, useSessionContext } from '@supabase/auth-helpers-react';
import { v4 as uuid } from 'uuid';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../context/UserContext';

const Calendar = () => {

  const navigate = useNavigate();

  const [ startDate, setStart ] = useState(new Date());
  const [ endDate, setEnd ] = useState(new Date());
  const [ eventName, setEventName ] = useState("");
  const [ eventDescription, setEventDescription ] = useState("");
  const [ setApiResponse ] = useState({});
  const { user } = useUserContext();

  useEffect(() => {
    syncCalendar(); // Call the syncCalendar function on component mount
  }, []);

  const session = useSession(); // tokens, when session exists we have a user
  const supabase = useSupabaseClient(); // talk to supabase!
  const { isLoading } = useSessionContext();
  // console.log("supabase", supabase);

  if(isLoading) {
    return <></>
  }

  function signIn() {
    const { error } = supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        scopes: ['https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/meetings.space.created',]
      }
    });
    if (error) {
      alert("Error logging in to Google provider with Supabase");
      console.log(error);
    }else {
      console.log("Supabase login successful");
      // window.open('https://calendar.google.com/calendar/u/0/r', "_blank");
    }
  }

  // async function signOut() {
  //   await supabase.auth.signOut();
  // }

  //write a function to get calendar url
  // async function getCalendarUrl() {
  //   const { data, error } = await supabase
  //     .from('users')
  //     .select('calendar_url')
  //     .eq('id', session.user.id)
  //     .single();
  //   if (error) {
  //     console.log(error);
  //     return;
  //   }
  //   return data.calendar_url;
  // }

  //write a function to sync calendar
  async function syncCalendar() {
    console.log("syncing calendar");
    const baseUrl = "http://localhost:4000/api/v1/fetchSlots/details";
    const userId = user._id;
    const apiUrl = `${baseUrl}?userId=${userId}`;
    console.log(apiUrl);
    axios.get(apiUrl).then((response) => {
      if (response.status === 200) {
        const events = response.data.events;
        //check length of events
        if (events.length === 0) {
          console.log("No events to sync");
          return;
        }
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
              timeZone: 'Asia/Kolkata', // Modify timezone as needed
            },
            end: {
              dateTime: event.endDateTime,
              timeZone: 'Asia/Kolkata', // Modify timezone as needed
            },
            attendees: event.attendees
            // Other event details to update
          };
          console.log("updated event", updatedEvent);
          try {
            const patchResponse = await fetch(googleCalendarUrl, {
              method: 'PATCH',
              headers: {
                'Authorization': 'Bearer ' + session.provider_token,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(updatedEvent),
            });
  
            if (patchResponse.ok) {
              console.log(`Event ${googleEventId} updated in Google Calendar`);
              // Optionally handle success
            } else {
              console.error('Failed to update event in Google Calendar:', patchResponse.status);
              // Handle error
            }
          } catch (error) {
            console.error('Error updating event in Google Calendar:', error);
            // Handle error
          }
        });
  
        console.log("All events synced with Google Calendar");
      } else {
        console.error('Failed to fetch events from the database:', response.status);
      }
    }).catch((error) => {
      console.error('Failed to fetch events from the database:', error);
    });
}

// async function createGoogleMeetEvent() {
//   try {
//     const meetEvent = {
//       conferenceData: {
//         createRequest: {
//           requestId: uuid(),
//           conferenceSolutionKey: {
//             type: 'hangoutsMeet',
//           },
//         },
//       },
//     };

//     const response = await fetch("https://www.googleapis.com/calendar/v3/users/me/events", {
//       method: "POST",
//       headers: {
//         'Authorization': 'Bearer ' + session.provider_token,
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify(meetEvent),
//     });

//     if (response.ok) {
//       const meetEventData = await response.json();
//       const meetLink = meetEventData.hangoutLink;
//       return meetLink;
//     } else {
//       console.error('Failed to create Google Meet event:', response.status);
//       return null;
//     }
//   } catch (error) {
//     console.error('Error creating Google Meet event:', error);
//     return null;
//   }
// }

//   async function createCalendarEvent() {
//     console.log("Creating calendar event");

//     const meetLink = await createGoogleMeetEvent();
//     if (meetLink) {
//       console.log("Meeting link", meetLink);
//       // Now, you have the Meet link. Update your calendar event.
//       const event = {
//         calendarId: 'primary',
//         conferenceDataVersion: 1,
//         summary: eventName,
//         description: eventDescription,
//         start: {
//           dateTime: startDate.toISOString(),
//           timeZone: 'Asia/Kolkata',
//         },
//         end: {
//           dateTime: endDate.toISOString(),
//           timeZone: 'Asia/Kolkata',
//         },
//         attendees: [],
//         reminders: {
//           useDefault: false,
//           overrides: [
//             { method: 'email', minutes: 24 * 60 },
//             { method: 'popup', minutes: 10 },
//           ],
//         },};
//       event.conferenceDataVersion = 1;
//       event.conferenceData = {
//         createRequest: {
//           requestId: uuid(),
//           conferenceSolutionKey: {
//             type: 'hangoutsMeet',
//           },
//         },
//         entryPoints: [
//           {
//             entryPointType: 'video',
//             uri: meetLink,
//           },
//         ],
//       };
    
//       //schedule an event using the above details

//       try {
//         const response = await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
//           method: "POST",
//           headers: {
//             'Authorization': 'Bearer ' + session.provider_token, // Access token for Google
//             'Content-Type': 'application/json'
//           },
//           body: JSON.stringify(event),
//         });
        
//         if (response.ok) {
//           const eventData = await response.json();
//           const googleEventId = eventData.id;
//           console.log('Event created and saved in MongoDB:', eventData, session.user.email, googleEventId);
//           const apiUrl = "http://localhost:4000/api/v1/saveEvent/details";
//           axios
//           .post(apiUrl, {
//             headers: {
//               'Content-Type': 'application/json',
//             },
//             googleEventId: googleEventId,
//             userId: session.user.email,
//             summary: eventName,
//             description: eventDescription,
//             startDateTime: startDate.toISOString(),
//             endDateTime: endDate.toISOString(),
//           })
//           .then((response) => {
//             // setApiResponse(response.data);
//             console.log(response.data);
//             if (response.status == 201) {
//               alert("Event created and saved, check your Google Calendar!");
//               // navigate("/");
//             } else {
//               // Handle errors while saving to MongoDB
//               console.error('Failed to save event in the database:', response.status);
//               const errorData = response.json();
//               console.error('Error details:', errorData);
//             }
//           })
//           .catch((error) => {
//             // Handle errors while saving to MongoDB
//             console.error('Failed to save event in the database:', response.status);
//             // const errorData = res.json();
//             console.error('Error details:', error);
//           });
//         }
//       } catch (error) {
//         // console.error('Failed to add event in calendar', response.status);
//         // const errorDat/ = await response.json();
//         console.error('Error details:', error);
//       }
//     }else {
//       console.error('Failed to create Google Meet event');
//     }
//  }

async function createCalendarEvent() {
  console.log("Creating calendar event");

  const event = {
    calendarId: 'primary',
    summary: eventName,
    description: eventDescription,
    start: {
      dateTime: startDate.toISOString(),
      timeZone: 'Asia/Kolkata',
    },
    end: {
      dateTime: endDate.toISOString(),
      timeZone: 'Asia/Kolkata',
    },
    attendees: [],
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'email', minutes: 24 * 60 },
        { method: 'popup', minutes: 10 },
      ],
    },
  };

  try {
    const response = await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
      method: "POST",
      headers: {
        'Authorization': 'Bearer ' + session.provider_token, // Access token for Google
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(event),
    });
    
    if (response.ok) {
      const eventData = await response.json();
      const googleEventId = eventData.id;
      console.log('Event created and saved in MongoDB:', eventData, session.user.email, googleEventId, eventData.attendees, eventData.hangoutLink);
      const apiUrl = "http://localhost:4000/api/v1/saveEvent/details";
      axios
      .post(apiUrl, {
        headers: {
          'Content-Type': 'application/json',
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
          // navigate("/");
        } else {
          // Handle errors while saving to MongoDB
          console.error('Failed to save event in the database:', response.status);
          const errorData = response.json();
          console.error('Error details:', errorData);
        }
      })
      .catch((error) => {
        // Handle errors while saving to MongoDB
        console.error('Failed to save event in the database:', response.status);
        // const errorData = res.json();
        console.error('Error details:', error);
      });
    }
  } catch (error) {
    // console.error('Failed to add event in calendar', response.status);
    // const errorDat/ = await response.json();
    console.error('Error details:', error);
  }
}

  console.log(session);
  console.log(startDate);
  console.log(endDate);
  console.log(eventName);
  console.log(eventDescription);

  return (
    <div className="App">
      <div style={{width: "600px", margin: "30px auto"}}>
        {session ?
          <>
            <h2>Hey there {session.user.email}</h2>
            <p>Start of your event</p>
            <input type="text" onChange={(e) => setStart(new Date(e.target.value))} />
            {/* <input type="date" onChange={(e) => {
                    const selectedDate = e.target.value;
                    // Do something with the selectedDate (it will be in the format YYYY-MM-DD)
                    // For instance, you can convert it to a Date object:
                    const dateObject = new Date(selectedDate);
                    console.log(dateObject); // This will show the selected date in the console
            }} /> */}
            {/* <DateTimePicker onChange={setStart} value={startDate} /> */}
            <p>End of your event</p>
            {/* <input type="date" onChange={(e) => {
                    const selectedDate = e.target.value;
                    // Do something with the selectedDate (it will be in the format YYYY-MM-DD)
                    // For instance, you can convert it to a Date object:
                    const dateObject = new Date(selectedDate);
                    console.log(dateObject); // This will show the selected date in the console
            }} /> */}
            {/* <DateTimePicker onChange={setEnd} value={endDate} /> */}
            <input type="text" onChange={(e) => setEnd(new Date(e.target.value))} />
            <p>Event name</p>
            <input type="text" onChange={(e) => setEventName(e.target.value)} />
            <p>Event description</p>
            <input type="text" onChange={(e) => setEventDescription(e.target.value)} />
            <hr />
            <button onClick={() => createCalendarEvent()}>Create Calendar Event</button>
          </>
          :
          <>
            <button onClick={() => signIn()}>Sign In</button>
          </>
        }
      </div>
    </div>
  );
}

export default Calendar;