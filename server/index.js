const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected.'))
.catch((err) => console.error('MongoDB Connection Error -- ', err));

// DB Routes
app.use("api/items", require("./routes/itemRoutes"));
//app.use("api/cases", require("./routes/caseRoutes"));
//app.use("api/inventory", require("./routes/inventoryRoutes"));
//app.use("api/logs", require("./routes/logRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));