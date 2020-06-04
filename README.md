# RSA Encryption Example using node-rsa

This project is an example how I used node-rsa within server-client architecture.

Note: This is for learning purposes only, and not made for production.

Note: Project is public and open to comments.

## Requirements

* Nodejs installed.

## How it works:

1) Server Creates a public private key pair before starting express server.

```
// routes/index.js
// Create public/private key pair.
var nodeRSA = require('node-rsa');
var key = nodeRSA({b: 2048});
key.generateKeyPair(2048);
```

2) Client calls the server to retrieve the public key.

`(GET) http://localhost:3000/getPubKey`

3) Server Responds with the public key.

```
// routes/index.js
// Export public key.
var pub = key.exportKey('pkcs8-public-pem');
```

4) Client encrypts the message with public key and sends the encrypted message as json as a payload to the server.

```
// index.js
key = nodeRSA("" + keyBuffer, 'pkcs8-public-pem');
encrypedMessage = key.encrypt(message, 'base64');
```

`(PUT) http://localhost:3000/message`

5) Server decrypts the message with its private key and returns a response with the original message.

```
// routes/index.js
var decrypted = key.decrypt(req.body.encrypted, 'utf8');
```

## Running the Project

### Server

In a termial, navigate from the project root to `.\src\rsa-server` and run the project with:

`npm start`

### Client

In a terminal, navigate from the project root to `.\src\rsa-client` and run the project with:

`node index.js`

## Changing the message

The message is currently hard-coded to "My Sercet Message".  As this is just an example, I didn't want to take the time to pass this as an argument.  To change the value, change the `message` variable value inside index.js in the client.

## Discovery

* **Encryptions Are Never The Same Twice.** In the process of debugging my project, I was thrown off because the encrypted message was different every time I encrypted it.  I falsely assumed that I should get the same encrypted message every time I used the same public key with the same message.  It turns out that RSA is meant to use a different vector each time it's run, making the encrypted key different every time.  This is good because it will still decrypt the message correctly given the matching private key on the server side.
