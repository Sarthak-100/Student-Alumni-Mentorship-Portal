// FilterMenu.js
import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    // Fetch data from the API endpoint
    const fetchData = async () => {
      try {
        const response = await axios.get(
          'http://localhost:4000/api/v1/student/filter-alumni/values'
        );
        setApiResponse(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []); // Empty dependency array to ensure the effect runs only once

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
          {apiResponse &&
            apiResponse.batches.map((batch) => (
              <MenuItem key={batch} value={batch}>
                {batch}
              </MenuItem>
            ))}
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
          {apiResponse &&
            apiResponse.branches.map((branch) => (
              <MenuItem key={branch} value={branch}>
                {branch}
              </MenuItem>
            ))}
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
          {apiResponse &&
            apiResponse.currentWorks.map((profile) => (
              <MenuItem key={profile} value={profile}>
                {profile}
              </MenuItem>
            ))}
        </TextField>

        <Button variant="contained" fullWidth onClick={handleApplyFilters}>
          Apply Filters
        </Button>

        {apiResponse && apiResponse.result && apiResponse.result.length > 0 && (
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
