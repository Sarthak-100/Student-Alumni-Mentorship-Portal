import React from 'react';
import Carousel from './Carousel';
// import { useAuth0 } from "@auth0/auth0-react";
import { useUserContext } from '../context/UserContext';
import { Typography, Box, Grid } from '@mui/material';
import { styled } from "@mui/system";
import ChartComponent from './Chart';
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
  const { user } = useUserContext();
  console.log(user)
  const isStudentOrAlumni = user && (user.user_type === 'student' || user.user_type === 'alumni');

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} md={7}>
        <Carousel />
      </Grid>
      <Grid item xs={12} md={5}>
        <StyledTitle variant="h6" component="div">
        {isStudentOrAlumni ? 'Recent Conversations' : 'Charts'}
        </StyledTitle>
        <MeetingsAndChatsContainer mt={4}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              {/* Render the RecentChats component */}
              {isStudentOrAlumni ? (
                <RecentChats />
              ) : (
                <ChartComponent />
              )}
            </Grid>
          </Grid>
        </MeetingsAndChatsContainer>
      </Grid>
    </Grid>
  );
};

export default Hello;