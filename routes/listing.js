const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listing");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");
const listingController=require("../controllers/listing.js")
const multer  = require('multer');
const {storage}=require("../cloudConfig.js")
const upload = multer({ storage });


router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,upload.single("listing[image]"),validateListing, wrapAsync(listingController.createListing));
  
  // New - Form to create new listing
  router.get("/new", 
  isLoggedIn,listingController.renderNewForm);
  
  // Create - Create new listing
router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(
  isLoggedIn,
  isOwner,
  upload.single("listing[image]"),
   validateListing,
    wrapAsync(listingController.updateListing))
   .delete(
  isLoggedIn,
  isOwner,
   wrapAsync(listingController.deleteListing));
  // Show - Details of a listing

  
  
  // Edit - Form to edit listing
  router.get("/:id/edit",
  isLoggedIn,
  isOwner,
   wrapAsync(listingController.renderEditForm));
  
  // Update - Update a listing
  
  
  // Delete - Remove a listing


  module.exports=router;
  