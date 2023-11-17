
// const axios = require('axios');

// // Set up Zoom API credentials
// const zoomApiKey = 'YOUR_ZOOM_API_KEY';
// const zoomApiSecret = 'YOUR_ZOOM_API_SECRET';

// // Create a new Zoom meeting
// async function createZoomMeeting(topic, startTime) {
//   const apiUrl = 'https://api.zoom.us/v2/users/me/meetings';

//   // Set up request headers
//   const headers = {
//     'Content-Type': 'application/json',
//     'Authorization': `Bearer ${await getZoomAccessToken()}`
//   };

//   // Set up request body
//   const data = {
//     topic: topic,
//     type: 2,
//     start_time: startTime,
//     duration: 60,
//     timezone: 'America/Los_Angeles',
//     settings: {
//       join_before_host: true,
//       waiting_room: false
//     }
//   };

//   // Send POST request to Zoom API
//   const response = await axios.post(apiUrl, data, { headers });

//   // Return the Zoom meeting ID
//   return response.data.id;
// }

// // Get a new Zoom access token
// async function getZoomAccessToken() {
//   const apiUrl = 'https://api.zoom.us/v2/oauth/token';

//   // Set up request headers
//   const headers = {
//     'Content-Type': 'application/x-www-form-urlencoded'
//   };

//   // Set up request body
//   const data = new URLSearchParams();
//   data.append('grant_type', 'client_credentials');
//   data.append('client_id', zoomApiKey);
//   data.append('client_secret', zoomApiSecret);

//   // Send POST request to Zoom API
//   const response = await axios.post(apiUrl, data, { headers });

//   // Return the access token
//   return response.data.access_token;
// }

import axios from 'axios';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

// Zoom API credentials
const apiKey = process.env.ZOOM_API_KEY;
const apiSecret = process.env.ZOOM_API_SECRET;
const url = process.env.ZOOM_REDIRECT_URL;

// Create a Zoom meeting
const createMeeting = async (req, res) => {
  // try {
  //   const response = await axios.post(
  //     'https://api.zoom.us/v2/users/me/meetings',
  //     {
  //       topic: req.body.topic,
  //       type: 2,
  //     },
  //     {
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Authorization: `Bearer ${generateZoomToken(apiKey, apiSecret)}`,
  //       },
  //     }
  //   );

  //   res.json(response.data);
  // } catch (error) {
  //   console.error(error);
  //   res.status(500).json({ error: 'Internal Server Error' });
  // }
  res.redirect('https://zoom.us/oauth/authorize?response_type=code&client_id=' + apiKey + '&redirect_uri=' + url);
}

// Redirect URL for Zoom OAuth
const redirect = async (req, res) => {
  const code = req.query.code;

  try {
    const response = await axios.post(
      'https://zoom.us/oauth/token?grant_type=authorization_code&code=' +
      code +
      '&redirect_uri=' +
      url,
      {},
      {
        headers: {
          Authorization:
            'Basic ' +
            Buffer.from(apiKey + ':' + apiSecret).toString('base64'),
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

// Helper function to generate Zoom JWT token
function generateZoomToken(apiKey, apiSecret) {
  const payload = {
    iss: apiKey,
    exp: new Date().getTime() + 5000, // 5 seconds
  };

  return jwt.sign(payload, apiSecret);
}

export default createMeeting;