var AWS = require('aws-sdk'),
    config = require('../../config/default.js'),
    User = require('../db/model/User.js'),
    Responses = require('../responses/api/index.js'),
    Application = require('../db/model/Application.js');

module.exports = function(email, type, application) {
    var s3 = new AWS.S3({
        accessKeyId: config.AWS_ACCESS_KEY_ID,
        secretAccessKey: config.AWS_SECRET_ACCESS_KEY
    });

    return new Promise((resolve, reject) => {
        if (application) {
            Application.findOne({ user: email })
                .exec()
                .then(application => {
                    if (type in application) {
                        var directory = '';
                        var url = application[type];
                        var fileName = url.split('/').pop();

                        if (type === 'resume') {
                            directory = 'resumes';
                        } else {
                            directory = 'avatars';
                        }

                        var params = {
                            Bucket: config.AWS_BUCKET_NAME,
                            Key: directory + '/' + fileName
                        };

                        var obj = s3.getObject(params);

                        obj
                            .on('error', function(error) {
                                reject(error);
                            })
                            .on('success', function(response) {
                                resolve([fileName, response]);
                            });

                        obj.send();
                    } else {
                        reject(new Error(Responses.INVALID_TYPE));
                    }
                })
                .catch(() => {
                    reject(new Error(Responses.INVALID_TYPE));
                });
        } else {
            User.find()
                .byEmail(email)
                .exec()
                .then(user => {
                    if (type in user) {
                        var directory = '';
                        var url = user[type];
                        var fileName = url.split('/').pop();

                        if (type === 'resume') {
                            directory = 'resumes';
                        } else {
                            directory = 'avatars';
                        }

                        var params = {
                            Bucket: config.AWS_BUCKET_NAME,
                            Key: directory + '/' + fileName
                        };

                        var obj = s3.getObject(params);

                        obj
                            .on('error', function(error) {
                                reject(error);
                            })
                            .on('success', function(response) {
                                resolve([fileName, response]);
                            });

                        obj.send();
                    } else {
                        reject(new Error(Responses.INVALID_TYPE));
                    }
                })
                .catch(() => {
                    reject(new Error(Responses.INVALID_TYPE));
                });
        }
    });
};
