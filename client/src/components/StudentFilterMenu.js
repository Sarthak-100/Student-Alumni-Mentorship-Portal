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
} from "@mui/material";
import StudentUserCard from './Student_User_Card';  

const StudentFilterMenu = ({ open, onClose, applyFilters, anchorEl }) => {
  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [apiResponse, setApiResponse] = useState(null);
  const [applyClicked, setApplyClicked] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          'http://localhost:4000/api/v1/filter-student/student_values'
        );
        setApiResponse(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleApplyFilters = () => {
    const filters = {
      batch: selectedBatch,
      branch: selectedBranch,
    };

    applyFilters(filters);
    setApplyClicked(false);
  };

  const handleClearFilters = () => {
    setSelectedBatch("");
    setSelectedBranch("");
    applyFilters({
      batch: "",
      branch: "",
    });
    setApplyClicked(true);
  };

  return (
    <Popover
      open={open || applyClicked} // Open when parent open or apply is clicked
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      onClose={onClose} // Close the popover if clicking outside the popover
      PaperProps={{
        style: {
          width: "300px",
        },
      }}
    >
      <Box p={2}>
        <Typography variant="h6" gutterBottom>
          Filter Student
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
            apiResponse.batches &&
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
            apiResponse.branches &&
            apiResponse.branches.map((branch) => (
              <MenuItem key={branch} value={branch}>
                {branch}
              </MenuItem>
            ))}
        </TextField>


        <Box p={2} display="flex" justifyContent="flex-end">
          <Button variant="contained" style={{ marginRight: '8px' }} onClick={handleApplyFilters}>
            Apply Filters
          </Button>

          <Button variant="outlined" size="small" onClick={handleClearFilters}>
            Clear Filters
          </Button>
        </Box>

        {apiResponse && apiResponse.result && apiResponse.result.length > 0 && (
          <div>
            <Typography variant="h6" gutterBottom>
              API Response:
            </Typography>
            {apiResponse.result.map((user, index) => (
              <StudentUserCard key={index} user={user} />
            ))}
          </div>
        )}
      </Box>
    </Popover>
  );
};

export default StudentFilterMenu;