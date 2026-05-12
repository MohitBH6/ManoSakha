import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout";
import App from "./App.jsx";
import HomePage from "./Pages/home/HomePage.jsx";
import Helplines from "./Pages/home/Helplines.jsx";
import Blogs from "./Pages/User/Blogs.jsx";
import Appointments from "./Pages/User/Appointments.jsx";
import ChatbotWidget from "./components/ChatbotWidget.jsx";
import MoodTracker from "./Pages/Admin/MoodTracker.jsx";
import Resources from "./Pages/User/Resources.jsx";
import AdminLogin from "./Pages/Admin/AdminLogin.jsx";
import AdminDashboard from "./Pages/Admin/AdminDashboard.jsx";
import Login from "./Pages/Auth/Login.jsx";
import Register from "./Pages/Auth/Register.jsx";
import StudentDashboard from "./Pages/User/StudentDashboard.jsx";
import StudentAppointments from "./Pages/User/StudentAppointments.jsx";
import StudentResources from "./Pages/User/StudentResources.jsx";
import Assesment from "./Pages/User/Assesment.jsx";
import DiscussionBoard from "./Pages/User/DiscussionBoard.jsx";
import CounsellorDashboard from "./Pages/User/CounsellorDashboard.jsx";
import ResilienceBuilderPage from "./Pages/User/ResilienceBuilderPage.jsx";

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<App />} >
        <Route index element={<HomePage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/helplines" element={<Helplines />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/chatbot" element={<ChatbotWidget/>} />
        <Route path="/mood-tracker" element={<MoodTracker/>} />
        <Route path="/resources" element={<Resources/>} />
        <Route path="/resilience" element={<ResilienceBuilderPage/>} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/student/resources" element={<StudentResources />} />
        <Route path="/student/appointments" element={<StudentAppointments />} />
        <Route path="/student/assesment/" element={<Assesment />} />
        <Route path="/discussion/" element={<DiscussionBoard />} />


        <Route path="/counsellor" element={<CounsellorDashboard />} />
        </Route>

    )
  );
createRoot(document.getElementById('root')).render(
  <StrictMode>
  <RouterProvider router={router}></RouterProvider>
  </StrictMode>,
)
