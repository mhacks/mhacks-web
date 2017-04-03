module.exports = {
    secret: process.env.SECRET || 'mhacks',
    mongo_hostname: process.env.MONGO_HOSTNAME || 'mhacks_db',
    backend_db: process.env.BACKEND_DB || 'mhacks_backend',
    sessions_db: process.env.SESSIONS_DB || 'mhacks_sessions',
    api_work: process.env.APIWORK || false,
    server_port: process.env.PORT || 3000
};