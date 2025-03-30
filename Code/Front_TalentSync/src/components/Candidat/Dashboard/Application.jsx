import React, { useState, useEffect } from "react";
import {
  Menu,
  History,
  PlusSquare,
  Settings,
  CreditCard,
  PenTool,
  Moon,
  Sun,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  Upload,
  FileText,
  Wrench
} from "lucide-react";
import { Dialog } from "@headlessui/react";
import { Menu as HeadlessMenu } from "@headlessui/react";
import { BellIcon } from "@heroicons/react/24/outline";
import { MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import CV from "./CV/CvCreation";
import { Link, useLocation } from "react-router-dom"; // Import useLocation
import axios from "axios";

import { useDarkMode } from "../../DarkModeProvider";
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

const SearchBar = ({ navigationMenu, navigationOption }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMenu = navigationMenu.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredOption = navigationOption.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Search Input */}
      <div className="relative max-w-md w-full">
        <Search className=" absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-black dark:text-zinc-300" />
        <input
          type="search"
          placeholder="Search..."
          className="w-80 pl-10 pr-4 py-2 transition-all duration-300 ease-in-out bg-zinc-200 text-black dark:bg-zinc-900 dark:text-white rounded-lg border border-zinc-100 dark:border-zinc-800 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 placeholder-gray-900 dark:placeholder-gray-400"
          onClick={() => setIsModalOpen(true)}
          readOnly
        />
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setIsModalOpen(false)} // Close modal on background click
        >
          <div
            className="bg-white  w-50%  dark:bg-zinc-900 p-6 rounded-lg shadow-lg w-full max-w-md relative"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
          >
            {/* Close Button - Fixed positioning */}
            <button
              className="absolute top-3 right-3  rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition-colors"
              onClick={() => setIsModalOpen(false)}
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            
            {/* Search Input Inside Modal */}
            <div className="relative mb-4  mt-5">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-black dark:text-zinc-300" />
              <input
                type="search"
                placeholder="Type a command or search..."
                className="w-full pl-10 pr-4 py-2 bg-zinc-200 text-black dark:bg-zinc-800 dark:text-white rounded-lg border border-zinc-100 dark:border-zinc-700 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 placeholder-gray-900 dark:placeholder-gray-400"
                autoFocus
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Dropdown Menu */}
            <div>
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                MENU
              </div>
              {filteredMenu.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 text-gray-700 dark:text-gray-300"
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </a>
              ))}
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-4 mb-2">
                OPTIONS
              </div>
              {filteredOption.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 text-gray-700 dark:text-gray-300"
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
const UserMenu = () => {
  const handleSignout = () => {
    localStorage.removeItem("token");
    fetch("http://localhost:5000/api/auth/logout", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    }).then(() => {
      window.location.href = "/";
    });
  };

  const menuItems = [
    { label: "Your History", href: "#profile" },
    { label: "Settings", href: "/Settings" },
  ];
  const { isDarkMode, toggleTheme } = useDarkMode();

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

      <MenuItems
        className={`absolute right-0 z-50 mt-2 w-48 rounded-md py-1 border-2 border-dashed  shadow-xl  focus:outline-none 
    ${
      isDarkMode
        ? "bg-zinc-900 text-white bg-opacity-100 border-zinc-400"
        : "bg-zinc-200 text-black bg-opacity-5  border-zinc-700"
    } backdrop-blur-sm`}
      >
        {menuItems.map(({ label, href }) => (
          <MenuItem key={label}>
            {({ active }) => (
              <a
                href={href}
                className={`block px-4 py-2 text-sm  border-b-2 border-dashed ${
                  active
                    ? isDarkMode
                      ? "bg-zinc-900 text-white " // Dark mode: Different active bg color
                      : "bg-zinc-300 text-black" // Light mode: Default active color
                    : isDarkMode
                    ? "bg-zinc-950 text-zinc-100 border-zinc-400" // Dark mode: Normal state
                    : "text-black" // Light mode: Normal state
                }`}
              >
                {label}
              </a>
            )}
          </MenuItem>
        ))}

        <MenuItem>
          {({ active }) => (
            <button
              onClick={handleSignout}
              className={`block w-full text-left px-4 py-2 text-sm border-b-2 border-dashed ${
                active
                  ? isDarkMode
                    ? "bg-zinc-900 text-white " // Dark mode: Different active bg color
                    : "bg-zinc-300 text-black" // Light mode: Default active color
                  : isDarkMode
                  ? "bg-zinc-950 text-zinc-100 border-zinc-400" // Dark mode: Normal state
                  : "text-black" // Light mode: Normal state
              }`}
            >
              Sign out
            </button>
          )}
        </MenuItem>
        <MenuItem>
          {({ active }) => (
            <button
              onClick={toggleTheme}
              className={` w-full text-left px-4 py-2 text-sm flex items-center justify-between ${
                active
                  ? isDarkMode
                    ? "bg-zinc-900 text-white" // Dark mode: Active bg color
                    : "bg-zinc-300 text-black" // Light mode: Active bg color
                  : isDarkMode
                  ? "bg-zinc-950 text-zinc-100 border-zinc-400" // Dark mode: Normal state
                  : "text-black" // Light mode: Normal state
              }`}
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              <span>Theme</span>
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-gray-600 dark:text-zinc-100" />
              ) : (
                <Moon className="w-5 h-5 text-gray-900 dark:text-gray-400" />
              )}
            </button>
          )}
        </MenuItem>
      </MenuItems>
    </HeadlessMenu>
  );
};

