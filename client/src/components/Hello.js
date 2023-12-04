import React from 'react';
import Carousel from './Carousel';
import { useAuth0 } from "@auth0/auth0-react";
import { Typography, Box, Grid } from '@mui/material';
import { styled } from "@mui/system";
import RecentMeetings from './RecentMeetings';
import RecentChats from './RecentChats'; // Imported the RecentChats component

const MeetingsAndChatsContainer = styled(Box)(({ theme }) => ({
  backgroundColor: '#f0f0f0',
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1),
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
}));

const StyledTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  fontSize: '1.2rem',
  marginBottom: theme.spacing(2),
}));

const Hello = () => {
  const { user } = useAuth0();

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} md={7}>
        <Carousel />
      </Grid>
      <Grid item xs={12} md={5}>
        <StyledTitle variant="h6" component="div">Recent Conversations</StyledTitle>
        <MeetingsAndChatsContainer mt={4}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              {/* Render the RecentChats component */}
              <RecentChats />
            </Grid>
          </Grid>
        </MeetingsAndChatsContainer>
      </Grid>
    </Grid>
  );
};

export default Hello;
