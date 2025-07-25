import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import defaultImage from '../photos/default-icon.jpg';

const InventoryView = () => {
    const [locationItems, setLocationItems] = useState([]);
    const [locations, setLocations] = useState([]);
    const [selectedLocationId, setSelectedLocationId] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('grid');
    const location = useLocation();

    useEffect(() => {
        if(location.state?.selectedLocationId) {
            setSelectedLocationId(location.state.selectedLocationId);
        } else {
            setSelectedLocationId('');
        }
    }, [location.state]);

    useEffect(() => {
        fetchLocationItems();
        fetchLocations();
    }, []);

    const fetchLocationItems = async () => {
        const res = await axios.get('/api/locationitems');
        setLocationItems(res.data);
    };

    const fetchLocations = async () => {
        const res = await axios.get('/api/locations');
        setLocations(res.data);
    };

    const filteredItems = locationItems.filter(li => {
        const matchesLocation = !selectedLocationId || li.location_id?._id == selectedLocationId;
        const matchesSearch = li.item_id?.name?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesLocation && matchesSearch;
    });

    return (
        <div style = {{ padding: '1rem' }}>
            <h2>Location Inventory List</h2>
            <label htmlFor = "location-filter">Filter by Location:</label>
            <select
                id = "location-filter"
                value = {selectedLocationId}
                onChange={(e) => setSelectedLocationId(e.target.value)}
                style = {{marginLeft: '0.5rem', marginBottom: '1rem'}}
            >
                <option value ="">All Locations</option>
                {locations.map(loc => (
                    <option key={loc._id} value={loc._id}>
                        {loc.name}
                    </option>
                ))}
            </select>
            <label htmlFor="item-serach">Search Items</label>
            <input
                id="item-search"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by item name"
                style={{marginLeft:'0.5rem',marginBottom:'1rem'}}
            />

            <div style = {{ margin: '1rem 0' }}>
                <button onClick={() => setViewMode('table')}>Table</button>
                <button onClick={() => setViewMode('grid')}>Grid</button>
            </div>

            {viewMode === 'table' ? (
                <table border = "1" cellPadding = "5" cellSpacing ="0">
                    <thead>
                        <tr>
                            <th>Location</th>
                            <th>Item</th>
                            <th>Quantity</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredItems.map(li => (
                            <tr key = {li._id}>
                                <td>{li.location_id?.name || 'Unknown'}</td>
                                <td>{li.item_id?.name || 'Unknown'}</td>
                                <td>{li.count}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div
                    style = {{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                        gap: '1rem'
                    }}
                >
                    {filteredItems.map(li => (
                        <div
                            key ={li._id}
                            style = {{
                                border: '1px solid #ccc',
                                borderRadius: '8px',
                                padding: '1rem',
                                textAlign: 'center'
                            }}
                        >
                            <img
                                src={defaultImage}
                                alt="default"
                                style={{ width: '100%', height: '150px', objectFit:'cover', marginBottom:'0.5rem'}}
                            />
                            <h3>{li.item_id?.name || 'Unknown'}</h3>
                            <p>Quantity: {li.count}</p>
                            <p>{li.location_id?.name || 'Unknown'}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default InventoryView;