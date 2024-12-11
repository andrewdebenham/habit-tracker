const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    const authorization = req.headers.authorization;
    let token = null;

    // Retrieve token
    if (authorization && authorization.split(" ").length === 2) {
        token = authorization.split(" ")[1];
    } else {
        return res.status(401).json({
            error: true,
            message: "Unauthorized user - No token provided",
        });
    }

    // Verify JWT and check expiration date
    try {
        const secretKey = process.env.SECRET_KEY;
        const decoded = jwt.verify(token, secretKey);

        if (decoded.exp < Date.now()) {
            return res.status(401).json({
                error: true,
                message: "Token has expired",
            });
        }

        // Attach decoded payload to request for later use
        req.user = decoded;

        next();
    } catch (e) {
        return res.status(401).json({
            error: true,
            message: "Token is not valid",
        });
    }
}

module.exports = verifyToken;