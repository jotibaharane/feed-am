const express = require("express");
const app = express();
const mongooes = require("mongoose");
require("dotenv/config");
const bodyParser = require("body-parser");
const postRouter = require("./routes/posts");
const userRouter = require("./routes/users");
const commentRouter = require("./routes/comment");

const dp = require("./routes/dp");
// const cookieParser = require("cookie-parser");
const path = require("path");
const cors = require("cors");
app.use(cors());
app.use(bodyParser.json());
app.use("/posts", postRouter);
app.use("/users", userRouter);
app.use("/profile", dp);
app.use("/posts/comments", commentRouter);

app.use(
  "/assets/profilePic",
  express.static(path.join(__dirname + "/assets/profilePic"))
);
app.use(
  "/assets/postImage",
  express.static(path.join(__dirname + "/assets/postImage"))
);
// app.use(cookieParser());

//connect to db
mongooes
  .connect(process.env.DB_CONNECTION)
  .then(() => {
    process.stdout.write("\x1Bc"); //clear console
    console.log("connected to mongodb");
    return app.listen(8000);
  })
  .then(() => console.log("server running at 8000"))
  .catch((err) => console.log(err.message));
