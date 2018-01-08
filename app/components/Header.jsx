const React = require('react');
const Link = require('react-router-dom').Link;
const style = require('../styles/header_style');
let isLogedIn;
let LogDiv, IndPollsDiv;

/* the header cmponent with 3 "buttons" - HOME, CREATE ACCOUNT, LOG IN */

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      LogDiv: "",
      IndPollsDiv: ""
    };
    this.handleLogOut = this.handleLogOut.bind(this);
  }
  handleLogOut(event) {
    let doLogOut = confirm("Are you sure that you want to logout?");
    if(doLogOut === true) {
      const xhr = new XMLHttpRequest();

      xhr.open('POST', '/logout', true);

      xhr.send();

      xhr.onreadystatechange = function() {
        if (this.readyState != 4) return;
        if (this.status != 200) {
          alert( 'error: ' + (this.status ? this.statusText : 'request has not been set') );
          return;
        }
        let response = JSON.parse(this.responseText);
        if(response.error == 0) {
          window.location = "https://voting-application.glitch.me";
        }
      }
    }
  }
  componentWillMount() {
    const that = this;
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
      if(isLogedIn) {
        LogDiv = <div style={{ float: "left", "marginLeft": 10, cursor:"pointer" }} className="icon link" onClick={that.handleLogOut}>LOG OUT</div>;
        IndPollsDiv = <Link to='/user-polls' className="link"><div style={{ float: "right", cursor:"pointer" }} className="icon">YOUR POLLS</div></Link>;;
      }
      else {
        LogDiv = <Link to='/login' className="link"><div style={{ float: "left", "marginLeft": 10, cursor:"pointer" }} className="icon">LOG IN</div></Link>;
        IndPollsDiv = "";
      }
      that.setState({
          ["LogDiv"]: LogDiv,
          ["IndPollsDiv"]: IndPollsDiv
           });
    }
  }
  render() {
    return (
      <div style={{ height: 40, width: "100%", background: "black", padding: 10, color: "white", position: "fixed"}} className="header">
        <Link to='/' className="link"><div style={{ float: "left", cursor:"pointer"}} className="main-label">\VoTe\_\APP\</div></Link>
        <Link to='/' className="link"><div style={{ float: "left", "marginLeft": 595, cursor:"pointer" }} className="icon">HOME</div></Link>
        <Link to='/create-account' className="link"><div style={{ float: "left", "marginLeft": 10, cursor:"pointer" }} className="icon">CREATE NEW ACCOUNT</div></Link>
        {this.state.LogDiv}
        {this.state.IndPollsDiv}
      </div>
    );
  }
}

module.exports = Header;