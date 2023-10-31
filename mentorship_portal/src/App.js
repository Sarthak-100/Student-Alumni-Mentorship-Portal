import LoginButton from './components/LoginButton';
import Dashboard from './components/Dashboard';
import { useAuth0 } from '@auth0/auth0-react';

function App() {
  const { isAuthenticated } = useAuth0();
  return (
    <main className="column">
      <LoginButton />
      {isAuthenticated && <Dashboard />}
    </main>
  );
}

export default App;

// import React from 'react'
// import Dashboard from './components/Dashboard'

// const App = () => {
//   return (
//     <div>
//       <Dashboard />
//     </div>
//   )
// }

// export default App
