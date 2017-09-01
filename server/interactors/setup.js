var config = require('../../config/default.js'),
    User = require('../db/model/User.js'),
    Scan = require('../db/model/Scan.js'),
    Configuration = require('../db/model/Configuration.js');

Configuration.find({})
    .exec()
    .then(configurations => {
        if (configurations.length < 1) {
            Configuration.create({
                app_name: config.app_name,
                start_date: config.start_date,
                end_date: config.end_date,
                is_live_page_enabled: config.is_live_page_enabled,
                is_application_open: config.is_application_open
            })
                .then(configuration => {
                    console.log(
                        'Created initial configuration:',
                        configuration
                    );
                })
                .catch(err => {
                    console.error('Error creating initial configuration', err);
                });
        }
    });

setTimeout(function() {
    User.find()
        .byEmail(config.admin_email)
        .exec()
        .then(user => {
            if (!user) {
                User.create({
                    full_name: config.admin_name,
                    email: config.admin_email,
                    email_verified: true,
                    password: config.admin_password
                })
                    .then(user => {
                        user.addGroup('admin');
                        console.log('Created initial user:', user);

                        Scan.find()
                            .byType('registration')
                            .exec()
                            .then(scan => {
                                if (!scan) {
                                    Scan.create({
                                        type: 'registration',
                                        name: 'Registration',
                                        creator: user,
                                        notes: 'The registration event',
                                        public: true,
                                        auth_groups: ['admin', 'scanner']
                                    })
                                        .then(scan => {
                                            console.log(
                                                'Created initial scan type "registration":',
                                                scan
                                            );
                                        })
                                        .catch(err => {
                                            console.error(
                                                'Error creating scan type "registration":',
                                                err
                                            );
                                        });
                                }
                            });
                    })
                    .catch(err => {
                        console.error('Error creating initial user', err);
                    });
            }
        });
}, 2000);
