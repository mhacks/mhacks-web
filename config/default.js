module.exports = {
    host: process.env.HOST || 'https://mhacks.org',
    secret: process.env.SECRET || 'mhacks',
    mongo_hostname: process.env.MONGO_HOSTNAME || 'mhacks_db',
    backend_db: process.env.BACKEND_DB || 'mhacks_backend',
    sessions_db: process.env.SESSIONS_DB || 'mhacks_sessions',
    api_work: process.env.APIWORK || false,
    server_port: process.env.PORT || 3000,
    max_tokens: process.env.MAX_TOKENS || 10,
    mailchimp_token: process.env.MAILCHIMP_TOKEN || '',
    mailchimp_listid: process.env.MAILCHIMP_LISTID || 'd9245d6d34',
    mandrill_token: process.env.MANDRILL_TOKEN || '',
    email_from: process.env.EMAIL_FROM || 'hackathon@umich.edu',
    email_from_name: process.env.EMAIL_FROM_NAME || 'MHacks',
    confirmation_email_template: process.env.CONFIRMATION_EMAIL_TEMPLATE || 'confirmation_instructions',
    confirmation_email_subject: process.env.CONFIRMATION_EMAIL_SUBJECT || 'Confirm Your Email for MHacks',
    password_reset_email_template: process.env.PASSWORD_RESET_EMAIL_TEMPLATE || 'change_password',
    password_reset_email_subject: process.env.PASSWORD_RESEST_EMAIL_SUBJECT || 'Reset Your MHacks Password'
};