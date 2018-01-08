const React = require('react');
const { render } = require('react-dom');
const Link = require('react-router-dom').Link;
const style = require('../styles/login_style');
const Header = require('./Header');


/* the login cmponent with form to log in */
class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      label: "Login Form"
    };
    
     this.handleInputChange = this.handleInputChange.bind(this);
     this.handleSubmit = this.handleSubmit.bind(this);
  }
  
    handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }
  
    handleSubmit(event) {
      let that = this;
      const xhr = new XMLHttpRequest();
      
      xhr.open('POST', '/login', true);
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      
      
      let body = 'email=' + encodeURIComponent(this.state.email) +
      '&password=' + encodeURIComponent(this.state.password);


      xhr.send(body);

      xhr.onreadystatechange = function() {
        if (this.readyState != 4) return;
        if (this.status != 200) {
          alert( 'error: ' + (this.status ? this.statusText : 'request has not been set') );
          return;
        }
        let response = JSON.parse(this.responseText);
        if(response.error == 0) {
        window.location = "https://voting-application.glitch.me";
           that.setState({
          ["label"]: "Succsess"
           });
        }
        else {
          that.setState({
          ["label"]: "Wrong email and/or password"
           });
         }
        }
      event.preventDefault();
     }
    
  
   render() {
  return (
    <div>
      <Header/>
      <div className="login">
        
        <h2>{this.state.label}</h2>
  
          <form method="post" action="/login" name="login" onSubmit={this.handleSubmit}>
            <div className="container">
              <label><b>Email</b></label>
              <input type="email" placeholder="Enter Email" name="email" required  onChange={this.handleInputChange}/>

              <label><b>Password</b></label>
              <input type="password" placeholder="Enter Password" name="password" required  onChange={this.handleInputChange}/>

              <div className="clearfix">
                <button type="submit" className="loginbtn">Log In</button>
              </div>
            </div>
          </form>
      </div>
    </div>
    );
  }
}


module.exports = Login;