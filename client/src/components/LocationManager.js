import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LocationManager = () => {
    const [locations, setLocations] = useState([]);
    const [locationFormData, setLocationFormData] = useState({
        name: '',
        is_active: true,
    });

    useEffect(() => {
        fetchLocations();
    }, []);

    const fetchLocations = async () => {
        try {
            const res = await axios.get('/api/locations');
            setLocations(res.data);
        } catch (err) {
            console.error('Error fetching items: ',err);
        }
    };

    const handleLocationChange = (e) => { // handles form change
        const { name, value, type, checked } = e.target;
        setLocationFormData({
            ...locationFormData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = async (e) => { // handles form submit
        e.preventDefault();

        const payload = {
            ...locationFormData,
            updated_at: new Date(),
        };

        try {
            payload.created_at = new Date();
            await axios.post('/api/locations', payload);

            setLocationFormData({ name:'', is_active: true});
            fetchLocations();
        } catch (err) {
            console.error('Error posting location: ',err);
        }
    };

    return (
        <div style = {{ padding: '1rem' }}>
            <h2>Create Location :3</h2>
            <form onSubmit = {handleSubmit}>
                <input
                    name="name"
                    placeholder="Location Name"
                    value={locationFormData.name}
                    onChange={handleLocationChange}
                    required
                />
                <label>
                    Active?
                    <input
                        type="checkbox"
                        name="is_active"
                        checked={locationFormData.is_active}
                        onChange={handleLocationChange}
                    />
                </label>
                <button type="submit">Submit</button>
            </form>

            <h2>Locations</h2>
            <table border ="1" cellPadding = "5" cellSpacing = "0">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Active?</th>
                        <th>Created</th>
                        <th>Updated</th>
                    </tr>
                </thead>
                <tbody>
                    {locations.map((location) => (
                        <tr key={location._id}>
                            <td>{location.name}</td>
                            <td>{location.is_active ? 'Yes' : 'No'}</td>
                            <td>{new Date(location.created_at).toLocaleString()}</td>
                            <td>{new Date(location.updated_at).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default LocationManager;