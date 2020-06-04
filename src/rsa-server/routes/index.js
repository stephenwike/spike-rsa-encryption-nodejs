var express = require('express');
var router = express.Router();

// Create public/private key pair.
var nodeRSA = require('node-rsa');
var key = nodeRSA({b: 2048});
key.generateKeyPair(2048);

// Export public key.
var pub = key.exportKey('pkcs8-public-pem');

/* GET PUBLIC KEY */
router.get('/getPubKey', function(req, res, next) {
  res.send(pub);
  res.end();
});

/* PUT ENCRYPTED MESSAGE - GET DECRYPTED MESSAGE */
router.put('/message', function(req, res, next) {
  var decrypted = key.decrypt(req.body.encrypted, 'utf8');
  res.send(decrypted);
  res.end();
})

module.exports = router;