const SidebarLayout = () => {
  const location = useLocation(); // Get location object
  const selectedJob = location.state?.job; // Extract job data from state

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalTwoOpen, setIsModalTwoOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [useSavedData, setUseSavedData] = useState(false);
  const [cvData, setCvData] = useState(null); // Data extracted from CV
  const [recommendations, setRecommendations] = useState([]);
  const [useExistingData, setUseExistingData] = useState(null);

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
  ];

  const { isDarkMode, toggleTheme } = useDarkMode();
  const [file, setFile] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [userData, setUserData] = useState({
    personalInfo: {
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "(555) 123-4567",
      location: "New York, NY"
    },
    experience: [
      {
        title: "Senior Developer",
        company: "Tech Solutions Inc.",
        duration: "2020 - Present",
        description: "Full-stack development with React and Node.js"
      },
      {
        title: "Web Developer",
        company: "Digital Creations",
        duration: "2017 - 2020",
        description: "Frontend development with JavaScript and CSS"
      }
    ],
    education: [
      {
        degree: "B.S. Computer Science",
        institution: "Tech University",
        year: "2017"
      }
    ],
    skills: ["JavaScript", "React", "Node.js", "CSS", "HTML", "Git", "SQL"]
  });

  const handleNext = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePrevious = () => {
    setCurrentPage(currentPage - 1);
  };

  const handleSelection = (useExisting) => {
    setUseExistingData(useExisting);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 1:
        return (
          <div className="max-w-4xl mx-auto px-0 py-1">
            <h1 className="text-2xl font-bold text-center mb-4 text-gray-900 dark:text-white">Application Session</h1>
            
            <div className="mb-8">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                Step 1 of 4 (Data)
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-zinc-900 rounded-lg p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Step 1</h2>
              <p className="text-gray-700 dark:text-gray-300">
                Do you want to use your saved data or add new CV?
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 dark:bg-zinc-900 rounded-lg p-6">
                <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Options</h3>
                <div className="space-y-4">
                  <button 
                    className={`w-full py-3 px-4 ${useExistingData === true ? 'bg-blue-600' : 'bg-blue-500 hover:bg-blue-600'} text-white rounded-lg transition-colors font-medium`}
                    onClick={() => handleSelection(true)}
                  >
                    Use Saved Data
                  </button>
                  <button 
                    className={`w-full py-3 px-4 ${useExistingData === false ? 'bg-gray-300 dark:bg-gray-600' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'} text-gray-800 dark:text-white rounded-lg transition-colors font-medium`}
                    onClick={() => handleSelection(false)}
                  >
                    Add New CV
                  </button>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-zinc-900 rounded-lg p-6">
                <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Your Selection</h3>
                <div className="h-40 flex items-center justify-center text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-zinc-950 rounded-lg">
                  {useExistingData === null ? (
                    selectedJob ? (
                      <div>
                        <p className="text-center text-gray-700 dark:text-gray-300">
                          Job Title: {selectedJob.title}
                        </p>
                        <p className="text-center text-gray-700 dark:text-gray-300">
                          Company: {selectedJob.company}
                        </p>
                      </div>
                    ) : (
                      "Please select an option"
                    )
                  ) : useExistingData ? (
                    "You have chosen to use your saved CV data"
                  ) : (
                    "You have chosen to add a new CV"
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="max-w-4xl mx-auto px-0 py-1">
            <h1 className="text-2xl font-bold text-center mb-4 text-gray-900 dark:text-white">Application Session</h1>
            
            <div className="mb-8">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                Step 2 of 4 (Data review)
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-zinc-900 rounded-lg p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white"> Step 2
              Review your data.</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Please review your CV information below.
              </p>
            </div>
            
            <div className="space-y-6 mb-8">
              {/* Personal Info */}
              <div className="bg-gray-50  dark:bg-zinc-900 rounded-lg p-6">
                <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Personal Information</h3>
                <div className="space-y-2">
                  <p className="text-gray-700 dark:text-gray-300"><span className="font-medium">Name:</span> {userData.personalInfo.name}</p>
                  <p className="text-gray-700 dark:text-gray-300"><span className="font-medium">Email:</span> {userData.personalInfo.email}</p>
                  <p className="text-gray-700 dark:text-gray-300"><span className="font-medium">Phone:</span> {userData.personalInfo.phone}</p>
                  <p className="text-gray-700 dark:text-gray-300"><span className="font-medium">Location:</span> {userData.personalInfo.location}</p>
                </div>
              </div>
              
              {/* Experience */}
              <div className="bg-gray-50  dark:bg-zinc-900 rounded-lg p-6">
                <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Work Experience</h3>
                <div className="space-y-4">
                  {userData.experience.map((exp, index) => (
                    <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0 last:pb-0">
                      <h4 className="font-medium text-gray-800 dark:text-gray-200">{exp.title}</h4>
                      <p className="text-gray-600 dark:text-gray-400">{exp.company} | {exp.duration}</p>
                      <p className="text-gray-700 dark:text-gray-300 mt-2">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Education */}
              <div className="bg-gray-50  dark:bg-zinc-900 rounded-lg p-6">
                <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Education</h3>
                <div className="space-y-4">
                  {userData.education.map((edu, index) => (
                    <div key={index}>
                      <h4 className="font-medium text-gray-800 dark:text-gray-200">{edu.degree}</h4>
                      <p className="text-gray-600 dark:text-gray-400">{edu.institution} | {edu.year}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Skills */}
              <div className="bg-gray-50  dark:bg-zinc-900 rounded-lg p-6">
                <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {userData.skills.map((skill, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="max-w-4xl mx-auto px-0 py-1">
            <h1 className="text-2xl font-bold text-center mb-8 text-gray-900 dark:text-white">Application Session</h1>
            
            <div className="mb-8">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                Step 3 of 4 (Recommandations)
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-zinc-900 rounded-lg p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Recommendations</h2>
              <p className="text-gray-700 dark:text-gray-300">
                Based on your CV, here are some recommendations to improve your application.
              </p>
            </div>
            
            <div className="space-y-6 mb-8">
              {/* Recommendations */}
              <div className="bg-gray-50 dark:bg-zinc-900 rounded-lg p-6">
                <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Profile Recommendations</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-300">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800 dark:text-gray-200">Add a professional summary</h4>
                      <p className="text-gray-700 dark:text-gray-300 mt-1">A concise professional summary can help recruiters quickly understand your expertise and career focus.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="flex-shrink-0 w-10 h-10 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center text-green-600 dark:text-green-300">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800 dark:text-gray-200">Quantify your achievements</h4>
                      <p className="text-gray-700 dark:text-gray-300 mt-1">Adding specific numbers and metrics to your accomplishments can make your experience more impactful.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="flex-shrink-0 w-10 h-10 bg-purple-100 dark:bg-purple-800 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-300">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800 dark:text-gray-200">Add certifications or courses</h4>
                      <p className="text-gray-700 dark:text-gray-300 mt-1">Including relevant certifications or coursework can strengthen your qualifications, especially in technical fields.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Edit CV Button */}
              <div className="flex justify-end">
                <button className="py-3 px-6 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg transition-colors font-medium">
                  Edit CV Data
                </button>
              </div>
            </div>
          </div>
        );
        
      case 4:
        return (
          <div className="max-w-4xl mx-auto px-0 py-5">
            <h1 className="text-2xl font-bold text-center mb-8 text-gray-900 dark:text-white">Application Session</h1>
            
            <div className="mb-8">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                Step 4 of 4 (Submitting)
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Submit Application</h2>
              <p className="text-gray-700 dark:text-gray-300">
                Please review all your information before submitting your application.
              </p>
            </div>
            
            <div className="space-y-6 mb-8">
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center text-green-600 dark:text-green-300">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Ready to Submit</h3>
                    <p className="text-gray-700 dark:text-gray-300 mt-1">Your application is ready to be submitted with all the information provided.</p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center">
                <button className="py-3 px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium text-lg">
                  Submit Application
                </button>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "dark" : ""
      } transition-all duration-300 ease-in-out z-30 `}
    >
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

          <nav className="flex-1 overflow-y-auto p-4  ">
            <div className="space-y-3">
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
              <div className="text-sm font-medium text-gray-400 px-2">
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

        <main className="flex-1 overflow-auto bg-white dark:bg-black transition-all duration-300 ease-in-out z-30">
      <header className="bg-white dark:bg-black border-gray-200 dark:border-gray-800 sticky top-0 transition-all duration-300 ease-in-out z-30">
        <div className="flex items-center justify-between px-6 py-4">
          <SearchBar navigationMenu={navigation_menu} navigationOption={navigation_option} />
          <div className="flex items-center gap-4">
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
          </div>
        </div>
      </header>

      {renderPage()}
      
      <div className="max-w-4xl mx-auto  py-1 mb-2">
        <div className="flex justify-between">
          <button 
            className={`py-2 px-4 ${currentPage === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white'} rounded-lg`}
            onClick={handlePrevious}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <div className="flex space-x-4">
            <span className={`flex items-center justify-center w-8 h-8 ${currentPage === 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'} rounded-full`}>1</span>
            <span className={`flex items-center justify-center w-8 h-8 ${currentPage === 2 ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'} rounded-full`}>2</span>
            <span className={`flex items-center justify-center w-8 h-8 ${currentPage === 3 ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'} rounded-full`}>3</span>
            <span className={`flex items-center justify-center w-8 h-8 ${currentPage === 4 ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'} rounded-full`}>4</span>
          </div>
          <button 
            className={`py-2 px-4 ${currentPage === 4 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'} rounded-lg`}
            onClick={handleNext}
            disabled={currentPage === 4}
          >
            Next
          </button>
        </div>
      </div>
    </main>
</div>
</div>
  );
};

export default SidebarLayout;
