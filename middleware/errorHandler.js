const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).send({
        success : false,
        message : err.message || "Internal Server Error"
    });
};

module.exports = errorHandler;