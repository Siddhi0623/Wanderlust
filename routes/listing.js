const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js'); 
const {listingSchema} = require('../schema.js');
const Listing = require('../models/listing.js');
const { isLoggedIn, isOwner } = require('../middleware.js');
const listingsController = require('../controllers/listings.js');
const multer  = require('multer');
const { storage } = require('../cloudConfig.js');
const upload = multer({ storage });


// const validateListing = (req, res, next) => {
//     console.log(req.body);

//     const { error } = listingSchema.validate(req.body);

//     if (error) {
//         console.log(error.details);
//         throw new ExpressError(400, error.details.map(el => el.message).join(", "));
//     }

//     next();
// };
const validateListing = (req, res, next) => {

    const { error } = listingSchema.validate(req.body);

    if (error) {
        console.log(error.details);

        return next(new ExpressError(
            400,
            error.details.map(el => el.message).join(", ")
        ));
    }

    next();
};

// Index and Create Routes
router.route('/')
.get(wrapAsync(listingsController.index))
.post( isLoggedIn, validateListing, upload.single('listing[image]'), wrapAsync(listingsController.createListing));


// NEW ROUTE
router.get('/new', isLoggedIn, listingsController.renderNewForm);

// Show, Delete and Update Routes
router.route('/:id')
.get( wrapAsync(listingsController.showListing))
.put(isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync(listingsController.updateListing)
)
.delete( isLoggedIn, isOwner, wrapAsync(listingsController.deleteListing));

// Edit ROUTE
router.get('/:id/edit', isLoggedIn, isOwner, wrapAsync(listingsController.renderEditForm)
);


module.exports = router;