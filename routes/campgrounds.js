const express = require("express")
const router = express.Router()
const catchAsync = require("../utils/catchAsync")
const { campgroundSchema } = require("../schemas");
const { isLoggedIn, isAuthor } = require("../middleware");
const campground = require("../controllers/camgrounds");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage })

const validateCampground = ((req, res, next) => {
    const { error } = campgroundSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(
            ","
        )
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
})

// Main Routes
router.route("/")
    .get(catchAsync(campground.index))
    .post(isLoggedIn, upload.array("image"), validateCampground, catchAsync(campground.createNewCampground))

router.get("/new", isLoggedIn, campground.newCampground)


// Show Routes
router.route("/:id")
    .get(catchAsync(campground.displayCampground))
    .put(isLoggedIn, isAuthor,  upload.array("image"), validateCampground, catchAsync(campground.editCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campground.deleteCampground))

// FORM ROUTES

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(campground.editPage))


// EXPORT 
module.exports = router


