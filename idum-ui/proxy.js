var http = require('http');

var proxyConfiguration = {
    target: 'http://localhost:8088/',
    agent: http.globalAgent,
    autoRewrite: true,
    headers: {
        host: 'localhost',
        port: 8088
    }
};

module.exports = proxyConfiguration;