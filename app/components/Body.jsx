const React = require('react');
const Link = require('react-router-dom').Link;
const style = require('../styles/body_style');
const PollCard = require('./PollCard');
let polls;
/* the body cmponent with polls*/
class Body extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      polls: "Loading..."
    };
  }
  componentWillMount() {
    const that = this;
    const xhr = new XMLHttpRequest();

    xhr.open('post', '/get-polls', true);

    xhr.send();

    xhr.onreadystatechange = function() {
      if (this.readyState != 4) return;
      if (this.status != 200) {
        alert( 'error: ' + (this.status ? this.statusText : 'request has not been set') );
        return;
      }
      polls = JSON.parse(this.responseText);
      let setPolls  = polls.list.map((obj, i)  => {
         return <Link to={'/polls/'+ obj["_id"]} key={i}><PollCard name={obj.name}/></Link>;
      });
          that.setState({
          ["polls"]: setPolls
           });
    }
  }
  render() {
      return (
        <div className="body">
          {this.state.polls}
        </div>
      );
  }
}

module.exports = Body;