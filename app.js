var http = require('http'),
    morgan = require('morgan'),
    express = require('express'),
    app = express(),
    server = http.createServer(app),
    session = require('express-session'),
    bodyParser = require('body-parser'),
    adminRouter = require('./server/routes/admin.js'),
    apiRouter = require('./server/routes/api.js'),
    indexRouter = require('./server/routes/index.js');

if (app.get('env') !== 'production') {
    var webpack = require('webpack'),
    webpackDevMiddleware = require('webpack-dev-middleware'),
    webpackHotMiddleware = require('webpack-hot-middleware'),
    webpackConfig = require('./webpack.dev.config'),
    webpackCompiler = webpack(webpackConfig);
}

morgan.token('remote-addr', function(req, res) {
    return req.headers['x-forwarded-for'] || req.ip;
});

app.use(morgan("combined"));

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.set('view engine', 'pug');
app.set('views', './server/views');
app.set('view cache', false);

if (app.get('env') !== 'production') {
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

app.use(session({
    secret: process.env.SECRET || 'mhacks',
    resave: true,
    saveUninitialized: true
}));

app.use(express.static('static'));

app.use('/', indexRouter);
app.use('/v1', apiRouter);
app.use('/admin', adminRouter);

server.listen(process.env.PORT || 3000);