import Chat from './pages/Chat';
import Login from './pages/Login';
import ChatWelcome from './components/ChatWelcome';
import Chatting from './components/Chatting';
import { Route, Routes } from 'react-router-dom';
import './style.css';

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='app' element={<Chat />}>
          <Route path='welcome' element={<ChatWelcome />}></Route>
          <Route path='chat' element={<Chatting />}></Route>
        </Route>
      </Routes>
    </>
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
