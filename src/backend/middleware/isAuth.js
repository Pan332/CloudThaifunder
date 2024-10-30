export const isAuthenticated = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
  
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ success: false, message: 'Forbidden' });
        }
        req.user = user;
        next();
    });
  };