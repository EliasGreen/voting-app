// server.js

// init project
const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
// body-parser
const bodyParser = require('body-parser');
// cookie-parser
const cookieParser = require('cookie-parser');
// passport
const passport = require('passport');
// bcrypt - hashing passwords
const bcrypt = require('bcrypt');
const saltRounds = 10;
// session
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
// assert
const assert = require('assert');
//require/import the mongodb native drivers
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
// using Node.js `require()`
const mongoose = require('mongoose');
// connection URL
const url = process.env.MONGOLAB_URI;      
// connection
const promise_connection = mongoose.connect(url, {
	useMongoClient: true
});
let db = mongoose.connection;
/******************************/
// set the store for sessions
/******************************/
let store = new MongoDBStore(
      {
        uri: url,
        collection: "sessions"
      });
 // Catch errors
    store.on('error', function(error) {
      assert.ifError(error);
      assert.ok(false);
    });
/******************************/
// set USEs for Application
/******************************/
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
/***/
app.use(cookieParser())
/***/
app.use(session({
  secret: process.env.COOKIE_SECRET,
  cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
      },
  store: store,
  resave: false,
  saveUninitialized: false
  //cookie: { secure: true }
}));
/***/
app.use(passport.initialize());
app.use(passport.session());
/***/
app.use(express.static('public'));
/******************************/
// if connection is success
promise_connection.then(function(db){
	console.log('Connected to mongodb');
});
// describe the schema
let Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
let userSet = new Schema({
    email: String,
    password: String,
    polls: []
});
let pollSchema = new Schema({
    name: String,
    options: []
});
// get the model
let userModel = mongoose.model('users', userSet);
let pollModel = mongoose.model('polls', pollSchema);
/******************************/
// main page
app.get("*", function(request, response) {
  //console.log(request.session);
  if(request.path == "/islogedin") {
     console.log("islogedin get");
     response.json({"isLogedIn": request.isAuthenticated() });
  }
  // prevent LOGIN page from "get by authenticated user"
  else if(request.path == "/login" && request.isAuthenticated() === true) {
    response.send("ERROR: you are already authenticated");
  }
        else {
  response.sendFile(__dirname + '/app/index.html');
}
});
// handle registration method
app.post("/register", function(request, response) {
  //hash password
  bcrypt.hash(request.body["password"], saltRounds, function(err, hash) {
   // create a user
        let obj = {email: request.body["email"], password: hash, polls: []};
        var user = new userModel(obj);
        user.save(function (err) {
          if (!err) console.log('Success!');
  // login after registration
            userModel.find({ email: request.body["email"], password: hash}, function (err, document) {
              if(!err) {
                let user_id = document[0]["id"];
                request.login(user_id, () => {
                  // send to user main page
                     response.redirect("/");
                });
              }
            });
        });
    });
});
/************************************************/
// handle login method
app.post("/login", function(request, response) {
  // login after registration
            userModel.find({ email: request.body["email"]}, function (err, document) {
              if(!err) {
                // if document has NOT been found
                if(document.length == 0) {
                  response.json({"error": "error0"});
                }
                // if document has been found
                else if(document.length == 1) {
                bcrypt.compare(request.body["password"], document[0]["password"], function(err, res) {
                if(res === true) {
                let user_id = document[0]["id"];
                request.login(user_id, () => {
                  // send to user main page
                     response.json({"error": 0});
                           });
                        }
                  else if(res === false) {
                    response.json({"error": "error1"});
                    console.log(request.body["password"]);
                    console.log(document[0]["password"]);
                  }
                   });
                }
            }
        });
    });
/************************************************/
app.post("/create-new-poll", (request, response) => {
  //response.json({id: request.session.passport.user});
  let options = request.body["optionsOfNewPoll"].split(",");
  let optionsToSend = [];
  for(let i = 0; i < options.length; i++) {
    optionsToSend.push([options[i], 0]);
  }
  // create a poll in POLLS collection
        let obj = {name: request.body["nameOfNewPoll"], options: optionsToSend};
        let poll = new pollModel(obj);
        poll.save(function (err) {
          if (!err) console.log('Success!');
        });
  // create a poll in user polls in USERS collection
            userModel.find({_id: request.session.passport.user}, function (err, document) {
              if(!err) {
                // if document has NOT been found
                if(document.length == 0) {
                  response.json({"error": "document has not been found"});
                }
                // if document has been found
                else if(document.length == 1) {
                  //console.log(document);
                      document[0].polls.push(poll);
                      document[0].save(function (err, document) {
                           if (!err) response.send(document);
                     });            
                 // response.send(document);
                }
            }
        });
 // response.send(request.body["nameOfNewPoll"] + " AND " + options.length);
});
/************************************************/
// handle logout method
app.post("/logout", function(request, response) {
  // logout on click on btn Logout
          request.logout();
          request.session.destroy(function(err) {
           response.status(200).clearCookie('connect.sid', {path: '/'}).json({error: 0});
          })
    });
// global login methods
passport.serializeUser(function(user_id, done) {
  done(null, user_id);
});
passport.deserializeUser(function(user_id, done) {
    done(null, user_id);
});
// check is a user Loged In
function checkAuthentication(req,res,next){
    if(req.isAuthenticated()){
        //if user is looged in, req.isAuthenticated() will return true 
        next();
    } else{
        res.redirect("/login");
    }
}
// listen for requests
const listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
