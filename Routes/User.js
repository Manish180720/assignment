const express = require("express");
const { Signin, Signup ,SubmitReview, RateCriteria} = require("../Controllers/User");
// const {  } = require("../Controllers/Review");
const router = express.Router();

// User Authentication Routes
router.post("/signin", Signin);
router.post("/signup", Signup);

// Review Routes
router.post("/reviews", SubmitReview); // Endpoint for submitting reviews
router.post("/ratings", RateCriteria); // Endpoint for rating criteria

module.exports = router;
