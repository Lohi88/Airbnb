if(process.env.NODE_ENV !="production")
{
  require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const ExpressError = require("./utils/ExpressError");
const session = require("express-session");
const MongoStore=require("connect-mongo");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js")


const store=MongoStore.create({
  mongoUrl:process.env.MONGO_URL,
  crypto:{
    secret:process.env.SECRET,
  },
  touchAfter:24*3600,
});

store.on("error",()=>
{
  console.log("ERROR in MONGO SESSION STORE",err);
})
// Session options
const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // secure: true, // Enable this in production with HTTPS
    maxAge: 1000 * 60 * 60 * 24,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24) // 1 day
  }
};



// Routes
const reviewRouter = require("./routes/review.js");
const listingRouter = require("./routes/listing.js");
const userRouter=require("./routes/user.js");

// Connect to MongoDB
main()
  .then(() => {
    console.log("✅ Connected to DB");
  })
  .catch(err => {
    console.error("❌ DB connection error:", err);
  });

async function main() {
  await mongoose.connect(process.env.MONGO_URL);
}

// View engine and middlewares
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));


// Enable session middleware
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>
{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.currUser=req.user;
  next();
});



// Routes
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/",userRouter);


// 404 handler
app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

// Global error handler
app.use((err, req, res, next) => {
  const statusCode = Number(err.statusCode) || 500;
  res.status(statusCode).render("error", { err });
});

// Start server
app.listen(8080, () => {
  console.log("🚀 Server is running on port 8080");
});
