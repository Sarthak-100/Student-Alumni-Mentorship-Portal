import express from "express";
import { config } from "dotenv";
import userRouter from "./routes/userRoutes.js";
import conversationRouter from "./routes/conversationRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import cookieParser from "cookie-parser";
import errorMiddleware from "./middlewares/error.js";
import filterRouter from "./routes/filterRouter.js";
import { useAuth0 } from '@auth0/auth0-react';

import cors from "cors";
import { google } from 'googleapis'
import dayjs from 'dayjs'
import { v4 as uuid } from 'uuid'

const app = express();

//PORT and database URI from config.env
config({
  path: "./data/config.env",
});

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URL
);

const scopes = [
  'https://www.googleapis.com/auth/calendar',
  // 'https://www.googleapis.com/auth/calendar.events'
];

const allowedOrigins = [
  'http://localhost:5000',
  'http://localhost:4000',
  'http://localhost:4000/schedule_event',
  'http://localhost:4000/google/redirect',
  'https://accounts.google.com/o/oauth2/v2/auth',
  'https://accounts.google.com',
  'http://www.google.com/support/accounts/bin/answer.py?hl=en&answer=151657',
  'https://accounts.google.com/o/oauth2/v2/auth?access_type=offline&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcalendar&response_type=code&client_id=205852059308-9052ffinaa09obcr0r23vibubi2963m5.apps.googleusercontent.com&redirect_uri=http%3A%2F%2Flocalhost%3A4000%2Fgoogle%2Fredirect',
];


//adding middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
  // res.header("Access-Control-Allow-Origin", ["http://localhost:5000", "https://accounts.google.com/o/oauth2/v2/auth?access_type=offline&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcalendar&response_type=code&client_id=205852059308-9052ffinaa09obcr0r23vibubi2963m5.apps.googleusercontent.com&redirect_uri=http%3A%2F%2Flocalhost%3A4000%2Fgoogle%2Fredirect"]);
  const origin = req.headers.origin;
  // console.log("origin", origin);
  if (allowedOrigins.includes(origin)) {
    // Set the Access-Control-Allow-Origin header to the request's origin
    // console.log("hello");
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Expose-Headers", "set-cookie");
  next();
});
// app.use(cors());
app.use("/api/v1/users", userRouter);
app.use("/api/v1/conversations", conversationRouter);
app.use("/api/v1/messages", messageRouter);

app.use(errorMiddleware);

//API for filtering alumni profiles as per added filters
app.use("/api/v1/student/filter-alumni", filterRouter);

app.get("/", (req, res) => {
  res.send("Nice Working");
  // console.log(oauth2Client._clientId, oauth2Client._clientSecret, oauth2Client._redirectUri);
});

app.get("/api/data", (req, res) => {
  res.status(200).json({ message: "This is a sample response" });
});

app.post("/calendar", (req, res) => {
  console.log("hello");
  //call /google api
  res.redirect("/google");
});

app.get("/google", (req, res) => {
  // console.log(oauth2Client._clientId, oauth2Client._clientSecret, oauth2Client._redirectUri);
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
  });
  console.log(url);
  res.redirect(url);
});

app.get('/google/redirect', (req, res) => {
  const code = req.query.code;
  oauth2Client.getToken(code)
  .then(({ tokens }) => {
    console.log("hello token", tokens);
    oauth2Client.setCredentials(tokens);
    res.send({
      msg: 'Successfully logged in',
    });
  })
  .catch(error => {
    // Handle error appropriately
    console.error('Error getting tokens:', error);
    res.status(500).send({ error: 'Failed to get tokens' });
  });
  res.redirect("/schedule_event");
});

// app.get('/schedule_event', async (req, res) => {
//   try {
//     const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
//     console.log("schedule_event");
  
//     const event = await calendar.events.insert({
//       calendarId: 'primary',
//       resource: {
//         summary: 'Test Event',
//         start: {
//           dateTime: dayjs(new Date()).add(0, 'day').toISOString(),
//           timeZone: 'Asia/Kolkata',
//         },
//         end: {
//           dateTime: dayjs(new Date()).add(0, 'day').add(1, 'hour').toISOString(),
//           timeZone: 'Asia/Kolkata',
//         },
//         conferenceData: {
//           createRequest: {
//             requestId: uuid(),
//           },
//         },
//         attendees: [
//           { email: 'abhit20421@iiitd.ac.in' },
//           { email: 'sarthak20576@iiitd.ac.in' }
//         ]
//       },
//     });

//     console.log("Event scheduled:", event.data.htmlLink);
//     res.status(200).json({ message: 'Event scheduled successfully'});
//   } catch (error) {
//     console.error("Error scheduling event:", error);
//     res.status(500).json({ error: 'Failed to schedule event' });
//   }
// });

// function getAuthenticatedClient(tokens) {
//   const oauth2Client = new google.auth.OAuth2();
//   oauth2Client.setCredentials({ access_token: tokens.accessToken });
//   return oauth2Client;
// }

// app.get('/schedule_event', async (req, res) => {
  
//   const token = req.headers.authorization; // Get the token from the request headers
//   console.log("hello");
//   if (!token) {
//     return res.status(401).json({ message: 'Unauthorized: Missing token' });
//   }
app.post('/schedule_event', async (req, res) => {

  console.log("hello schedule");
  // oauth2Client.setCredentials(
  //   {
  //     refreshtoken: '1//04Ey2n7u3qfZ1CgYIARAAGAQSNwF-L9IrbIahV0fWYcuEFdCourUXZC-5hAeQ2PtrO5mrvHgGchdbqD3wvMtoVmyQ9UHT25_VFfg'
  // });

  // // oauth2Client.setCredentials({ access_token: token.split(' ')[1] }); // Extract and set the access token

  // console.log("schedule_event", oauth2Client);
  // try {
  // //   // console.log("hello 767", token, token.scopes);

  // //   // oauth2Client.setCredentials({ access_token: token }); // Assuming 'tokens' contain the necessary access token
  // //   // oauth2Client.setCredentials({ access_token: user.accessToken }); // Assuming 'tokens' contain the necessary access token

  //   const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  //   const event = await calendar.events.insert({
  //     calendarId: 'primary',
  //     conferenceDataVersion: 1,
  //     resource: {
  //       summary: 'Test Event',
  //       start: {
  //         dateTime: dayjs(new Date()).add(0, 'day').toISOString(),
  //         timeZone: 'Asia/Kolkata',
  //       },
  //       end: {
  //         dateTime: dayjs(new Date()).add(0, 'day').add(1, 'hour').toISOString(),
  //         timeZone: 'Asia/Kolkata',
  //       },
  //       conferenceData: {
  //         createRequest: {
  //           requestId: uuid(),
  //         },
  //       },
  //       attendees: [
  //         { email: 'abhit20421@iiitd.ac.in' },
  //         { email: 'sarthak20576@iiitd.ac.in' }
  //       ]
  //     },
  //   });

  //   console.log("Event scheduled:", event.data.htmlLink);
  //   res.status(200).json({ message: 'Event scheduled successfully', link: event.data.htmlLink });
  // } catch (error) {
  //   console.error("Error scheduling event:", error);
  //   res.status(500).json({ error: 'Failed to schedule event' });
  // }
});

export default app;
