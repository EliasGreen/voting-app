const React = require('react');
const Link = require('react-router-dom').Link;
const style = require('../styles/body_style');
const PollCard = require('./PollCard');

/* the body cmponent with polls*/
const Body = function() {
  return (
    <div className="body">
      <PollCard name="lolik"/>
    </div>
  );
}

module.exports = Body;