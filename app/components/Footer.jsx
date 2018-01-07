const React = require('react');
const Link = require('react-router-dom').Link;
const style = require('../styles/footer_style');


/* the footer cmponent with link on my VK */
const Footer = function() {
  return (
    <div className="footer">
      Created By <a href="https://vk.com/elias_37" target="blank" className="link">Elias</a>
    </div>
  );
}

module.exports = Footer;