import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import InventoryView from './components/InventoryView';
import LoginPortal from './components/LoginPortal';
import NavMenu from './components/NavMenu';
import Home from './components/Home';
import axios from 'axios';

axios.defaults.withCredentials = true;

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [locations, setLocations] =  useState([]);

  useEffect(() => {
    axios.get('/api/locations').then(res=>setLocations(res.data));
  }, []);

  return (
    <Router>
      <NavMenu isLoggedIn = {isLoggedIn} locations={locations} />
      <div>
        <nav style={{ padding: '1rem' }}>
          <Link to="/loginportal/" style={{ marginRight: '1rem' }}>Login Portal</Link>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/inventory" element={<InventoryView />} />
          <Route path="/loginportal" element = {<LoginPortal setIsLoggedIn={setIsLoggedIn} isLoggedIn={isLoggedIn}/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;