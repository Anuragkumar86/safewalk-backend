import jwt, {} from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET;
export const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        // console.log("Token: ", token)
        const decoded = jwt.verify(token, JWT_SECRET);
        // console.log("DECODED: ",decoded)
        req.user = {
            id: decoded.userId,
        };
        next();
    }
    catch (err) {
        res.status(401).json({ message: "Invalid token" });
    }
};
//# sourceMappingURL=auth.middleware.js.map