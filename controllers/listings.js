const Listing = require('../models/listing.js');
const { listingSchema } = require("../schema.js");
const axios = require("axios");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;

const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) =>{
    const alllistings = await Listing.find({});
    res.render("listings/index", {listings: alllistings});
    
}

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new");
}

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({"path": "reviews", "populate": {"path": "author"}}).populate("owner");
    if(!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }
    res.render("listings/show", {listing});
}

module.exports.createListing = async (req, res, next) => {
    let response=await geocodingClient.forwardGeocode({
  query: req.body.listing.location,
  limit: 1,
})
  .send()
    let url = req.files[0].path;
    let filename = req.files[0].filename;
     const newListing = new Listing(req.body.listing);

     newListing.owner = req.user._id;
       
    newListing.images = req.files.map(file => ({
    url: file.path,
    filename: file.filename
}));

     newListing.image = { url, filename };
     newListing.geometry = response.body.features[0].geometry;
     newListing.coordinates = response.body.features[0].geometry.coordinates;
    await newListing.save();
    req.flash("success", "New listing created!");
    res.redirect('/listings');
}
// module.exports.createListing = async (req, res) => {
//     const { location } = req.body.listing;

//     const response = await axios.get(
//         "https://api.mapbox.com/search/geocode/v6/forward",
//         {
//             params: {
//                 q: location,
//                 access_token: process.env.MAP_TOKEN
//             }
//         }
//     );

//     if (!response.data.features.length) {
//         req.flash("error", "Location not found!");
//         return res.redirect("/listings/new");
//     }

//     const coordinates = response.data.features[0].geometry.coordinates;

//     const newListing = new Listing(req.body.listing);

//     newListing.geometry = {
//         type: "Point",
//         coordinates: coordinates
//     };

//     newListing.owner = req.user._id;
    

//     await newListing.save();
//     console.log("GEOMETRY BEFORE SAVE:", newListing.geometry);
//     req.flash("success", "New listing created!");
//     res.redirect("/listings");
// };

// module.exports.renderEditForm = async (req, res) => {
//         let { id } = req.params;

//         const listing = await Listing.findById(id);

//         if (!listing) {
//             req.flash("error", "Listing not found!");
//             return res.redirect("/listings");
//         }

//         let originalImageUrl = listing.image.url;
//         originalImageUrl = originalImageUrl.replace("/uploads/","/uploads/h_300,w_250");
//         res.render("listings/edit", { listing, originalImageUrl });
//     }
module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;

    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    let originalImageUrl = "";

    if (listing.images && listing.images.length > 0) {
    originalImageUrl = listing.images[0].url;
} else if (listing.image?.url) {
    originalImageUrl = listing.image.url;
}

    if (originalImageUrl) {
        originalImageUrl = originalImageUrl.replace(
            "/uploads/",
            "/uploads/h_300,w_250"
        );
    }

    res.render("listings/edit", {
        listing,
        originalImageUrl
    });
};
     

// module.exports.updateListing = async (req, res) => {
    

//         let { id } = req.params;

//         let listing=await Listing.findByIdAndUpdate(
//             id,
//             { ...req.body.listing },
//             { new: true, runValidators: true }
//         );
//         if(typeof req.file !== 'undefined'){
//             let url = req.file.path;
//             let filename = req.file.filename;
//             listing.image = { url, filename };
//         }
//             await listing.save();
//         req.flash("success", "Listing updated!");
//         res.redirect(`/listings/${id}`);
//     }

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;

    const { location } = req.body.listing;

    // Get coordinates from Mapbox
    const response = await axios.get(
        "https://api.mapbox.com/search/geocode/v6/forward",
        {
            params: {
                q: location,
                access_token: process.env.MAP_TOKEN
            }
        }
    );

    if (!response.data.features.length) {
        req.flash("error", "Location not found!");
        return res.redirect(`/listings/${id}/edit`);
    }

    const coordinates =
        response.data.features[0].geometry.coordinates;

    // Update listing
    await Listing.findByIdAndUpdate(
        id,
        {
            ...req.body.listing,
            geometry: {
                type: "Point",
                coordinates: coordinates
            }
        },
        {
            new: true,
            runValidators: true
        }
    );

    req.flash("success", "Listing updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log("Deleted listing:", deletedListing);
    req.flash("success", "Listing deleted!");
    res.redirect('/listings');
}