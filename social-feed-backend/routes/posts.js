const { json } = require("body-parser");
const express = require("express");
const router = express.Router();
const Post = require("../models/posts");
// const Comment = require("../models/comment");
const verify = require("./verifyToken");
const multer = require("multer");
const path = require("path");
let imageURL = "http://localhost:8000/assets/postImage/";

//add the post
let FileName = "";
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const FilePath = path.join(__dirname, "../assets/postImage");
    cb(null, FilePath);
  },
  filename: (req, file, cb) => {
    console.log(file);
    FileName = Date.now() + "-" + file.originalname;
    cb(null, FileName);
  },
});

var upload = multer({ storage: storage });

router.post("/add", verify, upload.single("image"), async (req, res) => {
  const post = new Post({
    image: FileName,
    caption: req.body.caption,
    createdBy: req.user._id,
    likes: req.body.likes,
    post_created_by: req.user.name,
  });
  try {
    const savedPost = await post.save();
    console.log(savedPost);
    res.json({ savedPost });
  } catch (err) {
    res.json({ message: err });
  }
});

//GET ALL POSTS

router.get("/", verify, async (req, res) => {
  console.log(req.user._id);
  try {
    const posts = await Post.find();
    const updatedPost = posts.map((post) => {
      return { ...post._doc, image: imageURL + post.image };
    });
    res.json(updatedPost);
  } catch (err) {
    res.json({ message: err });
  }
});

//GET A PARTICULAR POST
// router.get("/:postId", async (req, res) => {
//   try {
//     const post = await Post.findById(req.params.postId);
//     res.json(post);
//   } catch (err) {
//     res.json({ message: err });
//   }
// });

//DELETE A PARTICULAR POST
// router.delete("/:postId", async (req, res) => {
//   try {
//     const removePost = await Post.remove({ _id: req.params.postId });
//     res.json(removePost);
//   } catch (err) {
//     res.json({ message: err });
//   }
// });
// module.exports = router;

//Like or Unlike the post
router.put("/:postId", verify, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    const uid = req.user._id;
    const flag = post.likes.filter((id) => {
      return id === uid;
    });
    if (flag == "") {
      //res.send(post.likes)

      post.likes.push(uid);
      const updatedPost = await Post.updateOne(
        { _id: req.params.postId },
        { $set: { likes: post.likes } }
      );
      res.send({ likes: post.likes, message: "Post Liked successfully" });
    } else {
      var newLikeArr = post.likes.filter((id) => id !== uid);
      //res.send(newLikeArr)
      const updatedPost = await Post.updateOne(
        { _id: req.params.postId },
        { $set: { likes: newLikeArr } }
      );
      res.send({ likes: newLikeArr, message: "Post unliked successfully" });
    }
  } catch (err) {
    res.json({ message: err });
  }
});

router.get("/params", verify, async (req, res) => {
  console.log(req.user._id);
  try {
    const { page, limit } = req.query;
    const posts = await Post.find()
      .limit(limit * 1)
      .skip((page - 1) * limit);
    const updatedPost = posts.map((post) => {
      return { ...post._doc, image: imageURL + post.image };
    });
    res.send({ post: updatedPost, page: page, limit: limit });
  } catch (err) {
    res.json({ message: err });
  }
});

module.exports = router;
