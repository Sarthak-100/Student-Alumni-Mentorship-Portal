// import LoginButton from './components/LoginButton';
// import Dashboard from './components/Dashboard';
// import { useAuth0 } from '@auth0/auth0-react';

// function App() {
//   const { isAuthenticated } = useAuth0();
//   return (
//     <main className="column">
//       <LoginButton />
//       {isAuthenticated && <Dashboard />}
//     </main>
//   );
// }

// export default App;

import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import ProfilePage from './pages/ProfilePage';

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

// import React from 'react'
// import ProfilePage from './pages/ProfilePage'
// function App() {
//   return (
//     <div>
//       <ProfilePage />
//     </div>
//   )
// }

// export default App
