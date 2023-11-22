import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

const Calendar = () => {
  const [eventScheduled, setEventScheduled] = useState(false);
  const [eventLink, setEventLink] = useState('');
  const [accessToken, setAccessToken] = useState('');

  const { getAccessTokenSilently } = useAuth0();

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
        const apiUrl = 'http://localhost:4000/schedule_event';
    
        const response = await axios.get(apiUrl, {
            headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            },
        });

        console.log('Backend response:', response.data);
        if (response.status === 200) {
            // console.log('tokens', token);
            setEventScheduled(true);
            setEventLink(response.data.link); // Assuming the API response contains a 'link' field
        } else {
            // Handle error cases
            console.error('Failed to schedule event');
        }
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