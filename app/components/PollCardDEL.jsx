const React = require('react');
const Link = require('react-router-dom').Link;
const style = require('../styles/pollCardDEL_style');



/* the pollCard cmponent that shows the name of card to get the poll */
const PollCardDEL = function(props) {
  return (
    <div id={"id"+props.name} className="delPollCard">
      {props.name}
      <button className="buttonDNG"> delete </button>
    </div>
  );
}

module.exports = PollCardDEL;