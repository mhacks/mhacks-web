var Mailchimp = require('mailchimp-api-v3'),
    config = require('../../config/default.js'),
    mailchimp = new Mailchimp(config.mailchimp_token);

module.exports.ERRORS = {
    ALREADY_SUBSCRIBED: 'ALREADY_SUBSCRIBED',
    UNKNOWN: 'UNKNOWN_ERROR'
};

module.exports.subscribe = function(email, callback) {
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
        if (result.error_count > 0) {
            var message = result.errors[0].error;
            if (message.toLowerCase().indexOf('already a list member') != -1) {
                error = module.exports.ERRORS.ALREADY_SUBSCRIBED;
            } else {
                error = module.exports.ERRORS.UNKNOWN;
            }
        }
        callback(error, result);
    });
};