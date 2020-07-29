// Usually call this route index for all purpose routes not
//related to any particular model


// =========
// AUTH ROUTES
// ==========

var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var middleware = require("../middleware");

//show register form
router.get("/register", function(req, res){
  res.render("register");
});

//handle sign up logic when register(sign up) is clicked
router.post("/register", function(req, res){
  var newUser = new User({username: req.body.username});

  User.register(newUser, req.body.password, function(err, user){
    if(err){
      req.flash("error", err.message);
      return res.render("register");
    }
    passport.authenticate("local")(req, res, function(){
      req.flash("success", "Welcome to CampZ" + user.username);
      res.redirect("/campgrounds");
    });
  });
});

//show login form

router.get("/login", function(req, res){
  //step 2 under key of message display error
  res.render("login");
});

//handling login logic
//passport authenticate is middleware
router.post("/login", passport.authenticate("local",
      {
        successRedirect:"/campgrounds",
        failureRedirect:"/login"
      }), function(req, res){
});

//Logout route
router.get("/logout", function(res, req){
  req.logout();
  req.flash("success", "Logged you out!");
  res.direct("/campgrounds");
});


module.exports = router;
