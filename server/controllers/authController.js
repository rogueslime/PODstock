const bcrypt = require('bcryptjs');
const User = require('../models/Users');

exports.register = async (req, res) => {
    try {
        console.log('Register payload: ', req.body);
        const {uname, pword} = req.body;
        const hashed = await bcrypt.hash(pword, 12);
        const user = await User.create({ name: uname, password_hash: hashed });
        res.status(201).json({ message: 'User created', user: {username: user.name }});
    } catch (err) {
        console.error('Registration errror: ',err);
        res.status(500).json({ message: 'Error registering user.' });
    }
};

exports.login = async (req, res) => {
    try {
        const {uname, pword} = req.body;
        const user = await User.findOne({name: uname});
        if(!user) return res.status(400).json({ message: 'Invalid credentials. '});

        const isMatch = await bcrypt.compare(pword, user.password_hash);
        if(!isMatch) return res.status(400).json({ message: 'Invalid credentials.' });

        req.session.userId = user._id;
        res.status(200).json({ message: 'Login successful', user: {username: user.name} });
    } catch(err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Error logging in.' });
    }
};

exports.logout = (req, res) => {
    req.session.destroy();
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out.' });
};

exports.getCurrentUser = async (req, res) => {
    if(!req.session.userId) return res.status(401).json({ user: null} );
    const user = await User.findById(req.session.userId).select('-password_hash');
    res.json(user);
};