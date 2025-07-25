import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LocationManager = () => {
    const [locations, setLocations] = useState([]);
    const [locationFormData, setLocationFormData] = useState({
        _id: null,
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

        const newLoc = locationFormData.name.trim().toLowerCase();
        const duplicate = locations.find(loc => loc.name.trim().toLowerCase() === newLoc);
        if (duplicate) {
            alert(`Location "${locationFormData.name}" already exists.`);
            return;
        }

        const payload = {
            ...locationFormData,
            updated_at: new Date(),
        };

        try {

            if (locationFormData._id) {
                await axios.put(`/api/locations/${locationFormData._id}`, payload);
            } else {
                payload.created_at = new Date();
                await axios.post('/api/locations', payload);
            }

            setLocationFormData({_id:null, name:'', is_active: true});
            fetchLocations();
        } catch (err) {
            console.error('Error saving location: ',err);
        }
    };

    const handleEditClick = (location) => {
        setLocationFormData ({
            ...location,
        });
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this location?')) return;

        try {
            await axios.delete(`/api/locations/${id}`);
            fetchLocations();
        } catch (err) {
            console.error('Error deleting location: ', err);
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
                {locationFormData._id && (
                    <button type="button" onClick={() => setLocationFormData({ _id: null, name: '', is_active: true })}>Cancel Edit</button>
                )}
            </form>

            <h2>Locations</h2>
            <table border ="1" cellPadding = "5" cellSpacing = "0">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Active?</th>
                        <th>Created</th>
                        <th>Updated</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {locations.map((location) => (
                        <tr key={location._id}>
                            <td>{location.name}</td>
                            <td>{location.is_active ? 'Yes' : 'No'}</td>
                            <td>{new Date(location.created_at).toLocaleString()}</td>
                            <td>{new Date(location.updated_at).toLocaleString()}</td>
                            <td>
                                <button onClick={() => handleEditClick(location)}>Edit</button>
                                <button onClick={() => handleDelete(location._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default LocationManager;