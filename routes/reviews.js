const express = require("express")
const router = express.Router()
const catchAsync = require("../utils/catchAsync")
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");
const reviews = require("../controllers/reviews");


router.post("/:id/reviews", isLoggedIn, validateReview, catchAsync(reviews.makeReview))
router.delete("/:id/reviews/:reviewId", isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router