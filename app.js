const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require('./models/listing.js');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');

const MONGO_URL = 'mongodb://localhost:27017/Wanderlust';

main().then(()=>{
    console.log("MongoDB is connected");
})
.catch((err)=>{
    console.error("Error connecting to MongoDB:", err);
});

async function main(){
    await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.send("Hi I am root");
});

// INDEX ROUTE
app.get('/listings', async (req, res) =>{
    const alllistings = await Listing.find({});
    res.render("listings/index", {listings: alllistings});
    
});

// NEW ROUTE
app.get('/listings/new', (req, res) => {
    res.render("listings/new");
});

// SHOW ROUTE
app.get('/listings/:id', async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show", {listing});
});

// CREATE ROUTE
app.post('/listings', async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect('/listings');
});

// EDIT ROUTE
app.get('/listings/:id/edit', async (req, res) => {
     let { id } = req.params;
     const listing = await Listing.findById(id);
     res.render("listings/edit", {listing});
});

// UPDATE ROUTE
app.put('/listings/:id', async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id,{ ...req.body.listing });
    res.redirect(`/listings/${id}`);
});

// DELETE ROUTE
app.delete('/listings/:id', async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log("Deleted listing:", deletedListing);
    res.redirect('/listings');
});

// app.get('/testlistings', async(req, res) => {
//     let sampleListings = new Listing({
//         title: "Sample Listing",
//         price: 100,
//         description: "This is a sample listing for testing purposes.",
//         location: "Goa",
//         country: "India"
//     });

//     await sampleListings.save();
//     console.log("Sample listing saved to the database.");
//     res.send("Sample listing saved to the database.");
// });

app.listen(8080, () => {
    console.log("Server is listening");
});