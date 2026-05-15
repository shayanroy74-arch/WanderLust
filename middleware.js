const Listing = require("./models/listing");
const {listingSchema} = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");
const {reviewSchema} = require("./schema.js");
const Review = require("./models/review.js");

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to do that!");
        return res.redirect("/login");
    }
    next();
};

module.exports.savedRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
        delete req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async(req,res,next)=>{
    console.log("is owner running");
    let {id} = req.params;
    let listing = await Listing.findById(id);
    console.log(listing);
    if(!listing.owner._id.equals(res.locals.currentUser._id)){   
        req.flash("error", "You are not the owner of this listing!");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.validateListing = (req,res,next)=>{
    console.log("Validation running");
    let {error} = listingSchema.validate(req.body);
    if(error){
        console.log("❌ VALIDATION FAILED");
        let errMsg = error.details.map((el)=> el.message).join(", ");
        return next(new ExpressError(400, errMsg));        
    }
    next();
};

module.exports.validateReview = (req,res,next)=>{
    console.log("Validation running");
    let {error} = reviewSchema.validate(req.body);
    if(error){
        console.log("❌ VALIDATION FAILED");
        let errMsg = error.details.map((el)=> el.message).join(", ");
        return next(new ExpressError(400, errMsg));        
    }
    next();
};

module.exports.isReviewAuthor = async(req,res,next)=>{
    let {id, reviewId} = req.params;
    let review = await Review.findById(reviewId);   
    if(!review.author._id.equals(res.locals.currentUser._id)){
        req.flash("error", "You are not the author of this review!");   
        return res.redirect(`/listings/${id}`);
    }
    next();
};