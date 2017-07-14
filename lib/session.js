/**
 * Create Laravel session middleware for Socket.IO.
 * @param {Laravel} laravel
 * @returns {function}
 */
function session(laravel) {
    return (socket, next) => {
        const id = laravel.readCookies(socket.request.cookies);

        laravel.fetch(id)
            .then(session => {
                socket.request.session = session;
                next();
            })
            .catch(err => {
                next(err);
            });
    };
}

module.exports = session;
