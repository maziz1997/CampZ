const { Mongoose } = require('mongoose')

var     express = require('express'),
        app     = express(),
        body_parser = require('body-parser'),
        mongoose    = require("mongoose"),
        flash       = require("connect-flash"),
        passport    = require('passport'),
        LocalStrategy = require("passport-local"),
        methodOverride = require("method-override"),
        Campground  = require('./models/campground'),
        Comment     = require('./models/comment'),
        User        = require("./models/user");
        
        const{render } = require("ejs");

var commentRoutes     = require("./routes/comments");
var campgroundRoutes  = require("./routes/campgrounds");
var indexRoutes        = require("./routes/index");




mongoose.connect("mongodb://localhost/CampZ", {useUnifiedTopology: true, useNewUrlParser: true});
app.use(body_parser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
//tell express to serve our public directory
app.use(express.static(__dirname + "/public"));
app.use(methodOverride(".method"));
app.use(flash()); //has to come before passport config 

//Passport CONFIGURATION

app.use(require("express-session")({
  secret: "This is our secret",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//create our own middleware since currentUser cant be tracked
// in header.ejs since its only defined in campground page
app.use(function(req, res, next){
  // req.user will be either empty if no user or display name of user
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");

  next();
});

//tells our app to use all 3 of those apps required
app.use(indexRoutes);
//this /campgrounds allows us to shorten our url for code
//and set everywhere we say /campgrounds to just /
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

// ====== //
// ROOT ROUTE(homepage) //
app.get("/", function(req,res){
  res.render("landing");
});

var port = process.env.PORT || 3000;

app.listen(port,function(){
  console.log("Server has Started!");
});




