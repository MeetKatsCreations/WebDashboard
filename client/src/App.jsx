import { Routes, Route } from 'react-router-dom';
import Register from './Pages/Register';
import Login from './Pages/Login';
import Navbar from './Components/Navbar';
import Home from './Pages/Home';
import GoogleAuthHandler from './Components/GoogleAuthHandler';
import Event from './Pages/Event';
import Layout from './Components/Layout';

function App() {
  return (
    <Routes>
       <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />  {/* This renders Home inside Layout */}
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Register />} />
      <Route path="/google-auth" element={<GoogleAuthHandler />} />
      {/* <Route path="/" element={<Home />}/> */}
      <Route path="/add-events" element={<Event/>}/>
    </Routes>
  );
}

export default App;
