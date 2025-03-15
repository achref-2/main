import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import SmoothScroll from "smooth-scroll";
import "./App.css";
import Dashboard from "./components/Candidat/Dashboard/Dashboard";
import Candidat_Signup from "./components/Candidat/Singup";
import Candidat_Login from "./components/Candidat/Login";
import CVcomponent from "./components/Candidat/Dashboard/CVcomponent";
import CVBuilder from "./old/create";
import History from "./components/Candidat/Dashboard/History";
import LandingPage from "./pages/LandingPage/LandingPage";
import JobList from "./components/Recruiter/JOB_LIST/Job";
import Settings from "./components/Candidat/Dashboard/Settings";
import Pricing from "./pages/Pricing/Prising";
import { DarkModeProvider } from "./components/DarkModeProvider";
import RecruiterDashboard from "./components/Recruiter/Dashboard/Dashboard";
import { AuthWrapper } from "./components/AuthWrapper"; // Add this import
import Admin from "./components/admin";
import RecruiterHistory from "./components/Recruiter/Dashboard/History";
import RecruiterJobList from "./components/Recruiter/JOB_LIST/Job";
import RecruiterSettings from "./components/Recruiter/Dashboard/Settings";
import JOBBuilder from "./components/Recruiter/JOB_LIST/JobBuilder";
export const scroll = new SmoothScroll('a[href*="#"]', {
  speed: 1000,
  speedAsDuration: true,
});

const App = () => {
  const user = localStorage.getItem("token");

  return (
    <DarkModeProvider>
     
        <Router>
        <AuthWrapper>
          <Routes>
            <Route path="/Pricing" element={<Pricing />} />
            <Route path="/JobList" element={<JobList />} />
            <Route path="/Settings" element={<Settings />} />
            <Route path="/" element={<LandingPage />} />
            <Route path="/cv" element={<CVcomponent />} />
            <Route path="/admin" element={<Admin />} />
            {!user ? <Route path="/" element={<Navigate to="/" />} /> : <Route path="/dashboard" element={<Dashboard />} />}

            <Route path="/candidate/signup" element={<Candidat_Signup />} />
            <Route path="/candidate/login" element={<Candidat_Login />} />
            <Route path="/create" element={<CVBuilder />} />
            <Route path="/dashboard/history" element={<History />} />

            <Route
              path="/dashboard/recuiter"
              element={<RecruiterDashboard />}
            />
            <Route
              path="/dashboard/recuiter/history"
              element={<RecruiterHistory />}
            />
            <Route
              path="/dashboard/recuiter/joblist"
              element={<RecruiterJobList />}
            />
            <Route
              path="/dashboard/recuiter/settings"
              element={<RecruiterSettings />}
            />
            <Route
              path="/dashboard/recuiter/jobbuilder"
              element={<JOBBuilder />}
            />
          </Routes>
          </AuthWrapper>
        </Router>
     
    </DarkModeProvider>
  );
};

export default App;
