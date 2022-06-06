module.exports = errorHandler;

function errorHandler(err, req, res, next) {
    console.error(err.message ? err.message : err);
    if (typeof (err) === 'string') {
        return res.status(400).json({ message: err });
    }
    return res.status(500).json({ message: "Oops, seems like the server got itself in trouble" });
}