/**
 * Create Laravel session middleware for Socket.IO.
 * @param {Laravel} laravel
 * @returns {function}
 */
function session(laravel) {
    return (socket, next) => {
        const id = laravel.readCookies(socket.request.cookies);

        socket.request.sessionId = id;

        socket.request.refreshSession = function() {
            return laravel
                .fetch(this.sessionId)
                .then(session => socket.request.session = session);
        };

        socket.request.refreshSession()
            .then(() => next())
            .catch(next);
    };
}

module.exports = session;
