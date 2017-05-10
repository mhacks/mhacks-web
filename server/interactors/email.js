var Mailchimp = require('mailchimp-api-v3'),
    config = require('../../config/default.js'),
    Responses = require('../responses/api/email');

var Errors = {
    ALREADY_SUBSCRIBED: 'ALREADY_SUBSCRIBED',
    MISSING_CONFIG: 'MISSING_CONFIG',
    UNKNOWN: 'UNKNOWN_ERROR'
};

function subscribe(email) {
    return new Promise((resolve, reject) => {
        if (!config.mailchimp_token || !config.mailchimp_listid) {
            reject(Errors.MISSING_CONFIG);
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
        }).then((result) => {
            // mailchimp-api-v3 module resolves on all 200 HTTP status codes
            // so must check for errors here as well
            if (result.errors.length > 0) {
                var message = result.errors[0].error;
                var error = null;

                if (message.toLowerCase().indexOf('already a list member') != -1) {
                    error = Errors.ALREADY_SUBSCRIBED;
                } else {
                    error = Errors.UNKNOWN;
                }

                reject(error);
            } else {
                resolve(result);
            }
        }).catch((err) => {
            console.error(err);

            reject(Errors.UNKNOWN);
        });
    });
}

module.exports = {
    subscribe,
    Errors
}
