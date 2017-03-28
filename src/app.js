var http = require('http'),
    morgan = require('morgan'),
    express = require('express'),
    app = express(),
    swig = require('swig'),
    server = http.createServer(app),
    session = require('express-session'),
    bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', './views');
app.set('view cache', false);

app.use(express.static('public'));
app.use(session({
    secret: process.env.SECRET || 'mhacks',
    resave: true,
    saveUninitialized: true
}));

morgan.token('remote-addr', function(req, res) {
    return req.headers['x-forwarded-for'] || req.ip;
});

app.use(morgan("combined"));

swig.setDefaults({
    cache: false
});

server.listen(process.env.PORT || 3000);