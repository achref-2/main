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
  Wrench,
  Info,
  Loader,
  AlertCircle,
  Briefcase,
  FileClock,
  LogOut
} from "lucide-react";
import { Dialog } from "@headlessui/react";
import { Menu as HeadlessMenu } from "@headlessui/react";
import { BellIcon } from "@heroicons/react/24/outline";
import { MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import CV from "./CV/CvCreation";
import { Link, useLocation } from "react-router-dom"; // Import useLocation
import axios from "axios";
import LoadingAnimation from './LoginAnimation'; // Adjust the path if needed
import { useDarkMode } from "../../../components/DarkModeProvider";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
const NavLink = ({ href, icon: Icon, children, isActive, disabled }) => (
  <Link
    to={disabled ? "#" : href} // Prevent navigation if disabled
    className={`group flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-300 ease-in-out z-30
      ${
        disabled
          ? "cursor-not-allowed text-gray-400 dark:text-gray-600"
          : isActive
          ? "bg-zinc-200 text-black dark:bg-zinc-900 dark:text-white"
          : "text-gray-500 hover:bg-zinc-200 hover:text-black dark:text-gray-400 dark:hover:bg-zinc-900 dark:hover:text-white"
      }
    `}
    aria-current={isActive ? "page" : undefined}
    onClick={(e) => {
      if (disabled) {
        e.preventDefault(); // Prevent navigation if disabled
      }
    }}
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
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
const UserMenu = ({ profilePic, firstName, lastName, email }) => {
  const { isDarkMode, toggleTheme } = useDarkMode();


  const handleSignout = () => {
    localStorage.clear();
    sessionStorage.clear();
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
    {
      label: "Your History",
      href: "#profile",
      icon: History,
      description: "View your past activities",
    },
    {
      label: "Settings",
      href: "/Settings",
      icon: Settings,
      description: "Manage your preferences",
    },
  ];

  return (
    <HeadlessMenu as="div" className="relative">
      {({ open }) => (
        <>
          <MenuButton className="flex items-center focus:outline-none">
            <div className="relative">
            <img
  className={`h-9 w-9 rounded-full object-cover ring-2 transition-all duration-200 ${
    open
      ? "ring-blue-500 ring-offset-2 ring-offset-white dark:ring-offset-zinc-900"
      : "ring-gray-200 dark:ring-gray-700 hover:ring-blue-400"
  }`}
  src={profilePic || "../../assets/images/avatar.jpg"} // Use the profilePic prop
  alt="User avatar"
/>
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 ring-1 ring-white dark:ring-zinc-900"></span>
            </div>
          </MenuButton>

          <MenuItems
            className={`absolute right-0 z-50 mt-2 w-64 origin-top-right rounded-xl py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none transform transition-all duration-100 ${
              open ? "scale-100 opacity-100" : "scale-95 opacity-0"
            } ${
              isDarkMode
                ? "bg-zinc-800 text-white border border-zinc-700"
                : "bg-white text-gray-800 border border-gray-100"
            }`}
          >
            {/* Header with user info */}
            <div className="px-4 py-3 border-b border-gray-100 dark:border-zinc-700">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <img
                    className="h-10 w-10 rounded-full"
                    src={profilePic || "../../assets/images/avatar.jpg"} // Use the profilePic prop
                    alt="User avatar"
                  />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {`${firstName} ${lastName}`} {/* Use the firstName and lastName props */}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {email} {/* Use the email prop */}
                  </p>
                </div>
              </div>
            </div>

            <div className="py-1">
              {menuItems.map(({ label, href, icon: Icon, description }) => (
                <MenuItem key={label}>
                  {({ active }) => (
                    <a
                      href={href}
                      className={`group flex items-center justify-between px-4 py-2 text-sm ${
                        active
                          ? "bg-gray-100 text-gray-900 dark:bg-zinc-700 dark:text-white"
                          : "text-gray-700 dark:text-gray-200"
                      }`}
                    >
                      <div className="flex items-center">
                        <div
                          className={`mr-3 p-1 rounded-md ${
                            active
                              ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                              : "bg-gray-100 text-gray-500 dark:bg-zinc-700 dark:text-gray-400"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-medium">{label}</p>
                          {description && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {description}
                            </p>
                          )}
                        </div>
                      </div>
                      <ChevronRight
                        className={`w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-150 ${
                          active ? "opacity-100" : ""
                        }`}
                      />
                    </a>
                  )}
                </MenuItem>
              ))}
            </div>

            <div className="border-t border-gray-100 dark:border-zinc-700 py-1">
              <MenuItem>
                {({ active }) => (
                  <button
                    onClick={toggleTheme}
                    className={`w-full group flex items-center justify-between px-4 py-2 text-sm ${
                      active
                        ? "bg-gray-100 text-gray-900 dark:bg-zinc-700 dark:text-white"
                        : "text-gray-700 dark:text-gray-200"
                    }`}
                  >
                    <div className="flex items-center">
                      <div
                        className={`mr-3 p-1 rounded-md ${
                          active
                            ? "bg-amber-100 text-amber-600 dark:bg-indigo-900 dark:text-indigo-300"
                            : "bg-gray-100 text-gray-500 dark:bg-zinc-700 dark:text-gray-400"
                        }`}
                      >
                        {isDarkMode ? (
                          <Sun className="w-4 h-4" />
                        ) : (
                          <Moon className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">
                          {isDarkMode ? "Light Mode" : "Dark Mode"}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Switch appearance
                        </p>
                      </div>
                    </div>
                    <div className="flex h-5 items-center">
                      <div
                        className={`w-9 h-5 flex items-center rounded-full p-1 ${
                          isDarkMode ? "bg-indigo-600" : "bg-gray-300"
                        }`}
                      >
                        <div
                          className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                            isDarkMode ? "translate-x-3" : "translate-x-0"
                          }`}
                        />
                      </div>
                    </div>
                  </button>
                )}
              </MenuItem>
            </div>

            <div className="border-t border-gray-100 dark:border-zinc-700 py-1">
              <MenuItem>
                {({ active }) => (
                  <button
                    onClick={handleSignout}
                    className={`group flex items-center justify-between w-full px-4 py-2 text-sm ${
                      active
                        ? "bg-gray-100 text-red-600 dark:bg-zinc-700 dark:text-red-400"
                        : "text-gray-700 dark:text-gray-200"
                    }`}
                  >
                    <div className="flex items-center">
                      <div
                        className={`mr-3 p-1 rounded-md ${
                          active
                            ? "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300"
                            : "bg-gray-100 text-gray-500 dark:bg-zinc-700 dark:text-gray-400"
                        }`}
                      >
                        <LogOut className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-medium">Sign out</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          End your current session
                        </p>
                      </div>
                    </div>
                  </button>
                )}
              </MenuItem>
            </div>
          </MenuItems>
        </>
      )}
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
  const [isAddCvModalOpen, setIsAddCvModalOpen] = useState(false);
    const [profilePicFile, setProfilePicFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [activeSection, setActiveSection] = useState(null);

      const [profilePic, setProfilePic] = useState(""); // Default to an empty string
     const [firstName, setFirstName] = useState(""); // Default to an empty string
      const [lastName, setLastName] = useState(""); // Default to an empty string
      const [email, setEmail] = useState("");
  // State for Add CV Modal
  const [backendData, setBackendData] = useState({
    personalInfo: {},
    experience: [],
    education: [],
    skills: [],
  });
  const [fileName, setFileName] = useState("");
  const [fileSelected, setFileSelected] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const handleAddCvModalOpen = () => setIsAddCvModalOpen(true);
  const handleAddCvModalClose = () => setIsAddCvModalOpen(false);
  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const navigation_menu = [
    { name: "Dashboard", href: "/dashboard", icon: Menu, current: false },
    {
      name: "Past Applications",
      href: "/dashboard/PastApplications",
      icon: FileClock,
      current: false,
    },
    { name: "Jobs", href: "/Jobs", icon: Briefcase, current: false },
    { name: "Billing", href: "/Pricing", icon: CreditCard, current: false },
  ];
  const navigation_option = [
    { name: "Settings", href: "/Settings", icon: Settings, current: false },
    { name: "Support", href: "/cv", icon: Wrench, current: false , disabled: true},
  ];

  const { isDarkMode } = useDarkMode();
  const [file, setFile] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  
 useEffect(() => {
      const fetchUserData = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get("http://localhost:5000/api/candidates/profile", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
    
          const { candidate } = response.data;
    
          setProfilePic(candidate.profilePic || "../../assets/images/avatar.jpg");
          setFirstName(candidate.name?.split(" ")[0] || "");
          setLastName(candidate.name?.split(" ").slice(1).join(" ") || "");
          setEmail(candidate.email || "");
        } catch (error) {
          console.error("Error fetching user data:", error.message);
          alert("Failed to fetch user data. Please try again later.");
        }
      };
    
      fetchUserData();
    }, [isDarkMode]);

  const handleNext = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePrevious = () => {
    setCurrentPage(currentPage - 1);
  };

  const handleSelection = async (useExisting) => {
    setUseExistingData(useExisting);
  
    if (useExisting) {
      try {
        // Fetch candidate data from the backend
        const response = await axios.get("http://localhost:5000/api/candidates/get-candidate-data", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Include the token for authentication
          },
        });
  
        if (response.status === 200 && response.data.candidate) {
          const candidateData = response.data.candidate;
          const analysisData = response.data.analysis; // Fetch analysis data from the response
  
          // Map the fetched data to the form fields
          const savedData = {
            name: candidateData.personalInfo?.name || "",
            email: candidateData.personalInfo?.email || "",
            phone: candidateData.personalInfo?.phone || "",
            experience: candidateData.experience || "",
            skills: candidateData.skills || "",
            languages: candidateData.languages || "", // Updated to fetch directly from candidateData.languages
            linkedIn: candidateData.personalInfo?.linkedIn || "",
            github: candidateData.personalInfo?.github || "",
            analysisFeedback: analysisData?.feedback?.resume || "", // Include analysis feedback
            analysisSuggestions: analysisData?.feedback?.linkedin || "", // Include LinkedIn suggestions
          };
  
          setFormData(savedData); // Populate the form with fetched data
          console.log("Fetched candidate data and analysis:", savedData);
          setCurrentPage(2); // Navigate to Step 2
        } else {
          console.warn("Unexpected response format:", response);
          alert("Failed to retrieve candidate data. Please try again.");
        }
      } catch (error) {
        console.error("Error fetching candidate data:", error);
        alert("An error occurred while fetching candidate data. Please try again.");
      }
    } else {
      // Reset the form data if not using existing data
      setFormData({
        name: "",
        email: "",
        phone: "",
        experience: "",
        skills: "",
        languages: "",
        linkedIn: "",
        github: "",
        analysisFeedback: "",
        analysisSuggestions: "",
      });
    }
  };
  
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    experience: "",
    skills: "",
    additional: "",
    languages: "",
    linkedIn: "",
    github: "",
    projects: "",
    feedback: {
      strengths: [],
      areasForImprovement: [],
      linkedinSuggestions: [],
    },
  });
  useEffect(() => {
    if (backendData?.result) {
      const links = parseLinksSection(backendData.result.raw_analysis);
      const feedback = parseFeedbackSection(backendData.result.raw_analysis);

      setFormData({
        name: backendData.result.contacts?.name?.replace(/^\\*\s/, "") || "",
        email:
          backendData.result.contacts?.email?.replace(/^\\*\s/, "") || "",
        phone:
          backendData.result.contacts?.phone?.replace(/^\\*\s/, "") || "",
        experience:
          parseExperienceSection(backendData.result.raw_analysis, true) || "",
        skills: parseSkillsSection(backendData.result.raw_analysis, true) || "",
       
        languages:
          parseLanguagesSection(backendData.result.raw_analysis, true) || "",
        linkedIn: links.linkedIn,
        github: links.github,
        projects:
          parseProjectsSection(backendData.result.raw_analysis, true) || "",
        feedback,
      });
    }
  }, [backendData]);
  


 
  const renderEditableField = (label, field, value, isTextarea = false) => {
    return (
      <div className="mb-4">
        <label htmlFor={field} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
        {isTextarea ? (
          <textarea
            id={field}
            name={field}
            value={value}
            onChange={(e) => handleInputChange(field, e.target.value)}
            rows={5}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
          />
        ) : (
          <input
            type="text"
            id={field}
            name={field}
            value={value}
            onChange={(e) => handleInputChange(field, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
          />
        )}
      </div>
    );
  };
  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const handleSave = () => {
    setIsLoading(true);
    // Simulating API call
    setTimeout(() => {
      setIsLoading(false);
      setEditMode(false);
      // Here you would typically send data to backend
    }, 1000);
  };
  // Helper function to parse and display experience section
  const parseExperienceSection = (rawAnalysis, asPlainText = false) => {
    try {
      const experienceMatch = rawAnalysis.match(
        /\*\*(?:\d+\.)?\s*Work Experience Summary:\*\*([\s\S]*?)(?=\*\*3\.)/
      );

      if (experienceMatch && experienceMatch[1]) {
        const experienceText = experienceMatch[1].trim();

        if (asPlainText) {
          // Return plain text for form inputs
          return experienceText
            .replace(/\*\*/g, "")
            .replace(/\n\n/g, "\n")
            .replace(/\* /g, "- ");
        }

        // Return HTML for display
        return (
          <div
            dangerouslySetInnerHTML={{
              __html: experienceText
                .replace(/\*\*/g, "<strong>")
                .replace(/\*\*/g, "</strong>")
                .replace(/\n\n/g, "<br/><br/>")
                .replace(/\* /g, "• "),
            }}
          />
        );
      }

      return asPlainText ? (
        ""
      ) : (
        <p>No detailed experience information available.</p>
      );
    } catch (error) {
      console.error("Error parsing experience section:", error);
      return asPlainText ? "" : <p>Error displaying experience information.</p>;
    }
  };

  // Updated parseSkillsSection to ensure only skills are displayed
  const parseSkillsSection = (rawAnalysis, asPlainText = false) => {
    try {
      const skillsMatch = rawAnalysis.match(
       /\*\*(?:\d+\.)?\s*Technical Skills:\*\*([\s\S]*?)(?=\*\*\d+\.\s|$)/ // Match only the Technical Skills section
      );

      if (skillsMatch && skillsMatch[1]) {
        const skillsText = skillsMatch[1].trim();

        if (asPlainText) {
          return skillsText
            .replace(/\*\*/g, "")
            .replace(/\n\n/g, "\n")
            .replace(/\* /g, "- ");
        }

        return (
          <div
            dangerouslySetInnerHTML={{
              __html: skillsText
                .replace(/\*\*/g, "<strong>")
                .replace(/\*\*/g, "</strong>")
                .replace(/\n\n/g, "<br/><br/>")
                .replace(/\* /g, "• "),
            }}
          />
        );
      }

      return asPlainText ? "" : <p>No skills data available.</p>;
    } catch (error) {
      console.error("Error parsing skills section:", error);
      return asPlainText ? "" : <p>Error displaying skills information.</p>;
    }
  };

 

  // Helper function to parse and display languages
  const parseLanguagesSection = (rawAnalysis, asPlainText = false) => {
    try {
      // More flexible regex pattern to match Languages section regardless of numbering
      const languagesMatch = rawAnalysis.match(
        /\*\*(?:\d+\.)?\s*Languages:\*\*([\s\S]*?)(?=\*\*\d+\.|$)/
      );
  
      // Alternative pattern to try if the first one fails
      const alternateMatch = !languagesMatch && rawAnalysis.match(
        /\*\*Languages:\*\*([\s\S]*?)(?=\*\*|$)/
      );
  
      const matchResult = languagesMatch || alternateMatch;
  
      if (matchResult && matchResult[1]) {
        const languagesText = matchResult[1].trim();
  
        if (asPlainText) {
          // Return plain text for form inputs
          return languagesText
            .replace(/\*\*/g, "")
            .replace(/\n\n/g, "\n")
            .replace(/\* /g, "- ");
        }
  
        // Return HTML for display
        return (
          <div
            dangerouslySetInnerHTML={{
              __html: languagesText
                .replace(/\*\*/g, "<strong>")
                .replace(/\*\*/g, "</strong>")
                .replace(/\n\n/g, "<br/><br/>")
                .replace(/\* /g, "• "),
              }}
          />
        );
      }
  
      // Check if languages might be in technical skills section
      const skillsMatch = rawAnalysis.match(
        /\*\*(?:\d+\.)?\s*Technical Skills:\*\*([\s\S]*?)(?=\*\*\d+\.|$)/
      );
  
      if (skillsMatch && skillsMatch[1] && skillsMatch[1].toLowerCase().includes("language")) {
        // If we find languages mentioned in skills section, try to extract them
        const skillsText = skillsMatch[1].trim();
        const languagePortion = skillsText.split(/\n\n/).find(section => 
          section.toLowerCase().includes("language")
        );
  
        if (languagePortion) {
          if (asPlainText) {
            return languagePortion
              .replace(/\*\*/g, "")
              .replace(/\n\n/g, "\n")
              .replace(/\* /g, "- ");
          }
  
          return (
            <div
              dangerouslySetInnerHTML={{
                __html: languagePortion
                  .replace(/\*\*/g, "<strong>")
                  .replace(/\*\*/g, "</strong>")
                  .replace(/\n\n/g, "<br/><br/>")
                  .replace(/\* /g, "• "),
              }}
            />
          );
        }
      }
  
      return asPlainText ? "" : <p>No language information available.</p>;
    } catch (error) {
      console.error("Error parsing languages section:", error);
      return asPlainText ? "" : <p>Error displaying language information.</p>;
    }
  };
  // Helper function to parse LinkedIn and GitHub links
  const parseLinksSection = (rawAnalysis) => {
    try {
      const linkedInMatch = rawAnalysis.match(
        /\*\*LinkedIn:\*\*\s*(https?:\/\/[^\s]+|www\.[^\s]+)/i
      );
      const githubMatch = rawAnalysis.match(
        /\*\*GitHub:\*\*\s*(https?:\/\/[^\s]+)/i
      );

      return {
        linkedIn: linkedInMatch ? linkedInMatch[1] : "Not available",
        github: githubMatch ? githubMatch[1] : "Not available",
      };
    } catch (error) {
      console.error("Error parsing links section:", error);
      return {
        linkedIn: "Error extracting LinkedIn link.",
        github: "Error extracting GitHub link.",
      };
    }
  };

  // Updated parseProjectsSection to fix Key Projects parsing
  const parseProjectsSection = (rawAnalysis) => {
    try {
      const projectsMatch = rawAnalysis.match(
       /\*\*(?:\d+\.)?\s* Key Projects:\*\*([\s\S]*?)(?=\*\*\d+\.\s|$)/ // Match only the Key Projects section
      );

      if (projectsMatch && projectsMatch[1]) {
        const projectsText = projectsMatch[1].trim();

        return (
          <div
            dangerouslySetInnerHTML={{
              __html: projectsText
                .replace(/\*\*/g, "<strong>")
                .replace(/\*\*/g, "</strong>")
                .replace(/\n\n/g, "<br/><br/>")
                .replace(/\* /g, "• "),
            }}
          />
        );
      }

      return <p>No key projects information available.</p>;
    } catch (error) {
      console.error("Error parsing key projects section:", error);
      return <p>Error displaying key projects information.</p>;
    }
  };

  // Updated extractLinkedInSuggestions to display LinkedIn Profile Suggestions separately
  const extractLinkedInSuggestions = (rawAnalysis) => {
    try {
      const linkedInMatch = rawAnalysis.match(
        /\*\*(?:\d+\.)?\s*LinkedIn Profile Suggestions:\*\*([\s\S]*?)(?=\*\*\d+\.\s|$)/ // Match only the LinkedIn Profile Improvements section
      );

      if (linkedInMatch && linkedInMatch[1]) {
        return linkedInMatch[1]
          .split("*")
          .map((item) => item.trim())
          .filter((item) => item.length > 0);
      }

      return [];
    } catch (error) {
      console.error("Error extracting LinkedIn suggestions:", error);
      return [];
    }
  };

  // Function to extract resume strengths
  const extractResumeStrengths = (rawAnalysis) => {
    if (!rawAnalysis) return [];
    
    const strengthsSection = rawAnalysis.split("**Strengths:**")[1];
    if (!strengthsSection) return [];
    
    const endIndex = strengthsSection.indexOf("**Areas for Improvement:**");
    const relevantSection = endIndex !== -1 
      ? strengthsSection.substring(0, endIndex) 
      : strengthsSection;
    
    return relevantSection
      .split("*")
      .map(item => item.trim())
      .filter(item => item.length > 0);
  };
  
  // Function to extract areas for improvement
  const extractAreasForImprovement = (rawAnalysis) => {
    if (!rawAnalysis) return [];
    
    const sectionsArray = rawAnalysis.split("**Areas for Improvement:**");
    if (sectionsArray.length < 2) return [];
    
    let areasSection = sectionsArray[1];
    
    // Remove content after "6. LinkedIn Profile Improvements:"
    const endIndex = areasSection.indexOf("**6. LinkedIn Profile Suggestions:**");
    if (endIndex !== -1) {
      areasSection = areasSection.substring(0, endIndex);
    }
    
    return areasSection
      .split("*")
      .map(item => item.trim())
      .filter(item => item.length > 0);
  };
  // Now use these functions safely
  const linkedinSuggestions = extractLinkedInSuggestions(backendData?.result?.raw_analysis || "");
  const resumeStrengths = extractResumeStrengths(backendData?.result?.raw_analysis || "");
  const areasForImprovement = extractAreasForImprovement(backendData?.result?.raw_analysis || "");

  // Function to parse feedback section
  const parseFeedbackSection = (rawAnalysis) => {
    try {
      const feedbackMatch = rawAnalysis.match(
        /\*\*Feedback:\*\*([\s\S]*?)(?=\*\*\d+\.\s|$)/
      );

      if (feedbackMatch && feedbackMatch[1]) {
        return feedbackMatch[1]
          .split("*")
          .map((item) => item.trim())
          .filter((item) => item.length > 0);
      }

      return [];
    } catch (error) {
      console.error("Error parsing feedback section:", error);
      return [];
    }
  };
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
   // Extract jobId from selectedJob
   const handleSubmitApplication = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setIsUploading(true); // Set loading state to true
    
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication token is missing. Please log in again.");
        setIsUploading(false); // Reset loading state
        return;
      }
      
      console.log("selectedJob:", selectedJob._id);
      console.log("Submitting application with the following data:");
      console.log("Cover Letter:", coverLetter);
      console.log("File:", file);
      
      // Create FormData to send the file and other data
      const formData = new FormData();
      formData.append("jobId", selectedJob._id);
      formData.append("coverLetter", coverLetter);
      formData.append("cv", file); // Attach the CV file
      
      // Make the API request
      const response = await axios.post(
        "http://localhost:5000/api/applications/apply-job",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data", // Required for file uploads
          },
        }
      );
      
      console.log("Application submitted successfully:", response.data);
      
      // Display the resume-to-job match score if available
      if (response.data.application && response.data.application.score !== undefined) {
        const score = response.data.application.score;
        const scorePercentage = typeof score === 'number' ? `${Math.round(score * 100)}%` : score;
        
        setMessage(`Application submitted successfully. Your resume match score: ${scorePercentage}`);
        
        // Show toast with score information
        toast.success(
          <div>
            <p>Application submitted successfully!</p>
            <p>Resume match score: <strong>{scorePercentage}</strong></p>
            <p className="text-sm">Redirecting to Past Applications...</p>
          </div>,
          {
            position: "bottom-right",
            autoClose: 5000, // Give users a bit more time to see the score
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            onClose: () => {
              // Redirect to Past Applications after toast closes
              window.location.href = "/dashboard/PastApplications";
            },
          }
        );
      } else {
        // Fallback if no score is available
        setMessage(response.data.message);
        toast.success("Application submitted successfully. Redirecting...", {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          onClose: () => {
            // Redirect to Past Applications after toast closes
            window.location.href = "/dashboard/PastApplications";
          },
        });
      }
      
      // Clear form fields
      setCoverLetter("");
      setFile(null);
    } catch (err) {
      console.error("Error submitting application:", err);
      
      if (err.response) {
        console.error("Backend response:", err.response.data);
        
        // Handle specific error for already applied
        if (err.response.status === 409) {
          toast.error("You have already applied for this job.", {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
          setError("You have already applied for this job.");
        } else {
          setError(err.response.data.message || "An error occurred");
        }
      } else {
        setError("An error occurred while submitting your application.");
      }
    } finally {
      setIsUploading(false); // Reset loading state
    }
  };
  const [coverLetter, setCoverLetter] = useState("");

 const generateCoverLetter = async () => {
  setLoading(true);
  setError(null);

  try {
    const formDataToSend = new FormData();

    // Ensure job details are provided
    if (selectedJob) {
      const jobDetails = `Job Title: ${selectedJob.title}\nCompany: ${selectedJob.companyName}\nDescription: ${selectedJob.description}`;
      formDataToSend.append("jobDetailsText", jobDetails);
    } else {
      throw new Error("Job details are missing.");
    }

    // Convert resume analysis to a file
    const resumeAnalysis = JSON.stringify(formData);
    const blob = new Blob([resumeAnalysis], { type: "application/json" });
    formDataToSend.append("resumeAnalysis", blob, "resumeAnalysis.json");

    // Retrieve candidateId from localStorage
    const candidateId = localStorage.getItem("candidateId");
    if (!candidateId) {
      throw new Error("Candidate ID is missing. Please log in again.");
    }
    formDataToSend.append("candidateId", candidateId);

    const response = await axios.post(
      "http://localhost:5000/api/applications/generate-cover-letter",
      formDataToSend,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    const generatedLetter = response.data.result?.coverLetter || response.data.coverLetter;
    setCoverLetter(generatedLetter);

    const blobResponse = new Blob([generatedLetter], { type: "text/plain" });
    const url = URL.createObjectURL(blobResponse);
    setDownloadUrl(url);

    setLoading(false);
  } catch (err) {
    console.error("Error in cover letter generation process:", err);
    setError(err.message || "Failed to generate cover letter");
    setLoading(false);
  }
};

  // Cover letter generator state
  const [previewActive, setPreviewActive] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDetailsFile, setJobDetailsFile] = useState(null);
  const [jobDetailsText, setJobDetailsText] = useState('');
  const [useJobFile, setUseJobFile] = useState(false);
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);

  
  // Loading animation component


  
  // Auto-populate job details from selectedJob when available
  useEffect(() => {
    if (selectedJob) {
      const formattedJobDetails = `Job Title: ${selectedJob.title}\nCompany: ${selectedJob.companyName}\nDescription: ${selectedJob.description}`;
      setJobDetailsText(formattedJobDetails);
    }
  }, [selectedJob]);
  
  // Handle resume file upload
  
  // Handle form submission
  
  // Reset form
  const [coverLetterGenerated, setCoverLetterGenerated] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
      setCoverLetterGenerated(true); // Consider uploaded file as cover letter present
    }
  };
  const renderPage = () => {
    switch (currentPage) {
      case 1:
        return (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
              Application Session
            </h1>
            
            <div className="mt-6 relative">
              <div className="overflow-hidden h-2 mb-4 flex rounded bg-gray-200 dark:bg-zinc-950">
                <div className="shadow-none flex flex-col justify-center bg-blue-500 w-1/4"></div>
              </div>
              <div className="flex justify-between">
                <div className="text-xs font-medium text-blue-600 dark:text-blue-400">Step 1: Data</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Step 1 of 4</div>
              </div>
            </div>
          </div>
        
          <div className="bg-white dark:bg-zinc-950 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
              Choose Your Application Method
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              You can either use your previously saved data or upload a new CV for this application.
            </p>
            
            <div className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex flex-col space-y-4">
                    <button
                      className={`relative w-full py-4 px-6 rounded-lg transition-all duration-200 flex items-center ${
                        useExistingData === true 
                          ? "bg-blue-50 dark:bg-zinc-950/20 border-2 border-blue-500 dark:border-blue-500" 
                          : "bg-white dark:bg-zinc-950 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-zinc-800"
                      }`}
                      onClick={() => handleSelection(true)}
                    >
                      <div className="mr-4">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 ${
                          useExistingData === true
                            ? "border-blue-500 bg-blue-500"
                            : "border-gray-400 dark:border-gray-400"
                        }`}>
                          {useExistingData === true && (
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                            </svg>
                          )}
                        </div>
                      </div>
                      <div className="flex-1 text-left">
                        <span className="block font-medium text-gray-900 dark:text-white">Use Saved Data</span>
                        <span className="text-sm text-gray-500 dark:text-gray-300">Continue with your existing profile information</span>
                      </div>
                    </button>
        
                    <button
                      className={`relative w-full py-4 px-6 rounded-lg transition-all duration-200 flex items-center ${
                        useExistingData === false
                          ? "bg-blue-50 dark:bg-zinc-950/20 border-2 border-blue-500 dark:border-blue-500"
                          : "bg-white dark:bg-zinc-950 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-zinc-800"
                      }`}
                      onClick={handleAddCvModalOpen}
                    >
                      <div className="mr-4">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 ${
                          useExistingData === false
                            ? "border-blue-500 bg-blue-500"
                            : "border-gray-400 dark:border-gray-400"
                        }`}>
                          {useExistingData === false && (
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                            </svg>
                          )}
                        </div>
                      </div>
                      <div className="flex-1 text-left">
                        <span className="block font-medium text-gray-900 dark:text-white">Add New CV</span>
                        <span className="text-sm text-gray-500 dark:text-gray-300">Upload a new resume for this application</span>
                      </div>
                    </button>
                  </div>
                </div>
                
                {/* Rest of the code remains the same... */}
                <div className="bg-gray-50 dark:bg-zinc-950 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                  <h3 className="text-sm font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-3">
                    Current Selection
                  </h3>
                  
                  <div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-gray-600 p-4 h-40 flex flex-col justify-center">
                    {useExistingData === null ? (
                      selectedJob ? (
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <span className="w-24 text-xs text-gray-500 dark:text-gray-400">Job Title:</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">{selectedJob.title}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="w-24 text-xs text-gray-500 dark:text-gray-400">Company:</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">{selectedJob.companyName}</span>
                          </div>
                          <div className="flex items-start space-x-2">
                            <span className="w-24 text-xs text-gray-500 dark:text-gray-400">Description:</span>
                            <span className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">{selectedJob.description}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center text-gray-500 dark:text-gray-400">
                          <svg className="mx-auto h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <p className="mt-2 text-sm font-medium">Please select an option</p>
                        </div>
                      )
                    ) : useExistingData ? (
                      <div className="text-center">
                        <svg className="mx-auto h-8 w-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Using your saved CV data</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <svg className="mx-auto h-8 w-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Adding a new CV</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
         
        </div>
        );

      case 2:
        return (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
            <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
              Application Session
            </h1>
          <div className="flex items-center justify-center mt-6 mb-8">
            <div className="relative w-full max-w-2xl">
              <div className="overflow-hidden h-2 mb-4 flex rounded bg-gray-200 dark:bg-gray-700">
                <div className="shadow-none flex flex-col justify-center bg-blue-500 w-1/2"></div>
              </div>
              <div className="flex justify-between">
                <div className="text-xs font-medium text-blue-600 dark:text-blue-400">Step 2: Data Review</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Step 2 of 4</div>
              </div>
            </div>
          </div>
    
          <div className="bg-white dark:bg-zinc-950 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-800 p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Review Your Profile Information
              </h2>
              <button
                onClick={() => (editMode ? handleSave() : setEditMode(true))}
                disabled={isLoading}
                className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isLoading 
                    ? "bg-gray-400 text-gray-200 cursor-not-allowed" 
                    : editMode
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : editMode ? (
                  <>
                    <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Save Changes
                  </>
                ) : (
                  <>
                    <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    Edit Profile
                  </>
                )}
              </button>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              {editMode
                ? "Make any necessary changes to your information before proceeding to the next step."
                : "This information was extracted from your uploaded CV. Review it for accuracy before continuing."}
            </p>
          </div>
    
          <div className="space-y-4 mb-8">
            {/* Personal Info */}
            <div className="bg-white dark:bg-zinc-950 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-800 overflow-hidden">
              <button 
                className="w-full px-6 py-4 flex justify-between items-center text-left focus:outline-none"
                onClick={() => toggleSection('personal')}
              >
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Personal Information
                  </h3>
                </div>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`h-5 w-5 text-gray-500 transform transition-transform ${activeSection === 'personal' ? 'rotate-180' : ''}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {(activeSection === 'personal' || activeSection === null) && (
                <div className="px-6 py-4 border-t border-gray-200 dark:border-zinc-800">
                  {editMode ? (
                    <>
                      {renderEditableField("Full Name", "name", formData.name)}
                      {renderEditableField("Email Address", "email", formData.email)}
                      {renderEditableField("Phone Number", "phone", formData.phone)}
                      {renderEditableField("LinkedIn Profile", "linkedIn", formData.linkedIn)}
                      {renderEditableField("GitHub Profile", "github", formData.github)}
                    </>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <p className="text-gray-700 dark:text-gray-300">
                          <span className="inline-block w-24 font-medium">Name:</span> {formData.name}
                        </p>
                        <div className="mt-2 sm:mt-0">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                            Verified
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">
                        <span className="inline-block w-24 font-medium">Email:</span> 
                        <a href={`mailto:${formData.email}`} className="text-blue-600 hover:underline dark:text-blue-400">
                          {formData.email}
                        </a>
                      </p>
                      <p className="text-gray-700 dark:text-gray-300">
                        <span className="inline-block w-24 font-medium">Phone:</span> {formData.phone}
                      </p>
                      {formData.linkedIn && (
                        <p className="text-gray-700 dark:text-gray-300">
                          <span className="inline-block w-24 font-medium">LinkedIn:</span>{" "}
                          <a
                            href={formData.linkedIn}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline dark:text-blue-400 inline-flex items-center"
                          >
                            {formData.linkedIn.replace('https://', '')}
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        </p>
                      )}
                      {formData.github && (
                        <p className="text-gray-700 dark:text-gray-300">
                          <span className="inline-block w-24 font-medium">GitHub:</span>{" "}
                          <a
                            href={formData.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline dark:text-blue-400 inline-flex items-center"
                          >
                            {formData.github.replace('https://', '')}
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
    
            {/* Experience */}
            <div className="bg-white dark:bg-zinc-950 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-800 overflow-hidden">
              <button 
                className="w-full px-6 py-4 flex justify-between items-center text-left focus:outline-none" 
                onClick={() => toggleSection('experience')}
              >
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Work Experience
                  </h3>
                </div>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`h-5 w-5 text-gray-500 transform transition-transform ${activeSection === 'experience' ? 'rotate-180' : ''}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {(activeSection === 'experience' || activeSection === null) && (
  <div className="px-6 py-4 border-t border-gray-200 dark:border-zinc-800">
    {editMode ? (
      renderEditableField(
        "Experience Details",
        "experience",
        formData.experience,
        true
      )
    ) : backendData?.result?.raw_analysis ? (
      <div className="prose dark:prose-invert max-w-none">
        {parseExperienceSection(backendData.result.raw_analysis)}
      </div>
    ) : formData.experience && formData.experience.length > 0 ? (
      <div className="prose dark:prose-invert max-w-none">
        {formData.experience.map((exp, index) => (
          <div key={index} className="mb-4 last:mb-0">
            <div className="flex justify-between items-start">
              <h4 className="font-medium text-gray-900 dark:text-white mb-1">{exp.title} at {exp.company}</h4>
              <span className="text-sm text-gray-500 dark:text-gray-400">{exp.period}</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{exp.location}</p>
            {exp.responsibilities && exp.responsibilities.length > 0 && (
              <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-300">
                {exp.responsibilities.map((resp, idx) => (
                  <li key={idx}>{resp}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    ) : (
      <p className="text-gray-500 dark:text-gray-400">
        No work experience data available
      </p>
    )}
  </div>
)}
            </div>
    
            {/* Skills */}
            <div className="bg-white dark:bg-zinc-950 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-800 overflow-hidden">
              <button 
                className="w-full px-6 py-4 flex justify-between items-center text-left focus:outline-none"
                onClick={() => toggleSection('skills')}
              >
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Skills
                  </h3>
                </div>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`h-5 w-5 text-gray-500 transform transition-transform ${activeSection === 'skills' ? 'rotate-180' : ''}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {(activeSection === 'skills' || activeSection === null) && (
  <div className="px-6 py-4 border-t border-gray-200 dark:border-zinc-800">
    {editMode ? (
      renderEditableField("Skills", "skills", formData.skills, true)
    ) : backendData?.result?.raw_analysis ? (
      <div className="prose dark:prose-invert max-w-none">
        {parseSkillsSection(backendData.result.raw_analysis)}
      </div>
    ) : formData.skills && formData.skills.length > 0 ? (
      <div className="prose dark:prose-invert max-w-none">
        <div className="flex flex-wrap gap-2">
          {formData.skills.map((skill, index) => (
            <span 
              key={index} 
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    ) : (
      <p className="text-gray-500 dark:text-gray-400">
        No skills data available
      </p>
    )}
  </div>
)}
            </div>
            
            {/* Languages */}
            <div className="bg-white dark:bg-zinc-950 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-800 overflow-hidden">
              <button 
                className="w-full px-6 py-4 flex justify-between items-center text-left focus:outline-none"
                onClick={() => toggleSection('languages')}
              >
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Languages
                  </h3>
                </div>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`h-5 w-5 text-gray-500 transform transition-transform ${activeSection === 'languages' ? 'rotate-180' : ''}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {(activeSection === 'languages' || activeSection === null) && (
                <div className="px-6 py-4 border-t border-gray-200 dark:border-zinc-800">
                  {editMode ? (
                    renderEditableField("Languages", "languages", formData.languages, true)
                  ) : backendData?.result?.raw_analysis ? (
                    <div className="prose dark:prose-invert max-w-none">
                      {parseLanguagesSection(backendData.result.raw_analysis)}
                    </div>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400">
                      No language information available
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
    
          
        </div>
        );

        case 3:
          return (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
            <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
              Application Session
            </h1>
              <div className="flex items-center justify-center mt-6 mb-8">
                <div className="relative w-full max-w-2xl">
                  <div className="overflow-hidden h-2 mb-4 flex rounded bg-gray-200 dark:bg-gray-700">
                    <div className="shadow-none flex flex-col justify-center bg-blue-500 w-3/4"></div>
                  </div>
                  <div className="flex justify-between">
                    <div className="text-xs font-medium text-blue-600 dark:text-blue-400">Step 3: Recommendations</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Step 3 of 4</div>
                  </div>
                </div>
              </div>
        
              <div className="space-y-6 mb-8">
                {/* Resume Feedback Section */}
                {resumeStrengths.length > 0 && (
                  <div className="bg-white dark:bg-zinc-950 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-800 p-6">
                    <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Resume Feedback</h3>
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-800 dark:text-gray-200">Strengths:</h4>
                      <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300">
                        {resumeStrengths.map((strength, index) => (
                          <li key={index}>{strength}</li>
                        ))}
                      </ul>
        
                      {areasForImprovement.length > 0 && (
                        <>
                          <h4 className="font-medium text-gray-800 dark:text-gray-200 mt-4">Areas for Improvement:</h4>
                          <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300">
                            {areasForImprovement.map((area, index) => (
                              <li key={index}>{area}</li>
                            ))}
                          </ul>
                        </>
                      )}
                    </div>
                  </div>
                )}
        
                {/* LinkedIn Profile Suggestions Section */}
                {linkedinSuggestions.length > 0 && (
                  <div className="bg-white dark:bg-zinc-950 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-800 p-6">
                    <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">LinkedIn Profile Suggestions</h3>
                    <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300">
                      {linkedinSuggestions.map((suggestion, index) => (
                        <li key={index}>{suggestion}</li>
                      ))}
                    </ul>
                  </div>
                )}
        
                {/* Projects Section */}
                {backendData?.result?.raw_analysis && (
                  <div className="bg-white dark:bg-zinc-950 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-800 p-6">
                    <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Key Projects</h3>
                    <div className="prose dark:prose-invert max-w-none">
                      {parseProjectsSection(backendData.result.raw_analysis)}
                    </div>
                  </div>
                )}
              </div>
        
              
            </div>
          );

      case 4:
       
          return (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
            <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
              Application Session
            </h1>
            
            <div className="mt-6 relative">
              <div className="overflow-hidden h-2 mb-4 flex rounded bg-gray-200 dark:bg-gray-700">
                <div className="shadow-none flex flex-col justify-center bg-blue-500 w-full"></div>
              </div>
              <div className="flex justify-between">
                <div className="text-xs font-medium text-blue-600 dark:text-blue-400">Step 4: Final Review</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Step 4 of 4</div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-zinc-950 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-800 p-6 mt-8 mb-6">
              <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                Submit Your Application
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Please review all your information before submitting. Once submitted, you won't be able to make changes.
              </p>
            </div>
            
            <div className="space-y-6 mb-8">
              <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900/30 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-100 dark:bg-green-800/50 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 shadow-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                      Ready to Submit
                    </h3>
                   
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      All information has been provided and your application is ready to be submitted.
                    </p>
                    <ul className="mt-3 space-y-1 text-sm text-gray-500 dark:text-gray-400">
                      <li className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Personal Information</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Resume/CV</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Job Matching</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900/30 rounded-lg p-6">
      <h3 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-3">
        Enhance Your Application
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        A personalized cover letter can increase your chances of getting noticed by up to 50%.
      </p>
      
      {coverLetterGenerated && (
        <div className="mb-4 p-3 bg-green-100 dark:bg-green-800/20 border border-green-200 dark:border-green-800/30 rounded-md">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm text-green-700 dark:text-green-400">
              {uploadedFile ? `Cover letter uploaded: ${uploadedFile.name}` : 'Cover letter generated successfully'}
            </span>
          </div>
        </div>
      )}
      
      <div className="flex items-center space-x-4">
  {/* Generate Cover Letter Button */}
  <button
    onClick={generateCoverLetter}
    disabled={isGenerating || coverLetterGenerated}
    className={`inline-flex items-center px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
      (isGenerating || coverLetterGenerated) ? 'opacity-60 cursor-not-allowed' : ''
    }`}
  >
    {isGenerating ? (
      <>
        <svg className="animate-spin h-5 w-5 mr-2 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Generating...
      </>
    ) : (
      <>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-2 text-blue-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
          />
        </svg>
        Generate Cover Letter
      </>
    )}
  </button>


        <div>
    <label
      htmlFor="cover-letter-upload"
      className={`inline-flex items-center px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors cursor-pointer ${
        coverLetterGenerated && !uploadedFile ? 'opacity-60 cursor-not-allowed' : ''
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 mr-2 text-blue-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M4 8v8m16-8v8M4 8l8-4 8 4M4 8h16"
        />
      </svg>
      Upload Cover Letter
    </label>
    <input
      id="cover-letter-upload"
      type="file"
      accept=".pdf,.doc,.docx"
      className="hidden"
      onChange={handleFileUpload}
      disabled={coverLetterGenerated && !uploadedFile}
    />
  </div>
        
        {coverLetterGenerated && (
          <div className="flex space-x-3 mt-2">
            <button 
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center"
              onClick={() => window.open('#', '_blank')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Preview
            </button>
            <button 
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center"
              onClick={() => setCoverLetterGenerated(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Remove
            </button>
            <button 
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center"
              onClick={() => {/* Implement edit functionality */}}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </button>
          </div>
        )}
      </div>
      
      {!coverLetterGenerated && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
          Our AI will create a personalized cover letter based on your resume and the job description.
        </p>
      )}
    </div>
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6 pb-2">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
               
              </div>
              
              <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-6">
                By submitting this application, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </div>
        );
        case 5:
          return (
            <div className="max-w-4xl mx-auto px-0 py-1">
              <h1 className="text-2xl font-bold text-center mb-4 text-gray-900 dark:text-white">
                Application Session
              </h1>
  
              <div className="mb-8">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  Step 2 of 4 (Data review)
                </div>
              </div>
  
              <div className="bg-gray-50 dark:bg-zinc-900 rounded-lg p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Step 2: Review your data
                  </h2>
                  <button
                    onClick={() => (editMode ? handleSave() : setEditMode(true))}
                    className={`px-4 py-2 rounded-md ${
                      editMode
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    } transition-colors duration-200`}
                  >
                    {editMode ? "Save Changes" : "Edit Data"}
                  </button>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  {editMode
                    ? "Edit your information below. Click 'Save Changes' when you're done."
                    : "Please review your CV information below. This data was extracted from your uploaded file or saved data."}
                </p>
              </div>
  
              <div className="space-y-6 mb-8">
                {/* Personal Info */}
                <div className="bg-gray-50 dark:bg-zinc-900 rounded-lg p-6">
                  <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">
                    Personal Information
                  </h3>
                  <div className={editMode ? "" : "space-y-2"}>
                    {editMode ? (
                      <>
                        {renderEditableField("Name", "name", formData.name)}
                        {renderEditableField("Email", "email", formData.email)}
                        {renderEditableField("Phone", "phone", formData.phone)}
                        {formData.linkedIn &&
                          renderEditableField(
                            "LinkedIn",
                            "linkedIn",
                            formData.linkedIn
                          )}
                        {formData.github &&
                          renderEditableField(
                            "GitHub",
                            "github",
                            formData.github
                          )}
                      </>
                    ) : (
                      <>
                        <p className="text-gray-700 dark:text-gray-300">
                          <span className="font-medium">Name:</span> {formData.name}
                        </p>
                        <p className="text-gray-700 dark:text-gray-300">
                          <span className="font-medium">Email:</span> {formData.email}
                        </p>
                        <p className="text-gray-700 dark:text-gray-300">
                          <span className="font-medium">Phone:</span> {formData.phone}
                        </p>
                        {formData.linkedIn && (
                          <p className="text-gray-700 dark:text-gray-300">
                            <span className="font-medium">LinkedIn:</span>{" "}
                            <a
                              href={formData.linkedIn}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              {formData.linkedIn}
                            </a>
                          </p>
                        )}
                        {formData.github && (
                          <p className="text-gray-700 dark:text-gray-300">
                            <span className="font-medium">GitHub:</span>{" "}
                            <a
                              href={formData.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              {formData.github}
                            </a>
                          </p>
                        )}
                      </>
                    )}
                  </div>
                </div>
  
                {/* Experience */}
                <div className="bg-gray-50 dark:bg-zinc-900 rounded-lg p-6">
  <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">
    Work Experience
  </h3>
  {formData.experience && Array.isArray(formData.experience) ? (
    <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300">
      {formData.experience.map((exp, index) => (
        <li key={index}>
          <p>
            <strong>Title:</strong> {exp.title}
          </p>
          <p>
            <strong>Company:</strong> {exp.companyName}
          </p>
          <p>
            <strong>Location:</strong> {exp.location}
          </p>
          <p>
            <strong>Period:</strong> {exp.period}
          </p>
          <p>
            <strong>Responsibilities:</strong> {exp.responsibilities}
          </p>
        </li>
      ))}
    </ul>
  ) : (
    <p className="text-gray-500 dark:text-gray-400">No work experience data available</p>
  )}
</div>

<div className="bg-gray-50 dark:bg-zinc-900 rounded-lg p-6">
  <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">
    Skills
  </h3>
  {formData.skills && Array.isArray(formData.skills) ? (
    <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300">
      {formData.skills.map((skill, index) => (
        <li key={index}>{skill}</li>
      ))}
    </ul>
  ) : (
    <p className="text-gray-500 dark:text-gray-400">No skills data available</p>
  )}
</div>
  
               
                
                {/* Languages */}
                <div className="bg-gray-50 dark:bg-zinc-900 rounded-lg p-6">
    <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">
      Languages
    </h3>
    {editMode ? (
      renderEditableField(
        "Languages",
        "languages",
        formData.languages,
        true
      )
    ) : backendData?.result?.raw_analysis ? (
      <div className="prose dark:prose-invert max-w-none">
        {parseLanguagesSection(backendData.result.raw_analysis)}
      </div>
    ) : (
      <p className="text-gray-500 dark:text-gray-400">
        No language information available
      </p>
    )}
  </div>
              
              </div>
  
              {editMode && (
                <div className="flex justify-end space-x-4 mb-6">
                  <button
                    onClick={() => {
                      setEditMode(false);
                      // Reset form data to original values
                      if (backendData?.result) {
                        setFormData({
                          name:
                            backendData.result.contacts?.name?.replace(
                              /^\*\*\s*/,
                              ""
                            ) || "",
                          email:
                            backendData.result.contacts?.email?.replace(
                              /^\*\*\s*/,
                              ""
                            ) || "",
                          phone:
                            backendData.result.contacts?.phone?.replace(
                              /^\*\*\s*/,
                              ""
                            ) || "",
                          linkedIn:
                            backendData.result.contacts?.linkedIn?.replace(
                              /^\*\*\s*/,
                              ""
                            ) || "",
                          github:
                            backendData.result.contacts?.github?.replace(
                              /^\*\*\s*/,
                              ""
                            ) || "",
  
                          experience:
                            parseExperienceSection(
                              backendData.result.raw_analysis,
                              true
                            ) || "",
                          skills:
                            parseSkillsSection(
                              backendData.result.raw_analysis,
                              true
                            ) || "",
                          
                          languages:
                            parseLanguagesSection(
                              backendData.result.raw_analysis,
                              true
                            ) || "",
                        });
                      }
                    }}
                    className="px-4 py-2 rounded-md bg-gray-200 dark:bg-zinc-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-zinc-600 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition-colors duration-200"
                  >
                    Save Changes
                  </button>
                </div>
              )}
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
                  disabled={item.disabled}
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
              <SearchBar
                navigationMenu={navigation_menu}
                navigationOption={navigation_option}
              />
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
                <UserMenu
  profilePic={profilePic}
  firstName={firstName}
  lastName={lastName}
  email={email}
/>
              </div>
            </div>
          </header>

          {renderPage()}
          <ToastContainer
                              position="bottom-right"
                              autoClose={5000}
                              hideProgressBar={false}
                              newestOnTop={false}
                              closeOnClick
                              rtl={false}
                              pauseOnFocusLoss
                              draggable
                              pauseOnHover
                              theme={isDarkMode ? "dark" : "light"}
                            />{" "}
          <Dialog
            open={isAddCvModalOpen}
            onClose={handleAddCvModalClose}
            className="relative z-50"
          >
            <div
              className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
              aria-hidden="true"
            />
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <Dialog.Panel
                className={`w-full max-w-lg rounded-xl ${
                  isDarkMode
                    ? "bg-zinc-900 text-gray-100 border border-zinc-700"
                    : "bg-white text-zinc-900 border border-zinc-200"
                } shadow-2xl transition-all duration-300 overflow-hidden`}
              >
                <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
                  <Dialog.Title className="text-xl font-medium">
                    Add New CV
                  </Dialog.Title>
                  <button
                    onClick={handleAddCvModalClose}
                    className={`p-2 rounded-full ${
                      isDarkMode
                        ? "hover:bg-zinc-800 text-gray-400 hover:text-gray-200"
                        : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                    } transition-all duration-200`}
                    aria-label="Close modal"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6">
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Please upload your CV in PDF format to extract your
                    professional information automatically.
                  </p>

                  {/* Drag and drop area */}
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 mb-4 text-center ${
                      isDarkMode
                        ? fileSelected
                          ? "border-blue-600 bg-blue-900/10"
                          : "border-zinc-700 hover:border-zinc-500"
                        : fileSelected
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 hover:border-gray-400"
                    } transition-colors cursor-pointer`}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const droppedFile = e.dataTransfer.files[0];
                      if (
                        droppedFile &&
                        droppedFile.type === "application/pdf"
                      ) {
                        setFile(droppedFile);
                        setFileName(droppedFile.name);
                        setFileSelected(true);
                      }
                    }}
                    onClick={() =>
                      document.getElementById("cv-file-input").click()
                    }
                  >
                    {!fileSelected ? (
                      <>
                        <div className="flex justify-center mb-4">
                          <Upload
                            className={`w-12 h-12 ${
                              isDarkMode ? "text-blue-500" : "text-blue-600"
                            }`}
                          />
                        </div>
                        <p className="text-lg font-medium mb-2">
                          Drag & drop your CV here
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          or click to browse files
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                          (PDF format only, max 10MB)
                        </p>
                      </>
                    ) : (
                      <>
                        <div className="flex justify-center mb-4">
                          <FileText
                            className={`w-12 h-12 ${
                              isDarkMode ? "text-blue-500" : "text-blue-600"
                            }`}
                          />
                        </div>
                        <p className="text-lg font-medium mb-1">{fileName}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Ready to upload
                        </p>
                        <button
                          className={`mt-3 text-sm ${
                            isDarkMode
                              ? "text-red-400 hover:text-red-300"
                              : "text-red-500 hover:text-red-600"
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setFile(null);
                            setFileName("");
                            setFileSelected(false);
                          }}
                        >
                          Remove file
                        </button>
                      </>
                    )}
                  </div>

                  <input
                    id="cv-file-input"
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={(e) => {
                      const selectedFile = e.target.files[0];
                      if (selectedFile) {
                        setFile(selectedFile);
                        setFileName(selectedFile.name);
                        setFileSelected(true);
                      }
                    }}
                  />

                  {/* File size requirements */}
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 flex items-center">
                    <Info className="w-4 h-4 mr-1" />
                    We support PDF files up to 10MB in size
                  </div>
                </div>

                {/* Error message display */}
                {uploadError && (
                  <div className="mx-6 mb-4 p-3 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg flex items-start">
                    <AlertCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{uploadError}</span>
                  </div>
                )}

                {/* Loading state display */}
                {isUploading && (
                  <div className="mx-6 mb-4 p-3 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-sm rounded-lg flex items-center">
                    <Loader className="w-5 h-5 mr-2 animate-spin" />
                    <span>Processing your CV...</span>
                  </div>
                )}

                <div className="flex justify-end px-6 py-4 border-t border-zinc-200 dark:border-zinc-800">
                  <button
                    onClick={handleAddCvModalClose}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      isDarkMode
                        ? "bg-zinc-800 hover:bg-zinc-700 text-gray-300"
                        : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                    } transition-colors`}
                  >
                    Cancel
                  </button>
                  <button
                    className={`ml-2 px-4 py-2 rounded-lg text-sm font-medium ${
                      isDarkMode
                        ? `${
                            !fileSelected || isUploading
                              ? "bg-blue-800 cursor-not-allowed opacity-60"
                              : "bg-blue-600 hover:bg-blue-500"
                          } text-white`
                        : `${
                            !fileSelected || isUploading
                              ? "bg-blue-400 cursor-not-allowed opacity-60"
                              : "bg-blue-500 hover:bg-blue-600"
                          } text-white`
                    } transition-colors`}
                    disabled={!fileSelected || isUploading}
                    onClick={async () => {
                      if (!file) return;

                      try {
                        setIsUploading(true);
                        setUploadError("");

                        const formData = new FormData();
                        formData.append("cv", file);
                        const token = localStorage.getItem("token");
                        if (!token) {
                          console.error("Authentication token not found. Please log in again.");
                          return;
                        }
                        const response = await axios.post("http://localhost:5000/api/TakeData", formData, {
                          headers: {
                            "Content-Type": "multipart/form-data",
                            Authorization: `Bearer ${token}`, // Make sure this token format matches what your auth middleware expects
                          },
                        })

                        console.log("Backend Response:", response.data);
                        setBackendData(response.data);
                        handleAddCvModalClose();
                        setCurrentPage(2); // Navigate to Section 2
                      } catch (error) {
                        console.error("Error uploading file:", error);
                        setUploadError(
                          error.response?.data?.message ||
                            "Failed to process your CV. Please try again or use a different file."
                        );
                      } finally {
                        setIsUploading(false);
                      }
                    }}
                  >
                    {isUploading ? "Processing..." : "Upload CV"}
                  </button>
                </div>
              </Dialog.Panel>
            </div>
          </Dialog>

          <div className="max-w-4xl mx-auto py-4 mb-6">
  <div className="flex items-center justify-between">
    {/* Previous Button */}
    <button
      className={`py-2 px-6 rounded-lg font-medium transition-all ${
        currentPage === 1
          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
          : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white"
      }`}
      onClick={handlePrevious}
      disabled={currentPage === 1}
    >
      Previous
    </button>

    {/* Pagination Indicators */}
    <div className="flex items-center space-x-2">
      {[1, 2, 3, 4].map((page) => (
        <span
          key={page}
          className={`flex items-center justify-center w-10 h-10 rounded-full font-medium transition-all ${
            currentPage === page
              ? "bg-blue-600 text-white"
              : "bg-gray-100 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-300 hover:bg-gray-200 dark:hover:bg-gray-600"
          }`}
        >
          {page}
        </span>
      ))}
    </div>

  {/* Next/Submit Button */}
{currentPage === 4 ? (
  <button
    className={`w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 text-white rounded-lg transition-colors ${
      isUploading
        ? "bg-blue-400 cursor-not-allowed"
        : "bg-blue-600 hover:bg-blue-700"
    }`}
    onClick={handleSubmitApplication}
    disabled={isUploading} // Disable the button while uploading
  >
    {isUploading ? (
      <span className="flex items-center justify-center">
        <svg
          className="animate-spin h-5 w-5 text-white mr-2"
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
            d="M4 12a8 8 0 018-8v8H4z"
          ></path>
        </svg>
        Processing...
      </span>
    ) : (
      <>
        Submit Application
        <svg
          className="ml-1 h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M14 5l7 7m0 0l-7 7m7-7H3"
          />
        </svg>
      </>
    )}
  </button>
) : (
  <button
    className={`px-6 py-2 rounded-lg font-medium shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${
      currentPage === 4
        ? "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500"
        : "bg-zinc-300 dark:bg-zinc-800 text-black dark:text-white hover:bg-blue-600 dark:hover:bg-blue-800 focus:ring-gray-400"
    }`}
    onClick={handleNext}
    disabled={currentPage === 4}
  >
    Next
  </button>
)}
  </div>
</div>
        </main>
      </div>
    </div>
  );
};

export default SidebarLayout;
