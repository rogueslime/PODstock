import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ImportErrorBlock from './ImportErrorBlock';

const LocationItemManager = () => {
    const [locations, setLocations] = useState([]);
    const [items, setItems] = useState([]); // filteredItems preferred, legacy inclusion
    const [filteredItems, setFilteredItems] = useState([]);
    const [locationItems, setLocationItems] = useState([]);
    const [locItFormData, setLocItFormData] = useState({
        location_id: '',
        item_id: '',
        count: 1,
    });
    const [importErrorData, setImportErrorData] = useState([]);

    // shipment import state variables
    const [importFile, setImportFile] = useState(null);
    const [importLocation, setImportLocation] = useState('');

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
        setFilteredItems(res.data);
    };

    const fetchLocationItems = async () => {
        const res = await axios.get('/api/locationitems');
        setLocationItems(res.data);
    };

    const handleLocationItemChange = async (e) => { // Filters items, only allowing creation of items not already tracked on that location's inventory. CURRENTLY NOT WORKING
        const { name, value } = e.target;
        
        if( name === 'location_id') {
            const res = await axios.get(`/api/locationitems/${value}`);
            const usedItemIds = res.data.map(li => li.item_id._id || li.item_id);
            setFilteredItems(items.filter(item => !usedItemIds.includes(item._id)));
        }

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

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this item?")) {
            try {
                await axios.delete(`/api/locationitems/${id}`);
                fetchLocationItems();
            } catch (err) {
                console.error(`Error deleting location-item: `, err);
            }
        }
    };

    // import submission logic
    const handleImportSubmit = async (type) => {
        if (!importFile || !importLocation) return;

        const formData = new FormData();
        formData.append('file', importFile);

        try {
            const res = await axios.post(`/api/locationitems/${type}/${importLocation}`, formData, {
                headers: {'Content-Type': 'multipart/form-data'}
            });

            if(type === 'import-shipment') {
                const { message, successes, errors } = res.data;
                console.log('Shipment import');
                console.log('Errors: ', errors);
                setImportErrorData(errors);
            }
            alert(`${type} import successful`);
            fetchLocationItems();
        } catch (err) {
            console.error(`Error importing ${type}: `,err);
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
                    {filteredItems.map(item => (
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

            {/*Import Shipment form*/}
            <h3>Import Shipment</h3>
            <form onSubmit = { (e) => {e.preventDefault(); handleImportSubmit('import-shipment'); }}>
                <select onChange={(e) => setImportLocation(e.target.value)} required>
                    <option value="">Select Location</option>
                    {locations.map(loc => (
                        <option key={loc._id} value={loc._id}>{loc.name}</option>
                    ))}
                </select>
                <input type="file" accept=".csv" onChange={(e) => setImportFile(e.target.files[0])} required />
                <button type="submit">Import</button>
            </form>

            {importErrorData.length > 0 && (
                <div>
                    <h3>Errors during shipment import; please resolve.</h3>
                    {importErrorData.map((err, index) => (
                        <ImportErrorBlock
                            error={err}
                            onResolved={() => {
                                setImportErrorData(prev => prev.filter((_, i) => i !== index))
                            }}
                        />  
                    ))}
                </div>
            )}

            <h3>Import Daily Operations</h3>
            <form onSubmit = { (e) => {e.preventDefault(); handleImportSubmit('daily-operations'); }}>
                <select onChange={(e) => setImportLocation(e.target.value)} required>
                    <option value="">Select Location</option>
                    {locations.map(loc => (
                        <option key={loc._id} value={loc._id}>{loc.name}</option>
                    ))}
                </select>
                <input type="file" accept=".csv" onChange={(e) => setImportFile(e.target.files[0])} required />
                <button type="submit">Import</button>
            </form>

            <h2>Location Inventory List</h2>
            <table border = "1" cellpadding = "5" cellspacing ="0">
                <thead>
                    <tr>
                        <th>Location</th>
                        <th>Item</th>
                        <th>Quantity</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {locationItems.map(li => (
                        <tr key = {li.id}>
                            <td>{li.location_id?.name || 'Unknown'}</td>
                            <td>{li.item_id?.name || 'Unknown'}</td>
                            <td>{li.count}</td>
                            <td>
                                <button onClick = {() => handleDelete(li._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default LocationItemManager;