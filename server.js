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
// set store
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
// set USEs for app
/******************************/
app.use( bodyParser.json() );   
app.use(bodyParser.urlencoded({ 
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
// mongoDB models and schemas
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
// handle pages
/******************************/
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
   // prevent USER POLLS page from "get by not authenticated user"
  else if(request.path == "/user-polls" && request.isAuthenticated() === false) {
    response.redirect("/login");
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
/******************************/
// POST METHODS
/******************************/
app.post("/login", function(request, response) {
            userModel.find({ email: request.body["email"]}, function (err, document) {
              if(!err) {
                if(document.length == 0) {
                  response.json({"error": "error0"});
                }
                else if(document.length == 1) {
                bcrypt.compare(request.body["password"], document[0]["password"], function(err, res) {
                if(res === true) {
                let user_id = document[0]["id"];
                request.login(user_id, () => {
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
/************************************************/
/************************************************/
app.post("/create-new-poll", (request, response) => {
  let options = request.body["optionsOfNewPoll"].split(",");
  let optionsToSend = [];
  for(let i = 0; i < options.length; i++) {
    optionsToSend.push([options[i], 0]);
  }
        let obj = {name: request.body["nameOfNewPoll"], options: optionsToSend};
        let poll = new pollModel(obj);
        poll.save(function (err) {
          if (!err) console.log('Success!');
        });
            userModel.find({_id: request.session.passport.user}, function (err, document) {
              if(!err) {
                if(document.length == 0) {
                  response.json({"error": "document has not been found"});
                }
                else if(document.length == 1) {
                      document[0].polls.push(poll);
                      document[0].save(function (err, document) {
                           if (!err) response.redirect("/user-polls");
                     });            
                }
            }
        });
});
/************************************************/
/************************************************/
/************************************************/
app.post("/get-polls", (request, response) => {
     pollModel.find({}, (err, listOfPolls) => {
       response.json({list: listOfPolls});
     });
});
/************************************************/
/************************************************/
/************************************************/
app.post("/get-user-polls", (request, response) => {
     userModel.find({_id: request.session.passport.user}, (err, user) => {
       response.json({user: user[0].polls});
     });
});
/************************************************/
/************************************************/
/************************************************/
app.post("/update-poll", (request, response) => {
  let error_mes = "yes";
    pollModel.findById(request.body["id"], (err, poll) => {
      
     let findPoll = (element, index, array) => {
          if(element.name == poll.name) {
            return element;
          }
        }
      let findOption = (element, index, array) => {
          if(element[0] == request.body["value"]) {
            return element;
          }
        }
      
          userModel.find({"polls.name": poll.name}, (err, user) => {
            let ind = user[0].polls.findIndex(findPoll);
           user[0].polls[ind].options[user[0].polls[ind].options.findIndex(findOption)][1] += 1;
            //updating
          userModel.findOneAndUpdate({_id: user[0]["_id"]}, user[0], (err, doc) => {
                  if(!err) {
                    error_mes = "not";
                  }
                });
            pollModel.findOneAndUpdate({name: poll.name}, user[0].polls[ind], (err, doc) => {
                  if(!err) {
                    error_mes = "not";
                    response.json({error: error_mes});
                  }
                });
                });
     });
});
/************************************************/
/************************************************/
/************************************************/
app.post("/delete-poll", (request, response) => {
  // console.log(request.body["id"]);
  // response.json({resp: "test"});
  pollModel.findById(request.body["id"], (err, poll) => {
      
     let findPoll = (element, index, array) => {
          if(element.name == poll.name) {
            return element;
          }
        }
      let findOption = (element, index, array) => {
          if(element[0] == request.body["value"]) {
            return element;
          }
        }
      
          userModel.find({"polls.name": poll.name}, (err, user) => {
            let ind = user[0].polls.findIndex(findPoll);
           user[0].polls.splice(ind, 1);
            //updating
          userModel.findOneAndUpdate({_id: user[0]["_id"]}, user[0], (err, doc) => {
                  if(!err) {
                    console.log("suc!0");
                  }
                });
            pollModel.remove({name: poll.name}, (err, doc) => {
                  if(!err) {
                    console.log("suc!1");
                    response.json({error: "nouuu"});
                  }
                });
                });
     });
});
/************************************************/
/************************************************/
/************************************************/
app.post("/get-poll", (request, response) => {
     pollModel.findById(request.body["id"], (err, poll) => {
       response.json({list: poll});
     });
});
/************************************************/
/************************************************/
/************************************************/
app.post("/logout", function(request, response) {
          request.logout();
          request.session.destroy(function(err) {
           response.status(200).clearCookie('connect.sid', {path: '/'}).json({error: 0});
          })
    });
/******************************/
// user sessions handlers:
/******************************/
passport.serializeUser(function(user_id, done) {
  done(null, user_id);
});
passport.deserializeUser(function(user_id, done) {
    done(null, user_id);
});
function checkAuthentication(req,res,next){
    if(req.isAuthenticated()){
        next();
    } else{
        res.redirect("/login");
    }
}
/************************************************/
// app listener
const listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
