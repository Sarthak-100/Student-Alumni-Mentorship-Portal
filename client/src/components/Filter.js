// FilterMenu.js
import React, { useState } from 'react';
import axios from 'axios';
import {
  Popover,
  Box,
  Typography,
  Divider,
  Button,
  TextField,
  MenuItem,
} from '@mui/material';
import UserCard from './UserCard';

const FilterMenu = ({ open, onClose, applyFilters, anchorEl }) => {
  const [selectedBatch, setSelectedBatch] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedProfile, setSelectedProfile] = useState('');
  const [apiResponse, setApiResponse] = useState(null);

  const handleApplyFilters = () => {
    const filters = {
      batch: selectedBatch,
      branch: selectedBranch,
      current_work: selectedProfile,
    };

    applyFilters(filters);
  };

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      onClose={onClose}
      PaperProps={{
        style: {
          width: '300px', // Set your desired fixed width here
        },
      }}
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
          value={selectedBatch}
          onChange={(e) => setSelectedBatch(e.target.value)}
        >
          <MenuItem value="2020">2020</MenuItem>
          <MenuItem value="2021">2021</MenuItem>
        </TextField>

        <TextField
          select
          label="Branch"
          fullWidth
          variant="outlined"
          margin="normal"
          value={selectedBranch}
          onChange={(e) => setSelectedBranch(e.target.value)}
        >
          <MenuItem value="csai">CSAI</MenuItem>
          <MenuItem value="cse">CSE</MenuItem>
        </TextField>

        <TextField
          select
          label="Job Profile"
          fullWidth
          variant="outlined"
          margin="normal"
          value={selectedProfile}
          onChange={(e) => setSelectedProfile(e.target.value)}
        >
          <MenuItem value="sde1">SDE 1</MenuItem>
          <MenuItem value="sde2">SDE 2</MenuItem>
        </TextField>

        <Button variant="contained" fullWidth onClick={handleApplyFilters}>
          Apply Filters
        </Button>

        {apiResponse && apiResponse.result.length > 0 && (
          <div>
            <Typography variant="h6" gutterBottom>
              API Response:
            </Typography>
            {apiResponse.result.map((user, index) => (
              <UserCard key={index} user={user} />
            ))}
          </div>
        )}
      </Box>
    </Popover>
  );
};

export default FilterMenu;
