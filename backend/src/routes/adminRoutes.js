import { Router } from "express";
import {
    Getadmins,
    AddUsers,
    DeleteUsers,
    AllUsers,
    Activateornot,
    CametoApprove,
    ApproveProfile,
    RejectProfile,
    ProfileUser,
    AllapproveUsers
} from "../controllers/adminController.js";

const adminRouter = Router();

adminRouter.get('/', Getadmins);
adminRouter.post('/user', AddUsers);
adminRouter.post('/approval', CametoApprove);
adminRouter.get('/ApprovedUsers', AllapproveUsers);

adminRouter.get('/allusers', AllUsers);

adminRouter.post('/user/approve/:id', ApproveProfile);
adminRouter.post('/user/reject/:id', RejectProfile);
adminRouter.post('/user/activate/:id', Activateornot);
adminRouter.delete('/user/delete/:id', DeleteUsers);
adminRouter.get('/user/profile/:id', ProfileUser);

export default adminRouter;