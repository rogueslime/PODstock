import React, { useState } from 'react';
import axios from 'axios';

const ImportErrorBlock = ({ error, onResolved }) => {
    const [itemCaseForm, setItemCaseForm] = useState ({
        itemName: '',
        caseName: error.caseLabel,
        quantity: '',
    });
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const itemRes = await axios.post('/api/items', {
                name: itemCaseForm.itemName,
                is_active: true,
                created_at: new Date(),
                updated_at: new Date()
            });

            const itemId = itemRes.data._id;

            const caseRes = await axios.post('/api/cases', {
                name: itemCaseForm.caseName,
                item_id: itemId,
                itemcount: parseInt(itemCaseForm.quantity),
                is_active: true,
                created_at: new Date(),
                updated_at: new Date()
            });

            onResolved();
        } catch (err) {
            console.error('Error fixing import entry: ', err);
            alert('Failed to create item or case.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleFormChange = (e) => { // handles form change
        const { name, value, type, checked } = e.target;
        setItemCaseForm({
            ...itemCaseForm,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    return (
        <form onSubmit={handleSubmit} style = {{marginBottom: '1rem', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '6px' }}>
            <p><strong>Missing Case: {error.case_label}</strong></p>
            <input
                type="text"
                name="itemName"
                placeholder="Item Name"
                value={itemCaseForm.itemName}
                onChange={handleFormChange}
                required
            />
            <input
                type="text"
                name="caseName"
                placeholder="Case Name"
                value={itemCaseForm.caseName}
                onChange={handleFormChange}
                required
            />
            <input
                type="number"
                name="quantity"
                placeholder="Quantity"
                value={itemCaseForm.quantity}
                min="1"
                onChange={handleFormChange}
                required
            />
            <button type = "submit" disabled = {submitting}>
                {submitting ? 'Submitting ...' : 'Fix Entry'}
            </button>
        </form>
    )
}

export default ImportErrorBlock;