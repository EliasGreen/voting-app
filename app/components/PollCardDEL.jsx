const React = require('react');
const Link = require('react-router-dom').Link;
const style = require('../styles/pollCardDEL_style');



/* the pollCard cmponent that shows the name of card to get the poll */
class PollCardDEL extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.id
    };
    this.handleClick = this.handleClick.bind(this);
  }
  
  handleClick(event) {
    let doDelete = confirm("Are you sure that you want to delete this poll?");
    if(doDelete === true) {
    let that = this;
      const xhr = new XMLHttpRequest();
      
      xhr.open('POST', '/delete-poll', true);
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      
      
      let body = 'id=' + encodeURIComponent(this.state.id);


      xhr.send(body);

      xhr.onreadystatechange = function() {
        if (this.readyState != 4) return;
        if (this.status != 200) {
          alert( 'error: ' + (this.status ? this.statusText : 'request has not been set') );
          return;
        }
        let response = JSON.parse(this.responseText);
        location.reload(true);
        }
    }
    event.preventDefault();  
  }
  
  render() {
      return (
        <div>
          <div id={"id"+this.props.name} className="delPollCard">
            {this.props.name}
        </div>    
        <button className="buttonDNG" onClick={this.handleClick}> delete </button>
       </div>
      );
  }
}

module.exports = PollCardDEL;