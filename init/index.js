const mongoose = require('mongoose');
const initData = require('./data.js');
const Listings=require('../models/listing.js');

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

const initDB = async () => {
    await Listings.deleteMany({});
    await Listings.insertMany(initData.data);
    console.log("Data was initialized successfully");
}
initDB();