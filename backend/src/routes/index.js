import { Router } from "express";
import authRoute from "./authRoutes.js";
import adminRoute from "./adminRoutes.js";
import userRoute from "./userRoutes.js";
const mainRouter = Router();

mainRouter.get('/', (req, res) => {
    const isAuthenticated = req.session && req.session.user;
    if (isAuthenticated) {
        return res.status(200).json({
            message: "Server is Ok and in Running State",
            id: isAuthenticated ? req.session.user.id : null,
            email: isAuthenticated ? req.session.user.email : null,
            role: isAuthenticated ? req.session.user.role : null
        });
    } else {
        return res.status(401).json({ message: "Unauthorized" });
    }
});

mainRouter.use('/auth', authRoute);
mainRouter.use('/user', userRoute);
mainRouter.use('/admin', adminRoute);

export default mainRouter;