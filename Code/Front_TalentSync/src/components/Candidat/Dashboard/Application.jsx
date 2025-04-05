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
} from "lucide-react";
import { Dialog } from "@headlessui/react";
import { Menu as HeadlessMenu } from "@headlessui/react";
import { BellIcon } from "@heroicons/react/24/outline";
import { MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import CV from "./CV/CvCreation";
import { Link, useLocation } from "react-router-dom"; // Import useLocation
import axios from "axios";
import LoadingAnimation from './LoginAnimation'; // Adjust the path if needed
import { useDarkMode } from "../../DarkModeProvider";
import { useNavigate } from "react-router-dom"; // Import useNavigate

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
              aria-label={
                isDarkMode ? "Switch to light mode" : "Switch to dark mode"
              }
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
  const [isAddCvModalOpen, setIsAddCvModalOpen] = useState(false); // State for Add CV Modal
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
  
          // Map the fetched data to the form fields
          const savedData = {
            name: candidateData.personalInfo?.name || "",
            email: candidateData.personalInfo?.email || "",
            phone: candidateData.personalInfo?.phone || "",
            experience: candidateData.experience || "",
            skills: candidateData.skills || "",
            languages: candidateData.personalInfo?.languages || "",
            linkedIn: candidateData.personalInfo?.linkedIn || "",
            github: candidateData.personalInfo?.github || "",
          };
  
          setFormData(savedData); // Populate the form with fetched data
          console.log("Fetched candidate data:", savedData);
          setCurrentPage(5); // Navigate to Step 2
        } else {
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
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    if (onUpdate) {
      onUpdate(formData);
    }
    setEditMode(false);
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
  const navigate = useNavigate();
  const handleSubmitApplication = async () => {
    try {
      if (!file) {
        alert("Please upload your CV before submitting.");
        return;
      }

      if (!selectedJob) {
        alert("Please select a job before submitting.");
        return;
      }

      setIsUploading(true); // Start the loading state
      setUploadError("");

      const formData = new FormData();
      formData.append("cv", file);

      // Step 1: Extract Data from CV
      const extractResponse = await axios.post(
        "http://localhost:5000/api/TakeData",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: 30000,
        }
      );

      console.log("Extracted Data Response:", extractResponse.data);

      if (!extractResponse.data || !extractResponse.data.result) {
        alert("Failed to extract data from the CV. Please try again.");
        return;
      }

      // Step 2: Combine Extracted Data with Job Details
      const analysisPayload = {
        jobTitle: selectedJob.title || "Unknown Job Title",
        company: selectedJob.company || "Unknown Company",
        cvData: extractResponse.data.result, // Ensure extracted data is present
      };

      console.log("Payload for AnalyseData API:", analysisPayload);

      // Step 3: Send Data to AnalyseData API
      const analysisResponse = await axios.post(
        "http://localhost:5000/api/AnalyseData",
        analysisPayload,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (analysisResponse.status === 200 && analysisResponse.data.result) {
        console.log("Analysis Result:", analysisResponse.data.result);
        alert("Application analyzed successfully!");

        // Navigate to /history after successful submission
        navigate("/dashboard/history");
      } else {
        alert("Failed to analyze the application. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting application:", error);

      if (error.response && error.response.data && error.response.data.error) {
        alert(`Error: ${error.response.data.error}`);
      } else {
        alert("An error occurred while submitting your application. Please try again.");
      }
    } finally {
      setIsUploading(false); // End the loading state
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 1:
        return (
          <div className="max-w-4xl mx-auto px-0 py-1">
            <h1 className="text-2xl font-bold text-center mb-4 text-gray-900 dark:text-white">
              Application Session
            </h1>

            <div className="mb-8">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                Step 1 of 4 (Data)
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-zinc-900 rounded-lg p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Step 1
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                Do you want to use your saved data or add new CV?
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 dark:bg-zinc-900 rounded-lg p-6">
                <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">
                  Options
                </h3>
                <div className="space-y-4">
                  <button
                    className={`w-full py-3 px-4 ${
                      useExistingData === true
                        ? "bg-blue-600"
                        : "bg-blue-500 hover:bg-blue-600"
                    } text-white rounded-lg transition-colors font-medium`}
                    onClick={() => handleSelection(true)}
                  >
                    Use Saved Data
                  </button>
                  <button
                    className={`w-full py-3 px-4 ${
                      useExistingData === false
                        ? "bg-gray-300 dark:bg-gray-600"
                        : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                    } text-gray-800 dark:text-white rounded-lg transition-colors font-medium`}
                    onClick={handleAddCvModalOpen}
                  >
                    Add New CV
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-zinc-900 rounded-lg p-6">
                <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">
                  Your Selection
                </h3>
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
                {editMode ? (
                  renderEditableField(
                    "Experience",
                    "experience",
                    formData.experience,
                    true
                  )
                ) : (
                  <p className="text-gray-700 dark:text-gray-300">{formData.experience}</p>
                )}
              </div>

              {/* Skills */}
              {/* Experience */}
              <div className="bg-gray-50 dark:bg-zinc-900 rounded-lg p-6">
                <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">
                  Work Experience
                </h3>
                {editMode ? (
                  renderEditableField(
                    "Experience",
                    "experience",
                    formData.experience,
                    true
                  )
                ) : backendData?.result?.raw_analysis ? (
                  <div className="prose dark:prose-invert max-w-none">
                    {parseExperienceSection(backendData.result.raw_analysis)}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">
                    No work experience data available
                  </p>
                )}
              </div>

              {/* Skills */}
              <div className="bg-gray-50 dark:bg-zinc-900 rounded-lg p-6">
                <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">
                  Skills
                </h3>
                {editMode ? (
                  renderEditableField("Skills", "skills", formData.skills, true)
                ) : backendData?.result?.raw_analysis ? (
                  <div className="prose dark:prose-invert max-w-none">
                    {parseSkillsSection(backendData.result.raw_analysis)}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">
                    No skills data available
                  </p>
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

      case 3:
        return (
          <div className="max-w-4xl mx-auto px-0 py-1">
            <h1 className="text-2xl font-bold text-center mb-8 text-gray-900 dark:text-white">
              Application Session
            </h1>
  
            <div className="mb-8">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                Step 3 of 4 (Recommendations)
              </div>
            </div>
  
            <div className="space-y-6 mb-8">
              {/* Resume Feedback Section */}
              {resumeStrengths.length > 0 && (
                <div className="bg-gray-50 dark:bg-zinc-900 rounded-lg p-6">
                  <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">
                    Resume Feedback
                  </h3>
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-800 dark:text-gray-200">
                      Strengths:
                    </h4>
                    <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300">
                      {resumeStrengths.map((strength, index) => (
                        <li key={index}>{strength}</li>
                      ))}
                    </ul>
  
                    {areasForImprovement.length > 0 && (
                      <>
                        <h4 className="font-medium text-gray-800 dark:text-gray-200 mt-4">
                          Areas for Improvement:
                        </h4>
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
                <div className="bg-gray-50 dark:bg-zinc-900 rounded-lg p-6">
                  <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">
                    LinkedIn Profile Suggestions
                  </h3>
                  <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300">
                    {linkedinSuggestions.map((suggestion, index) => (
                      <li key={index}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}
  
              {/* Projects Section */}
              {backendData?.result?.raw_analysis && (
                <div className="bg-gray-50 dark:bg-zinc-900 rounded-lg p-6">
                  <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">
                    Key Projects
                  </h3>
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
          <div className="max-w-4xl mx-auto px-0 py-5">
            <h1 className="text-2xl font-bold text-center mb-8 text-gray-900 dark:text-white">
              Application Session
            </h1>

            <div className="mb-8">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                Step 4 of 4 (Submitting)
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Submit Application
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                Please review all your information before submitting your
                application.
              </p>
            </div>

            <div className="space-y-6 mb-8">
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center text-green-600 dark:text-green-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-8 h-8"
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
                    <p className="text-gray-700 dark:text-gray-300 mt-1">
                      Your application is ready to be submitted with all the
                      information provided.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
              {isUploading && <LoadingAnimation />}

<button 
  onClick={handleSubmitApplication}
  disabled={isUploading}
  className={`px-4 py-2 rounded-md ${
    isUploading 
      ? "bg-gray-400 cursor-not-allowed" 
      : "bg-blue-500 hover:bg-blue-600 text-white"
  }`}
>
  {isUploading ? "Processing..." : "Submit Application"}
</button>
              </div>
            </div>
          </div>
        );
        case 2:
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
            <strong>Company:</strong> {exp.company}
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
                <UserMenu />
              </div>
            </div>
          </header>

          {renderPage()}

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

                        const response = await axios.post(
                          "http://localhost:5000/api/TakeData",
                          formData,
                          {
                            headers: {
                              "Content-Type": "multipart/form-data",
                            },
                            timeout: 30000, // 30 second timeout
                          }
                        );

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

          <div className="max-w-4xl mx-auto  py-1 mb-2">
            <div className="flex justify-between">
              <button
                className={`py-2 px-4 ${
                  currentPage === 1
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white"
                } rounded-lg`}
                onClick={handlePrevious}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <div className="flex space-x-4">
                <span
                  className={`flex items-center justify-center w-8 h-8 ${
                    currentPage === 1
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  } rounded-full`}
                >
                  1
                </span>
                <span
                  className={`flex items-center justify-center w-8 h-8 ${
                    currentPage === 2
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  } rounded-full`}
                >
                  2
                </span>
                <span
                  className={`flex items-center justify-center w-8 h-8 ${
                    currentPage === 3
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  } rounded-full`}
                >
                  3
                </span>
                <span
                  className={`flex items-center justify-center w-8 h-8 ${
                    currentPage === 4
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  } rounded-full`}
                >
                  4
                </span>
              </div>
              <button
                className={`py-2 px-4 ${
                  currentPage === 4
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                } rounded-lg`}
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
