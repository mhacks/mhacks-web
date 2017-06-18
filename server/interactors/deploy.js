var node_ssh = require('node-ssh'),
    config = require('../../config/default.js'),
    crypto = require('./crypto.js');

function stagingDamageReport() {
    var host = config.deploy.staging.host;
    var user = config.deploy.staging.user;
    var privateKey = config.deploy.staging.privateKey;

    return damageReport(host, user, privateKey);
}

function productionDamageReport() {
    var host = config.deploy.production.host;
    var user = config.deploy.production.user;
    var privateKey = config.deploy.production.privateKey;

    return damageReport(host, user, privateKey);
}

function deployStaging() {
    var host = config.deploy.staging.host;
    var user = config.deploy.staging.user;
    var privateKey = config.deploy.staging.privateKey;

    return deploy(host, user, privateKey);
}

function deployProduction() {
    var host = config.deploy.production.host;
    var user = config.deploy.production.user;
    var privateKey = config.deploy.production.privateKey;

    return deploy(host, user, privateKey);
}

function damageReport(host, user, privateKey) {
    return new Promise((resolve, reject) => {
        var ssh = new node_ssh();

        ssh
            .connect({
                host: host,
                username: user,
                privateKey: new Buffer(
                    crypto.decrypt(privateKey),
                    'base64'
                ).toString('ascii')
            })
            .then(() => {
                ssh
                    .execCommand('hostname')
                    .then(hostresult => {
                        if (hostresult.code === 0) {
                            ssh
                                .execCommand('/opt/bin/unchained-damage-report')
                                .then(result => {
                                    if (result.code === 0) {
                                        ssh.dispose();
                                        resolve({
                                            host: hostresult,
                                            command: result
                                        });
                                    } else {
                                        ssh.dispose();
                                        reject({
                                            host: hostresult,
                                            command: result
                                        });
                                    }
                                })
                                .catch(err => {
                                    ssh.dispose();
                                    reject({
                                        host: hostresult,
                                        command: err
                                    });
                                });
                        } else {
                            ssh.dispose();
                            reject({
                                host: hostresult,
                                command: {}
                            });
                        }
                    })
                    .catch(err => {
                        ssh.dispose();
                        reject({
                            host: err,
                            command: {}
                        });
                    });
            })
            .catch(err => {
                ssh.dispose();
                reject({
                    host: err,
                    command: {}
                });
            });
    });
}

function deploy(host, user, privateKey) {
    return new Promise((resolve, reject) => {
        var ssh = new node_ssh();

        ssh
            .connect({
                host: host,
                username: user,
                privateKey: new Buffer(
                    crypto.decrypt(privateKey),
                    'base64'
                ).toString('ascii')
            })
            .then(() => {
                ssh
                    .execCommand('hostname')
                    .then(hostresult => {
                        if (hostresult.code === 0) {
                            ssh
                                .execCommand('/opt/bin/unchained-deploy')
                                .then(result => {
                                    if (result.code === 0) {
                                        ssh.dispose();
                                        resolve({
                                            host: hostresult,
                                            command: result
                                        });
                                    } else {
                                        ssh.dispose();
                                        reject({
                                            host: hostresult,
                                            command: result
                                        });
                                    }
                                })
                                .catch(err => {
                                    ssh.dispose();
                                    reject({
                                        host: hostresult,
                                        command: err
                                    });
                                });
                        } else {
                            ssh.dispose();
                            reject({
                                host: hostresult,
                                command: {}
                            });
                        }
                    })
                    .catch(err => {
                        ssh.dispose();
                        reject({
                            host: err,
                            command: {}
                        });
                    });
            })
            .catch(err => {
                ssh.dispose();
                reject({
                    host: err,
                    command: {}
                });
            });
    });
}

function formatResponse(result) {
    var response = '';
    for (var command in result) {
        if (result[command].stdout) {
            response += result[command].stdout;
        }

        if (result[command].stderr) {
            response += result[command].stderr;
        }

        response += '\n';
    }

    return response;
}

module.exports = {
    stagingDamageReport,
    productionDamageReport,
    deployStaging,
    deployProduction,
    formatResponse
};
