const {deserialize, readCookies} = require("node-laravel");
const SessionError = require("./session-error");

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

    return async (socket, next) => {
        const cookies = socket.request.cookies;
        const id = cookieName === undefined
            ? readCookies(key, cookies)
            : readCookies(key, cookieName, cookies);

        socket.request.sessionId = id;

        try {
            await refreshSession();
            socket.request.refreshSession = refreshSession;
            next();
        } catch (err) {
            next(err);
        }

        async function refreshSession() {
            try {
                const data = await fetch(id);

                if (!data) throw new SessionError("session not found");

                const decoded = deserialize(data);
                const session = deserialize(decoded);

                socket.request.session = session;
            } catch (err) {
                err = new SessionError("failed to load session", err);
                if (errorHandler) errorHandler(err);
                throw err;
            }
        }
    };
}

module.exports = session;
