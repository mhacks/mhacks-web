var http = require('http'),
    mongoose = require('./server/db/index.js'),
    morgan = require('morgan'),
    express = require('express'),
    app = express(),
    server = http.createServer(app),
    session = require('express-session'),
    bodyParser = require('body-parser'),
    MongoStore = require('connect-mongo')(session),
    csrf = require('csurf'),
    csrfProtection = csrf(),
    adminRouter = require('./server/routes/admin.js'),
    apiRouter = require('./server/routes/api.js'),
    indexRouter = require('./server/routes/index.js'),
    config = require('./config/default.js');

// Logging
morgan.token('remote-addr', function(req, res) {
    return req.headers['x-forwarded-for'] || req.ip;
});
app.use(morgan('combined'));

// Request parsers
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// Server side views (if used)
app.set('view engine', 'pug');
app.set('views', './server/views');
app.set('view cache', false);

// Initialize session
var sessionStore = new MongoStore({
    url: 'mongodb://' + config.mongo_hostname + '/' + config.sessions_db
});

app.use(session({
    secret: config.secret,
    store: sessionStore,
    resave: false,
    saveUninitialized: false
}));

// Set an xsrf-token for the session if it's enabled
app.use(function(req, res, next) {
    if (req.csrfToken) {
        res.cookie('xsrf-token', req.csrfToken());
    }

    return next();
});

// Intiialize development webpack (hot reloading, etc);
if (app.get('env') !== 'production' && !config.api_work) {
    var webpack = require('webpack'),
    webpackDevMiddleware = require('webpack-dev-middleware'),
    webpackHotMiddleware = require('webpack-hot-middleware'),
    webpackConfig = require('./webpack.dev.config'),
    webpackCompiler = webpack(webpackConfig);

    app.use(webpackDevMiddleware(webpackCompiler, {
        publicPath: webpackConfig.output.publicPath,
        stats: {
            colors: true
        }
    }));

    app.use(webpackHotMiddleware(webpackCompiler, {
        log: console.log
    }));
}

// Static files middleware
app.use(express.static('build'));

// Other route middleware (modules in `routes/`)
app.use('/', indexRouter);
app.use('/v1', apiRouter);
app.use('/admin', adminRouter);

app.use(function(req, res, next) {
    res.sendFile(__dirname + '/build/index.html');
});

// Now we start the server
server.listen(config.server_port);