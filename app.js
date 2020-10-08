require("dotenv").config();

const express       = require("express"),
      bodyParser    = require("body-parser"),
      methodOveride = require("method-override"),
      session       = require("client-sessions"),
      passport      = require("passport"),
      LocalStrategy = require("passport-local"),
      User          = require("./models/User"),
      mongoose      = require("mongoose");

const app = express();

//db connection
mongoose.connect(process.env.DBURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})
.then(console.log("DB Connected."))
.catch(err => console.log(err));
    
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(methodOveride("_method"));

app.use(session({
    cookieName: "session",
    secret: process.env.CK_SECRET,
    duration: 60 * 60 * 1000,
    cookie: {
        httpOnly: true,
        ephemeral: true
    }
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});

app.use(express.static(__dirname + "/public"));

//routes
const indexRoute = require(__dirname + "/routes");
const postsRoute = require(__dirname + "/routes/posts");

app.use("/", indexRoute);
app.use("/posts", postsRoute);

app.listen(process.env.PORT, () => {
    console.log(`running at ${process.env.PORT}`);
});