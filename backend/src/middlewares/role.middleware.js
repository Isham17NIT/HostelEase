// Role-based access control middleware

export const roleMiddleware = (allowedRole) => {
	return (req, res, next) => {
		const user = req.user;
		if (!user || !user.role) {
            return res.status(401).json({message: "Unauthorized: No user role found"})
		}
		if (allowedRole !== user.role) {
            return res.status(403).json({message: "Forbidden: You don't have access to this resource"})
		}
		next();
	};
};