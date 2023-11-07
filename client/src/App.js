import React from 'react'
import { Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard'
import ProfilePage from './pages/ProfilePage';
import SignInSide from './components/SignIn';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/profile" element={<ProfilePage />} />
      {/* <Route path="/login" element={<SignInSide />} /> */}
    </Routes>
  )
}

export default App
