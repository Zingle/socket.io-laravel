socket.io-laravel
=================
Socket.IO middleware for interoperation with Laravel.

Example
-------
```js
const http = require("http");
const io = require("socket.io");
const session = require("socket.io-laravel").session;
const httpServer = http.createServer();
const socketServer = io(httpServer);
const appKey = "..."        // Laravel application encryption key

// setup middleware
socketServer.use(session(appKey, id => new Promise((resolve, reject) => {
    // load session data from storage and resolve
})));

// middleware adds .sesssion to socket.request object
socketServer.sockets.on("connect", socket => {
    console.log(socket.request.session);
});
```

API
---

### session(key, [cookieName], fetch, [errorHandler]) => function
Create Socket.IO middleware to load Laravel session data.  The key must match
the Laravel `app.key`.  The fetch function takes a string session id and should
return a Promise that resolves to the session data.  If an error handler is
provided, errors will get passed to the error handler before being sent to the
client.
