var config = require('../../../config/default.js'),
    elasticsearch = require('elasticsearch'),
    client = new elasticsearch.Client({
        host: config.es_hostname + ':9200',
        log: 'trace'
    });

module.exports = client;
