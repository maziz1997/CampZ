// ========== //
// CAMPGROUND ROUTES //

var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
const campground = require("../models/campground");
var middleware = require("../middleware");

//index route
router.get("/", function(req,res){
  req.user
  //Get all campgrounds from DataBase
  Campground.find({}, function(err, allCampgrounds){
    if(err){
      console.log(err);
    } else {
      // req.user contains username and id of currently logged in user
      res.render("campgrounds/index",{campgrounds:allCampgrounds, currentUser: req.user});
    }
  });
});

//create route
router.post("/", middleware.isLoggedIn, function(req,res){
  //get data from form and add to campgrounds array
  var name = req.body.name;
  var price = req.body.price;
  var image = req.body.image;
  var desc = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username
  };
  var newCampground = {name: name, price: price, image: image, description: desc, author:author}
  //create new campground and save to DB
  Campground.create(newCampground, function(err, newlyCreated){
    if(err){
      console.log(err);
    }else{
      //redirect back to campgrounds page
      res.redirect("/campgrounds");
    }
  });
  
});

//new route shows form to create new campground
router.get("/new", middleware.isLoggedIn, function(req,res){
  res.render("campgrounds/new");
});

//show route- shows info about one dog
router.get("/:id",function(req,res){
  //find the campground with provided ID
  //populate comments on the campground and executiing it with .exec
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
    if(err){
      console.log(err);
    }else{
      //render show template with that campground
      res.render("campgrounds/show",{campground: foundCampground});
    }
  });
  
});

//EDIT Campground route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit", {campground: foundCampground});
    });
  });



//UPDATE Campground route
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
  //find and update the correct campground
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
    if(err){
      res.redirect("/campgrounds");
    } else{
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

//DESTROY Campground route
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
  Campground.findByIdAndRemove(req.params.id, function(err){
    if(err){
      res.redirect("/campgrounds");
    }else{
      res.redirect("/campgrounds");
    }
  });
});



module.exports = router;