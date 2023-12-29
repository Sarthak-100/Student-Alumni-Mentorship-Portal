import React from "react";
import SearchIcon from "@mui/icons-material/Search";
import { IconButton } from "@mui/material";

const Search = () => {
  return (
    <div className="search">
      <div className="searchForm">
        <IconButton>
          <SearchIcon className="searchIcon" />
        </IconButton>
        <input type="text" className="searchInput" placeholder="Find a User" />
      </div>
    </div>
  );
};
export default Search;