import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ItemManager = () => {
    const [items, setItems] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        is_active: true,
    });

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const res = await axios.get('api/items');
            setItems(res.data);
        } catch (err) {
            console.error('Error fetching items: ', err);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const itemToSend = {
            ...formData,
            created_at: new Date(),
            updated_at: new Date(),
        };

        try {
            await axios.post('api/items', itemToSend);
            setFormData({ name: '', is_active: true });
            fetchItems();
        } catch (err) {
            console.error('Error posting item: ', err);
        }
    };

    return (
        <div style = {{ padding: '1rem' }}>
            <h2> Create Item </h2>
            <form onSubmit = {handleSubmit}>
                <input
                    name="name"
                    placeholder="Item Name"
                    value={formData.name}
                    onChange={handleChange}
                    required    
                />
                <label>
                    Active?
                    <input
                        type="checkbox"
                        name="is_active"
                        checked={formData.is_active}
                        onChange={handleChange}
                    />
                </label>
                <button type="submit">Submit Item</button>
            </form>

            <h2>Items</h2>
            <table border="1" cellPadding="5" cellSpacing="0">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Active?</th>
                        <th>Created</th>
                        <th>Updated</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item) => (
                        <tr key={item._id}>
                            <td>{item.name}</td>
                            <td>{item.is_active ? 'Yes' : 'No'}</td>
                            <td>{new Date(item.created_at).toLocaleString()}</td>
                            <td>{new Date(item.updated_at).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ItemManager;