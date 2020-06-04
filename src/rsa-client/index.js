var http = require('http');
var nodeRSA = require('node-rsa');
var key;
var message = "My Secret Message";
var encrypedMessage;

var callback = function(response) {
    var str = '';

    //another chunk of data has been recieved, so append it to `str`
    response.on('data', function(chunk) {
        str += chunk;
    });

    //the whole response has been recieved, so we just print it out here
    response.on('end', function() {
        console.log("CALLBACK: " + str);
    });
};

http.get({
    hostname: 'localhost',
    port: 3000,
    path: '/getPubKey',
    agent: false  // Create a new agent just for this one request
    }, (res) => {
        res.on('data', function (keyBuffer) {

            key = nodeRSA("" + keyBuffer, 'pkcs8-public-pem');
            encrypedMessage = key.encrypt(message, 'base64');

            var bodyString = JSON.stringify({
                encrypted: encrypedMessage
            });

            var options = {
                hostname: 'localhost',
                port: 3000,
                path: '/message',
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': bodyString.length
                }
            };

            http.request(options, callback).write(bodyString);
        });
    });