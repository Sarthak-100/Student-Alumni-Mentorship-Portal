import React from 'react'
import Navbar from './Navbar'
import Search from './Search'
import PreviousChats from './PreviousChats'

const Sidebar = () => {
  return (
    <div className='Sidebar'>
      <Navbar />
      <Search />
      <PreviousChats />
    </div>
  )
}

export default Sidebar
