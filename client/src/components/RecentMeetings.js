import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { styled } from '@mui/system';

const MeetingCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  backgroundColor: '#fff',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  borderRadius: theme.spacing(1),
  padding: theme.spacing(2),
}));

const MeetingTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.1rem',
  marginBottom: theme.spacing(1),
}));

const MeetingDetails = styled(Typography)(({ theme }) => ({
  color: '#666',
}));

const RecentMeetings = () => {
  const meetings = [
    {
      id: 1,
      title: 'Math Study Group',
      date: '2023-11-25',
      time: '10:00 AM',
      location: 'Zoom'
    },
  ];

  return (
    <div>
      {meetings.map(meeting => (
        <MeetingCard key={meeting.id}>
          <CardContent>
            <MeetingTitle variant="h6">
              {meeting.title}
            </MeetingTitle>
            <MeetingDetails variant="body2">
              Date: {meeting.date}, Time: {meeting.time}, Location: {meeting.location}
            </MeetingDetails>
          </CardContent>
        </MeetingCard>
      ))}
    </div>
  );
};

export default RecentMeetings;