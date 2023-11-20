// Packages
const express = require('express');
const db = require("./databases/database")

// Lauch the app
const app = express();

// App will work with json
const bodyparser = require("body-parser");
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended : true }));

// Routers available
const userRouter = require("./routes/user.route")

// Routes used
app.use('/user',userRouter)

app.listen(process.env.PORT, () => console.log('Server running on port 3000!'));