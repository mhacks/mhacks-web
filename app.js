var config = require('./config/default.js');

if (config.newrelic_enabled) {
    require('newrelic');
    require('@newrelic/native-metrics');
}

var http = require('http'),
    mongoose = require('./server/db/index.js'),
    morgan = require('morgan'),
    express = require('express'),
    app = express(),
    server = http.createServer(app),
    io = require('socket.io')(server, {wsEngine: 'uws'}),
    session = require('express-session'),
    bodyParser = require('body-parser'),
    MongoStore = require('connect-mongo')(session),
    csrf = require('csurf'),
    csrfProtection = csrf(),
    apiRouter = require('./server/routes/api.js'),
    indexRouter = require('./server/routes/index.js'),
    shortenerRouter = require('./server/routes/shortener.js'),
    sharedsession = require('express-socket.io-session');

// Force https
app.use(function(req, res, next) {
    if (!req.secure && req.get('x-forwarded-proto') !== 'https' && app.get('env') !== 'development') {
        if (config.service === 'shortener') {
            return res.redirect(config.shortener_host + req.url);
        } else {
            return res.redirect(config.host + req.url);
        }
    }
    next();
});

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

// Pretty API Responses
app.set('json spaces', 4);

// Initialize session
var sessionStore = new MongoStore({
    url: 'mongodb://' + config.mongo_hostname + '/' + config.sessions_db
});

var sessionMiddleware = session({
    secret: config.secret,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: config.token_expiration * 24 * 60 * 60 * 1000
    }
});

app.use(sessionMiddleware);

io.use(sharedsession(sessionMiddleware, {
    autoSave: true
}));

// Set an xsrf-token for the session if it's enabled
app.use(function(req, res, next) {
    if (req.csrfToken) {
        res.cookie('xsrf-token', req.csrfToken());
    }

    return next();
});

// Other route middleware (modules in `routes/`)
if (config.service === 'shortener') {
    app.use('/', shortenerRouter);
} else {
    app.use('/', indexRouter);
    app.use('/v1', apiRouter);

    // Intiialize development webpack (hot reloading, etc);
    if (app.get('env') !== 'production' && !config.api_work) {
        var webpack = require('webpack'),
            webpackDevMiddleware = require('webpack-dev-middleware'),
            webpackHotMiddleware = require('webpack-hot-middleware'),
            historyApiFallback = require('connect-history-api-fallback'),
            webpackConfig = require('./webpack.dev.config'),
            webpackCompiler = webpack(webpackConfig),
            webpackMiddlewareInstance = webpackDevMiddleware(webpackCompiler, {
                publicPath: webpackConfig.output.publicPath,
                stats: {
                    colors: true
                }
            });

        app.use(webpackMiddlewareInstance);
        app.use(historyApiFallback());
        app.use(webpackMiddlewareInstance);

        app.use(webpackHotMiddleware(webpackCompiler, {
            log: console.log
        }));
    } else {
        // Static files middleware
        app.use(express.static('build'));

        app.use(function(req, res, next) {
            res.sendFile(__dirname + '/build/index.html');
        });
    }
}

var ioHandler = require('./server/socketio/index.js')(io);

// Now we start the server
server.listen(config.server_port);
