const exprees = require('express');
const router = exprees.Router({mergeParams: true});
const wrapAsync= require("../utils/wrapAsync.js");
const {isLoggedIn, validateReview, isReviewAuthor} = require("../middleware.js");
const reviewsController = require("../controllers/reviews.js");

// Review 
//Post route
router.post("",isLoggedIn, validateReview, wrapAsync(reviewsController.createReview));

router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewsController.deleteReview));

module.exports = router;