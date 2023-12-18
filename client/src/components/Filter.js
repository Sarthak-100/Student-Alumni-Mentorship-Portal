import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Popover,
  Box,
  Typography,
  Divider,
  IconButton,
  TextField,
  MenuItem,
} from "@mui/material";
import UserCard from "./UserCard";

const FilterMenu = ({ open, onClose, applyFilters, anchorEl }) => {
  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedProfile, setSelectedProfile] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [apiResponse, setApiResponse] = useState(null);
  const [applyClicked, setApplyClicked] = useState(false);

  useEffect(() => {
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
  }, []);

  const handleApplyFilters = () => {
    const filters = {
      batch: selectedBatch,
      branch: selectedBranch,
      current_role: selectedProfile,
      current_organization: selectedCompany,
      current_location: selectedCountry,
    };

    applyFilters(filters);
    setApplyClicked(false);
    // onClose(); // Close the popover after applying filters
  };

  const handleClearFilters = () => {
    setSelectedBatch("");
    setSelectedBranch("");
    setSelectedProfile("");
    setSelectedCompany("");
    setSelectedCountry("");
    applyFilters({
      batch: "",
      branch: "",
      current_role: "",
      current_organization: "",
      current_location: "",
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
            apiResponse.roles &&
            apiResponse.roles.map((role) => (
              <MenuItem key={role} value={role}>
                {role}
              </MenuItem>
            ))}
        </TextField>

        <TextField
          select
          label="Company"
          fullWidth
          variant="outlined"
          margin="normal"
          value={selectedCompany}
          onChange={(e) => setSelectedCompany(e.target.value)}
        >
          {apiResponse &&
            apiResponse.companies &&
            apiResponse.companies.map((company) => (
              <MenuItem key={company} value={company}>
                {company}
              </MenuItem>
            ))}
        </TextField>

        <TextField
          select
          label="Country"
          fullWidth
          variant="outlined"
          margin="normal"
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
        >
          {apiResponse &&
            apiResponse.countries &&
            apiResponse.countries.map((country) => (
              <MenuItem key={country} value={country}>
                {country}
              </MenuItem>
            ))}
        </TextField>

        <Box p={2} display="flex" justifyContent="flex-end">
          <IconButton variant="contained" style={{ marginRight: '8px' }} onClick={handleApplyFilters}>
            Apply Filters
          </IconButton>

          <IconButton variant="outlined" size="small" onClick={handleClearFilters}>
            Clear Filters
          </IconButton>
        </Box>

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
