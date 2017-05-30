var authResponses = require('./auth.js'),
    emailResponses = require('./email.js'),
    deployResponse = require('./deploy.js');

var Responses = {
    METHOD_NOT_ALLOWED: 'Method not allowed',
    UNKNOWN_ERROR: 'An unknown error occurred. Get in contact at hackathon@umich.edu',
    MISSING_CONFIG: 'The configuration is missing necessary values'
};

Responses.Auth = authResponses;
Responses.Email = emailResponses;
Responses.Deploy = deployResponse;

module.exports = Responses;
