import React, { useState, useRef } from "react";
import axios from "axios";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import {
  IconButton,
  Input,
} from "@mui/material";
import UserCard from "./UserCard";
import FilterMenu from "./Filter";
import { useUserContext } from "../context/UserContext";

const FilterAlumni = () => {
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [searchText, setSearchText] = useState("");
  const inputRef = useRef(null);
  const [apiResponse, setApiResponse] = useState(null);
  const { user } = useUserContext();
  const [filters, setFilters] = useState({
    batch: "",
    branch: "",
    current_role: "",
    current_organization: "",
    current_location: "",
  });
  
  const [selectedUserCalenderDisplay, setSelectedUserCalenderDisplay] = useState(null);

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

    const baseUrl = "http://localhost:4000/api/v1/student/filter-alumni/search";
    const filterParams = new URLSearchParams(updatedFilters).toString();
    const apiUrl = `${baseUrl}?${filterParams}`;
    console.log(apiUrl);
    
    axios
      .get(apiUrl)
      .then((response) => {
        const filteredData = response.data.result.filter(
          (currentUser) => currentUser._id !== user._id // Replace 'userId' with the property containing the user ID in your data
        );
        setApiResponse({ ...response.data, result: filteredData });
        console.log(response.data);
      })
      .catch((error) => {
        console.error("API Error:", error);
      });

    closeFilterMenu();
  };

  // Function to handle search text change
  const handleSearchChange = (e) => {
    if (selectedUserCalenderDisplay) {
      setSelectedUserCalenderDisplay(null);
    }
    const searchText = e.target.value;
    setSearchText(searchText);

    const updatedFilters = {...filters, searchPrefix: searchText};
    setFilters(updatedFilters);

    const baseUrl = "http://localhost:4000/api/v1/student/filter-alumni/search";
    const filterParams = new URLSearchParams(updatedFilters).toString();
    const apiUrl = `${baseUrl}?${filterParams}`;
    console.log(apiUrl);

    axios
      .get(apiUrl)
      .then((response) => {
        const filteredData = response.data.result.filter(
          (currentUser) => currentUser._id !== user._id // Replace 'userId' with the property containing the user ID in your data
        );

        setApiResponse({ ...response.data, result: filteredData });
        console.log(filteredData);
      })
      .catch((error) => {
        console.error("API Error:", error);
      });
  };

  return (
    <div>
      <div>
        <Input
          ref={inputRef}
          placeholder="Search For Alumni"
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
      </div>

      {apiResponse && apiResponse.result && apiResponse.result.length > 0 && (
        <div
          style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}
        >
          {apiResponse.result.map((user, index) => (
            <div
              style={{
                padding: "0",
                width:
                  selectedUserCalenderDisplay === user._id ? "620px" : "300px",
                marginLeft: "20px",
              }}
            >
              <UserCard
                cardUser={user}
                setSelectedUserCalenderDisplay={setSelectedUserCalenderDisplay}
              />
            </div>
          ))}
        </div>
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