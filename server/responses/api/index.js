var authResponses = require('./auth.js'),
    emailResponses = require('./email.js'),
    applicationResponse = require('./deploy.js'),
    deployResponse = require('./deploy.js');

var Responses = {
    METHOD_NOT_ALLOWED: 'Method not allowed',
    UNKNOWN_ERROR: 'An unknown error occurred. Get in contact at hackathon@umich.edu',
    MISSING_CONFIG: 'The configuration is missing necessary values',
    NOT_FOUND: 'Not found',
    INVALID_TYPE: 'Invalid type.',
    MISSING_PARAMETERS: 'Missing some required fields'
};

Responses.Auth = authResponses;
Responses.Email = emailResponses;
Responses.Deploy = deployResponse;
Responses.Application = applicationResponse;

module.exports = Responses;
