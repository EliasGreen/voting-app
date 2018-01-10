const React = require('react');
const { render } = require('react-dom');

// router
const Route = require('react-router-dom').Route;
const BrowserRouter = require('react-router-dom').BrowserRouter;
const hashHistory = require('react-router-dom').hashHistory;



// variable to check user LogedIn
let isLogedIn;
/* Import Components */
const Main = require('./components/Main');
const Login = require('./components/Login');
const CreateAccount = require('./components/CreateAccount');
const UserPolls = require('./components/UserPolls');
const PollFrame = require('./components/PollFrame');

// render the app
      render((
          <BrowserRouter>
            <div>
              <Route exact path="/" component={Main}/>
              <Route path="/login" component={Login}/>
              <Route path="/create-account" component={CreateAccount}/>
              <Route path="/user-polls" component={UserPolls}/>
              <Route path="/polls/:unic" component={PollFrame}/>
            </div>
          </BrowserRouter>
   ), document.getElementById('main'));
