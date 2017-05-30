var node_ssh = require('node-ssh'),
    config = require('../../config/default.js'),
    crypto = require('./crypto.js');

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
                                .execCommand('unchained-deploy')
                                .then(result => {
                                    if (result.code === 0) {
                                        ssh.dispose();
                                        resolve({
                                            host: hostresult,
                                            command: result
                                        });
                                    } else {
                                        ssh.dispose();
                                        reject(result);
                                    }
                                })
                                .catch(err => {
                                    ssh.dispose();
                                    reject(err);
                                });
                        } else {
                            ssh.dispose();
                            reject(hostresult);
                        }
                    })
                    .catch(err => {
                        ssh.dispose();
                        reject(err);
                    });
            })
            .catch(err => {
                ssh.dispose();
                reject(err);
            });
    });
}

module.exports = {
    deployStaging,
    deployProduction
};
