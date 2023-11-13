// app.js
const express = require('express');
const jwt = require("jsonwebtoken");
const db = require("./databases/database")

const app = express();
require('./routes/index.js')(app);

app.listen(process.env.PORT, () => console.log('Server running on port 3000!'));