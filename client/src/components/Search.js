import React from 'react'
import SearchIcon from '@mui/icons-material/Search';
import { IconButton } from '@mui/material';

const Search = () => {
  return (
    <div className='search'>
      <div className="searchForm">
        <IconButton>
          <SearchIcon className='searchIcon'/>
        </IconButton>
        <input type="text" className="searchInput" placeholder="Find a User"/>
      </div>
      <div className="searchedUsers">
        <img className='img' src="https://images.pexels.com/photos/1181288/pexels-photo-1181288.jpeg?auto=compress&cs=tinysrgb&w=600" alt="user" />
        <span className='span'>Aanya</span>
      </div>
    </div>
  )
}
export default Search

