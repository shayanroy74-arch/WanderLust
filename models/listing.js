const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        filename: String,
        //set is a function that runs when the value is set,either null-"" or a valid url but default is used when the value is undefined
        url: {
            type: String,
            default: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
            set: (v) =>
                v === ""
                    ? "https://images.unsplash.com/photo-1501785888041-af3ef285b470"
                    : v
        }
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    }
    
});

listingSchema.post("findOneAndDelete", async(listing)=> {
    if(listing){
        await Review.deleteMany({ _id: { $in: listing.reviews }});
    }
});
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;