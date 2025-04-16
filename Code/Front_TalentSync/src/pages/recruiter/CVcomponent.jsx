import React, { useState, useEffect } from "react";
import {
  Menu,
  History,
  PlusSquare,
  Settings,
  CreditCard,
  Moon,
  Sun,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";
import { Upload, FileText, AlertCircle } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Menu as HeadlessMenu } from "@headlessui/react";
import { BellIcon } from "@heroicons/react/24/outline";
import { MenuButton, MenuItem, MenuItems } from "@headlessui/react";
const NavLink = ({ href, icon: Icon, children, isActive }) => (
  <a
    href={href}
    className={`group flex items-center gap-3 px-3 py-2 rounded-lg  transition-all duration-300 ease-in-out z-30
      ${
        isActive
          ? "bg-zinc-200 text-black dark:bg-zinc-900 dark:text-white transition-all duration-300 ease-in-out z-30"
          : "text-gray-500 hover:bg-zinc-200 hover:text-black dark:text-gray-400 dark:hover:bg-zinc-900  dark:hover:text-white "
      }
    `}
    aria-current={isActive ? "page" : undefined}
  >
    <Icon className="w-5 h-5 flex-shrink-0" />
    <span className="truncate">{children}</span>
  </a>
);



// Reuse your existing components
const SearchBar = () => (
  <div className="relative max-w-md w-full transition-all duration-300 ease-in-out z-30">
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-black dark:text-zinc-300 transition-all duration-300 ease-in-out z-30" />
    <input
      type="search"
      placeholder="Search..."
      className="w-80 pl-10 pr-4 py-2 transition-all duration-300 ease-in-out z-30 bg-zinc-200 text-black dark:bg-zinc-900 dark:text-black rounded-lg border border-zinc-100  dark:border-zinc-800
        focus:outline-none focus:border-zinc-500  focus:ring-1 focus:ring-zinc-500 
        placeholder-gray-900 dark:placeholder-gray-400"
    />
  </div>
);
const UserMenu = () => {
  const menuItems = [
    { label: "Your Profile", href: "#profile" },
    { label: "Settings", href: "/Settings" },
    { label: "Sign out", href: "#signout" },
  ];

  return (
    <HeadlessMenu as="div" className="relative">
      <MenuButton className="flex rounded-full ring-offset-gray-800 focus-visible:ring-2">
        <span className="sr-only">Open user menu</span>
        <img
          className="h-8 w-8 rounded-full ring-2 ring-gray-700 hover:ring-blue-500 transition-all"
          src="../../assets/images/avatar.jpg"
          alt="User avatar"
        />
      </MenuButton>
      <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-gray-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
        {menuItems.map(({ label, href }) => (
          <MenuItem key={label}>
            {({ active }) => (
              <a
                href={href}
                className={`block px-4 py-2 text-sm ${
                  active ? "bg-gray-700 text-white" : "text-gray-300"
                }`}
              >
                {label}
              </a>
            )}
          </MenuItem>
        ))}
      </MenuItems>
    </HeadlessMenu>
  );
};

