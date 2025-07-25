import React, { useState, useEffect } from 'react';
import campusPhoto from '../photos/utc-photo.jpg';

const Home = () => {

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
        </div>
    )

}

export default Home;