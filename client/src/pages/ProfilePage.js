// ProfilePage.js

import React from 'react';
import { Container, Paper, Typography, Avatar, Button, Link } from '@mui/material';
import { styled } from '@mui/system';

const CenteredContainer = styled(Container)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
  backgroundColor: '#f0f0f0',
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: 150,
  height: 150,
}));

const ProfilePage = () => {
  return (
    <CenteredContainer>
      <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: 'white', boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.2)' }}>
        <ProfileAvatar src="your-profile-image-url.jpg" />
        <Typography variant="h5" component="div">
          John Doe
        </Typography>
        <Typography color="textSecondary">
          Student
        </Typography>
        <Typography variant="h6" component="div">
          Specialization:
        </Typography>
        <Typography>
          Computer Science
        </Typography>
        <Typography variant="h6" component="div">
          Batch:
        </Typography>
        <Typography>
          2022
        </Typography>
        <Button variant="contained" color="primary">
          Connect
        </Button>
      </Paper>
      <Paper sx={{ p: 2, textAlign: 'center', marginTop: 2, backgroundColor: 'white', boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.2)' }}>
        <Typography variant="h5" component="div">
          About Me
        </Typography>
        <Typography>
          I'm a passionate student looking to connect with alumni for mentorship opportunities.
        </Typography>
        <Typography variant="h5" component="div">
          Skills
        </Typography>
        <Typography>
          - Web Development
          - JavaScript
          - React
          - HTML/CSS
          - ...
        </Typography>
        <Typography variant="h5" component="div">
          Contact Information
        </Typography>
        <Typography>
          Email: john.doe@example.com
        </Typography>
        <Typography>
          LinkedIn: <Link href="https://www.linkedin.com/in/johndoe">https://www.linkedin.com/in/johndoe</Link>
        </Typography>
      </Paper>
    </CenteredContainer>
  );
};

export default ProfilePage;
