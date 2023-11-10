// UserCard.js
import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Typography,
  CardActions,
  IconButton,
} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const UserCard = ({ user }) => {
  return (
    <Card>
      <CardHeader
        avatar={<Avatar>{user.user_name.charAt(0)}</Avatar>}
        title={user.user_name}
        subheader={user.email}
      />
      <CardContent>
        <Typography variant="body1">Current Work: {user.current_work}</Typography>
        <Typography variant="body1">Branch: {user.branch}</Typography>
        <Typography variant="body1">Batch: {user.batch}</Typography>
      </CardContent>
      <CardActions style={{ justifyContent: 'center' }}>
        <IconButton color="primary" aria-label="Chat">
          <ChatIcon />
        </IconButton>
        <IconButton color="primary" aria-label="Profile">
          <AccountCircleIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default UserCard;
