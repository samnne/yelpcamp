const express = require("express")
const router = express.Router()
const passport = require("passport")
const { storeReturnTo } = require('../middleware');
const userAction = require("../controllers/users")

// Register 
router.route("/register")
    .get(userAction.registerPage)
    .post(userAction.registerUser)

// Login
router.route("/login")
    .get(storeReturnTo, userAction.loginPage)
    .post(
        storeReturnTo,
        passport.authenticate("local", {
            ailureFlash: true,
            failureRedirect: "/login"
        }
        ), userAction.loginUser
    )

// Logout
router.get('/logout', userAction.logout);

module.exports = router