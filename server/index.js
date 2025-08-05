const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

const app = express();
const corsOptions = {
  origin: 'http://localhost:3000', // in prod, would be frontend URL
  credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(session({
  secret: 'super-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
    maxAge: 1000 * 60 * 60 * 24,
  }
}));
app.use('/uploads/images', express.static(path.join(__dirname, 'uploads/images')));

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected.'))
.catch((err) => console.error('MongoDB Connection Error -- ', err));

// DB Routes
app.use("/api/items", require("./routes/itemRoutes"));
app.use("/api/cases", require("./routes/caseRoutes"));
app.use("/api/locations", require("./routes/locationRoutes"));
app.use("/api/locationitems", require("./routes/locationItemRoutes"));
app.use("/api/auth", require("./routes/authRoutes"))
//app.use("api/inventory", require("./routes/inventoryRoutes"));
//app.use("api/logs", require("./routes/logRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));