const Listing = require("./models/listing");
const Review=require("./models/review");
const ExpressError = require("./utils/ExpressError");
const { listingJoiSchema,reviewSchema} = require("./schema.js"); 

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        // Save intended URL in session
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in first!");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req, res, next) => {
    try {
        let { id } = req.params;
        let listing = await Listing.findById(id);

        if (!listing.owner.equals(res.locals.currUser._id)) {
            req.flash("error", "You don't have permission to edit");
            return res.redirect(`/listings/${id}`);
        }

        next(); // ✅ continue if owner
    } catch (err) {
        req.flash("error", "Something went wrong");
        return res.redirect("/listings");
    }
};

module.exports.validateListing = (req, res, next) => {
    const cleanListing = {};
    for (let key in req.body.listing) {
      const value = req.body.listing[key];
      cleanListing[key] = typeof value === "string"
        ? value.replace(/^"(.*)"$/, "$1")
        : value;
    }
    req.body.listing = cleanListing;
  
    const result = listingJoiSchema.validate(req.body.listing, { abortEarly: false });
  
    if (result.error) {
      const errMsg = result.error.details.map(el => el.message).join(", ");
      throw new ExpressError(400, errMsg);
    }
    next();
  };
  module.exports. validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
      const errMsg = error.details.map(el => el.message).join(",");
      throw new ExpressError(400, errMsg);
    }
    next();
  };
  module.exports.isReviewAuthor = async (req, res, next) => {
    try {
        let { reviewId,id } = req.params;
        let review = await Review.findById(reviewId);

        if (!review.author.equals(res.locals.currUser._id)) {
            req.flash("error", "You are not the author of this review");
            return res.redirect(`/listings/${id}`);
        }

      return  next(); // ✅ continue if owner
    } catch (err) {
        req.flash("error", "Something went wrong");
        return res.redirect("/listings");
    }
    
};