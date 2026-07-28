const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const review = require('./review.js');

const listingSchema = new Schema({
    title:{
        type:String,
        required:true, 
    },
    description: {
        type:String,
        required:true
    },
    price: {
        type:Number,
        required:true
    },
    location: {
        type:String,
        required:true
    },
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
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

listingSchema.post('findOneAndDelete', async (listing) => {
    if(listing){
        await review.deleteMany({_id: {$in: listing.reviews}});
}
    });
  
const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;