// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useAuth0 } from '@auth0/auth0-react';
// import { useSession, useSupabaseClient, useSessionContext } from '@supabase/auth-helpers-react';
// import DateTimePicker from 'react-datetime-picker';


// // import jwt from 'jsonwebtoken';
// // import { Buffer } from 'buffer';

// // import { GoogleLogin} from 'react-google-login';

// // const responseGoogle = (response) => {
// //   console.log("response ", response);
// // }

// // const responseError = (error) => {
// //   console.log("error", error);  
// // }
// const Calendar = () => {

//   const [ start, setStart ] = useState(new Date());
//   const [ end, setEnd ] = useState(new Date());
//   const [ eventName, setEventName ] = useState("");
//   const [ eventDescription, setEventDescription ] = useState("");

//   const session = useSession(); // tokens, when session exists we have a user
//   const supabase = useSupabaseClient(); // talk to supabase!
//   const { isLoading } = useSessionContext();
  
//   if(isLoading) {
//     return <></>
//   }

//   async function googleSignIn() {
//     const { error } = await supabase.auth.signInWithOAuth({
//       provider: 'google',
//       options: {
//         scopes: 'https://www.googleapis.com/auth/calendar'
//       }
//     });
//     if (error) {
//       alert("Error logging in to Google provider with Supabase");
//       console.log(error);
//     }
//   }

//   async function signOut() {
//     await supabase.auth.signOut();
//   }

//   async function createCalendarEvent() {
//     console.log("Creating calendar event");
//     const event = {
//       'summary': eventName,
//       'description': eventDescription,
//       'start': {
//         'dateTime': start.toISOString(), // Date.toISOString() ->
//         'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone // America/Los_Angeles
//       },
//       'end': {
//         'dateTime': end.toISOString(), // Date.toISOString() ->
//         'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone // America/Los_Angeles
//       }
//     }
//     console.log("event h", event);
//     //schedule an event using the above details

//     try {
//       const response = await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
//         method: "POST",
//         headers: {
//           'Authorization': 'Bearer ' + session.provider_token, // Access token for Google
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(event)
//       });
  
//       if (response.ok) {
//         const eventData = await response.json();
//         console.log("done with creation", eventData);
//         // alert("Event created, check your Google Calendar!");
//       } else {
//         console.error('Failed to create event:', response.status);
//         const errorData = await response.json();
//         console.error('Error details:', errorData);
//         // Handle the error or display an appropriate message to the user
//       }
//     } catch (error) {
//       console.error('Error creating event:', error);
//       // Handle the error or display an appropriate message to the user
//     }
//   }

//     // await axios
//   //   await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
//   //     method: "POST",
//   //     headers: {
//   //       'Authorization':'Bearer ' + session.provider_token // Access token for google
//   //     },
//   //     body: JSON.stringify(event)
//   //   }).then((data) => {
//   //     return data.json();
//   //   }).then((data) => {
//   //     console.log(data);
//   //     alert("Event created, check your Google Calendar!");
//   //   });
//   // }

//   console.log(session);
//   console.log(start);
//   console.log(eventName);
//   console.log(eventDescription);
//   return (
//     <div className="App">
//       <div style={{width: "600px", margin: "30px auto"}}>
//         {session ?
//           <>
//             <h2>Hey there {session.user.email}</h2>
//             <p>Start of your event</p>
//             <input type="text" onChange={(e) => setStart(new Date(e.target.value))} />
//             {/* <DateTimePicker onChange={setStart} value={start} /> */}
//             <p>End of your event</p>
//             {/* <DateTimePicker onChange={setEnd} value={end} /> */}
//             <input type="text" onChange={(e) => setEnd(new Date(e.target.value))} />
//             <p>Event name</p>
//             <input type="text" onChange={(e) => setEventName(e.target.value)} />
//             <p>Event description</p>
//             <input type="text" onChange={(e) => setEventDescription(e.target.value)} />
//             <hr />
//             <button onClick={() => createCalendarEvent()}>Create Calendar Event</button>
//             <p></p>
//             <button onClick={() => signOut()}>Sign Out</button>
//           </>
//           :
//           <>
//             <button onClick={() => googleSignIn()}>Sign In With Google</button>
//           </>
//         }
//       </div>
//     </div>
//   );
// }

//   // const [eventScheduled, setEventScheduled] = useState(false);
//   // const [eventLink, setEventLink] = useState('');
//   // const [accessToken, setAccessToken] = useState('');
//   // const { user, getAccessTokenSilently } = useAuth0();

// //   // useEffect(() => {
// //   //   const fetchToken = async () => {
// //   //     try {
// //   //       const accessToken = await getAccessTokenSilently();
// //   //       setAccessToken(accessToken);
// //   //       console.log('user 78655: ', user.accessToken, "ok", accessToken);
// //   //     } catch (error) {
// //   //       console.error('Error fetching token:', error);
// //   //     }
// //   //   };

// //   //   fetchToken();
// //   // }, [getAccessTokenSilently]);

// //   const scheduleEvent = async () => {
// //     console.log("user 786", user, " ok ", user.token);
// //     // if (!accessToken) {
// //     //   console.error('Access token not available');
// //     //   return;
// //     // }

// //     try {
// //         // console.log("ok 8676", accessToken, user);
// //         // const decodedToken = jwt.decode(accessToken);
// //         // console.log("decodedToken", decodedToken);
// //         // console.log(decodedToken);
// //         // const decodedToken = jwt.decode(accessToken);
// //         // if (decodedToken && decodedToken.scope) {
// //         //   const scopes = decodedToken.scope.split(' ');
// //         //   if (scopes.includes('https://www.googleapis.com/auth/calendar')) {
// //         //     console.log('User has calendar permissions');
// //         //   } else {
// //         //     console.log('User does not have calendar permissions');
// //         //   }
// //         // } else {
// //         //   console.log('Unable to verify user permissions');
// //         // }

