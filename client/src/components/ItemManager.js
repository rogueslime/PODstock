import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ItemManager = () => {
    const [items, setItems] = useState([]);
    const [cases, setCases] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        is_active: true,
    });
    const [caseFormData, setCaseFormData] = useState({ item: '', quantity: 1, case_label: ''});
    const [editItemId, setEditItemId] = useState(null); // tracks item we're editing

    useEffect(() => {
        fetchItems();
        fetchCases();
    }, []);

    const fetchItems = async () => {
        try {
            const res = await axios.get('/api/items');
            setItems(res.data);
        } catch (err) {
            console.error('Error fetching items: ', err);
        }
    };

    const fetchCases = async () => {
        try {
            const res = await axios.get('/api/cases');
            setCases(res.data);
        } catch (err) {
            console.error('Error fetching cases: ', err);
        }
    };

    const handleChange = (e) => { // handles Item change
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleCaseChange = (e) => {
        const { name, value } = e.target;
        setCaseFormData({ ...caseFormData, [name]: value});
    };

    const handleSubmit = async (e) => { // handles Item submit
        e.preventDefault();

        const payload = {
            ...formData,
            updated_at: new Date(),
        };

        // check to see if this item is a duplicate
        const itemName = formData.name.trim().toLowerCase();
        const duplicate = items.find(item => item.name.trim().toLowerCase() === itemName);
        if (duplicate && !editItemId) {
            alert(`Item "${formData.name}" already exists.`)
            return;
        }

        try {
            if (editItemId) { // update an existing item if we're holding an EditItemId
                await axios.put(`/api/items/${editItemId}`, payload);
            } else { // otherwise create a NEW item
                payload.created_at = new Date();
                await axios.post('/api/items', payload);
            }

            // then we reset the form to blank
            setFormData({ name: '', is_active: true});
            setEditItemId(null);
            fetchItems();
        } catch (err) {
            console.error('Error submitting item:', err);
        }
    };

    const handleCaseSubmit = async (e) => {
        e.preventDefault();

        const caseToSend = {
            item_id: caseFormData.item,
            name: caseFormData.case_label,
            itemcount: parseInt(caseFormData.quantity),
            is_active: true,
            created_at: new Date(),
            updated_at: new Date(),
        };

        try {
            await axios.post('/api/cases', caseToSend);
            setCaseFormData({ item: '', quantity: 1, case_label: '' });
            fetchCases();
        } catch (err) {
            console.error('Error posting case: ', err);
        }
    };

    const caseByItem = {};
    for (const c of cases) {
        const item = c.item_id;
        if (!item || !item._id) continue;
        if (!caseByItem[item._id]) {
            caseByItem[item._id] = [];
        }
        caseByItem[item._id].push(c);
    }

    const handleEdit = (item) => {
        setFormData ({
            name: item.name,
            is_active: item.is_active,
        });
        setEditItemId(item._id);
    }

    const handleDelete = async (type, id) => {
        if (window.confirm("Are you sure you want to delete this item?")) {
            try {
                await axios.delete(`/api/${type}/${id}`);
                fetchItems();
                fetchCases();
            } catch (err) {
                console.error(`Error deleting ${type}: `, err);
            }
        }
    };

    const uploadItemImage = async (itemId, file) => {
        const formData = new FormData();
        formData.append('image', file);

        const res = await axios.post(`/api/items/${itemId}/image`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });

        console.log('Uploaded image path:', res.data.imagePath);
    };

    return (
        <div style = {{ padding: '1rem' }}>
            <h2>{editItemId ? 'Edit Item' : 'Create Item'}</h2>
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
                <button type="submit">{editItemId? 'Update' : 'Submit'}</button>
                {editItemId && (
                    <button type="button" onClick={() => {
                        setFormData({ name: '', is_active: true});
                        setEditItemId(null);
                    }}>Cancel Edit</button>
                )}
            </form>

            <h2>Create Case</h2>
            <form onSubmit = {handleCaseSubmit}>
                <input
                    name="case_label"
                    placeholder="Case Label"
                    value={caseFormData.case_label}
                    onChange={handleCaseChange}
                    required
                />
                <input
                    name = "quantity"
                    type = "number"
                    min = "1"
                    value = {caseFormData.quantity}
                    onChange = {handleCaseChange}
                    required
                />
                <select
                    name = "item"
                    value = {caseFormData.item}
                    onChange = {handleCaseChange}
                    required
                >
                    <option value="">-- Select Item --</option>
                    {items 
                        .filter(item => !caseByItem[item._id])
                        .map(item => (
                            <option key={item._id} value={item._id}>
                                {item.name}
                            </option>
                    ))}
                </select>
                <button type="submit">Submit Case</button>
            </form>

            <h2>Items and Cases</h2>
            <table border="1" cellPadding="5" cellSpacing="0">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Active?</th>
                        <th>Created</th>
                        <th>Updated</th>
                        <th>Actions</th>
                        <th>#/Case</th>
                        <th>Actions</th>
                        <th>Image</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item) => (
                        <tr key={item._id}>
                            <td>{item.name}</td>
                            <td>{item.is_active ? 'Yes' : 'No'}</td>
                            <td>{new Date(item.created_at).toLocaleString()}</td>
                            <td>{new Date(item.updated_at).toLocaleString()}</td>
                            <td>
                                <button onClick={() => handleEdit(item)}>Edit</button>
                                <button onClick={() => handleDelete('items', item._id)}>Delete</button>
                            </td>
                            <td>
                                {(caseByItem[item._id] || []).map(c => (
                                    <div key={c._id}>
                                        <b>{c.name}</b>: {c.itemcount}
                                    </div>
                                ))}
                            </td>
                            <td>
                                {(caseByItem[item._id] || []).map( c => (
                                    <div key={c._id}>
                                        <button onClick = {() => handleDelete('cases', c._id)}>Delete</button>
                                    </div>
                                ))}
                            </td>
                            <td>
                                <input
                                    type = "file"
                                    accept ="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if(file) {
                                            uploadItemImage(item._id, file);
                                        }
                                    }}
                                />
                                {item.image ? <b>Image Uploaded</b> : <b> Null </b>}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ItemManager;