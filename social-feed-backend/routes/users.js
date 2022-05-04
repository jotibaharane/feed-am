const { json } = require("body-parser");
const express = require("express");
const router = express.Router();
const User = require("../models/users");
const Joi = require("@hapi/joi");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client({
  clientId: process.env.CLIENT_ID,
});
const {
  registerValidation,
  loginValidation,
  updatePassValidation,
} = require("../validation");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const verify = require("./verifyToken");

//localhost in image url may be change to 192.168.0.123
let imageURL = "http://localhost:8000/assets/profilePic/";

//Register User
router.post("/register", async (req, res) => {
  //validate the data before the post
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //validate if the user is already in the database
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send("Email already exists");

  //Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  //create a new user
  const user = new User({
    image: req.body.image,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    password: hashedPassword,
    bio: req.body.bio,
    gender: req.body.gender,
    DOB: req.body.DOB,
    mobile: req.body.mobile,
  });
  try {
    const savedUser = await user.save();
    res.send({
      user: user._id,
    });
  } catch (err) {
    res.send({ message: err });
  }
});
//logout
router.get("/logout", verify, async (req, res, next) => {
  const token = req.headers["auth-token"];
  console.log(token);
  try {
    jwt.sign(token, { expiresIn: 1 }, (logout, err) => {
      if (logout) {
        res.send({ msg: "You have been Logged Out" });
      } else {
        res.send({ msg: "Error" });
      }
    });

    res.status(200).send("logout successfully");
  } catch (err) {
    res.json({ message: "nothing happens" });
  }
});
//get user
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.json({ message: err });
  }
});

router.get("/getUser", verify, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const updateduser = { ...user._doc, image: imageURL + user.image };
    res.json(updateduser);
  } catch (err) {
    res.json({ message: err });
  }
});
//Login

router.post("/login", async (req, res) => {
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //validate email
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Email or password is invalid");

  //validate password
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).send("Password is invalid");
  // const pass = await User.findOne({ password: req.body.password });
  // if (!pass) return res.status(400).send("Password is invalid");

  const token = jwt.sign(
    {
      _id: user._id,
      email: user.email,
      name: user.firstname + " " + user.lastname,
    },
    process.env.TOKEN_SECRET,
    {
      expiresIn: "24h",
    }
  );
  // res.cookie("nToken", token, { maxAge: 900000, httpOnly: true });
  res.header("auth-token", token).send(token);
});

//change password
// router.put("/reset", async (req, res) => {
//   res.send("gdhg");
//   // const salt = await bcrypt.genSalt(10);
//   // const hashedPassword = await bcrypt.hash(req.body.password, salt);
//   // try {
//   //   const updatedPost = await User.updateOne(
//   //     { _id: req.params.userId },
//   //     { $set: { password: hashedPassword } }
//   //   );
//   //   res.json(updatedPost);
//   // } catch (err) {
//   //   res.json(err);
//   // }
// });

router.put("/reset", verify, async (req, res) => {
  // res.send(req.user._id);
  const { error } = updatePassValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const CurrentUser = await User.findById(req.user._id);

    const passExist = await bcrypt.compare(
      req.body.current_password,
      CurrentUser.password
    );
    if (!passExist) return res.send("current password does not matched");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.new_password, salt);
    const updatedpass = await User.updateOne(
      { _id: req.user._id },
      { $set: { password: hashedPassword } }
    );
    res.status(200).send("password updated successfully");
    // res.json(updatedpass);
  } catch (err) {
    res.json(err);
  }
});

router.post("/auth/google", async (req, res) => {
  const { idToken } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: idToken,
      requiredAudience: process.env.CLIENT_ID,
    });
    const payload = ticket.getPayload();
    console.log(payload.email);
    let user = await User.findOne({ email: payload.email });
    if (!user) {
      return res.status(400).send("email is not registered");
    } else {
      console.log("hkhjn");
      const token = jwt.sign(
        { _id: user._id, email: user.email },
        process.env.TOKEN_SECRET,
        {
          expiresIn: "24h",
        }
      );
      return res.status(200).send(token);
    }
  } catch (err) {
    return res.status(400).send({ message: "something went wrong" });
  }
});

// router.put("/reset", async (req, res) => {
//   res.send("resrt");
//   // try {
//   //   const user = await User.findOne(req.user._id);
//   //   // const resetPass = await User.updateOne(
//   //   //   { _id: req.user._id },
//   //   //   {
//   //   //     $set: {
//   //   //       image: FileName,
//   //   //       username: req.body.username,
//   //   //       email: req.body.email,
//   //   //       bio: req.body.bio,
//   //   //       gender: req.body.gender,
//   //   //       DOB: req.body.DOB,
//   //   //       mobile: req.body.mobile,
//   //   //     },
//   //   //   }
//   //   // );
//   //   // res.json(updatedUser);
//   // } catch (err) {
//   //   res.json(err);
//   // }
// });

module.exports = router;
