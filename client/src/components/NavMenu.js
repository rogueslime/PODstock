import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
//import axios from 'axios';
import './styles/NavMenu.css';

const NavMenu = ({isLoggedIn, locations}) => {
    const [open, setOpen] = useState(false);
    const [inventoryOpen, setInventoryOpen] = useState(false);
    //const [locations, setLocations] = useState([]);
    const navigate = useNavigate();

    // Removing this useEffect and its associated state as this is now passed down from the main App to facilitate opening locations with a filter applied.
    //useEffect(() => {
    //    axios.get('/api/locations')
    //        .then(res => setLocations(res.data))
    //        .catch(err => console.error("Failed loading locations to navmenu: ",err));
    //}, []);

    const toggleMenu = () => setOpen(prev => !prev);
    const toggleInventory = () => setInventoryOpen(prev => !prev);

    const handleLocationClick = (locationId) => {
        if (locationId) {
            navigate('/inventory', { state: {selectedLocationId: locationId} });
        } else {
            navigate('/inventory', { state: {} });
        }
        setOpen(false);
    };

    return (
        <div className="nav-wrapper">
                <button className={`pancake ${open ? 'open':''}`} onClick = {toggleMenu}>☰</button>

                {open && (
                    <div className={`menu-overlay ${open ? 'open':''}`}>
                        <Link to ="/" onClick={() => setOpen(false)}>Home</Link>
                        <span onClick={toggleInventory}>Inventory</span>
                        
                        {inventoryOpen && (
                            <div className="submenu">
                                <span className="menu-link" onClick={() => handleLocationClick(null)}>All Inventory</span>
                                {locations.map(loc => (
                                    <span
                                        key={loc._id}
                                        className="menu-link"
                                        onClick={() => handleLocationClick(loc._id)}
                                    >
                                        {loc.name} Inventory
                                    </span>
                                ))}
                            </div>
                        )}

                        {!isLoggedIn && (
                            <Link to="/loginportal" onClick={() => setOpen(false)}>Login</Link>
                        )}
                        {isLoggedIn && (
                            <Link to="/loginportal" onClick={() => setOpen(false)}>Management Portal</Link>
                        )}
                    </div>
                )}
            </div>
    )
}

export default NavMenu;