import React, { useState } from "react";
import axios from "axios";
import {
  Popover,
  Box,
  Typography,
  Divider,
  Button,
  TextField,
  MenuItem,
} from "@mui/material";
import UserCard from "./UserCard";

const FilterMenu = ({ open, onClose, applyFilters, anchorEl }) => {
  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedProfile, setSelectedProfile] = useState("");
  const [apiResponse, setApiResponse] = useState(null);

  const handleApplyFilters = () => {
    const filters = {
      batch: selectedBatch,
      branch: selectedBranch,
      current_role: selectedProfile,
    };

    applyFilters(filters);
  };

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      onClose={onClose}
      PaperProps={{
        style: {
          width: "300px",
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
          <MenuItem value="2012">2012</MenuItem>
          <MenuItem value="2013">2013</MenuItem>
          <MenuItem value="2014">2014</MenuItem>
          <MenuItem value="2015">2015</MenuItem>
          <MenuItem value="2016">2016</MenuItem>
          <MenuItem value="2017">2017</MenuItem>
          <MenuItem value="2018">2018</MenuItem>
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
          <MenuItem value="ECE">ECE</MenuItem>
          <MenuItem value="CSE">CSE</MenuItem>
          <MenuItem value="CSAM">CSAM</MenuItem>
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
          <MenuItem value="Applied Research Engineer">
            Applied Research Engineer
          </MenuItem>
          <MenuItem value="Software Engineer">Software Engineer</MenuItem>
          <MenuItem value="Program Manager">Program Manager</MenuItem>
          <MenuItem value="PhD Mathematics">PhD Mathematics</MenuItem>
          <MenuItem value="PhD Computer Science">PhD Computer Science</MenuItem>
          <MenuItem value="Associate Consultant">Associate Consultant</MenuItem>
          <MenuItem value="Senior Product Manager">
            Senior Product Manager
          </MenuItem>
          <MenuItem value="Senior Software Engineer">
            Senior Software Engineer
          </MenuItem>
          {/* Add other job profiles based on your API response */}
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
