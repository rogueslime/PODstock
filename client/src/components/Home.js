import React, { useState, useEffect } from 'react';
import campusPhoto from '../photos/utc-photo.jpg';
import defaultImage from '../photos/default-icon.jpg';
import axios from 'axios';

const Home = () => {

    const [locations, setLocations] =  useState([]);

    useEffect(() => {
        axios.get('/api/locations').then(res=>setLocations(res.data));
    }, []);

    return (
        <div>
            <div
                style={{
                    width: '100%',
                    height: '400px',
                    backgroundImage: `url(${campusPhoto})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            ></div>
            <h1 style={{padding: '1rem'}}>Welcome home!</h1>

            <div
                style = {{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
                    gap: '1rem'
                }}
            >
                {locations.map(loc => (
                    <div
                        key ={loc._id}
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
                            style={{ width: '300px', height: '200px', objectFit:'cover', marginBottom:'0.5rem'}}
                        />
                        <h3>{loc.name || 'Unknown'}</h3>
                    </div>
                ))}
            </div>
        </div>
    )

}

export default Home;