const CVUpload = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Initialize dark mode based on system preference
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check if window is defined (client-side)
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/create"); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("cv", file);
    formData.append("jobDescription", jobDescription);

    try {
      
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in to analyze your CV.");
        navigate("/login"); 
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/analyze",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("API Response:", response.data);
      setAnalysis(response.data);
    } catch (error) {
      console.error("Error in API call:", error);
      alert("An error occurred while processing your CV. Please try again.");
    }
  };
  const navigation_menu = [
      { name: "Dashboard", href: "/dashboard/recuiter", icon: Menu, current: true },
      {
        name: "History",
        href: "/dashboard/recuiter/history",
        icon: History,
        current: false,
      },
      { name: "Job List", href: "/dashboard/recuiter/joblist", icon: Menu, current: false },
      { name: "Billing", href: "/Pricing", icon: PlusSquare, current: false },
    ];
    const navigation_option = [
      { name: "Settings", href: "/dashboard/recuiter/Settings", icon: Settings, current: false },
      { name: "Support", href: "/dashboard/recuiter/jobbuilder", icon: Settings, current: false },
    ];

  // Handle system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => setIsDarkMode(e.matches);

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Apply dark mode class
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  // Theme toggle function
  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? "dark" : ""}`}>
      <div className="flex h-screen bg-white dark:bg-black">
        {/* Sidebar */}
        <aside
          className={`fixed md:relative flex flex-col h-full bg-white dark:bg-black  border-gray-200 dark:border-gray-800
            transition-all duration-300 ease-in-out z-30
            ${isSidebarOpen ? "w-64" : "w-20"}`}
        >
          {/* Rest of the sidebar content remains the same, but update classes to use dark: prefix */}
          <div className="flex items-center justify-between p-4  border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="p-2  rounded-lg">
                               <Menu className="w-5 h-5 text-gray-600 dark:text-white transition-all duration-300 ease-in-out z-30 " />
               
              </div>
              {isSidebarOpen && (
                <span className="text-lg font-semibold text-gray-900 dark:text-white transition-all duration-300 ease-in-out z-30">
                TalentSync
              </span>
              )}
            </div>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
              {isSidebarOpen ? (
                <ChevronLeft className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-400" />
              )}
            </button>
          </div>

          {/* Navigation - update classes for dark mode */}

          <nav className="flex-1 overflow-y-auto p-4 space-y-8">
            <div className="space-y-3 ">
              <div className="text-sm font-medium text-gray-400 px-2">MENU</div>
              {navigation_menu.map((item) => (
                <NavLink
                  key={item.name}
                  href={item.href}
                  icon={item.icon}
                  isActive={item.current}
                >
                  {item.name}
                </NavLink>
              ))}
              <div className="text-sm font-medium  text-gray-400 px-2">
                OPTIONS
              </div>
              {navigation_option.map((item) => (
                <NavLink
                  key={item.name}
                  href={item.href}
                  icon={item.icon}
                  isActive={item.current}
                >
                  {item.name}
                </NavLink>
              ))}
            </div>
          </nav>

          {/* Premium Card - already has dark mode styling */}
           {isSidebarOpen && (
                                <div className="p-3  border-gray-200 dark:border-gray-900 transition-all duration-300 ease-in-out z-30">
                                  <div className="   rounded-lg p-4 space-y-4 transition-all duration-300 ease-in-out z-30 ">
                                    <div className="flex items-center gap-3">
                                      <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                                        <CreditCard className="w-5 h-5 text-white " />
                                      </div>
                                      <div className="flex-1">
                                        <h3 className="font-medium  text-gray-900 dark:text-white  transition-all duration-300 ease-in-out z-30 ">Buy us a coffee</h3>
                                        <p className="text-sm text-gray-400 dark:text-gray-500  transition-all duration-300 ease-in-out z-30">
                                          TalentSync is free thanks to donations, please support us
                                          to keep the project running.
                                        </p>
                                      </div>
                                    </div>
                                    <button className="w-full dark:bg-zinc-900 dark:hover:bg-zinc-800 bg-zinc-200 hover:bg-gray-300 text-black dark:text-white py-2 px-4 rounded-lg  transition-colors">
                                      Donate
                                    </button>
                                  </div>
                                </div>
                              )}
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-white dark:bg-black transition-all duration-300 ease-in-out z-30">
          {/* Header */}
          <header className="bg-white dark:bg-black  border-gray-200 dark:border-gray-800 sticky top-0 transition-all duration-300 ease-in-out z-30">
            <div className="flex items-center justify-between px-6 py-4">
              <SearchBar />
              <div className="flex items-center gap-4">
                {/* Notification button */}
                <button
                  type="button"
                  className="relative p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg
                    focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" />
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-900" />
                </button>
                <UserMenu />
                {/* Dark mode toggle */}
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label={
                    isDarkMode ? "Switch to light mode" : "Switch to dark mode"
                  }
                >
                  {isDarkMode ? (
                    <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  ) : (
                    <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <div className="min-h-screen  p-2">
            <div className="max-w-3xl mx-auto space-y-2">
              <div className="  rounded-xl shadow-lg overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                  <h1 className="text-3xl font-bold text-gray-100">
                    CV Analysis
                  </h1>
                </div>

                <div className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* File Upload Section */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-100">
                        Upload CV (PDF)
                      </label>
                      <div className="relative">
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={(e) => setFile(e.target.files[0])}
                          className="hidden"
                          id="cv-upload"
                          required
                        />
                        <label
                          htmlFor="cv-upload"
                          className="flex items-center text-gray-100 justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors cursor-pointer group"
                        >
                          <div className="text-center">
                            <Upload className="mx-auto h-12 w-12 text-gray-100 group-hover:text-blue-500" />
                            <span className="mt-2 block text-sm font-medium text-gray-100">
                              {file
                                ? file.name
                                : "Drop your PDF here, or click to browse"}
                            </span>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* Job Description Section */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-100">
                        Job Description
                      </label>
                      <div className="relative">
                        <FileText className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                        <textarea
                          value={jobDescription}
                          onChange={(e) => setJobDescription(e.target.value)}
                          rows="4"
                          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter the job description here..."
                          required
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={loading || !file}
                      className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                        loading || !file
                          ? "bg-gray-300 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700 text-white"
                      }`}
                    >
                      {loading ? (
                        <span className="flex items-center justify-center">
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Analyzing...
                        </span>
                      ) : (
                        "Analyze CV"
                      )}
                    </button>
                  </form>

                  {/* Analysis Results */}
                  {analysis && (
                    <div className="mt-8 space-y-6">
                      <h2 className="text-xl font-semibold text-gray-900">
                        Analysis Results
                      </h2>

                      {/* Match Score */}
                      <div className="bg-white rounded-lg p-6 border border-gray-200">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-600">
                            Match Score
                          </span>
                          <span className="text-2xl font-bold text-blue-600">
                            {isNaN(analysis?.result?.similarity_score)
                              ? "0.0%"
                              : (
                                  analysis?.result?.similarity_score * 100
                                ).toFixed(1) + "%"}
                          </span>
                        </div>
                        <div className="mt-4 w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-blue-600 h-2.5 rounded-full"
                            style={{
                              width: `${
                                analysis?.result?.similarity_score * 100
                              }%`,
                            }}
                          ></div>
                        </div>
                      </div>
                      {/* Skills Section */}
                      <div className="bg-white rounded-lg p-6 border border-gray-200">
                        <h3 className="font-semibold text-gray-900 mb-4">
                          Skills Found
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {analysis?.result?.entities?.SKILL?.length > 0 ? (
                            analysis.result.entities.SKILL.map(
                              (skill, index) => (
                                <span
                                  key={index}
                                  className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                                >
                                  {skill}
                                </span>
                              )
                            )
                          ) : (
                            <p className="text-sm text-gray-500">
                              No skills found.
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Suggestions Section */}
                      <div className="bg-white rounded-lg p-6 border border-gray-200">
                        <h3 className="font-semibold text-gray-900 mb-4">
                          Improvement Suggestions
                        </h3>
                        <div className="space-y-3">
                          {analysis?.result?.suggestions?.length > 0 ? (
                            analysis.result.suggestions.map(
                              (suggestion, index) => (
                                <div
                                  key={index}
                                  className="flex items-start space-x-2 p-4 rounded-lg bg-blue-50 text-blue-800"
                                >
                                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                                  <p className="text-sm">{suggestion}</p>
                                </div>
                              )
                            )
                          ) : (
                            <p className="text-gray-500">
                              Aucune suggestion disponible.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Create CV Button */}
              <button
                onClick={handleNavigate}
                className="w-full py-3 px-4 rounded-lg bg-gray-600 hover:bg-gray-800 text-white font-medium transition-colors flex items-center justify-center gap-2"
              >
                Create CV
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CVUpload;
