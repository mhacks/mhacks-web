var AWS = require('aws-sdk'),
    multer = require('multer'),
    multerS3 = require('multer-s3'),
    config = require('../../config/default.js'),
    crypto = require('crypto'),
    User = require('../db/model/User.js'),
    fs = require('fs'),
    mkdirp = require('mkdirp');

module.exports = function(bucket_name, artifactOverride) {
    var multeropts;
    var directory = '';

    if (config.AWS_ACCESS_KEY_ID && config.AWS_SECRET_ACCESS_KEY) {
        var s3 = new AWS.S3({
            accessKeyId: config.AWS_ACCESS_KEY_ID,
            secretAccessKey: config.AWS_SECRET_ACCESS_KEY
        });

        multeropts = {
            storage: multerS3({
                s3: s3,
                acl: 'private',
                bucket: bucket_name,
                key: function(req, file, cb) {
                    if (req.authToken && !artifactOverride) {
                        User.find()
                            .byToken(req.authToken)
                            .exec()
                            .then(user => {
                                if (file.fieldname === 'resume') {
                                    directory = 'resumes';
                                }

                                if (file.fieldname === 'avatar') {
                                    directory = 'avatars';
                                }

                                if (file.fieldname === 'floor_image') {
                                    directory = 'floor_images';
                                }

                                if (!directory) {
                                    return cb(false, '');
                                }

                                var fileType = file.originalname
                                    .split('.')
                                    .pop();
                                var fileName =
                                    directory +
                                    '/' +
                                    crypto
                                        .createHash('sha512')
                                        .update(user.email + config.secret)
                                        .digest('hex') +
                                    '.' +
                                    fileType;

                                cb(null, fileName);
                            })
                            .catch(() => {
                                return cb(false, '');
                            });
                    } else if (artifactOverride) {
                        if (file.fieldname === 'resume') {
                            directory = 'resumes';
                        }

                        if (file.fieldname === 'avatar') {
                            directory = 'avatars';
                        }

                        if (file.fieldname === 'floor_image') {
                            directory = 'floor_images';
                        }

                        if (!directory) {
                            return cb(false, '');
                        }

                        var fileType = file.originalname.split('.').pop();
                        var fileName =
                            directory +
                            '/' +
                            crypto
                                .createHash('sha512')
                                .update(file.originalname + config.secret)
                                .digest('hex') +
                            '.' +
                            fileType;

                        cb(null, fileName);
                    } else {
                        return cb(false, '');
                    }
                }
            })
        };
    } else {
        multeropts = {
            storage: multer.diskStorage({
                destination: function(req, file, cb) {
                    if (file.fieldname === 'resume') {
                        directory = 'resumes';
                    }

                    if (file.fieldname === 'avatar') {
                        directory = 'avatars';
                    }

                    if (file.fieldname === 'floor_image') {
                        directory = 'floor_images';
                    }

                    if (!directory) {
                        return cb(false, '');
                    }

                    var fullDirectory = 'build/uploads/' + directory + '/';

                    if (!fs.existsSync(fullDirectory)) {
                        mkdirp.sync(fullDirectory);
                    }

                    cb(null, fullDirectory);
                },
                filename: function(req, file, cb) {
                    if (req.authToken && !artifactOverride) {
                        User.find()
                            .byToken(req.authToken)
                            .exec()
                            .then(user => {
                                var fileType = file.originalname
                                    .split('.')
                                    .pop();
                                var fileName =
                                    crypto
                                        .createHash('sha512')
                                        .update(user.email + config.secret)
                                        .digest('hex') +
                                    '.' +
                                    fileType;

                                cb(null, fileName);
                            })
                            .catch(() => {
                                return cb(false, '');
                            });
                    } else if (artifactOverride) {
                        if (file.fieldname === 'resume') {
                            directory = 'resumes';
                        }

                        if (file.fieldname === 'avatar') {
                            directory = 'avatars';
                        }

                        if (file.fieldname === 'floor_image') {
                            directory = 'floor_images';
                        }

                        if (!directory) {
                            return cb(false, '');
                        }

                        var fileType = file.originalname.split('.').pop();
                        var fileName =
                            directory +
                            '/' +
                            crypto
                                .createHash('sha512')
                                .update(file.originalname + config.secret)
                                .digest('hex') +
                            '.' +
                            fileType;

                        cb(null, fileName);
                    } else {
                        return cb(false, '');
                    }
                }
            })
        };
    }

    return multer(multeropts);
};
