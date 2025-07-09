import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LocationItemManager = () => {
    const [locations, setLocations] = useState([]);
    const [items, setItems] = useState([]);
    const [locationItems, setLocationItems] = useState([]);
    const [locItFormData, setLocItFormData] = useState({
        location_id: '',
        item_id: '',
        count: 1,
    });

    useEffect(() => {
        fetchLocations();
        fetchItems();
        fetchLocationItems();
    }, []);

    const fetchLocations = async () => {
        const res = await axios.get('/api/locations');
        setLocations(res.data);
    };

    const fetchItems = async () => {
        const res = await axios.get('/api/items');
        setItems(res.data);
    };

    const fetchLocationItems = async () => {
        const res = await axios.get('/api/locationitems');
        setLocationItems(res.data);
    };

    const handleLocationItemChange = (e) => {
        const { name, value } = e.target;
        setLocItFormData({
            ...locItFormData,
            [name]: name === 'count' ? parseInt(value) : value,
        });
    };

    const handleLocationItemSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...locItFormData,
                created_at: new Date(),
                updated_at: new Date(),
            };
            await axios.post('/api/locationitems', payload);
            setLocItFormData({ location_id: '', item_id: '', count: 1});
            fetchLocationItems();
        } catch (err) {
            console.error('Error submitting location item, ', err);
        }
    };

    return (
        <div style = {{ padding: '1rem' }}>
            <h2>Create Items at Locations</h2>
            <form onSubmit = {handleLocationItemSubmit}>
                <select
                    name="location_id"
                    value={locItFormData.location_id}
                    onChange={handleLocationItemChange}
                    required
                >
                    <option value="">-- Select Location --</option>
                    {locations.map(loc => (
                        <option key={loc._id} value = {loc._id}>
                            {loc.name}
                        </option>
                    ))}
                </select>
                <select
                    name="item_id"
                    value={locItFormData.item_id}
                    onChange={handleLocationItemChange}
                    required
                >
                    <option value="">-- Select Item --</option>
                    {items.map(item => (
                        <option key={item._id} value = {item._id}>
                            {item.name}
                        </option>
                    ))}
                </select>
                <input
                    type="number"
                    name="count"
                    value={locItFormData.count}
                    onChange={handleLocationItemChange}
                    min={1}
                    required
                />

                <button type = "submit">Submit</button>
            </form>

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

export default LocationItemManager;