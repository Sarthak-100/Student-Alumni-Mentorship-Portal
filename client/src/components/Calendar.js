import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
// import jwt from 'jsonwebtoken';
// import { Buffer } from 'buffer';

const Calendar = () => {
  const [eventScheduled, setEventScheduled] = useState(false);
  const [eventLink, setEventLink] = useState('');
  const [accessToken, setAccessToken] = useState('');

  const { user, getAccessTokenSilently } = useAuth0();
  console.log('user 78655: ', user);
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const token = await getAccessTokenSilently();
        setAccessToken(token);
      } catch (error) {
        console.error('Error fetching token:', error);
      }
    };

    fetchToken();
  }, [getAccessTokenSilently]);

  const scheduleEvent = async () => {

    if (!accessToken) {
      console.error('Access token not available');
      return;
    }

    try {
        // console.log("ok 8676", accessToken, user);
        // const decodedToken = jwt.decode(accessToken);
        // console.log("decodedToken", decodedToken);
        // console.log(decodedToken);
        // const decodedToken = jwt.decode(accessToken);
        // if (decodedToken && decodedToken.scope) {
        //   const scopes = decodedToken.scope.split(' ');
        //   if (scopes.includes('https://www.googleapis.com/auth/calendar')) {
        //     console.log('User has calendar permissions');
        //   } else {
        //     console.log('User does not have calendar permissions');
        //   }
        // } else {
        //   console.log('Unable to verify user permissions');
        // }

        // await axios
        // .post(
        //   'http://localhost:4000/google',
        //   { token: accessToken, user: user },
        //   {
        //       headers: {
        //         'Authorization': `Bearer ${accessToken}`,
        //         'Content-Type': 'application/json',
        //       },
        //     withCredentials: true,
        //   }
        // )
        await axios
        .get(
          'http://localhost:4000/google',
          {
                  headers: {
            //         'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                  },
                withCredentials: true,
            }
        )
        .then((response) => {
          // console.log("&&&&&&In User CHat", friendId, response);
          // setUser(response.data.user);
          // setChattedUsersValue(friendId, response.data.user);
          console.log('Backend response:', response.data);
            if (response.status === 200) {
              // console.log('tokens', token);
              setEventScheduled(true);
              setEventLink(response.data.link); // Assuming the API response contains a 'link' field
          } else {
              // Handle error cases
              console.error('Failed to schedule event');
          }
        })
        .catch((error) => {
          console.error("API Error:", error);
        });

    } catch (error) {
        console.error('Error sending token to backend:', error);
    }
  };

  return (
    <div>
      <h1>Calendar</h1>
      {eventScheduled ? (
        <div>
          <p>Event scheduled successfully!</p>
          <p>
            Event Link: <a href={eventLink}>{eventLink}</a>
          </p>
        </div>
      ) : (
        <button onClick={scheduleEvent}>Schedule Event</button>
      )}
    </div>
  );
};

export default Calendar;