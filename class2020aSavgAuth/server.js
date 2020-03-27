// server.js
// setting up the variables and using require to pull the packages that will help us connect to the browser?
// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080; //localhost url, able to change if need be
const MongoClient = require('mongodb').MongoClient
//server node modules. In order to run
var mongoose = require('mongoose'); //Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.
var passport = require('passport');//Passport is authentication middleware for Node. js.
var flash    = require('connect-flash');//FlashJS is JavaScript graphics and game development engine with API similar to Flash one

var morgan       = require('morgan');//Morgan: is another HTTP request logger middleware for Node. js.
var cookieParser = require('cookie-parser');//cookie-parser is a middleware which parses cookies attached to the client request object.
// bodyParser allows us to select only the information that we want to grab

var bodyParser   = require('body-parser');
// In order to get access to the post data we have to use body-parser. Basically what the body-parser is which allows express to read the body and then parse that into a Json object that we can understand.
var session      = require('express-session');

var configDB = require('./config/database.js'); // this is the file you need to go to connect to your own personal server

var db

// configuration ===============================================================
mongoose.connect(configDB.url, (err, database) => { // .connect is a method used for mongoDB to connect to your database
  if (err) return console.log(err)
  db = database
  require('./app/routes.js')(app, passport, db);
}); // connect to our database

//app.listen(port, () => {
    // MongoClient.connect(configDB.url, { useNewUrlParser: true }, (error, client) => {
    //     if(error) {
    //         throw error;
    //     }
    //     db = client.db(configDB.dbName);
    //     console.log("Connected to `" + configDB.dbName + "`!");
    //     require('./app/routes.js')(app, passport, db);
    // });
//});

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({
    secret: 'rcbootcamp2019a', // session secret
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


// routes ======================================================================
//require('./app/routes.js')(app, passport, db); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);
