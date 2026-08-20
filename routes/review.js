const express = require('express');
const router = express.Router({mergeParams : true});
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js'); 
const {reviewSchema} = require('../schema.js');
const Review = require('../models/review.js');
const Listing = require('../models/listing.js');
const { isLoggedIn, isReviewAuthor } = require("../middleware.js");
const reviewsController = require('../controllers/reviews.js');

const validateReview = (req, res, next) => {
    console.log(req.body);

    let { error } = reviewSchema.validate(req.body);

    console.log(error);

    if (error) {
        console.log(error.details);
        throw new ExpressError(400, error.message);
    }

    next();
};

// Review Model
router.post('/', isLoggedIn, validateReview, wrapAsync(reviewsController.createReview));

// Delete Review Route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewsController.deleteReview));

module.exports = router;