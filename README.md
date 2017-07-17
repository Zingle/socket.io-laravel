socket.io-laravel
=================
Socket.IO middleware for interoperation with Laravel.  This library makes use of
the `node-laravel` package; it expects a Laravel context object from that
module.

Example
-------
```js
const http = require("http");
const io = require("socket.io");
const Laravel = require("node-laravel");
const session = require("socket.io-laravel").session;
const httpServer = http.createServer();
const socketServer = io(httpServer);
const appKey = "..."        // Laravel application encryption key

var laravel;

// create Laravel context that can load data from storage, decrypt, and decode
laravel = Laravel(appKey, id => new Promise((resolve, reject) => {
    // load session data from storage and resolve...
}));

// setup middleware
socketServer.use(session(laravel));

// middleware adds .sesssion to socket object
socketServer.sockets.on("connect", socket => {
    console.log(socket.session);
});
```

API
---

### session(Laravel) => function
Create Socket.IO middleware using Laravel context compatible with those created
by the `node-laravel` module.
