/**
 * Create Laravel session middleware for Socket.IO.
 * @param {Laravel} laravel
 * @param {function} [errorHandler]
 * @returns {function}
 */
function session(laravel, errorHandler) {
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
            .catch(handleError);

        function handleError(err) {
            if (errorHandler) {
                errorHandler(err);
                err = new Error("failed to load session");
            }

            next(err);
        }
    };
}

module.exports = session;
