var config = require('../../config/default.js'),
    newrelic = false;

if (config.newrelic_enabled) {
    newrelic = require('newrelic');
    require('@newrelic/native-metrics');
}

var noticeError = function(error, params) {
    if (newrelic) {
        return newrelic.noticeError(error, params);
    }
    return false;
};

var setIgnoreTransaction = function(ignored) {
    if (newrelic) {
        return newrelic.setIgnoreTransaction(ignored);
    }
    return false;
};

var addCustomParameter = function(name, value) {
    if (newrelic) {
        return newrelic.addCustomParameter(name, value);
    }
    return false;
};

var addCustomParameters = function(params) {
    if (newrelic) {
        return newrelic.addCustomParameters(params);
    }
    return false;
};

var setTransactionName = function(name) {
    if (newrelic) {
        return newrelic.setTransactionName(name);
    }
    return false;
};

var setControllerName = function(name, action) {
    if (newrelic) {
        return newrelic.setControllerName(name, action);
    }
    return false;
};

module.exports = {
    noticeError,
    setIgnoreTransaction,
    addCustomParameter,
    addCustomParameters,
    setTransactionName,
    setControllerName
};
