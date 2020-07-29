//all the middleware goes here
//call it index.js because then we we require it other places
//it knows cause index.js is considered the home 
//so we can just do require("../middleware")
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middlewareObj = {};

//Middleware to check campground ownership
middlewareObj.checkCampgroundOwnership = function(req, res, next) {
    // is user logged in?
    if(req.isAuthenticated()){
    
    Campground.findById(req.params.id, function(err, foundCampground){
      if(err){
        req.flash("error","Campground not found");
        res.redirect("back");
      }else{
        //does user own the campground
        // cant do foundcampground === to req.user since its an object to string
        //so we use built in mongoose equals method
        if(foundCampground.author.id.equals(req.user._id)) {
          next();
        } else{
          req.flash("error","You don't have permission to do that");
          res.redirect("back");
        }
      }
    });
    } else{
      req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

//Middleware to check comment ownership
middlewareObj.checkCommentOwnership = function(req, res, next) {
  // is user logged in?
  if(req.isAuthenticated()){
    
    Comment.findById(req.params.comment_id, function(err, foundComment){
      if(err){
        res.redirect("back");
      }else{
        //does user own the comment?
        if(foundComment.author.id.equals(req.user._id)) {
          next();
        } else{
          req.flash("error", " You don't have permission to do that");
          res.redirect("back");
        }
      }
    });
    } else{
      req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

//middleware to check if user is logged in or not 
//Middleware is Logged in

middlewareObj.isLoggedIn = function(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  //first step error please login first then go to routes/index.js for step 2
  req.flash("error", "You need to be logged in to do that!");
  res.redirect("/login");
}


module.exports = middlewareObj
