import jwt from 'jsonwebtoken';
export const authenticateToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ error: 'Access Denied' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded);
        req.user = decoded;
        next();
    }
    catch (err) {
        console.error(err);
        return res.status(403).json({ error: 'Invalid Token' });
    }
};
//# sourceMappingURL=auth.middleware.js.map