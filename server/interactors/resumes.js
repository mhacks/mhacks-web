var AWS = require('aws-sdk'),
    config = require('../../config/default.js'),
    User = require('../db/model/User.js'),
    Responses = require('../responses/api/index.js'),
    Application = require('../db/model/Application.js'),
    fs = require('fs'),
    s3 = false,
    archiver = require('archiver');

if (config.AWS_ACCESS_KEY_ID && config.AWS_SECRET_ACCESS_KEY) {
    s3 = new AWS.S3({
        accessKeyId: config.AWS_ACCESS_KEY_ID,
        secretAccessKey: config.AWS_SECRET_ACCESS_KEY
    });
}

function downloadApplicationsZip(resolve, reject) {
    Application.find({})
        .exec()
        .then(applications => {
            User.find({})
                .exec()
                .then(users => {
                    var archive = archiver('zip', {
                        zlib: { level: 9 }
                    });

                    if (users.length === 0 || applications.length === 0) {
                        archive.finalize();
                    }

                    users.forEach(function(user, elem) {
                        applications.forEach(function(application) {
                            if (user.email === application.user) {
                                var fileName = application.resume
                                    .split('/')
                                    .pop(),
                                    fileEnding = fileName.split('.').pop();

                                if (
                                    fs.existsSync(
                                        fs.readFileSync(
                                            'build/uploads/resumes/' + fileName
                                        )
                                    )
                                ) {
                                    archive.append(
                                        fs.readFileSync(
                                            'build/uploads/resumes/' + fileName
                                        ),
                                        {
                                            name:
                                                'MHacks Resumes/' +
                                                    user.full_name +
                                                    '.' +
                                                    fileEnding
                                        }
                                    );
                                } else {
                                    reject(new Error(Responses.NOT_FOUND));
                                }
                            }
                        });

                        if (elem + 1 === users.length) {
                            archive.finalize();
                        }
                    });

                    resolve(archive);
                })
                .catch(err => {
                    reject(err);
                });
        })
        .catch(err => {
            reject(err);
        });
}

function downloadUsersZip(resolve, reject) {
    User.find({})
        .exec()
        .then(users => {
            var archive = archiver('zip', {
                zlib: { level: 9 }
            });

            if (users.length === 0) {
                archive.finalize();
            }

            users.forEach(function(user, elem) {
                var fileName = user.resume.split('/').pop(),
                    fileEnding = fileName.split('.').pop();

                if (
                    fs.existsSync(
                        fs.readFileSync('build/uploads/resumes/' + fileName)
                    )
                ) {
                    archive.append(
                        fs.readFileSync('build/uploads/resumes/' + fileName),
                        {
                            name:
                                'MHacks Resumes/' +
                                    user.full_name +
                                    '.' +
                                    fileEnding
                        }
                    );
                } else {
                    reject(new Error(Responses.NOT_FOUND));
                }

                if (elem + 1 === users.length) {
                    archive.finalize();
                }
            });

            resolve(archive);
        })
        .catch(err => {
            reject(err);
        });
}

function downloadS3ApplicationsZip(resolve, reject) {
    Application.find({})
        .exec()
        .then(applications => {
            User.find({})
                .exec()
                .then(users => {
                    var archive = archiver('zip', {
                        zlib: { level: 9 }
                    });

                    if (users.length === 0 || applications.length === 0) {
                        archive.finalize();
                    }

                    users.forEach(function(user, elem) {
                        applications.forEach(function(application) {
                            if (user.email === application.user) {
                                var fileName = application.resume
                                    .split('/')
                                    .pop(),
                                    fileEnding = fileName.split('.').pop();

                                var params = {
                                    Bucket: config.AWS_BUCKET_NAME,
                                    Key: 'resumes/' + fileName
                                };

                                var obj = s3.getObject(params);

                                obj
                                    .on('error', function(error) {
                                        reject(error);
                                    })
                                    .on('success', function(response) {
                                        archive.append(response.data.Body, {
                                            name:
                                                'MHacks Resumes/' +
                                                    user.full_name +
                                                    '.' +
                                                    fileEnding
                                        });

                                        if (elem + 1 === users.length) {
                                            archive.finalize();
                                        }
                                    });
                                obj.send();
                            }
                        });
                    });

                    resolve(archive);
                })
                .catch(err => {
                    reject(err);
                });
        })
        .catch(err => {
            reject(err);
        });
}

function downloadS3UsersZip(resolve, reject) {
    User.find({})
        .exec()
        .then(users => {
            var archive = archiver('zip', {
                zlib: { level: 9 }
            });

            if (users.length === 0) {
                archive.finalize();
            }

            users.forEach(function(user, elem) {
                var fileName = user.resume.split('/').pop(),
                    fileEnding = fileName.split('.').pop();

                var params = {
                    Bucket: config.AWS_BUCKET_NAME,
                    Key: 'resumes/' + fileName
                };

                var obj = s3.getObject(params);

                obj
                    .on('error', function(error) {
                        reject(error);
                    })
                    .on('success', function(response) {
                        archive.append(response.data.Body, {
                            name:
                                'MHacks Resumes/' +
                                    user.full_name +
                                    '.' +
                                    fileEnding
                        });

                        if (elem + 1 === users.length) {
                            archive.finalize();
                        }
                    });
                obj.send();
            });

            resolve(archive);
        })
        .catch(err => {
            reject(err);
        });
}

function downloadZip(applications) {
    return new Promise((resolve, reject) => {
        if (applications) {
            if (s3) {
                downloadS3ApplicationsZip(resolve, reject);
            } else {
                downloadApplicationsZip(resolve, reject);
            }
        } else {
            if (s3) {
                downloadS3UsersZip(resolve, reject);
            } else {
                downloadUsersZip(resolve, reject);
            }
        }
    });
}

module.exports = {
    downloadZip
};
