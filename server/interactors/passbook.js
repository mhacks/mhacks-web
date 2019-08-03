const { join } = require('path'),
    sharp = require('sharp'),
    { Template, constants } = require('@destinationstransfers/passkit'),
    config = require('../../config/default.js'),
    User = require('../db/model/User.js'),
    Application = require('../db/model/Application.js'),
    Confirmation = require('../db/model/Confirmation.js');

let template = null;

if (config.passbook.enabled) {
    template = new Template('eventTicket', {
        passTypeIdentifier: config.passbook.pass_type,
        teamIdentifier: config.passbook.team_id,
        organizationName: config.passbook.organization_name,
        backgroundColor: hexToRgb(config.color_dark, true),
        foregroundColor: hexToRgb(config.color_light, true),
        labelColor: config.passbook.label_color,
        associatedStoreIdentifiers: [config.passbook.store_identifier]
    });

    template.loadCertificate(
        join(
            config.passbook.directory,
            (config.passbook.pass_type + '.pem').replace('pass.', '')
        ),
        config.passbook.secret
    );

    sharp(config.passbook.logo_url)
        .resize(160)
        .toBuffer()
        .then(data => {
            template.images.add('icon', data);
            template.images.add('logo', data);
        });
}

function createPass(email) {
    return new Promise((resolve, reject) => {
        if (template) {
            User.find()
                .byEmail(email)
                .then(user => {
                    if (user) {
                        Application.find()
                            .byUser(user)
                            .then(application => {
                                if (
                                    application &&
                                    application.status === 'accepted'
                                ) {
                                    Confirmation.findOne({
                                        user: user
                                    }).then(confirmation => {
                                        if (confirmation) {
                                            var pass = template.createPass({
                                                serialNumber: email,
                                                description:
                                                    config.passbook.description
                                            });

                                            pass.headerFields.add({
                                                key: 'date',
                                                label: 'Date',
                                                value: config.passbook.date,
                                                textAlignment:
                                                    constants.textDirection
                                                        .RIGHT
                                            });

                                            pass.barcodes = [
                                                {
                                                    message: email,
                                                    format:
                                                        constants.barcodeFormat
                                                            .QR,
                                                    messageEncoding:
                                                        'iso-8859-1'
                                                }
                                            ];

                                            pass.beacons = [
                                                {
                                                    proximityUUID:
                                                        config.passbook.beacon,
                                                    relevantText:
                                                        config.passbook
                                                            .beacon_text,
                                                    name:
                                                        config.passbook
                                                            .organization_name
                                                }
                                            ];

                                            pass.primaryFields.add({
                                                key: 'name',
                                                label: 'HACKER',
                                                value: user.full_name
                                            });
                                            pass.backFields.add({
                                                key: 'name',
                                                label: 'NAME',
                                                value: user.full_name
                                            });
                                            pass.backFields.add({
                                                key: 'email',
                                                label: 'EMAIL',
                                                value: user.email
                                            });

                                            pass.secondaryFields.add({
                                                key: 'school',
                                                label: 'SCHOOL',
                                                value: application.university
                                            });
                                            pass.backFields.add({
                                                key: 'school',
                                                label: 'SCHOOL',
                                                value: application.university
                                            });

                                            pass.auxiliaryFields.add({
                                                key: 'minor',
                                                label: 'MINOR',
                                                value: isMinor(
                                                    application.birthday
                                                )
                                                    ? 'YES'
                                                    : 'NO'
                                            });
                                            pass.backFields.add({
                                                key: 'minor',
                                                label: 'MINOR',
                                                value: isMinor(
                                                    application.birthday
                                                )
                                                    ? 'YES'
                                                    : 'NO'
                                            });

                                            pass.backFields.add({
                                                key: 'tshirt',
                                                label: 'T-SHIRT SIZE',
                                                value: application.tshirt.toUpperCase()
                                            });

                                            config.passbook.locations.forEach(
                                                function(location) {
                                                    pass.addLocation(
                                                        location,
                                                        location.text
                                                    );
                                                }
                                            );

                                            resolve(pass);
                                        } else {
                                            reject(404);
                                        }
                                    });
                                } else {
                                    reject(404);
                                }
                            });
                    } else {
                        reject(404);
                    }
                });
        } else {
            resolve(null);
        }
    });
}

function isMinor(birthdate) {
    const now = new Date();
    const birth = new Date(birthdate);

    var age = now.getFullYear() - birth.getFullYear();
    const ageMonth = now.getMonth() - birth.getMonth();
    const ageDay = now.getDate() - birth.getDate();

    if (ageMonth < 0 || (ageMonth === 0 && ageDay < 0)) {
        age = parseInt(age) - 1;
    }

    return age < 18;
}

function hexToRgb(hex, stringRep) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    var returnData = result
        ? {
              r: parseInt(result[1], 16),
              g: parseInt(result[2], 16),
              b: parseInt(result[3], 16)
          }
        : null;

    if (stringRep && returnData) {
        return (
            'rgb(' +
            returnData.r +
            ', ' +
            returnData.g +
            ', ' +
            returnData.b +
            ')'
        );
    }

    return returnData;
}

module.exports = {
    createPass
};
