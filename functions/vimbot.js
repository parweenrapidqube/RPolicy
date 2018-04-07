var botBuilder = require('claudia-bot-builder')

module.exports = botBuilder(function (message) {
    console.log('got text', message.text)
    console.log('full request', JSON.stringify(message.origionalRequest))

    return 'Thanks for Sending' + message.text + '! ' +
          'Your message is very important to us'
});