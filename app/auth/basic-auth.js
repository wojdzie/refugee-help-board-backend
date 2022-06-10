const userService = require('../user/user.service');

module.exports = basicAuth;

const no_auth_paths = [
    "/user/authenticate",
    "/user/register",
    "/user/login",
    "/report/overview",
    "/report/periodic"
]

async function basicAuth(req, res, next) {
    if (no_auth_paths.includes(req.path)) {
        return next();
    }

    if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
        return res.status(401).json({ message: 'Missing Authorization Header' });
    }

    const base64Credentials = req.headers.authorization.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [login, password] = credentials.split(':');
    const user = await userService.authenticate({ login, password });

    if (!user) {
        return res.status(401).json({ message: 'Invalid Authentication Credentials' });
    }
    req.user = user;
    next();
}