module.exports = {
    host: process.env.HOST || 'https://mhacks.org',
    secret: process.env.SECRET || 'mhacks',
    mongo_hostname: process.env.MONGO_HOSTNAME || 'mhacks_db',
    backend_db: process.env.BACKEND_DB || 'mhacks_backend',
    sessions_db: process.env.SESSIONS_DB || 'mhacks_sessions',
    api_work: process.env.APIWORK || false,
    server_port: process.env.PORT || 3000,
    max_tokens: process.env.MAX_TOKENS || 10,
    socket_auth_timeout: process.env.socket_auth_timeout || 10000,
    mailchimp_token: process.env.MAILCHIMP_TOKEN || '',
    mailchimp_listid: process.env.MAILCHIMP_LISTID || 'd9245d6d34',
    mandrill_token: process.env.MANDRILL_TOKEN || '',
    email_from: process.env.EMAIL_FROM || 'hackathon@umich.edu',
    email_from_name: process.env.EMAIL_FROM_NAME || 'MHacks',
    confirmation_email_template: process.env.CONFIRMATION_EMAIL_TEMPLATE ||
        'confirmation_instructions',
    confirmation_email_subject: process.env.CONFIRMATION_EMAIL_SUBJECT ||
        'Confirm Your Email for MHacks',
    password_reset_email_template: process.env.PASSWORD_RESET_EMAIL_TEMPLATE ||
        'change_password',
    password_reset_email_subject: process.env.PASSWORD_RESEST_EMAIL_SUBJECT ||
        'Reset Your MHacks Password',
    deployment_secret: process.env.DEPLOYMENT_SECRET || 'some_secret',
    deployment_users: (process.env.DEPLOYMENT_USERS ||
        'antoniomika,konnor,roball')
        .split(','),
    deploy: {
        staging: {
            host: process.env.STAGING_HOST || 'staging0.aws.mhacks.org',
            user: process.env.STAGING_USER || 'core',
            privateKey: process.env.STAGING_PRIVATEKEY || ''
        },
        production: {
            host: process.env.PRODUCTION_HOST || 'prod0.aws.mhacks.org',
            user: process.env.PRODUCTION_USER || 'core',
            privateKey: process.env.PRODUCTION_PRIVATEKEY || ''
        }
    },
    slack_token: process.env.SLACK_TOKEN || '',
    slack_notifications_channel: process.env.SLACK_NOTIFICATIONS_CHANNEL ||
        '#notifications'
};
