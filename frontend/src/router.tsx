import { Routes, Route, Navigate } from "react-router-dom";
import ProfilePage from "./pages/profile_section";
import LoginPage from "./pages/login";
import CommunityPage from "./pages/community";
import NotFoundPage from "./pages/NotFound";
import AuthMiddleware from "./service/routeProtect/AuthMiddleware";
import LogOutPage from "./pages/logout";
import AdminsContactPage from "./pages/admincontact";
import GuestMiddleware from './service/routeProtect/GuestMiddleware';
import AdminPage from "./pages/adminPage";
import VideoPage from "./pages/video";
import ConfirmPage from "./pages/confirm";
import EarlyVideoPage from "./pages/video/EarlyVideoPage";
import Review1Page from "./pages/video/Review1Page";
import ProfessionalVideoPage from "./pages/video/ProfessionalVideoPage";
import Review2Page from "./pages/video/Review2Page";
import CurrentVideoPage from "./pages/video/CurrentVideoPage";
import Review3Page from "./pages/video/Review3Page";
import ForgetPassPage from "./pages/forgetPass";

const AllRoutes = () => {
    return (
        <Routes>
            <Route
                path="/login"
                element={
                    <GuestMiddleware>
                        <LoginPage />
                    </GuestMiddleware>
                }
            /> 
            <Route path="/logout" element={<LogOutPage />} />
            <Route path="/admin_Contact" element={<AdminsContactPage />} />
            <Route path="/forget" element={<ForgetPassPage />} />
            <Route path="" element={<Navigate to="/profile" />} />
            <Route element={<AuthMiddleware />}>
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/video" element={<VideoPage />}>
                    <Route path="early" element={<EarlyVideoPage />} />
                    <Route path="review1" element={<Review1Page />} />
                    <Route path="professional" element={<ProfessionalVideoPage />} />
                    <Route path="review2" element={<Review2Page />} />
                    <Route path="current" element={<CurrentVideoPage />} />
                    <Route path="review3" element={<Review3Page />} />
                </Route>
                <Route path="/confirm" element={<ConfirmPage />} />
                <Route path="/community" element={<CommunityPage />} />
                <Route path="/adduser" element={< AdminPage />} />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
};

export default AllRoutes;
