const handler500 = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: "Internal Server Error, Unexpected ERROR",
        error: process.env.NODE_ENV === "development" ? err.message : {}
    });
};

module.exports = handler500;

