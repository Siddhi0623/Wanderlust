const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title:{
        type:String, 
    },
    description: String,
    price: Number,
    location: String,
    image: {
    filename: {
        type: String,
        default: "listingimage",
    },
    url: {
        type: String,
        default: "https://images.unsplash.com/..."
    }
},
    country: String,
});
const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;