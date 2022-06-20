var Mailchimp = require('mailchimp-api-v3'),
    config = require('../../config/default.js'),
    Mandrill = require('mandrill-api/mandrill');

var Errors = {
    ALREADY_SUBSCRIBED: 'ALREADY_SUBSCRIBED',
    MISSING_CONFIG: 'MISSING_CONFIG',
    UNKNOWN: 'UNKNOWN_ERROR'
};

const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: 'mhacks.org',
  key: process.env.MAILGUN_API_KEY || 'key-3c4f7813f2541f7b7ac2774aa91a6b1c',
  public_key: process.env.MAILGUN_PUBLIC_KEY || 'pubkey-e705b491e75108109796e42bdc6565a2'
});


function subscribe(email) {
    return new Promise((resolve, reject) => {
        if (!config.mailchimp_token || !config.mailchimp_listid) {
            reject(Errors.MISSING_CONFIG);
            return;
        }

        var mailchimp = new Mailchimp(config.mailchimp_token);

        mailchimp
            .post({
                path: '/lists/' + config.mailchimp_listid,
                body: {
                    members: [
                        {
                            email_address: email,
                            status: 'subscribed'
                        }
                    ]
                }
            })
            .then(result => {
                // mailchimp-api-v3 module resolves on all 200 HTTP status codes
                // so must check for errors here as well
                if (result.errors.length > 0) {
                    var message = result.errors[0].error;
                    var error = null;

                    if (
                        message
                            .toLowerCase()
                            .indexOf('already a list member') != -1
                    ) {
                        error = Errors.ALREADY_SUBSCRIBED;
                    } else {
                        error = Errors.UNKNOWN;
                    }

                    reject(error);
                } else {
                    resolve(result);
                }
            })
            .catch(err => {
                console.error(err);

                reject(Errors.UNKNOWN);
            });
    });
}

function sendEmailTemplate(
    template_name,
    template_content,
    subject,
    to_email,
    from_email,
    from_name
) {
    return new Promise((resolve, reject) => {
      var DOMAIN = 'mhacks.org';
      var api_key = 'key-3c4f7813f2541f7b7ac2774aa91a6b1c';
      var mailgun = require('mailgun-js')({ apiKey: api_key, domain: DOMAIN });

      console.log(template_content);

      var data = {
        from: from_email,
        to: to_email,
        subject: subject,
        html: template_content,
      };

      mailgun.messages().send(data, function (error, body) {
        console.log(body);
        if(error)
        {
          reject(error);
        }
        else
        {
          resolve(body);
        }
      });


      /*
      mg.messages.create('mhacks.org', {
          from: from_email,
          to: to_email,
          subject: subject,
          text: template_content,
        })
        .then(msg => {
            console.log(msg);
            resolve(msg);
          }) // logs response data
        .catch(err => {
            console.log(err);
            reject(err);
          }); // logs any error

          mg.messages.sendTemplate
          */

        /*
        if (!config.mandrill_token) {
            reject(Errors.MISSING_CONFIG);
            return;
        }

        var mandrill = new Mandrill.Mandrill(config.mandrill_token);

        var content_array = [];
        for (var i in template_content) {
            content_array.push({ name: i, content: template_content[i] });
        }

        var message = {
            subject: subject,
            from_email: from_email,
            from_name: from_name,
            to: [
                {
                    email: to_email
                }
            ],
            global_merge_vars: content_array
        };

        mandrill.messages.sendTemplate(
            {
                template_name: template_name,
                template_content: content_array,
                message: message
            },
            function(result) {
                resolve(result);
            },
            function(error) {
                reject(error);
            }
        );
        */
    });
}

module.exports = {
    subscribe,
    sendEmailTemplate,
    Errors
};
