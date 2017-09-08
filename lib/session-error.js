const create = Object.create;

/**
 * Create session error.
 * @constructor
 * @augments {Error}
 * @param {string} message
 * @param {Error} [cause]
 */
function SessionError(message, cause) {
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = message;
    this.cause = cause || null;
}

SessionError.prototype = create(Error.prototype);
SessionError.prototype.constructor = SessionError;

module.exports = SessionError;
