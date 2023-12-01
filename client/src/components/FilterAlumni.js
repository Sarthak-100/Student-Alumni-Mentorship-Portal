import React, { useState, useRef } from "react";
import axios from "axios";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { IconButton, Input, Grid } from "@mui/material";
import UserCard from "./UserCard";
import FilterMenu from "./Filter";

const FilterAlumni = () => {
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [searchText, setSearchText] = useState("");
  const inputRef = useRef(null);
  const [apiResponse, setApiResponse] = useState(null);

  // Function to open and close the filter menu
  const openFilterMenu = () => {
    setShowFilterMenu(true);
  };

  const closeFilterMenu = () => {
    setShowFilterMenu(false);
  };

  // Function to fetch the filtered results
  const applyFilters = (filters) => {
    const baseUrl = "http://localhost:4000/api/v1/student/filter-alumni/search";

    const filterParams = new URLSearchParams(filters).toString();
    const apiUrl = `${baseUrl}?${filterParams}`;
    console.log(apiUrl);
    axios
      .get(apiUrl)
      .then((response) => {
        setApiResponse(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("API Error:", error);
      });

    closeFilterMenu();
  };

  // Function to handle search text change
  const handleSearchChange = (e) => {
    const searchText = e.target.value;
    setSearchText(searchText);

    // Make API call to fetch filtered results based on searchText
    const apiUrl = `http://localhost:4000/api/v1/student/filter-alumni/alumniPrefix?prefix=${searchText}`;
    console.log(apiUrl);
    axios
      .get(apiUrl)
      .then((response) => {
        setApiResponse(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("API Error:", error);
      });
  };

  return (
    <div>
      <Input
        ref={inputRef}
        placeholder="Search For Alumni"
        sx={{
          width: "78%",
          fontSize: "15px",
          fontWeight: "550",
          marginLeft: "5px",
          marginBottom: "-3px",
        }}
        onChange={handleSearchChange}
      />
      <IconButton onClick={openFilterMenu} sx={{ marginLeft: "10px" }}>
        <FilterAltIcon />
      </IconButton>
      {apiResponse && apiResponse.result && apiResponse.result.length > 0 && (
        <Grid container spacing={3}>
          {apiResponse.result.map((user, index) => (
            <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
              <UserCard cardUser={user} />
            </Grid>
          ))}
        </Grid>
      )}
      <FilterMenu
        open={showFilterMenu}
        onClose={closeFilterMenu}
        applyFilters={applyFilters}
        anchorEl={inputRef.current}
      />
    </div>
  );
};

export default FilterAlumni;
