var Mailchimp = require('mailchimp-api-v3'),
    config = require('../../config/default.js'),
    Responses = require('../responses/api/email');

var Errors = {
    ALREADY_SUBSCRIBED: 'ALREADY_SUBSCRIBED',
    MISSING_CONFIG: 'MISSING_CONFIG',
    UNKNOWN: 'UNKNOWN_ERROR'
};

function subscribe(email, callback) {
    if (!config.mailchimp_token || !config.mailchimp_listid) {
        callback(Errors.MISSING_CONFIG);
        return;
    }

    var mailchimp = new Mailchimp(config.mailchimp_token);

    mailchimp.post({
        path: '/lists/' + config.mailchimp_listid,
        body: {
            members: [
                {
                    email_address: email,
                    status: 'subscribed'
                }
            ]
        }
    }, function(err, result) {
        var error = null;
        if (result.errors.length > 0) {
            var message = result.errors[0].error;
            if (message.toLowerCase().indexOf('already a list member') != -1) {
                error = Errors.ALREADY_SUBSCRIBED;
            } else {
                error = Errors.ERRORS.UNKNOWN;
            }
        }
        callback(error, result);
    });
};

module.exports = {
    subscribe,
    Errors
}
