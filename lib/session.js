const {deserialize, readCookies} = require("node-laravel");
const con = console;

/**
 * Create Laravel session middleware for Socket.IO.
 * @param {string} key
 * @param {string} [cookieName]
 * @param {function} fetch
 * @param {Console} [console]
 * @returns {function}
 */
function session(key, cookieName, fetch, console={debug(){},info(){},error(){}}) {
    if (typeof cookieName === "function") {
        console = fetch || console;
        fetch = cookieName;
        cookieName = undefined;
    }

    return async (socket, next) => {
        console.info("checking socket.io request headers for Laravel session");

        console.debug(`reading ${cookieName||"default"} session cookie`);
        const cookies = socket.request.cookies;
        const id = cookieName === undefined
            ? readCookies(key, cookies)
            : readCookies(key, cookieName, cookies);

        console.debug(`got session id ${id} from cookie`);
        socket.request.sessionId = id;

        try {
            console.debug(`fetching data for session ${id}`);
            const data = await fetch(id);

            if (!data) {
                console.debug(`failed to fetch data for session ${id}`);
                return next();
            }

            const decoded = deserialize(data);
            const session = deserialize(decoded);

            socket.request.session = session;
            console.info(`loaded session ${id}`);
            next();
        } catch (err) {
            console.error(err);
            next(err);
        }
    };
}

module.exports = session;
