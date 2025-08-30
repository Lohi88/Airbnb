const Listing=require("../models/listing");
const axios = require("axios");


module.exports.index=async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
  };

  module.exports.renderNewForm=(req,res)=>
  {
    res.render("listings/new")
  };

  module.exports.showListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id)
      .populate({
        path: "reviews",
        populate: { path: "author", model: "User" }
      })
      .populate("owner");
  
    if (!listing) {
      req.flash("error", "Listing you requested for does not exist");
      return res.redirect("/listings");
    }
  
    // Pass mapToken here along with listing
    res.render("listings/display", { 
      listing, 
      mapToken: process.env.MAP_TOKEN,  // <-- add this line
      currUser: req.user  // if you use currUser in your template
    });
  };
  
module.exports.createListing = async (req, res, next) => {
  try {
    const location = req.body.listing.location;
    const maptilerKey = process.env.MAP_TOKEN;

    // 🌍 Call MapTiler geocoding API
    const response = await axios.get(`https://api.maptiler.com/geocoding/${encodeURIComponent(location)}.json`, {
      params: {
        key: maptilerKey,
        limit: 1,
      }
    });

    const geometry = response.data.features[0]?.geometry;

    if (!geometry) {
      req.flash("error", "Could not find that location. Please try another.");
      return res.redirect("/listings/new");
    }

    // 📦 Create and save listing
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;

    if (req.file) {
      const { path: url, filename } = req.file;
      newListing.image = { url, filename };
    }

    newListing.geometry = geometry;

    await newListing.save();

    req.flash("success", "New Listing Created!");
    res.redirect(`/listings/${newListing._id}`);
  } catch (err) {
    console.error("Error during MapTiler geocoding or listing creation:", err);
    req.flash("error", "Something went wrong while creating the listing.");
    res.redirect("/listings/new");
  }
};

  module.exports.renderEditForm=async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing)
    {
      req.flash("error","Listing you requested for does not exist ");
     return  res.redirect("/listings")

    }
    let originalImageUrl=listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/h_100,w_100")
    res.render("listings/edit", { listing,originalImageUrl });
  };

  module.exports.updateListing=async (req, res) => {
    let { id } = req.params;
    const updatedListing = await Listing.findByIdAndUpdate(id, req.body.listing, { new: true, runValidators: true });
    if(typeof req.file !=="undefined")
    {
      let url=req.file.path;
      let filename=req.file.filename;
      updateListing.image={url,filename};
      await updateListing.save();
    }
   
    req.flash("success","Listing updated!");
    res.redirect(`/listings/${updatedListing._id}`);

  };
  module.exports.deleteListing=async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success"," Listing Deleted!");
    res.redirect("/listings");
  };