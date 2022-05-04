const { json } = require("body-parser");
const express = require("express");
const router = express.Router();
const Comment = require("../models/comment");
const verify = require("./verifyToken");

//add comment
router.post("/add/:postId", verify, async (req, res) => {
  console.log(req.user);
  const comment = new Comment({
    postId: req.params.postId,
    createdBy: req.user.name,
    text: req.body.text,
    likes: req.body.likes,
  });
  try {
    const savedComment = await comment.save();
    console.log(savedComment);
    res.json(savedComment);
  } catch (err) {
    res.json({ message: err });
  }
});

//get all comments of particular post Id
router.get("/:postId", verify, async (req, res) => {
  console.log(req.user);
  try {
    const comments = await Comment.find({ postId: req.params.postId });
    res.json(comments);
  } catch (err) {
    res.json({ message: "something went wrong" });
  }
});

module.exports = router;

//update like or unlike comment

router.put("/:commentId", verify, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    const uid = req.user._id;
    const flag = comment.likes.filter((id) => {
      return id === uid;
    });
    if (flag == "") {
      // res.send(comment.likes)

      comment.likes.push(uid);
      const updatedComment = await Comment.updateOne(
        { _id: req.params.commentId },
        { $set: { likes: comment.likes } }
      );
      res.send({ likes: comment.likes, message: "Post liked successfully" });
    } else {
      var newLikeArr = comment.likes.filter((id) => id !== uid);
      const updatedComment = await Comment.updateOne(
        { _id: req.params.commentId },
        { $set: { likes: newLikeArr } }
      );
      res.send({ likes: newLikeArr, message: "Post unliked successfully" });
    }
  } catch (err) {
    res.json({ message: err });
  }
});
