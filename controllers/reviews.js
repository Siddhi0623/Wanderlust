const Listing = require('../models/listing.js');
const Review = require('../models/review.js');
const {reviewSchema} = require('../schema.js');

module.exports.createReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    // If user doesn't select a rating, use 1 by default
    if (req.body.review.rating == 0) {
        req.body.review.rating = 1;
    }
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();

    console.log("New review added");
    req.flash("success", "New review created!");

    res.redirect(`/listings/${listing._id}`);
}

module.exports.deleteReview = async(req, res) =>{
    let {id, reviewId} = req.params;

    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted!");

    res.redirect(`/listings/${id}`);

}