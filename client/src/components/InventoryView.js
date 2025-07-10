import React, { useState, useEffect } from 'react';
import axios from 'axios';

const InventoryView = () => {
    const [locationItems, setLocationItems] = useState([]);

    useEffect(() => {
        fetchLocationItems();
    }, []);

    const fetchLocationItems = async () => {
        const res = await axios.get('/api/locationitems');
        setLocationItems(res.data);
    };

    return (
        <div style = {{ padding: '1rem' }}>
            <h2>Location Inventory List</h2>
            <table border = "1" cellpadding = "5" cellspacing ="0">
                <thead>
                    <tr>
                        <th>Location</th>
                        <th>Item</th>
                        <th>Quantity</th>
                    </tr>
                </thead>
                <tbody>
                    {locationItems.map(li => (
                        <tr key = {li.id}>
                            <td>{li.location_id?.name || 'Unknown'}</td>
                            <td>{li.item_id?.name || 'Unknown'}</td>
                            <td>{li.count}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default InventoryView;