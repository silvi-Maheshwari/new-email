const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    // Extract the token from the Authorization header
    const token = req.header('Authorization')?.split(' ')[1]; // This splits the "Bearer <token>"

    
    // If token is missing
    if (!token) return res.status(401).json({ message: 'Access Denied' });

    try {
        // Verify the token using the secret key
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.admin = verified; // Attach verified admin information to the request object
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        // If the token is invalid or expired
        res.status(400).json({ message: 'Invalid Token' });
    }
};

module.exports = auth;
