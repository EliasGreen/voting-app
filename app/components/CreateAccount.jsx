const React = require('react');
const { render } = require('react-dom');
const ReactTooltip = require('react-tooltip');
const Link = require('react-router-dom').Link;
const style = require('../styles/createAccount_style');
const Header = require('./Header');


/* the createAccount component with form to register in the app */
class CreateAccount extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      label: "Signup Form"
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
      if(this.state.password.length < 6 || this.state.password.length > 15 || this.state.email.length > 60) {
        alert("error: please, check the fields and then try again");
        event.preventDefault();
      }
      else {
          this.setState({
          ["label"]: "Succsess"
           });
      }
    }
  
   render() {
  return (
    <div>
      <Header/>
      <div className="createAccount">
        
        <h2>{this.state.label}</h2>
  
          <form method="post" action="/register" name="registration" onSubmit={this.handleSubmit}>
            <div className="container">
              <label><b>Email</b></label>
              <input type="email" placeholder="Enter Email" name="email" required  onChange={this.handleInputChange} data-tip data-event='focus' data-for='email_tooltip'/>
              
              <ReactTooltip id='email_tooltip' place="right" type="error" effect='solid'>
                <span>email length must be no more than 60 characters</span>
              </ReactTooltip>

              <label><b>Password</b></label>
              <input type="password" placeholder="Enter Password" name="password" required  onChange={this.handleInputChange}  data-tip data-event='focus' data-for='password_tooltip'/>
              
              <ReactTooltip id='password_tooltip' place="right" type="error" effect='solid'>
                <span>password length must be 6-15 characters</span>
              </ReactTooltip>

              <div className="clearfix">
                <button type="submit" className="signupbtn"  data-toggle="tooltip" title="Tooltip on top">Sign Up</button>
              </div>
            </div>
          </form>
      </div>
    </div>
    );
  }
}


module.exports = CreateAccount;