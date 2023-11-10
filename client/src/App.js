import React from 'react'
import { Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard'
import ProfilePage from './pages/ProfilePage';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/profile" element={<ProfilePage />} />
    </Routes>
  )
}

export default App

// import React from 'react';
// import { Route, Routes } from 'react-router-dom';
// import Layout from './components/Layout';

// const App = () => {
//   return (
//     <Routes>
//       <Route
//         path="/"
//         element={
//           <Layout>
//             <Dashboard />
//           </Layout>
//         }
//       />
//       <Route
//         path="/profile"
//         element={
//           <Layout>
//             <ProfilePage />
//           </Layout>
//         }
//       />
//     </Routes>
//   );
// };

// export default App;