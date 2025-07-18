import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ItemManager from './ItemManager';
import LocationManager from './LocationManager';
import LocationItemManager from './LocationItemManager';

const LoginPortal = ({ isLoggedIn, setIsLoggedIn }) => {
    //const [loginFormData, setLoginFormData] = useState({ uname: '', pword: '' });
    const [formData, setFormData] = useState({ uname: '', pword: '' });
    //const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [registerMode, setREgisterMode] = useState(false);
    const [activeComponent, setActiveComponent] = useState(null);

    useEffect(() => {
        axios.get('/api/auth/me')
            .then(res => {
                setUser(res.data);
                setIsLoggedIn(true);
            })
            .catch(() => {
                setIsLoggedIn(false);
            });
    }, []);

    const handleChange = (e) => {
        const {name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/auth/login', formData);
            const res = await axios.get('/api/auth/me');
            setUser(res.data);
            setIsLoggedIn(true);
        } catch (err) {
            alert('Login failed');
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/auth/register', formData);
            alert('Registration successful. Please log in.');
            setREgisterMode(false);
        } catch (err) {
            alert('Registration failed');
        }
    }

    const handleLogout = async () => {
        await axios.post('/api/auth/logout');
        setUser(null);
        setIsLoggedIn(false);
        setFormData({ uname: '', pword: '' });
    };

    const renderActiveComponent = () => {
        if (!isLoggedIn) return null;

        switch (activeComponent) {
            case 'items' : return <ItemManager />;
            case 'locations' : return <LocationManager />;
            case 'inventory' : return <LocationItemManager />;
            default: return <p>Select a manager to begin.</p>;
        }
    }

    return (
        <div style= {{ padding: '1rem' }}>
            {isLoggedIn ? (
                <>
                    <h2>Welcome, {user.name}</h2>
                    <button onClick={handleLogout}>Log Out</button>
                    <div style = {{marginTop: '1rem'}}>
                        <button onClick={() => setActiveComponent('items')}>Item Manager</button>
                        <button onClick={() => setActiveComponent('locations')}>Location Manager</button>
                        <button onClick={() => setActiveComponent('inventory')}>Inventory Manager</button>
                    </div>
                    <div style = {{ marginTop: '2rem' }}>
                        {renderActiveComponent()}
                    </div>
                </>
            ) : (
                <>
                <h2>Register New User</h2>
                    <form onSubmit={handleRegister}>
                        <input
                            name="uname"
                            placeholder="Username"
                            value={formData.uname}
                            onChange={handleChange}
                            required
                        />
                        <input
                            name="pword"
                            type="password"
                            placeholder="Password"
                            value={formData.pword}
                            onChange={handleChange}
                            required
                        />
                        <button type = "submit">Register</button>
                    </form>
                <h2>Login</h2>
                    <form onSubmit={handleLogin}>
                        <input
                            name="uname"
                            placeholder="Username"
                            value={formData.uname}
                            onChange={handleChange}
                            required
                        />
                        <input
                            name="pword"
                            type="password"
                            placeholder="Password"
                            value={formData.pword}
                            onChange={handleChange}
                            required
                        />
                        <button type = "submit">Login</button>
                    </form>
                </>
            )}
        </div>
    );
};

export default LoginPortal;