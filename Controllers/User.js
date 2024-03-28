const User = require("../Models/User.js");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const mongoose = require('mongoose');

const generateEventId = () => {
  // Generate a unique event ID using MongoDB's automatic _id generation
  return new mongoose.Types.ObjectId();
};

const Signup = async (req, res) => {
  console.log("req has come");
  console.log(req.body);
  try {
    const check1 = await User.findOne({ email: req.body.email });
    const check2 = await User.findOne({ username: req.body.username });
    if (check1) {
      throw new Error("Email is already exist");
    }
    if (check2) {
      throw new Error("Username is already exist");
    }
    const password = req.body.password;
    const hashPassword = await bcrypt.hash(password, 10);

    // Generate a unique event ID for the user
    const eventId = generateEventId();

    // Create the new user with event ID
    const user = await User.create({
      _id: new mongoose.Types.ObjectId(), // Generate a new ObjectId for userId
      username: req.body.username,
      email: req.body.email,
      password: hashPassword,
      eventId: eventId, // Assign the generated event ID to the user
    });

    console.log("all the best");
    res.status(200).json({ userId: user._id, eventId: eventId, message: "You have registered Successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};


const Signin = async (req, res) => {
  console.log(req.body);
  try {
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findOne({ email: email });
    if (user) {
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        // Generate a JWT token with the userId included
        const token = jwt.sign({ userId: user._id }, process.env.TOKEN_SECRET, {
          expiresIn: "1d",
        });

        console.log(token);
        const userInfo = {
          userId: user._id, // Include userId in the response
          username: user.username,
          email: user.email,
        };

        res.cookie("token", token, { httpOnly: true, maxAge: 3600000 });
        res.status(200).json(userInfo);
      } else {
        throw new Error("Incorrect Password");
      }
    } else {
      throw new Error("Email does not exist");
    }
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};



const SubmitReview = async (req, res) => {
  try {
    const { userId, eventId, reviewText } = req.body;
    // Find the user by ID and update their reviews array
    const user = await User.findByIdAndUpdate(
      userId,
      { $push: { reviews: { eventId, reviewText } } },
      { new: true }
    );
    if (!user) throw new Error("User not found");
    res.status(200).json({ message: "Review submitted successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const RateCriteria = async (req, res) => {
  try {
    const { userId, registrationRating, eventRating, breakfastRating } = req.body;
    // Find the user by ID and update their ratings object
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { "ratings.registration": registrationRating, "ratings.event": eventRating, "ratings.breakfast": breakfastRating } },
      { new: true }
    );
    if (!user) throw new Error("User not found");
    res.status(200).json({ message: "Ratings submitted successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};


module.exports = { Signin, Signup , SubmitReview , RateCriteria};
