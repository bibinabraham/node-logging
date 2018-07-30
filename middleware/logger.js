
function logger(req, res, next) {
    console.log('Request', req.body);
    next();
}

module.exports = logger;