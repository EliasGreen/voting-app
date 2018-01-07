const React = require('react');
const { render } = require('react-dom');

// router
const Route = require('react-router-dom').Route;
const BrowserRouter = require('react-router-dom').BrowserRouter;
const hashHistory = require('react-router-dom').hashHistory;

// redux
const { createStore } = require('redux');
const { Provider } = require('react-redux');
const votes = require('./reducers');

let store = createStore(votes);
// variable to check user LogedIn
let isLogedIn;
/* Import Components */
const Main = require('./components/Main');
const Login = require('./components/Login');
const CreateAccount = require('./components/CreateAccount');

// send GET request to check if user is Loged in
console.log("main component");
const xhr = new XMLHttpRequest();

    xhr.open('GET', '/islogedin', true);

    xhr.send();

    xhr.onreadystatechange = function() {
      if (this.readyState != 4) return;
      if (this.status != 200) {
        alert( 'error: ' + (this.status ? this.statusText : 'request has not been set') );
        return;
      }
      isLogedIn = JSON.parse(this.responseText).isLogedIn;
      console.log(isLogedIn);
    }
// render the app
      render((
        <Provider store={store}>
          <BrowserRouter>
            <div>
              <Route exact path="/" component={Main}/>
              <Route path="/login" component={Login}/>
              <Route path="/create-account" component={CreateAccount}/>
            </div>
          </BrowserRouter>
        </Provider>), document.getElementById('main'));
