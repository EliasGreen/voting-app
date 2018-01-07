const React = require('react');
const Link = require('react-router-dom').Link
const Header = require('./Header');
const Footer = require('./Footer');
const Body = require('./Body');

/* the main page for the index route of this app */
const Main = function() {
  return (
    <div>
      <Header/>
      <Body/>
      <Footer/>
    </div>
  );
};

module.exports = Main;