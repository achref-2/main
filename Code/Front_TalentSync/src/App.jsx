import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import SmoothScroll from "smooth-scroll";
import "./App.css";
import Dashboard from "./pages/candidat/Pages/Dashboard";
import CandidatSignup from "./pages/candidat/Singup/Signup";
import CandidatLogin from "./pages/candidat/Login/Login";
import CVcomponent from "./pages/candidat/Pages/CVcomponent";
import PastApplications from "./pages/candidat/Pages/PastApplications";
import LandingPage from "./pages/landingPage/LandingPage";
import Jobs from "./pages/candidat/Pages/Jobs/Jobs";
import Settings from "./pages/candidat/Pages/Settings";
import Pricing from "./pages/landingPage/Prising";
import { DarkModeProvider } from "./components/DarkModeProvider";
import RecruiterDashboard from "./pages/recruiter/Dashboard";
import { AuthWrapper } from "./components/AuthWrapper"; // Add this import
import Admin from "./components/admin";
import AppliedCandidates from "./pages/recruiter/AppliedCandidates";
import RecruiterJobs from "./pages/recruiter/Jobs";
import RecruiterSettings from "./pages/recruiter/Settings";
import TestingPage from "./pages/candidat/Pages/Testing";
import Application from "./pages/candidat/Pages/Application";
import NotFoundPage from "./pages/404";
import Blog from "./pages/landingPage/Blog";
import CvPreview from "./components/Cvpreview";
import { UserProvider } from "./components/UserContext"
export const scroll = new SmoothScroll('a[href*="#"]', {
  speed: 1000,
  speedAsDuration: true,
});

const App = () => {
  const user = localStorage.getItem("token");

  return (
    <DarkModeProvider>
      <UserProvider>
      <Router>
        <AuthWrapper>
          <Routes>
            <Route path="/" element={<LandingPage />} />

            {/* Candidat Routes */}
            <Route path="/candidate/signup" element={<CandidatSignup />} />
            <Route path="/candidate/login" element={<CandidatLogin />} />
            <Route path="/Application" element={<Application />} />
            <Route path="/Pricing" element={<Pricing />} />
            <Route path="/Blog" element={<Blog />} />
            <Route path="/Jobs" element={<Jobs />} />
            <Route path="*" element={<NotFoundPage />} />
            
            {!user ? (
              <Route path="/" element={<Navigate to="/" />} />
            ) : (
              <Route path="/dashboard" element={ <Dashboard />} />
            )}
        
                    <Route path="/cv-preview" element={<CvPreview />} />

            <Route path="/dashboard/PastApplications" element={<PastApplications />}/>
            <Route path="/Settings" element={<Settings />} />

            {/** Recruiter Routes */}
            <Route
              path="/dashboard/recuiter"
              element={<RecruiterDashboard />}
            />
            <Route
              path="/dashboard/AppliedCandidates"
              element={<AppliedCandidates />}
            />
            <Route
              path="/dashboard/recuiter/joblist"
              element={<RecruiterJobs />}
            />
            <Route
              path="/dashboard/recuiter/settings"
              element={<RecruiterSettings />}
            />

            {/** Other Routes */}
            <Route path="/admin" element={<Admin />} />
            <Route path="/Testing" element={<TestingPage />} />
            <Route path="/cv" element={<CVcomponent />} />
          </Routes>
        </AuthWrapper>
      </Router>
      </UserProvider>
    </DarkModeProvider>
  );
};

export default App;
