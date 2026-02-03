export const verifyAllowedRoleMiddleWare = (...allowedRoles) => {
    return async (req, res, next) => {
        try {
            const userdata = req.user;
            if (!userdata?.role)
                return res
                    .status(400)
                    .json({ success: false, message: "user role missing" });
            console.log(userdata, allowedRoles);
            if (!allowedRoles.includes(userdata.role.toUpperCase())) {
                return res
                    .status(401)
                    .json({ success: false, message: "user is not allowed" });
            }
            next();
        }
        catch (err) {
            return res
                .status(500)
                .json({ success: false, message: `internal server error ${err}` });
        }
    };
};
