const React = require('react');
const Link = require('react-router-dom').Link;
const Header = require('./Header');
const ProgressBar = require('react-bootstrap').ProgressBar;
const style = require('../styles/pollFrame_style');



/* the pollFrame component that shows the poll */
class PollFrame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "0",
      label: "loading...",
      container: "",
      value: "loading...",
      progressives: []
    };
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
  }
  
   handleChange(event) {
    this.setState({["value"]: event.target.value});
  }

handleSubmit(event) {
      let that = this;
      const xhr = new XMLHttpRequest();
      
      xhr.open('POST', '/update-poll', true);
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      
      
      let body = 'id=' + encodeURIComponent(this.state.id) +
      '&value=' + encodeURIComponent(this.state.value);


      xhr.send(body);

      xhr.onreadystatechange = function() {
        if (this.readyState != 4) return;
        if (this.status != 200) {
          alert( 'error: ' + (this.status ? this.statusText : 'request has not been set') );
          return;
        }
        let response = JSON.parse(this.responseText);
          if(response.error == "not") {
            alert("You've voted for " + that.state.value);
            document.location.reload(true);
          }
          else {
            alert("error");
          }
        }
      event.preventDefault();
     }
   componentWillMount() {
      let that = this;
      const xhr = new XMLHttpRequest();
      
      xhr.open('POST', '/get-poll', true);
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      
      
      let body = 'id=' + encodeURIComponent(this.props.match["url"].split("/")[2]);


      xhr.send(body);

      xhr.onreadystatechange = function() {
        if (this.readyState != 4) return;
        if (this.status != 200) {
          alert( 'error: ' + (this.status ? this.statusText : 'request has not been set') );
          return;
        }
        let response = JSON.parse(this.responseText);
        let options = [];
        let progressives = [];
        // calculate all options
        let num_options = 0;
        for(let i = 0; i < response.list["options"].length; i++) {
          num_options += response.list["options"][i][1];
        }
        for(let i = 0; i < response.list["options"].length; i++) {
          let perc = response.list["options"][i][1]/num_options;
          if(isNaN(perc)) perc = 0;
          options.push(<option value={response.list["options"][i][0]} key={"op"+i}>{response.list["options"][i][0]}</option>);
          progressives.push(
            <div key={"lp"+i}>
               <label className="label-text">{response.list["options"][i][0]+" ["+response.list["options"][i][1]+"]"}</label>
               <ProgressBar now={perc*100} label={`${response.list["options"][i][1]}`} />
            </div>
          );
        }
        that.setState({
          ["label"]: response.list["name"],
          ["id"]: that.props.match["url"].split("/")[2],
          ["container"]: options,
          ["value"]: response.list["options"][0][0],
          ["progressives"]: progressives
           });
        }
   }
  render() {
    return (
        <div>
            <Header/>
              <div id={"id"+this.state.id} className="frame">
                <form onSubmit={this.handleSubmit}>
                <label>
                  <h1 style={{"color":"#9aff2c"}}>{this.state.label}</h1>
                      <select value={this.state.value} onChange={this.handleChange}>
                     {this.state.container}
                      </select>
                </label>
                <input type="submit" value="Submit" style={{"backgroundColor":"#9aff2c"}}/>
                  {this.state.progressives}
              </form>  
            </div>
        </div>
    );
  }
}

module.exports = PollFrame;