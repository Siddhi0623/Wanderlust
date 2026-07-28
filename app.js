const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError.js');       


const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");

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


app.use('/listings', listings);
app.use('/listings/:id/reviews', reviews);
app.use((err, req, res, next) => {
    let { status = 500, message = "Something went wrong" } = err;
    res.render("error.ejs", { status, message });
});

app.listen(8080, () => {
    console.log("Server is listening");
});