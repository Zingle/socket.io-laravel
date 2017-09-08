const laravel = require("node-laravel");
const SessionError = require("./session-error");
const deserialize = laravel.deserialize;
const readCookies = laravel.readCookies;

/**
 * Create Laravel session middleware for Socket.IO.
 * @param {string} key
 * @param {string} [cookieName]
 * @param {function} fetch
 * @param {function} [errorHandler]
 * @returns {function}
 */
function session(key, cookieName, fetch, errorHandler) {
    if (typeof cookieName === "function") {
        errorHandler = fetch;
        fetch = cookieName;
        cookieName = undefined;
    }

    return (socket, next) => {
        const cookies = socket.request.cookies;
        const id = cookieName === undefined
            ? readCookies(key, cookies)
            : readCookies(key, cookieName, cookies);

        socket.request.sessionId = id;

        socket.request.refreshSession = function() {
            return fetch(id)
                .then(data => {
                    if (!data) throw new SessionError("session not found");
                    return data;
                })
                .then(data => deserialize(data))
                .then(data => deserialize(data))
                .then(session => socket.request.session = session)
                .catch(err => {
                    err = new SessionError("failed to load session", err);
                    if (errorHandler) errorHandler(err);
                    throw err;
                });
        };

        socket.request.refreshSession()
            .then(() => next())
            .catch(next);
    };
}

module.exports = session;
