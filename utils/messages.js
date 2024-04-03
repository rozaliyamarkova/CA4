/* This file is a curtesy to Traversy Media's tutorial (https://www.youtube.com/watch?v=jD7FnbI76Hg).*/
const moment = require('moment');

function formatMessage(username, text) {
  return {
    username,
    text,
    // How can I make this do 24 hours?
    time: moment().format('h:mm a'),
  };
}

module.exports = formatMessage;