// //         // await axios
// //         // .post(
// //         //   'http://localhost:4000/google',
// //         //   { token: accessToken, user: user },
// //         //   {
// //         //       headers: {
// //         //         'Authorization': `Bearer ${accessToken}`,
// //         //         'Content-Type': 'application/json',
// //         //       },
// //         //     withCredentials: true,
// //         //   }
// //         // )
// //         await axios
// //         .post(
// //           '/calendar',
// //               {
// //                 headers: {
// //                   //'Authorization': `Bearer ${accessToken}`,
// //                   'Content-Type': 'application/json',
// //                 },
// //                 withCredentials: true,
// //               }
// //         )
// //         .then((response) => {
// //           // console.log("&&&&&&In User CHat", friendId, response);
// //           // setUser(response.data.user);
// //           // setChattedUsersValue(friendId, response.data.user);
// //           console.log('Backend response:', response.data);
// //             if (response.status === 200) {
// //               // console.log('tokens', token);
// //               setEventScheduled(true);
// //               setEventLink(response.data.link); // Assuming the API response contains a 'link' field
// //           } else {
// //               // Handle error cases
// //               console.error('Failed to schedule event');
// //           }
// //         })
// //         .catch((error) => {
// //           console.error("API Error:", error);
// //         });

// //     } catch (error) {
// //         console.error('Error sending token to backend:', error);
// //     }
// //   };

// //   return (
// //     <div>
// //       <div>
// //       <h1>Calendar</h1>
// //       </div>
// //       <div>
// //         <button onClick={scheduleEvent}>Schedule Event</button>
// //       </div>
// //     </div>
// //   );
// // };

import React from 'react';
// import logo from './logo.svg';
// import './App.css';
import dayjs from 'dayjs';
import { v4 as uuid } from 'uuid';
// import { REACT_APP_GOOGLE_CALENDAR_CLIENT_ID, REACT_APP_GOOGLE_CALENDAR_API_KEY } from 

function Calendar() {

  var gapi = window.gapi
  /* 
    Update with your own Client Id and Api key 
  */
  var CLIENT_ID = '205852059308-9052ffinaa09obcr0r23vibubi2963m5.apps.googleusercontent.com'
  var API_KEY = 'AIzaSyBus4Dt7wMVXjMYWeqtlCW_6ENHBpfbxNI'
  var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"]
  var SCOPES = "https://www.googleapis.com/auth/calendar.events"

  const handleClick = () => {

    if (typeof window.gapi === 'undefined') {
      // Handle the case when gapi is not available or loaded
      console.error('Google API (gapi) is not available');
      return;
    }
    
    gapi.load('client:auth2', () => {
      console.log('loaded client')

      gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES,
      })

      gapi.client.load('calendar', 'v3', () => console.log('bam!'))

      gapi.auth2.getAuthInstance().signIn()
      .then(() => {
        
        // var event = {
        //   'summary': 'Awesome Event!',
        //   'location': '800 Howard St., San Francisco, CA 94103',
        //   'description': 'Really great refreshments',
        //   'start': {
        //     'dateTime': '2020-06-28T09:00:00-07:00',
        //     'timeZone': 'America/Los_Angeles'
        //   },
        //   'end': {
        //     'dateTime': '2020-06-28T17:00:00-07:00',
        //     'timeZone': 'America/Los_Angeles'
        //   },
        //   'recurrence': [
        //     'RRULE:FREQ=DAILY;COUNT=2'
        //   ],
        //   'attendees': [
        //     {'email': 'lpage@example.com'},
        //     {'email': 'sbrin@example.com'}
        //   ],
        //   'reminders': {
        //     'useDefault': false,
        //     'overrides': [
        //       {'method': 'email', 'minutes': 24 * 60},
        //       {'method': 'popup', 'minutes': 10}
        //     ]
        //   }
        // }

        const event = {
          calendarId: 'primary',
          conferenceDataVersion: 1,
          resource: {
            summary: 'Test Event',
            start: {
              dateTime: dayjs(new Date()).add(0, 'day').toISOString(),
              timeZone: 'Asia/Kolkata',
            },
            end: {
              dateTime: dayjs(new Date()).add(0, 'day').add(1, 'hour').toISOString(),
              timeZone: 'Asia/Kolkata',
            },
            conferenceData: {
              createRequest: {
                requestId: uuid(),
              },
            },
            attendees: [
              { email: 'abhit20421@iiitd.ac.in' },
              { email: 'sarthak20576@iiitd.ac.in' }
            ]
          },
        }

        var request = gapi.client.calendar.events.insert({
          'calendarId': 'primary',
          'resource': event,
        })

        request.execute(event => {
          console.log(event)
          window.open(event.htmlLink)
        })
        

        /*
            Uncomment the following block to get events
        */
        /*
        // get events
        gapi.client.calendar.events.list({
          'calendarId': 'primary',
          'timeMin': (new Date()).toISOString(),
          'showDeleted': false,
          'singleEvents': true,
          'maxResults': 10,
          'orderBy': 'startTime'
        }).then(response => {
          const events = response.result.items
          console.log('EVENTS: ', events)
        })
        */
    

      })
    })
  }


  return (
    <div>
      <p>Click to add event to Google Calendar</p>
      <button style={{width: 100, height: 50}} onClick={handleClick}>Add Event</button>
    </div>
  );
}

export default Calendar;