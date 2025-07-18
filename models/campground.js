const mongoose = require("mongoose");
const Review = require("./review");


const Schema = mongoose.Schema;
//https://res.cloudinary.com/dcl4oivjp/image/upload/w_500/v1748487999/YelpCamp/cvx12mqvaiswsgiiea07.jpg


const ImageSchema = new Schema({
    url: String,
    filename: String
})
ImageSchema.virtual("thumbnail").get(function () {
    return this.url.replace("/upload", "/upload/w_200")
})

const opts = { toJSON: {virtuals: true}}

const CampgroundSchema = new Schema({
    title: String,
    images: [
        ImageSchema
    ],
    price: Number,
    description: String,
    location: String,
    geometry:
    {
        type: {
            type: String,
            enum: ["Point"],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
        
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }],
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
}, opts)

CampgroundSchema.virtual("properties.popUpMarkup").get(function () {
    return `<strong><a class="text-info text-decoration-none lead" href="/campgrounds/${this._id}">${this.title}</a></strong>`
})


CampgroundSchema.post("findOneAndDelete", async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model("Campground", CampgroundSchema)