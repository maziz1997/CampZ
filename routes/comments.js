// =========================
// Comments routes
// NEW campgrounds/:id/comments/new GET
// CREATE campgrounds/:id/comments   POST
// =========================

var express = require("express");
//merges the params together so we are able to access finding id
// in other files like ejs files
var router = express.Router({mergeParams: true});

var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");


// get route for comments
router.get("/new", middleware.isLoggedIn, function(req,res){
  // find campground by id
  Campground.findById(req.params.id, function(err, campground){
    if(err){
      console.log(err);
    }else{
      //since we have a new.ejs already for campgrounds we create two new 
      //directories in views called campgrounds and comments and create a new.ejs for comments route
      res.render("comments/new", {campground: campground});
    }
  });
});

// Create new comment

router.post("/", middleware.isLoggedIn, function(req,res){
  //lookup campground using ID
  Campground.findById(req.params.id, function(err, campground){
    if(err){
      req.flash("error", "Something went wrong");
      res.redirect("/campgrounds");
    } else{
      /* because we have comment[text], and comment[author] in views/comments/new
      we dont have to set a var = req.body.comment and just call it instead */
        Comment.create(req.body.comment, function(err, comment){
          if(err){
            console.log(err);
          }else{
            //add username and id to comment and save comment
            comment.author.id = req.user._id;
            comment.author.username = req.user.username;
            comment.save(); 
            campground.comments.push(comment);
            campground.save();
            req.flash("success", "Successfully added comment");
            res.redirect("/campgrounds/" + campground._id);
          }
        });
    }
  });
  //create new comment
  //connect new comment to campground
  //redirect to campground show page
});

//Comments EDIT Route
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
  Comment.findById(req.params.comment_id, function(err, foundComment){
    if(err){
      res.redirect("back");
    }else {
    res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
    }
  });
  
});

//COMMENT UPDATE ROUTE
// /campgrounds/:id/comments/:comment_id
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
    if(err){
      res.redirect("back");
    }else{
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

//Comment DESTROY ROUTE

router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
  //findbyid and remove
  Comment.findByIdAndRemove(req.params.comment_id, function(err){
    if(err){
      res.redirect("back");
    }else{
      req.flash("success", "Comment deleted");
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});


module.exports = router;
