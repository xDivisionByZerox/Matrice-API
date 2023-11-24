// Packages
const express = require('express');
const db = require("./databases/database");
const cors = require("cors");

// Lauch the app
const app = express();

// App will work with json
const bodyparser = require("body-parser");
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended : true }));
app.use(cors());

// Routers available
const userRouter = require("./routes/user.route");
const followerRouter = require("./routes/follower.route");
const postRouter = require("./routes/post.route");
const likeRouter = require("./routes/like.route");
const rankRouter = require("./routes/rank.route");
const viewRouter = require("./routes/view.route");
const threadRouter = require("./routes/thread.route");

// Routes used
app.use('/user',userRouter)
app.use('/follower',followerRouter)
app.use('/post',postRouter)
app.use('/like',likeRouter)
app.use('/rank',rankRouter)
app.use('/view',viewRouter)
app.use('/thread',threadRouter);

app.listen(process.env.PORT, () => console.log('Server running on port 3000!'));