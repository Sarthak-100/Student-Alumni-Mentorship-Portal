import React, { useState, useRef } from "react";
import axios from "axios";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import {
  IconButton,
  Input,
  Grid,
  Box,
} from "@mui/material";
import StudentUserCard from "./Student_User_Card";
import StudentFilterMenu from "./StudentFilterMenu";

const FilterStudent = () => {
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [searchText, setSearchText] = useState("");
  const inputRef = useRef(null);
  const [apiResponse, setApiResponse] = useState(null);
  const [filters, setFilters] = useState({
    batch: "",
    branch: "",
  });

  // Function to open and close the filter menu
  const openFilterMenu = () => {
    setShowFilterMenu(true);
  };

  const closeFilterMenu = () => {
    setShowFilterMenu(false);
  };

  // Function to fetch the filtered results
  const applyFilters = (filters) => {

    const updatedFilters = {...filters, searchPrefix: searchText};
    setFilters(updatedFilters);

    const baseUrl = "http://localhost:4000/api/v1/filter-student/student_filter";
    const filterParams = new URLSearchParams(updatedFilters).toString();
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

    const updatedFilters = {...filters, searchPrefix: searchText};
    setFilters(updatedFilters);

    const baseUrl = "http://localhost:4000/api/v1/filter-student/student_filter";
    const filterParams = new URLSearchParams(updatedFilters).toString();
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
  };

  return (
    <Grid container direction="column" spacing={3}>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Input
          ref={inputRef}
          placeholder="Search For Students"
          sx={{
            width: "70%",
            fontSize: "16px",
            fontWeight: 500,
            borderRadius: "4px",
            padding: "10px",
            marginRight: "10px",
          }}
          onChange={handleSearchChange}
        />
        <IconButton onClick={openFilterMenu} sx={{ color: "#4285f4" }}>
          <FilterAltIcon />
        </IconButton>
      </Box>
      {apiResponse && apiResponse.result && apiResponse.result.length > 0 && (
        <Grid container spacing={3}>
          {apiResponse.result.map((user, index) => (
            <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
              <StudentUserCard cardUser={user} />
            </Grid>
          ))}
        </Grid>
      )}
      <StudentFilterMenu
        open={showFilterMenu}
        onClose={closeFilterMenu}
        applyFilters={applyFilters}
        anchorEl={inputRef.current}
      />
    </Grid>
  );
};

export default FilterStudent;