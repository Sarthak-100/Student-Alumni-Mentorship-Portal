import React from 'react';
import { Popover, Box, Typography, Divider, Button, TextField, MenuItem } from '@mui/material';

const FilterMenu = ({ open, onClose }) => {
  return (
    <Popover
      open={open}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      onClose={onClose}
    >
      <Box p={2}>
        <Typography variant="h6" gutterBottom>
          Filter Alumni
        </Typography>
        <Divider />

        <TextField
          select
          label="Batch"
          fullWidth
          variant="outlined"
          margin="normal"
        >
          <MenuItem value="batch1">Batch 1</MenuItem>
          <MenuItem value="batch2">Batch 2</MenuItem>
          {/* Add more batch options */}
        </TextField>

        <TextField
          select
          label="Branch"
          fullWidth
          variant="outlined"
          margin="normal"
        >
          <MenuItem value="branch1">Branch 1</MenuItem>
          <MenuItem value="branch2">Branch 2</MenuItem>
          {/* Add more branch options */}
        </TextField>

        <TextField
          select
          label="Company"
          fullWidth
          variant="outlined"
          margin="normal"
        >
          <MenuItem value="company1">Company 1</MenuItem>
          <MenuItem value="company2">Company 2</MenuItem>
          {/* Add more company options */}
        </TextField>

        <TextField
          select
          label="Job Profile"
          fullWidth
          variant="outlined"
          margin="normal"
        >
          <MenuItem value="profile1">Profile 1</MenuItem>
          <MenuItem value="profile2">Profile 2</MenuItem>
          {/* Add more profile options */}
        </TextField>

        {/* Add a calendar filter for availability dates here */}
        {/* You can use a date picker or calendar component for this part */}

        <Button variant="contained" fullWidth>
          Apply Filters
        </Button>
      </Box>
    </Popover>
  );
};

export default FilterMenu;
