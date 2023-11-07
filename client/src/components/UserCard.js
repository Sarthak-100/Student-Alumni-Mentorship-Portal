// UserCard.js
import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Typography,
} from '@mui/material';

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
    </Card>
  );
};

export default UserCard;
