const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
mongoose.set("strictQuery", true);
mongoose
  .connect("mongodb://127.0.0.1:27017/yelp-camp")
  .then(() => {
    console.log("MONGO CONNECTION OPENED");
  })
  .catch((e) => {
    console.log("MONGO Error", e);
  });

const sample = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;

    const camp = new Campground({
      author: "6828180a74c0c7b9ded6faa8",
      title: `${sample(descriptors)} ${sample(places)}`,
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      images: [
        {
          url: "https://res.cloudinary.com/dcl4oivjp/image/upload/v1748487999/YelpCamp/cuacedochl8ojy2q48ve.jpg",
          filename: "YelpCamp/cuacedochl8ojy2q48ve",
        },
        {
          url: "https://res.cloudinary.com/dcl4oivjp/image/upload/v1748487999/YelpCamp/cvx12mqvaiswsgiiea07.jpg",
          filename: "YelpCamp/cvx12mqvaiswsgiiea07",
        },
      ],
      description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum totam eveniet
earum vero cupiditate porro et sequi corrupti asperiores laboriosam quam rerum
nihil ab, repellendus explicabo dolores eligendi odio. Vero?
`,
      price: price,
      geometry: {
        type: "Point",
        coordinates: [cities[random1000].longitude, cities[random1000].latitude]
      },
    });
    await camp.save();
  }
};

//
seedDB().then(() => {
  console.log("Closed connection");
  mongoose.connection.close();
});
