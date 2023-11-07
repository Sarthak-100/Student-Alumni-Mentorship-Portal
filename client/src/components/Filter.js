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
import UserCard from './UserCard'; // Import the UserCard component

const FilterMenu = ({ open, onClose }) => {
  const [selectedBatch, setSelectedBatch] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  // const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedProfile, setSelectedProfile] = useState('');
  const [apiResponse, setApiResponse] = useState(null);

  const applyFilters = () => {
    const baseUrl = 'http://localhost:4000/api/v1/student/filter-alumni/search';

    const filters = {
      batch: selectedBatch,
      branch: selectedBranch,
      current_work: selectedProfile,
    };

    Object.keys(filters).forEach((key) => {
      if (filters[key] === '') {
        delete filters[key];
      }
    });
    
    const filterParams = new URLSearchParams(filters).toString();
    const apiUrl = `${baseUrl}?${filterParams}`;
    console.log(apiUrl);
    axios
      .get(apiUrl, { params: filters })
      .then((response) => {
        setApiResponse(response.data);
      })
      .catch((error) => {
        console.error('API Error:', error);
      });

    onClose();
  };

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
          value={selectedBatch}
          onChange={(e) => setSelectedBatch(e.target.value)}
        >
          <MenuItem value="2020">2020</MenuItem>
          <MenuItem value="2021">2021</MenuItem>
          {/* Add more batch options */}
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
          <MenuItem value="csss">CSSS</MenuItem>
          {/* Add more branch options */}
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
          {/* Add more profile options */}
        </TextField>

        <Button variant="contained" fullWidth onClick={applyFilters}>
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
