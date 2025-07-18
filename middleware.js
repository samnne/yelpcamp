const Campground = require("./models/campground")
const Review = require("./models/review")
const { reviewSchema } = require("./schemas")


const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        // Store the url requested 
        req.session.returnTo = req.originalUrl

        req.flash("error", "You must be signed in")
        return res.redirect("/login")
    }
    next()
}
const validateReview = ((req, res, next) => {
    console.dir(req.body)
    const { error } = reviewSchema.validate(req.body)

    if (error) {
        const msg = error.details.map(el => el.message).join(
            ","
        )
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
})
const isAuthor = async (req, res, next)=>{
    const { id } = req.params
    const campground = await Campground.findById(id)
    if (!campground.author.equals(req.user._id)) {
        req.flash("error", "You cant do that i fear")
        return res.redirect(`/campgrounds/${id}`)
    }
    next()

}
const isReviewAuthor = async (req, res, next)=>{
    const {reviewId, id } = req.params
    const review = await Review.findById(reviewId)
    if (!review.author.equals(req.user._id)) {
        req.flash("error", "You cant do that i fear")
        return res.redirect(`/campgrounds/${id}`)
    }
    next()

}

const storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}



module.exports = { isLoggedIn, isAuthor, validateReview, storeReturnTo, isReviewAuthor }

