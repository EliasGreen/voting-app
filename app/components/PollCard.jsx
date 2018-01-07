const React = require('react');
const Link = require('react-router-dom').Link;
const style = require('../styles/pollCard_style');



/* the pollCard cmponent that shows the name of card to get the poll */
const PollCard = function(props) {
  return (
    <div id={"id"+props.name} className="pollCard">
      {props.name}
    </div>
  );
}

module.exports = PollCard;