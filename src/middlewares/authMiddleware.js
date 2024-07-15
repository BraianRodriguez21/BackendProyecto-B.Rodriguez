export function adminOnly(req, res, next) {
    if (req.user && req.user.role === 'admin') {
    return next();
    }
    res.status(403).json({ message: 'Access denied' });
}

export function userOnly(req, res, next) {
    if (req.user && req.user.role === 'user') {
    return next();
    }
    res.status(403).json({ message: 'Access denied' });
}