const React = require('react');
const Link = require('react-router-dom').Link;
const Header = require('./Header');
const PollCardDEL = require('./PollCardDEL');
const style = require('../styles/userPolls_style');
/* the body cmponent with polls*/
class UserPolls extends React.Component {
   constructor(props) {
    super(props);
     this.state = {
      container: "loading...",
      value: "zero"
    };
    this.handleCreatePoll = this.handleCreatePoll.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  
  handleCreatePoll(event) {
        var modal = document.getElementById('myModal');
        var span = document.getElementsByClassName("close")[0];
        modal.style.display = "block";
        span.onclick = function() {
            modal.style.display = "none";
        }
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
  }
     componentWillMount() {
      let that = this;
      const xhr = new XMLHttpRequest();
      
      xhr.open('POST', '/get-user-polls', true);
      xhr.send();

      xhr.onreadystatechange = function() {
        if (this.readyState != 4) return;
        if (this.status != 200) {
          alert( 'error: ' + (this.status ? this.statusText : 'request has not been set') );
          return;
        }
          let response = JSON.parse(this.responseText);
          console.log(response.user);
          let setPolls  = response.user.map((obj, i)  => {
          return <Link to={'/polls/'+ obj["_id"]} key={i}><PollCardDEL name={obj.name} id={obj["_id"]}/></Link>;
          });
          that.setState({
            ["container"]: setPolls
             });
        }
   }
  handleSubmit(event) {
    }
  
  render() {
      return (
        <div>
            <div className="body">
              <Header />
               <button type="button" className="btn btn-primary" onClick={this.handleCreatePoll}>Create new poll</button>
              {this.state.container}
            </div>     
              <div id="myModal" className="modal">
                   <div className="modal-content">
                   <form action="/create-new-poll" method="post" style={{"maxWidth":"100%"}} onSubmit={this.handleSubmit}>
                      <span className="close">&times;</span>
                      <h4 style={{"color":"#a8d43f"}}>Name of new poll</h4>
                      <input type="text" name="nameOfNewPoll" placeholder="Do you like oranges?" required/>
                      <h4 style={{"color":"#a8d43f"}}>Options of new poll</h4>
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