const multer = require("multer");
const express = require("express");
const router = express.Router();
const path = require("path");
const User = require("../models/users");
const verify = require("./verifyToken");
const { updateUserValidation } = require("../validation");
let FileName = "";
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const FilePath = path.join(__dirname, "../assets/profilePic");
    cb(null, FilePath);
  },
  filename: (req, file, cb) => {
    console.log(file);
    FileName = Date.now() + "-" + file.originalname;
    cb(null, FileName);
  },
});

var upload = multer({ storage: storage });

router.put("/update", verify, upload.single("image"), async (req, res) => {
  const { error } = updateUserValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const users = await User.find();
  // console.log(users);
  const filteredUsers = users.filter((user) => req.user._id != user._id);
  console.log(filteredUsers);
  const emailExists = filteredUsers.filter(
    (user) => user.email == req.body.email
  );
  console.log(emailExists);
  if (emailExists.length > 0)
    return res.status(400).send("Email already exists!");

  console.log(req.user._id);
  try {
    const updatedUser = await User.updateOne(
      { _id: req.user._id },
      {
        $set: {
          image: FileName,
          username: req.body.username,
          email: req.body.email,
          bio: req.body.bio,
          gender: req.body.gender,
          DOB: req.body.DOB,
          mobile: req.body.mobile,
        },
      }
    );
    res.json(updatedUser);
  } catch (err) {
    res.json(err);
  }
});

//Remove Profile Pic
router.put("/remove", verify, async (req, res) => {
  try {
    const updatedpass = await User.updateOne(
      { _id: req.user._id },
      { $set: { image: "" } }
    );
    res.status(200).send("Profile Removed successfully");
  } catch (err) {
    res.json(err);
  }
});
module.exports = router;
