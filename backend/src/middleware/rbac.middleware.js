export const checkRole = (...allowedRoles) => {
    return (req, res, next) => {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ error: 'Authentication Required' });
        }
        if (!allowedRoles.includes(user.role)) {
            return res.status(403).json({ error: 'Access Denied' });
        }
        next();
    };
};
//# sourceMappingURL=rbac.middleware.js.map