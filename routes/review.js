const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const Review=require("../models/review.js");
const Listing = require("../models/listing");
const {validateReview,isLoggedIn,isReviewAuthor}=require("../middleware.js");
const reviewController=require("../controllers/review.js");


  
// POST Review
router.post("/", 
  isLoggedIn,
  validateReview, 
  wrapAsync(reviewController.createReview)
);

// DELETE Review
router.delete("/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.deleteReview)
);

  module.exports=router;
  