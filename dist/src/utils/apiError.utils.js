class apiError extends Error {
    statusCode;
    stack;
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}
export default apiError;
