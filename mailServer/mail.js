const {MailSlurp} = require('mailslurp-client');

const mailslurp = new MailSlurp({
  apiKey: "c7ca346df7277ebf0edfb1a905d7a4238c8c8321a55d433358c76ade57b58b62",
});

module.exports = {
  mailslurp,
};
