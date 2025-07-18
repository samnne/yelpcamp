const { cloudinary } = require("../cloudinary");
const Campground = require("../models/campground");
const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;

const index = async (req, res) => {
  const campgrounds = await Campground.find({});

  res.render("campgrounds/index", { campgrounds });
};

const newCampground = (req, res) => {
  res.render("campgrounds/new");
};

const createNewCampground = async (req, res) => {
  const geoData = await maptilerClient.geocoding.forward(
    req.body.campground.location,
    { limit: 1 }
  );
  const campground = new Campground(req.body.campground);
  campground.geometry = geoData.features[0].geometry;
  campground.author = req.user._id;
  campground.images = req.files.map((file) => ({
    url: file.path,
    filename: file.filename,
  }));
  await campground.save();
  console.log(campground);
  req.flash("success", "Sucessfully made a new campground");
  res.redirect(`/campgrounds/${campground._id}`);
};

const displayCampground = async (req, res) => {
  const { id } = req.params;

  const campground = await Campground.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("author");

  if (!campground) {
    req.flash("error", "Cannot find that campground");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/show", { campground });
};

const editPage = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  res.render("campgrounds/edit", { campground });
};

const editCampground = async (req, res) => {
  const { id } = req.params;
  const camp = await Campground.findByIdAndUpdate(
    id,
    { ...req.body.campground },
    { new: true }
  );
  const geoData = await maptilerClient.geocoding.forward(
    req.body.campground.location,
    { limit: 1 }
  );
  camp.geometry = geoData.features[0].geometry;
  const images = req.files.map((file) => ({
    url: file.path,
    filename: file.filename,
  }));
  camp.images.push(...images);
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await camp.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
    console.log(camp);
  }
  await camp.save();
  req.flash("success", "Successfully updated campground");
  res.redirect(`/campgrounds/${camp._id}`);
};

const deleteCampground = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted campground");
  res.redirect(`/campgrounds`);
};

module.exports = {
  index,
  newCampground,
  createNewCampground,
  displayCampground,
  editPage,
  editCampground,
  deleteCampground,
};
