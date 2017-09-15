var AWS = require('aws-sdk'),
    config = require('../../config/default.js'),
    User = require('../db/model/User.js'),
    Responses = require('../responses/api/index.js'),
    Application = require('../db/model/Application.js'),
    fs = require('fs');

module.exports = function(email, type, application, artifactOverride, url) {
    return new Promise((resolve, reject) => {
        var s3 = false,
            directory = '',
            params,
            obj;

        if (type === 'resume') {
            directory = 'resumes';
        } else if (type === 'floor_image') {
            directory = 'floor_images';
        } else {
            directory = 'avatars';
        }

        if (config.AWS_ACCESS_KEY_ID && config.AWS_SECRET_ACCESS_KEY) {
            s3 = new AWS.S3({
                accessKeyId: config.AWS_ACCESS_KEY_ID,
                secretAccessKey: config.AWS_SECRET_ACCESS_KEY
            });
        }

        if (!artifactOverride && !url) {
            User.find()
                .byEmail(email)
                .exec()
                .then(user => {
                    if (user) {
                        if (application) {
                            Application.findOne({ user: email })
                                .exec()
                                .then(application => {
                                    if (type in application) {
                                        var url = application[type] || '';
                                        var fileName = url.split('/').pop();
                                        var extension = fileName
                                            .split('.')
                                            .pop();

                                        if (s3) {
                                            var params = {
                                                Bucket: config.AWS_BUCKET_NAME,
                                                Key: directory + '/' + fileName
                                            };

                                            var obj = s3.getObject(params);

                                            obj
                                                .on('error', function(error) {
                                                    reject(error);
                                                })
                                                .on('success', function(
                                                    response
                                                ) {
                                                    resolve([
                                                        user.full_name +
                                                            '.' +
                                                            extension,
                                                        response,
                                                        fileName
                                                    ]);
                                                });
                                            obj.send();
                                        } else {
                                            if (
                                                fs.existsSync(
                                                    'build/uploads/' +
                                                        directory +
                                                        '/' +
                                                        fileName
                                                )
                                            ) {
                                                resolve([
                                                    user.full_name +
                                                        '.' +
                                                        extension,
                                                    {
                                                        data: {
                                                            Body: fs.readFileSync(
                                                                'build/uploads/' +
                                                                    directory +
                                                                    '/' +
                                                                    fileName
                                                            )
                                                        }
                                                    },
                                                    fileName
                                                ]);
                                            } else {
                                                reject(
                                                    new Error(
                                                        Responses.NOT_FOUND
                                                    )
                                                );
                                            }
                                        }
                                    } else {
                                        reject(
                                            new Error(Responses.INVALID_TYPE)
                                        );
                                    }
                                })
                                .catch(err => {
                                    reject(err);
                                });
                        } else {
                            if (type in user) {
                                var url = user[type] || '';
                                var fileName = url.split('/').pop();
                                var extension = fileName.split('.').pop();

                                params = {
                                    Bucket: config.AWS_BUCKET_NAME,
                                    Key: directory + '/' + fileName
                                };

                                if (s3) {
                                    obj = s3.getObject(params);

                                    obj
                                        .on('error', function(error) {
                                            reject(error);
                                        })
                                        .on('success', function(response) {
                                            resolve([fileName, response]);
                                        });

                                    obj.send();
                                } else {
                                    if (
                                        fs.existsSync(
                                            'build/uploads/' +
                                                directory +
                                                '/' +
                                                fileName
                                        )
                                    ) {
                                        resolve([
                                            user.full_name + '.' + extension,
                                            {
                                                data: {
                                                    Body: fs.readFileSync(
                                                        'build/uploads/' +
                                                            directory +
                                                            '/' +
                                                            fileName
                                                    )
                                                }
                                            },
                                            fileName
                                        ]);
                                    } else {
                                        reject(new Error(Responses.NOT_FOUND));
                                    }
                                }
                            } else {
                                reject(new Error(Responses.INVALID_TYPE));
                            }
                        }
                    } else {
                        reject(new Error(Responses.INVALID_TYPE));
                    }
                })
                .catch(err => {
                    reject(err);
                });
        } else if (artifactOverride) {
            if (s3) {
                params = {
                    Bucket: config.AWS_BUCKET_NAME,
                    Key: directory + '/' + artifactOverride
                };

                obj = s3.getObject(params);

                obj
                    .on('error', function(error) {
                        reject(error);
                    })
                    .on('success', function(response) {
                        resolve([artifactOverride, response, email]);
                    });
                obj.send();
            } else {
                if (
                    fs.existsSync(
                        'build/uploads/' + directory + '/' + artifactOverride
                    )
                ) {
                    resolve([
                        artifactOverride,
                        {
                            data: {
                                Body: fs.readFileSync(
                                    'build/uploads/' +
                                        directory +
                                        '/' +
                                        artifactOverride
                                )
                            }
                        },
                        email
                    ]);
                } else {
                    reject(new Error(Responses.NOT_FOUND));
                }
            }
        } else if (url) {
            if (s3) {
                params = {
                    Bucket: config.AWS_BUCKET_NAME,
                    Key: directory + '/' + artifactOverride
                };

                var matches = url.match(
                    /https:\/\/(.*)\.s3\.amazonaws\.com\/(.*)\/(.*)/
                );

                if (matches && matches.length === 4) {
                    params.Key = matches.slice(2, 4).join('/');
                    params.Bucket = matches[1];
                }

                obj = s3.getObject(params);

                obj
                    .on('error', function(error) {
                        reject(error);
                    })
                    .on('success', function(response) {
                        resolve([matches[matches.length - 1], response, email]);
                    });
                obj.send();
            } else {
                var splitUrl = url.split('/'),
                    fileName = splitUrl.pop();
                directory = splitUrl.pop();
                if (
                    fs.existsSync('build/uploads/' + directory + '/' + fileName)
                ) {
                    resolve([
                        fileName,
                        {
                            data: {
                                Body: fs.readFileSync(
                                    'build/uploads/' +
                                        directory +
                                        '/' +
                                        fileName
                                )
                            }
                        },
                        email
                    ]);
                } else {
                    reject(new Error(Responses.NOT_FOUND));
                }
            }
        }
    });
};
