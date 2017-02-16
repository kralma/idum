var PORT = 8000;

var gutil = require('gulp-util');
var express = require('express');
var fs = require('fs');
var app = module.exports.app = exports.app = express();
var magenta = gutil.colors.magenta;
var httpProxy = require('http-proxy');

var projectDir = process.cwd();

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

app.use('/img', express.static(projectDir + '/img'));
app.use('/lang', express.static(projectDir + '/lang'));
app.use('/fonts', express.static(projectDir + '/fonts'));

var proxy = httpProxy.createProxyServer(require(projectDir + '/proxy.js'));

proxy.on('error', function (err, req, res) {
    console.log("error");
});

app.start = function () {
    app.use('/dist', express.static(projectDir + '/dist'));

    app.all('/api*', function (req, res) {
        proxy.web(req, res);
    });

    app.get('/*', function (req, res) {
        var content, template;

        try {
            var templatePath = "app/index.html";
            template = fs.readFileSync(templatePath, {encoding: 'utf8'});
        } catch (e) {
            gutil.log('Server:' + magenta(e));
        }
        content = template;
        res.send(content);
    });

    app.listen(PORT);
    gutil.log('Clientside server listening on: ' + magenta('http://localhost:' + PORT));
};


