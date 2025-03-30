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
  FlaskConical,
  Wrench,
} from "lucide-react";
import { Upload, FileText, AlertCircle } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Menu as HeadlessMenu } from "@headlessui/react";
import { BellIcon } from "@heroicons/react/24/outline";
import { MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Link } from "react-router-dom";

const NavLink = ({ href, icon: Icon, children, isActive }) => (
  <Link
    to={href}
    className={`group flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-300 ease-in-out z-30
      ${
        isActive
          ? "bg-zinc-200 text-black dark:bg-zinc-900 dark:text-white transition-all duration-300 ease-in-out z-30"
          : "text-gray-500 hover:bg-zinc-200 hover:text-black dark:text-gray-400 dark:hover:bg-zinc-900 dark:hover:text-white"
      }
    `}
    aria-current={isActive ? "page" : undefined}
  >
    <Icon className="w-5 h-5 flex-shrink-0" />
    <span className="truncate">{children}</span>
  </Link>
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
const CVUploadForm = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  // Initialize dark mode based on system preference
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check if window is defined (client-side)
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setAnalysis(null);
    setError(null);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("cv", file);

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/TakeData",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Full API Response:", response.data);

      const { result } = response.data;
      setAnalysis(result);
    } catch (err) {
      console.error("API Error:", err);
      setError(err.response?.data?.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };
  // Convert JSON to readable text
  const convertToReadableText = (data) => {
    if (!data) return "No analysis available";
    
    let textOutput = "";
    
    // Recursive function to handle nested objects and arrays
    const parseValue = (value, indent = '') => {
      if (value === null) return 'null';
      if (typeof value === 'undefined') return 'undefined';
      
      if (Array.isArray(value)) {
        return value.map((item, index) => 
          `${indent}- Item ${index + 1}: ${parseValue(item, indent + '  ')}`
        ).join('\n');
      }
      
      if (typeof value === 'object') {
        return Object.entries(value)
          .map(([key, val]) => `${indent}${key}: ${parseValue(val, indent + '  ')}`)
          .join('\n');
      }
      
      return value.toString();
    };
    
    // Convert the entire object to text
    textOutput = parseValue(data);
    
    return textOutput;
  };
  
  // Debug render to see text representation
  const renderDebugView = () => {
    return (
      <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto whitespace-pre-wrap">
        {convertToReadableText(analysis)}
      </pre>
    );
  };
  // Handle form submission

  const navigation_menu = [
    { name: "Dashboard", href: "/dashboard", icon: Menu, current: false },
    {
      name: "History",
      href: "/dashboard/history",
      icon: History,
      current: false,
    },
    { name: "Job List", href: "/Jobcandidate", icon: Menu, current: false },
    { name: "Billing", href: "/Pricing", icon: PlusSquare, current: false },
  ];
  const navigation_option = [
    { name: "Settings", href: "/Settings", icon: Settings, current: false },
    { name: "Support", href: "/cv", icon: Wrench, current: false },
    { name: "cv testing", href: "/Testing", icon: FlaskConical, current: true },
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
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);

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
                    <h3 className="font-medium  text-gray-900 dark:text-white  transition-all duration-300 ease-in-out z-30 ">
                      Buy us a coffee
                    </h3>
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
          <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-white shadow-md rounded-lg p-6">
              <h1 className="text-2xl font-bold mb-4 text-center">
                Resume Analyzer
              </h1>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* File Upload Section */}
                <div className="flex items-center justify-center w-full">
                  <label
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition"
                    aria-label="Upload Resume"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg
                        className="w-8 h-8 mb-4 text-gray-500"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 16"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                        />
                      </svg>
                      <p className="mb-2 text-sm text-gray-500">
                        {file ? file.name : "Click to upload or drag and drop"}
                      </p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf"
                      onChange={handleFileChange}
                      aria-describedby="file-upload"
                    />
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!file || isLoading}
                  className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:bg-gray-400 transition"
                >
                  {isLoading ? "Analyzing..." : "Analyze Resume"}
                </button>
              </form>

              {/* Error Message */}
              {error && (
                <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              )}

              {/* Analysis Results */}
              {analysis && (
                <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                  <h2 className="text-xl font-semibold mb-4">Resume Editor</h2>

                  {/* Contact Information Section */}
                  <div className="mb-6">
                    <h3 className="text-lg font-bold mb-4">Contact Information</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block font-medium">Name</label>
                        <input
                          type="text"
                          value={analysis.contacts.name}
                          onChange={(e) =>
                            setAnalysis((prev) => ({
                              ...prev,
                              contacts: { ...prev.contacts, name: e.target.value },
                            }))
                          }
                          className="w-full border rounded p-2"
                        />
                      </div>
                      <div>
                        <label className="block font-medium">Phone</label>
                        <input
                          type="text"
                          value={analysis.contacts.phone}
                          onChange={(e) =>
                            setAnalysis((prev) => ({
                              ...prev,
                              contacts: { ...prev.contacts, phone: e.target.value },
                            }))
                          }
                          className="w-full border rounded p-2"
                        />
                      </div>
                      <div>
                        <label className="block font-medium">Email</label>
                        <input
                          type="email"
                          value={analysis.contacts.email}
                          onChange={(e) =>
                            setAnalysis((prev) => ({
                              ...prev,
                              contacts: { ...prev.contacts, email: e.target.value },
                            }))
                          }
                          className="w-full border rounded p-2"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Work Experience Section */}
                  <div className="mb-6">
                    <h3 className="text-lg font-bold mb-4">Work Experience</h3>
                    {typeof analysis.experience === "string" ? (
                      <p className="text-gray-700">{analysis.experience}</p>
                    ) : (
                      Array.isArray(analysis.experience) &&
                      analysis.experience.map((exp, index) => (
                        <div key={index} className="mb-4 border p-4 rounded-lg bg-white shadow">
                          <div className="mb-2">
                            <label className="block font-medium">Company</label>
                            <input
                              type="text"
                              value={exp.company || ""}
                              onChange={(e) => {
                                const updatedExperience = [...analysis.experience];
                                updatedExperience[index].company = e.target.value;
                                setAnalysis((prev) => ({
                                  ...prev,
                                  experience: updatedExperience,
                                }));
                              }}
                              className="w-full border rounded p-2"
                            />
                          </div>
                          <div className="mb-2">
                            <label className="block font-medium">Role</label>
                            <input
                              type="text"
                              value={exp.role || ""}
                              onChange={(e) => {
                                const updatedExperience = [...analysis.experience];
                                updatedExperience[index].role = e.target.value;
                                setAnalysis((prev) => ({
                                  ...prev,
                                  experience: updatedExperience,
                                }));
                              }}
                              className="w-full border rounded p-2"
                            />
                          </div>
                          <div className="mb-2">
                            <label className="block font-medium">Date</label>
                            <input
                              type="text"
                              value={exp.date || ""}
                              onChange={(e) => {
                                const updatedExperience = [...analysis.experience];
                                updatedExperience[index].date = e.target.value;
                                setAnalysis((prev) => ({
                                  ...prev,
                                  experience: updatedExperience,
                                }));
                              }}
                              className="w-full border rounded p-2"
                            />
                          </div>
                          <div>
                            <label className="block font-medium">Description</label>
                            <textarea
                              value={exp.description || ""}
                              onChange={(e) => {
                                const updatedExperience = [...analysis.experience];
                                updatedExperience[index].description = e.target.value;
                                setAnalysis((prev) => ({
                                  ...prev,
                                  experience: updatedExperience,
                                }));
                              }}
                              className="w-full border rounded p-2"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const updatedExperience = analysis.experience.filter(
                                (_, i) => i !== index
                              );
                              setAnalysis((prev) => ({
                                ...prev,
                                experience: updatedExperience,
                              }));
                            }}
                            className="mt-2 bg-red-500 text-white py-1 px-4 rounded hover:bg-red-600"
                          >
                            Remove
                          </button>
                        </div>
                      ))
                    )}
                    <button
                      type="button"
                      onClick={() =>
                        setAnalysis((prev) => ({
                          ...prev,
                          experience: [
                            ...prev.experience,
                            { company: "", role: "", date: "", description: "" },
                          ],
                        }))
                      }
                      className="bg-green-500 text-white py-1 px-4 rounded hover:bg-green-600"
                    >
                      Add Experience
                    </button>
                  </div>

                  {/* Education Section */}
                  <div className="mb-6">
                    <h3 className="text-lg font-bold mb-4">Education</h3>
                    {analysis.education?.map((edu, index) => (
                      <div key={index} className="mb-4 border p-4 rounded-lg bg-white shadow">
                        <div className="mb-2">
                          <label className="block font-medium">Degree</label>
                          <input
                            type="text"
                            value={edu.degree || ""}
                            onChange={(e) => {
                              const updatedEducation = [...analysis.education];
                              updatedEducation[index].degree = e.target.value;
                              setAnalysis((prev) => ({
                                ...prev,
                                education: updatedEducation,
                              }));
                            }}
                            className="w-full border rounded p-2"
                          />
                        </div>
                        <div className="mb-2">
                          <label className="block font-medium">Institution</label>
                          <input
                            type="text"
                            value={edu.institution || ""}
                            onChange={(e) => {
                              const updatedEducation = [...analysis.education];
                              updatedEducation[index].institution = e.target.value;
                              setAnalysis((prev) => ({
                                ...prev,
                                education: updatedEducation,
                              }));
                            }}
                            className="w-full border rounded p-2"
                          />
                        </div>
                        <div className="mb-2">
                          <label className="block font-medium">Graduation Date</label>
                          <input
                            type="text"
                            value={edu.graduation_date || ""}
                            onChange={(e) => {
                              const updatedEducation = [...analysis.education];
                              updatedEducation[index].graduation_date = e.target.value;
                              setAnalysis((prev) => ({
                                ...prev,
                                education: updatedEducation,
                              }));
                            }}
                            className="w-full border rounded p-2"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const updatedEducation = analysis.education.filter(
                              (_, i) => i !== index
                            );
                            setAnalysis((prev) => ({
                              ...prev,
                              education: updatedEducation,
                            }));
                          }}
                          className="mt-2 bg-red-500 text-white py-1 px-4 rounded hover:bg-red-600"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() =>
                        setAnalysis((prev) => ({
                          ...prev,
                          education: [
                            ...prev.education,
                            { degree: "", institution: "", graduation_date: "" },
                          ],
                        }))
                      }
                      className="bg-green-500 text-white py-1 px-4 rounded hover:bg-green-600"
                    >
                      Add Education
                    </button>
                  </div>
                </div>
              )}
            </div>
         
          </div>
        </main>
      </div>
    </div>
  );
};

export default CVUploadForm;
