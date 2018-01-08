const React = require('react');
const Link = require('react-router-dom').Link;
const Header = require('./Header');
const PollCardDEL = require('./PollCardDEL');
const style = require('../styles/userPolls_style');
/* the body cmponent with polls*/
class UserPolls extends React.Component {
   constructor(props) {
    super(props);
    this.handleCreatePoll = this.handleCreatePoll.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  
  handleCreatePoll(event) {
            // Get the modal
        var modal = document.getElementById('myModal');
        // Get the <span> element that closes the modal
        var span = document.getElementsByClassName("close")[0];
        modal.style.display = "block";
        // When the user clicks on <span> (x), close the modal
        span.onclick = function() {
            modal.style.display = "none";
        }
        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
  }
  
  handleSubmit(event) {
      alert("WORKS YEE");
    }
  
  render() {
      return (
        <div>
            <div className="body">
              <Header />
               <button type="button" className="btn btn-primary" onClick={this.handleCreatePoll}>Create new poll</button>
               <PollCardDEL name="custom poll"/>
            </div>     
              <div id="myModal" className="modal">
                   <div className="modal-content">
                   <form action="/create-new-poll" method="post" style={{"maxWidth":"100%"}} onSubmit={this.handleSubmit}>
                      <span className="close">&times;</span>
                      <h4>Name of new poll</h4>
                      <input type="text" name="nameOfNewPoll" placeholder="Do you like oranges?" required/>
                      <h4>Options of new poll</h4>
                      <input type="text" name="optionsOfNewPoll" placeholder="yes,no,IDK,maybe,it's disgusting" required/>
                      <button type="submit">create</button>
                    </form>
                    </div>

              </div>
          </div>
      );
  }
}

module.exports = UserPolls;