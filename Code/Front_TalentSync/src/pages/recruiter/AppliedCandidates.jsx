import React, { useState, useRef, useEffect } from "react";
import {
  Menu,
  History,
  PlusSquare,
  Settings,
  CreditCard,
  PenTool,
  Moon,
  Sun,
  ChevronLeft,
  ChevronRight,
  Search,
  FileText,
  Download,
  Loader2,
  Calendar,
  Wrench,
  FlaskConical,
  LogOut,
  DollarSign,
  Users,
  Linkedin,
  Building2,
  Briefcase,
  User,
  Mail,
  Phone,
  MapPin,
  Award,
  Star,
  Clock,
  Filter,
} from "lucide-react";
import { Menu as HeadlessMenu } from "@headlessui/react";
import { BellIcon } from "@heroicons/react/24/outline";
import { MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { useDarkMode } from "../../components/DarkModeProvider"; // Import the hook
import { Link } from "react-router-dom";
import GoogleMeetIntegration from "./GoogleMeetIntegration";

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
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef(null);

  // Filter menu items based on search query
  const filteredMenu = navigationMenu.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredOption = navigationOption.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Combine filtered items for keyboard navigation
  const allFilteredItems = [...filteredMenu, ...filteredOption];

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev < allFilteredItems.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === "Enter" && allFilteredItems[activeIndex]) {
      window.location.href = allFilteredItems[activeIndex].href;
      setIsModalOpen(false);
    } else if (e.key === "Escape") {
      setIsModalOpen(false);
    }
  };

  // Close modal when clicking outside
  useEffect(() => {
    if (isModalOpen && inputRef.current) {
      inputRef.current.focus();
    }

    const handleClickOutside = (event) => {
      if (isModalOpen && event.target.classList.contains("modal-backdrop")) {
        setIsModalOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModalOpen]);

  // Reset active index when search changes
  useEffect(() => {
    setActiveIndex(0);
  }, [searchQuery]);

  return (
    <>
      {/* Search Input Trigger */}
      <div className="relative max-w-md w-full group">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-zinc-400" />
        <div
          onClick={() => setIsModalOpen(true)}
          className="w-full md:w-80 pl-10 pr-4 py-2.5 flex items-center bg-zinc-100 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 cursor-pointer group-hover:bg-zinc-200 dark:group-hover:bg-zinc-700 transition-colors"
        >
          <span className="text-gray-500 dark:text-gray-400 text-sm">
            Search...
          </span>
          <div className="ml-auto flex items-center gap-1 text-xs bg-zinc-200 dark:bg-zinc-700 px-1.5 py-0.5 rounded text-gray-500 dark:text-gray-400">
            <kbd className="font-sans">⌘</kbd>
            <kbd className="font-sans">K</kbd>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-start justify-center pt-16 sm:pt-24 px-4 z-50 modal-backdrop"
          onClick={(e) => {
            if (e.target.classList.contains("modal-backdrop")) {
              setIsModalOpen(false);
            }
          }}
        >
          <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl w-full max-w-lg border border-zinc-200 dark:border-zinc-700 overflow-hidden animate-fadeIn">
            {/* Search Input Inside Modal */}
            <div className="relative border-b border-zinc-200 dark:border-zinc-800">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-zinc-400" />
              <input
                ref={inputRef}
                type="search"
                placeholder="Type to search..."
                className="w-full pl-12 pr-12 py-4 bg-transparent text-gray-900 dark:text-white text-base focus:outline-none placeholder-gray-500 dark:placeholder-gray-400"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-gray-500 dark:text-gray-400"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close"
              >
                <span className="text-xs font-medium">ESC</span>
              </button>
            </div>

            {/* Results container with max height and scrolling */}
            <div className="max-h-96 overflow-y-auto p-2">
              {/* Show no results message if both arrays are empty */}
              {filteredMenu.length === 0 &&
                filteredOption.length === 0 &&
                searchQuery && (
                  <div className="flex flex-col items-center justify-center py-8">
                    <div className="bg-zinc-100 dark:bg-zinc-800 p-3 rounded-full mb-3">
                      <Search className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400">
                      No results found
                    </p>
                    <p className="text-sm text-gray-400 dark:text-gray-500">
                      Try different keywords
                    </p>
                  </div>
                )}

              {/* Menu Section */}
              {filteredMenu.length > 0 && (
                <div className="mb-2">
                  <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-3 py-2 uppercase tracking-wider">
                    Menu
                  </div>
                  <div className="space-y-1">
                    {filteredMenu.map((item, index) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg ${
                          index === activeIndex
                            ? "bg-zinc-200 dark:bg-zinc-700 text-gray-900 dark:text-white"
                            : "text-gray-700 dark:text-gray-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        } transition-colors duration-75`}
                        onMouseEnter={() => setActiveIndex(index)}
                      >
                        <div className="bg-zinc-100 dark:bg-zinc-800 p-2 rounded-md">
                          <item.icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-medium">{item.name}</div>
                          {item.description && (
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {item.description}
                            </div>
                          )}
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Options Section */}
              {filteredOption.length > 0 && (
                <div>
                  <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-3 py-2 uppercase tracking-wider">
                    Options
                  </div>
                  <div className="space-y-1">
                    {filteredOption.map((item, index) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg ${
                          index + filteredMenu.length === activeIndex
                            ? "bg-zinc-200 dark:bg-zinc-700 text-gray-900 dark:text-white"
                            : "text-gray-700 dark:text-gray-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        } transition-colors duration-75`}
                        onMouseEnter={() =>
                          setActiveIndex(index + filteredMenu.length)
                        }
                      >
                        <div className="bg-zinc-100 dark:bg-zinc-800 p-2 rounded-md">
                          <item.icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-medium">{item.name}</div>
                          {item.description && (
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {item.description}
                            </div>
                          )}
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer with keyboard shortcuts */}
            <div className="border-t border-zinc-200 dark:border-zinc-800 p-3 bg-zinc-50 dark:bg-zinc-900 text-xs text-gray-500 dark:text-gray-400 flex justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <span>↑↓</span>
                  <span>Navigate</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>↵</span>
                  <span>Select</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <span>Esc</span>
                <span>Cancel</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Reuse your existing components

const UserMenu = () => {
  const { isDarkMode, toggleTheme } = useDarkMode();

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
                src="../../assets/images/avatar.jpg"
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
                    src="../../assets/images/avatar.jpg"
                    alt=""
                  />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    John Doe
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    john.doe@example.com
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
const AppliedCandidatesContent = () => {
  const [candidates, setCandidates] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("appliedAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const [expandedCandidateId, setExpandedCandidateId] = useState(null);

  useEffect(() => {
    fetchAppliedCandidates();
  }, []);

  const fetchAppliedCandidates = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:5000/api/recruiters/candidates/applied",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 404) {
        setCandidates([]);
        setError("No applications found for your jobs.");
        setLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }

      // Get the response text
      const text = await response.text();

      try {
        // Check if the response starts with "Raw response text:" and handle accordingly
        const jsonText = text.startsWith("Raw response text:")
          ? text.substring("Raw response text:".length).trim()
          : text;

        // Parse the JSON data
        const data = JSON.parse(jsonText);

        // Transform and sanitize the data for better handling
        const sanitizedCandidates = data
          .map((application) => {
            // Check if application is valid
            if (!application) return null;

            // Handle nested objects safely with optional chaining and default values
            const candidate = application.candidateId || {};
            const personalInfo = candidate.personalInfo || {};
            const job = application.jobId || {};
            const latestAnalysis = application.latestAnalysis || {};
            const cvHistory = Array.isArray(application.cvHistory)
              ? application.cvHistory
              : [];
            const latestCV = cvHistory.length > 0 ? cvHistory[0] : {};
            const analysis = latestCV.analysis || {};

            // Extract information from raw_analysis if available
            const rawAnalysis = analysis.raw_analysis || "";
            const parsedAnalysis = parseResumeAnalysis(rawAnalysis);

            // Use data from analysis if available, especially when main fields are N/A
            const name =
              personalInfo.name && personalInfo.name !== "N/A"
                ? personalInfo.name
                : (parsedAnalysis.contactInfo?.name || "Unknown").replace(
                    /\*\* /g,
                    ""
                  );
            const email =
              personalInfo.email && personalInfo.email !== "N/A"
                ? personalInfo.email
                : (
                    parsedAnalysis.contactInfo.email ||
                    analysis.contacts?.Email ||
                    "Not provided"
                  ).replace(/\*\* /g, "");
            const phone =
              personalInfo.name && personalInfo.phone !== "N/A"
                ? personalInfo.phone
                : (
                    parsedAnalysis.contactInfo.phone ||
                    analysis.contacts?.phone ||
                    "Not provided"
                  ).replace(/\*\* /g, "");
            const location =
              personalInfo.location && personalInfo.location !== "N/A"
                ? personalInfo.location
                : parsedAnalysis.location || "Not provided";

            // Combine skills from multiple sources
            const skills =
              candidate.skills?.join(", ") ||
              parsedAnalysis.technicalSkills ||
              analysis.skills ||
              "Not provided";

            // Extract education and experience data
            const education =
              Array.isArray(candidate.education) &&
              candidate.education.length > 0
                ? candidate.education
                    .map(
                      (edu) =>
                        `${edu.degree || "Unknown degree"} in ${
                          edu.field || "Unknown field"
                        } from ${edu.institution || "Unknown institution"}`
                    )
                    .join("; ")
                : parsedAnalysis.Education ||
                  parsedAnalysis.education ||
                  analysis.education ||
                  "Not provided";

            const experience =
              candidate.experience
                ?.map((exp) => `${exp.role || ""} at ${exp.company || ""}`)
                .join("; ") ||
              parsedAnalysis.experience ||
              analysis.experience ||
              "Not provided";
            return {
              id: application._id || application.id || "",
              name: name,
              email: email,
              phone: phone,
              location: location,
              skills: skills,
              applicationId: application.applicationId || "", // Correctly extract applicationId
              certifications:
                candidate.certifications?.join(", ") ||
                parsedAnalysis.certifications ||
                "Not provided",
              education: education,
              experience: experience,
              languages: parsedAnalysis.languages || "Not provided",
              coverLetter:
                application.coverLetter !== "N/A"
                  ? application.coverLetter
                  : "Not provided",
              latestAnalysis: {
                similarityScore: latestAnalysis.similarity_score || 0,
                skills: latestAnalysis.skills || [],
                suggestions: latestAnalysis.suggestions || [],
                analyzedAt:
                  latestAnalysis.analyzedAt || new Date().toISOString(),
                strengths: parsedAnalysis.strengths || [],
                improvements: parsedAnalysis.improvements || [],
                linkedinSuggestions: parsedAnalysis.linkedinSuggestions || [],
              },
              resumeAnalysis: parsedAnalysis,
              cvHistory: cvHistory.map((cv) => ({
                fileUrl: cv.fileUrl || "",
                fileName: cv.fileName || "",
                uploadDate: cv.uploadDate || "",
                analysis: cv.analysis || {},
              })),
              appliedJob: {
                title: job.title || "Unknown",
                location: job.location || "Not provided",
                salary: job.salary || "Not provided",
                jobType: job.jobType || "Not specified",
                requirements: job.requirements || "Not provided",
                deadline: job.deadline
                  ? new Date(job.deadline).toLocaleDateString()
                  : "No deadline",
                companyName: job.companyName || "Not provided",
                skills: job.skills?.join(", ") || "Not provided",
              },
              appliedAt: application.appliedAt
                ? new Date(application.appliedAt).toLocaleString()
                : "Unknown",
              status: application.status || "Pending",
              score: application.score || latestAnalysis.similarity_score || 0,
              cvPath: latestCV.fileUrl || application.cvPath || "Not available",
              recommendationPath:
                application.recommendationPath || "Not available",
            };
          })
          .filter(Boolean); // Remove any null entries

        setCandidates(sanitizedCandidates);
      } catch (jsonError) {
        console.error("Error parsing JSON:", jsonError, "Response text:", text);
        throw new Error("Invalid JSON response received: " + jsonError.message);
      }
    } catch (err) {
      console.error("Error fetching applied candidates:", err);
      setError("Failed to load applied candidates: " + err.message);
    } finally {
      setLoading(false);
    }
  };
  // Function to parse resume analysis markdown text
  const parseResumeAnalysis = (rawAnalysis) => {
    if (!rawAnalysis || typeof rawAnalysis !== "string") {
      return {
        contactInfo: {},
        experience: "",
        technicalSkills: "",
        languages: "",
        strengths: [],
        improvements: [],
        linkedinSuggestions: [],
      };
    }

    const result = {
      contactInfo: {
        name: "",
        email: "",
        phone: "",
        linkedin: "",
      },
      experience: "",
      technicalSkills: "",
      languages: "",
      strengths: [],
      improvements: [],
      linkedinSuggestions: [],
    };

    // Extract contact information
    const contactMatch = rawAnalysis.match(
      /\*\*1\.\s*Contact Information:\*\*([\s\S]*?)(?=\*\*2\.|\n\n\*\*)/
    );
    if (contactMatch && contactMatch[1]) {
      const contactSection = contactMatch[1];

      const nameMatch = contactSection.match(
        /\*\*Name:\*\*\s*(.*?)(?=\n|\*\*)/
      );
      if (nameMatch) result.contactInfo.name = nameMatch[1].trim();

      const emailMatch = contactSection.match(
        /\*\*Email:\*\*\s*(.*?)(?=\n|\*\*)/
      );
      if (emailMatch) result.contactInfo.email = emailMatch[1].trim();

      const phoneMatch = contactSection.match(
        /\*\*Phone:\*\*\s*(.*?)(?=\n|\*\*)/
      );
      if (phoneMatch) result.contactInfo.phone = phoneMatch[1].trim();

      const linkedinMatch = contactSection.match(
        /\*\*LinkedIn:\*\*\s*(.*?)(?=\n|\*\*)/
      );
      if (linkedinMatch) result.contactInfo.linkedin = linkedinMatch[1].trim();
    }

    // Extract work experience
    const experienceMatch = rawAnalysis.match(
      /\*\*2\.\s*Work Experience Summary:\*\*([\s\S]*?)(?=\*\*3\.|\n\n\*\*)/
    );
    if (experienceMatch && experienceMatch[1]) {
      const experienceItems = experienceMatch[1].match(
        /\*\s*\*\*(.*?):\*\*\s*(.*?)(?=\n\*|\n\n|$)/g
      );

      if (experienceItems) {
        result.experience = experienceItems
          .map((item) => {
            const [_, position, details] = item.match(
              /\*\s*\*\*(.*?):\*\*\s*(.*)/
            ) || [null, "", ""];
            return `${position}: ${details.trim()}`;
          })
          .join("; ");
      }
    }

    // Extract technical skills
    const skillsMatch = rawAnalysis.match(
      /\*\*3\.\s*Technical Skills:\*\*([\s\S]*?)(?=\*\*4\.|\n\n\*\*)/
    );
    if (skillsMatch && skillsMatch[1]) {
      const skillItems = skillsMatch[1].match(
        /\*\s*\*\*(.*?):\*\*\s*(.*?)(?=\n\*|\n\n|$)/g
      );

      if (skillItems) {
        const skills = skillItems
          .map((item) => {
            const match = item.match(/\*\s*\*\*(.*?):\*\*\s*(.*)/);
            if (match && match[2].trim()) {
              return `${match[1]}: ${match[2].trim()}`;
            }
            return match ? match[1] : "";
          })
          .filter(Boolean);

        result.technicalSkills = skills.join("; ");
      }
    }

    // Extract languages
    const languagesMatch = rawAnalysis.match(
      /\*\*4\.\s*Languages:\*\*([\s\S]*?)(?=\*\*5\.|\n\n\*\*)/
    );
    if (languagesMatch && languagesMatch[1]) {
      const languageItems = languagesMatch[1].match(
        /\*\s*(.*?):\s*(.*?)(?=\n\*|\n\n|$)/g
      );

      if (languageItems) {
        result.languages = languageItems
          .map((item) => {
            const match = item.match(/\*\s*(.*?):\s*(.*)/);
            return match ? `${match[1]}: ${match[2].trim()}` : "";
          })
          .filter(Boolean)
          .join(", ");
      }
    }

    // Extract strengths
    const strengthsMatch = rawAnalysis.match(
      /\*\*Strengths:\*\*([\s\S]*?)(?=\*\*Areas for Improvement|\*\*Weaknesses|\n\n\*\*)/
    );
    if (strengthsMatch && strengthsMatch[1]) {
      const strengthItems = strengthsMatch[1].match(
        /\*\s*(.*?)(?=\n\*|\n\n|$)/g
      );

      if (strengthItems) {
        result.strengths = strengthItems
          .map((item) => item.replace(/^\*\s*/, "").trim())
          .filter(Boolean);
      }
    }

    // Extract areas for improvement
    const improvementsMatch = rawAnalysis.match(
      /\*\*Areas for Improvement:\*\*([\s\S]*?)(?=\*\*6\.|\n\n\*\*)/
    );
    if (improvementsMatch && improvementsMatch[1]) {
      const improvementSections = improvementsMatch[1].match(
        /\*\s*\*\*(.*?):\*\*\s*(.*?)(?=\n\*\s*\*\*|\n\n|$)/g
      );

      if (improvementSections) {
        result.improvements = improvementSections
          .map((section) => {
            const match = section.match(/\*\s*\*\*(.*?):\*\*\s*(.*)/s);
            return match ? `${match[1]}: ${match[2].trim()}` : "";
          })
          .filter(Boolean);
      }
    }

    // Extract LinkedIn suggestions
    const linkedinMatch = rawAnalysis.match(
      /\*\*6\.\s*LinkedIn Profile Suggestions:\*\*([\s\S]*?)(?=\n\n\*\*|$)/
    );
    if (linkedinMatch && linkedinMatch[1]) {
      const linkedinItems = linkedinMatch[1].match(
        /\*\s*\*\*(.*?):\*\*\s*(.*?)(?=\n\*\s*\*\*|\n\n|$)/g
      );

      if (linkedinItems) {
        result.linkedinSuggestions = linkedinItems
          .map((item) => {
            const match = item.match(/\*\s*\*\*(.*?):\*\*\s*(.*)/s);
            return match ? `${match[1]}: ${match[2].trim()}` : "";
          })
          .filter(Boolean);
      }
    }

    return result;
  };

  // Filter and sort candidates
  const filteredCandidates = candidates
    .filter((candidate) => {
      // Filter by search term
      const searchFields = [
        candidate.name,
        candidate.email,
        candidate.skills,
        candidate.appliedJob.title,
        candidate.location,
      ]
        .join(" ")
        .toLowerCase();
      const matchesSearch =
        searchTerm === "" || searchFields.includes(searchTerm.toLowerCase());

      // Filter by status
      const matchesStatus =
        statusFilter === "all" ||
        candidate.status.toLowerCase() === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      // Sort by selected field
      let comparison = 0;

      if (sortBy === "name") {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === "appliedAt") {
        comparison = new Date(a.appliedAt) - new Date(b.appliedAt);
      } else if (sortBy === "score") {
        comparison = a.score - b.score;
      }

      // Apply sort direction
      return sortDirection === "asc" ? comparison : -comparison;
    });

  const toggleExpandCandidate = (id) => {
    setExpandedCandidateId(expandedCandidateId === id ? null : id);
  };

  const getStatusColor = (status) => {
    const statusMap = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      reject: "bg-red-100 text-red-800 border-red-200",
      approve: "bg-green-100 text-green-800 border-green-200",
      shortlisted: "bg-green-100 text-green-800 border-green-200",
      review: "bg-orange-100 text-range-800 border-range-200",
      hired: "bg-blue-100 text-blue-800 border-blue-200",
      interviewing: "bg-purple-100 text-purple-800 border-purple-200",
    };
    return statusMap[status.toLowerCase()] || " text-gray-800 border-gray-200";
  };
  const getScoreBadgeColor = (score) => {
    if (score >= 80) return "bg-green-100 text-green-800 border-green-200";
    if (score >= 60) return "bg-blue-100 text-blue-800 border-blue-200";
    if (score >= 40) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-red-100 dark:bg-zinc-950  dark:border-zinc-900 dark:text-red-400 text-red-800 border-red-200";
  };

  const exportCandidatesToCsv = () => {
    const headers = [
      "Name",
      "Email",
      "Phone",
      "Location",
      "Skills",
      "Applied Job",
      "Applied Date",
      "Status",
      "Score",
    ];
    const csvRows = [
      headers.join(","),
      ...filteredCandidates.map((c) =>
        [
          c.name,
          c.email,
          c.phone,
          c.location,
          `"${c.skills}"`,
          `"${c.appliedJob.title}"`,
          c.appliedAt,
          c.status,
          c.score,
        ].join(",")
      ),
    ];

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", "applied_candidates.csv");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  const updateApplicationStatus = async (applicationId, newStatus) => {
    try {
      // Normalize the newStatus to match the server's expected case-sensitive values
      const validStatuses = [
        "Pending",
        "Accepted",
        "Rejected",
        "Review",
        "Approve",
        "Reject",
      ];

      const normalizedStatus = validStatuses.find(
        (status) => status.toLowerCase() === newStatus.toLowerCase()
      );

      if (!normalizedStatus) {
        alert("Invalid status value. Please provide a valid status.");
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/applications/applications/${applicationId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ status: normalizedStatus }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update status");
      }

      const updatedApplication = await response.json();
      alert(`Status updated to ${normalizedStatus} successfully!`);
      // Optionally, refresh the candidates list or update the UI
      fetchAppliedCandidates();
    } catch (error) {
      console.error("Error updating application status:", error);
      alert("Failed to update status. Please try again.");
    }
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [interviewDate, setInterviewDate] = useState("");
  const [interviewTime, setInterviewTime] = useState("");
  const [meetLink, setMeetLink] = useState("");

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleStatusUpdate = (status) => {
    updateApplicationStatus(candidate.applicationId, status);
    // Optionally close the modal after status update
    // closeModal();
  };

  const handleSubmitInterview = (e) => {
    e.preventDefault();
    // Process interview planning
    console.log("Interview scheduled for:", interviewDate, interviewTime);
    console.log("Reason:", reason);
    closeModal();
  };
  return (
    <div className="space-y-6">
      {/* Header with title and export button */}

      {/* Filters and search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search candidates by name, email, skills or job title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="flex gap-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter size={16} className="text-gray-400" />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 py-2 pr-8 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="interviewing">Interviewing</option>
              <option value="hired">Hired</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Clock size={16} className="text-gray-400" />
            </div>
            <select
              value={`${sortBy}-${sortDirection}`}
              onChange={(e) => {
                const [field, direction] = e.target.value.split("-");
                setSortBy(field);
                setSortDirection(direction);
              }}
              className="pl-10 py-2 pr-8 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="appliedAt-desc">Newest First</option>
              <option value="appliedAt-asc">Oldest First</option>
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
              <option value="score-desc">Highest Score</option>
              <option value="score-asc">Lowest Score</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className="bg-red-100 border border-red-200 rounded-lg p-4 text-red-800 dark:bg-red-900/20 dark:border-red-700/30 dark:text-red-400">
          <p>{error}</p>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Empty state */}
      {!loading && candidates.length === 0 && !error && (
        <div className="text-center py-12 bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-gray-700">
          <Briefcase size={48} className="mx-auto text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-800 dark:text-white">
            No candidates found
          </h3>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            No one has applied to your posted jobs yet.
          </p>
        </div>
      )}

      {/* Results count */}
      {!loading && filteredCandidates.length > 0 && (
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Showing {filteredCandidates.length} of {candidates.length} candidates
        </div>
      )}

      {/* Candidates list */}
      {!loading && filteredCandidates.length > 0 && (
        <div className="grid gap-4">
          {filteredCandidates.map((candidate, index) => (
            <div
              key={candidate.id || index}
              className="bg-white dark:bg-zinc-950 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-200"
            >
              {/* Card header - always visible */}
              <div
                className="p-4 flex flex-col md:flex-row md:items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-900 "
                onClick={() => toggleExpandCandidate(candidate.id)}
              >
                <div className="flex items-start gap-4">
                  {/* Avatar placeholder */}
                  <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 flex-shrink-0">
                    <User size={24} />
                  </div>

                  {/* Basic candidate info */}
                  <div className="flex-grow">
                    <h3 className="font-medium text-lg text-gray-900 dark:text-white">
                      {candidate.name}
                    </h3>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <Mail size={14} className="mr-1 flex-shrink-0" />
                        <span className="truncate">{candidate.email}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <Phone size={14} className="mr-1 flex-shrink-0" />
                        <span>{candidate.phone}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <MapPin size={14} className="mr-1 flex-shrink-0" />
                        <span>{candidate.location}</span>
                      </div>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {/* Job title and skills indicator */}
                      <div className="text-sm px-2 py-1 bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 rounded-md border border-indigo-200 dark:border-indigo-800/30 flex items-center">
                        <Briefcase size={12} className="mr-1" />
                        {candidate.appliedJob.title}
                      </div>

                      {/* Status badge */}
                      <div
                        className={`text-sm px-2 py-1 rounded-md border flex items-center ${getStatusColor(
                          candidate.status
                        )}`}
                        aria-label={`Status: ${candidate.status}`}
                        title={`Status: ${candidate.status}`}
                      >
                        {candidate.status.charAt(0).toUpperCase() +
                          candidate.status.slice(1)}
                      </div>

                      {/* Score badge */}
                      <div
                        className={`text-sm px-2 py-1 rounded-md border flex items-center ${getScoreBadgeColor(
                          candidate.score
                        )}`}
                      >
                        <Star size={12} className="mr-1" />
                        Score: {candidate.score}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Applied date and expand indicator */}
                <div className="flex items-center justify-between mt-4 md:mt-0">
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mr-4">
                    <Calendar size={14} className="mr-1" />
                    <span>Applied: {candidate.appliedAt}</span>
                  </div>
                  <svg
                    className={`h-5 w-5 text-gray-500 transition-transform ${
                      expandedCandidateId === candidate.id ? "rotate-180" : ""
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>

              {/* Expanded content */}
              {expandedCandidateId === candidate.id && (
                <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Candidate details */}
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        Candidate Details
                      </h4>

                      {/* Contact info */}
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Contact Information
                        </h5>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                            <Mail size={14} className="mr-1 flex-shrink-0" />
                            <span className="truncate">{candidate.email}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                            <Phone size={14} className="mr-1 flex-shrink-0" />
                            <span>{candidate.phone}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                            <MapPin size={14} className="mr-1 flex-shrink-0" />
                            <span>{candidate.location}</span>
                          </div>
                          {candidate.resumeAnalysis?.contactInfo?.linkedin && (
                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                              <Linkedin
                                size={14}
                                className="mr-1 flex-shrink-0"
                              />
                              <a
                                href={
                                  candidate.resumeAnalysis.contactInfo.linkedin
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 dark:text-blue-400 hover:underline"
                              >
                                LinkedIn Profile
                              </a>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Skills */}
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Technical Skills
                        </h5>
                        <div className="flex flex-wrap gap-2">
                          {candidate.skills &&
                          candidate.skills !== "Not provided" ? (
                            candidate.skills
                              .split("; ")
                              .flatMap((skillGroup) => {
                                const [category, skillsList] =
                                  skillGroup.split(": ");
                                if (!skillsList)
                                  return [category].filter(
                                    (s) => s && s.trim() !== ""
                                  );
                                return skillsList
                                  .split(", ")
                                  .map((skill) => skill.trim())
                                  .filter(Boolean);
                              })
                              .map((skill, idx) => (
                                <span
                                  key={idx}
                                  className="text-xs px-2 py-1 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 rounded border border-blue-100 dark:border-blue-800/30"
                                >
                                  {skill}
                                </span>
                              ))
                          ) : (
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              No skills listed
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Languages */}
                      {candidate.languages &&
                        candidate.languages !== "Not provided" && (
                          <div>
                            <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Languages
                            </h5>
                            <div className="flex flex-wrap gap-2">
                              {candidate.languages
                                .split(", ")
                                .map((lang, idx) => (
                                  <span
                                    key={idx}
                                    className="text-xs px-2 py-1 bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400 rounded border border-purple-100 dark:border-purple-800/30"
                                  >
                                    {lang}
                                  </span>
                                ))}
                            </div>
                          </div>
                        )}

                      {/* Experience */}
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Experience
                        </h5>
                        <div className="space-y-2">
                          {candidate.experience &&
                          candidate.experience !== "Not provided" ? (
                            candidate.experience.split("; ").map((exp, idx) => (
                              <div
                                key={idx}
                                className="text-sm text-gray-600 dark:text-gray-300 pl-2 border-l-2 border-gray-300 dark:border-gray-600"
                              >
                                {exp}
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              No experience listed
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Education */}
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Education
                        </h5>
                        <div className="space-y-1">
                          {candidate.education &&
                          candidate.education !== "Not provided" ? (
                            candidate.education.split("; ").map((edu, idx) => (
                              <div
                                key={idx}
                                className="text-sm text-gray-600 dark:text-gray-300"
                              >
                                {edu}
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              No education listed
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Certifications */}
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Certifications
                        </h5>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {candidate.certifications}
                        </p>
                      </div>
                    </div>

                    {/* Analysis and Job details */}
                    <div className="space-y-5">
                      <button
                        className="ml-auto px-5 py-3 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center"
                        onClick={openModal}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                          />
                        </svg>
                        Contact
                      </button>
                      {/* Resume Analysis */}
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                          Resume Analysis
                        </h4>

                        {/* Latest Analysis Score */}
                        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-4">
                          <div className="flex justify-between items-center">
                            <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Job Match Score
                            </h5>
                            <div
                              className={`text-sm px-2 py-1 rounded-full ${getScoreBadgeColor(
                                candidate.score * 100
                              )}`}
                            >
                              {Math.round(candidate.score * 100)}%
                            </div>
                          </div>

                          <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                            <div
                              className={`h-2.5 rounded-full ${getScoreBadgeColor(
                                candidate.score * 100
                              ).replace("border-", "")}`}
                              style={{
                                width: `${Math.round(candidate.score * 100)}%`,
                              }}
                            ></div>
                          </div>

                          <div className="mt-4">
                            <h6 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                              Analysis Date
                            </h6>
                            <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                              <Calendar size={12} className="mr-1" />
                              {new Date(
                                candidate.latestAnalysis.analyzedAt
                              ).toLocaleString()}
                            </div>
                          </div>
                        </div>

                        {/* Resume Strengths */}
                        {candidate.latestAnalysis.strengths &&
                          candidate.latestAnalysis.strengths.length > 0 && (
                            <div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-4">
                              <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Resume Strengths
                              </h5>
                              <ul className="space-y-1 list-disc list-inside text-sm text-gray-600 dark:text-gray-300">
                                {candidate.latestAnalysis.strengths.map(
                                  (strength, idx) => (
                                    <li key={idx}>{strength}</li>
                                  )
                                )}
                              </ul>
                            </div>
                          )}

                        {/* Areas for Improvement */}
                        {candidate.latestAnalysis.improvements &&
                          candidate.latestAnalysis.improvements.length > 0 && (
                            <div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-4">
                              <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Areas for Improvement
                              </h5>
                              <div className="space-y-2">
                                {candidate.latestAnalysis.improvements.map(
                                  (improvement, idx) => {
                                    const [title, description] =
                                      improvement.split(": ");
                                    return (
                                      <div key={idx} className="text-sm">
                                        <span className="font-medium text-gray-700 dark:text-gray-300">
                                          {title}:{" "}
                                        </span>
                                        <span className="text-gray-600 dark:text-gray-400">
                                          {description}
                                        </span>
                                      </div>
                                    );
                                  }
                                )}
                              </div>
                            </div>
                          )}

                        {/* LinkedIn Suggestions */}
                        {candidate.latestAnalysis.linkedinSuggestions &&
                          candidate.latestAnalysis.linkedinSuggestions.length >
                            0 && (
                            <div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                              <div className="flex items-center gap-2 mb-2">
                                <Linkedin
                                  size={16}
                                  className="text-blue-600 dark:text-blue-400"
                                />
                                <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                  LinkedIn Profile Suggestions
                                </h5>
                              </div>
                              <div className="space-y-2">
                                {candidate.latestAnalysis.linkedinSuggestions.map(
                                  (suggestion, idx) => {
                                    const [title, description] =
                                      suggestion.split(": ");
                                    return (
                                      <div key={idx} className="text-sm">
                                        <span className="font-medium text-gray-700 dark:text-gray-300">
                                          {title}:{" "}
                                        </span>
                                        <span className="text-gray-600 dark:text-gray-400">
                                          {description}
                                        </span>
                                      </div>
                                    );
                                  }
                                )}
                              </div>
                            </div>
                          )}
                      </div>

                      {/* Job Application Details */}
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                          Applied Job
                        </h4>
                        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                          <div className="flex flex-col space-y-2">
                            <div className="flex items-center justify-between">
                              <h5 className="text-base font-medium">
                                {candidate.appliedJob.title}
                              </h5>
                              <span className="text-xs bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 rounded-full px-2 py-1">
                                {candidate.appliedJob.jobType}
                              </span>
                            </div>

                            <div className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-1">
                              <Building2 size={14} />
                              <span>{candidate.appliedJob.companyName}</span>
                            </div>

                            <div className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-1">
                              <MapPin size={14} />
                              <span>{candidate.appliedJob.location}</span>
                            </div>

                            <div className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-1">
                              <DollarSign size={14} />
                              <span>{candidate.appliedJob.salary}</span>
                            </div>

                            <div className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-1">
                              <Clock size={14} />
                              <span>
                                Deadline: {candidate.appliedJob.deadline}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Document links and Actions */}
                      <div className="space-y-4">
                        {/* Document links */}
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Documents
                          </h5>
                          <div className="flex flex-col gap-2">
                            <button
                              onClick={() =>
                                candidate.cvPath !== "Not available" &&
                                window.open(candidate.cvPath, "_blank")
                              }
                              className={`flex items-center gap-2 px-3 py-2 text-sm bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors w-full ${
                                candidate.cvPath === "Not available"
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                              disabled={candidate.cvPath === "Not available"}
                            >
                              <FileText
                                size={16}
                                className="text-blue-600 dark:text-blue-400"
                              />
                              <span>View CV</span>
                            </button>

                            <button
                              onClick={() =>
                                candidate.coverLetter !== "Not provided" &&
                                window.open(candidate.coverLetter, "_blank")
                              }
                              className={`flex items-center gap-2 px-3 py-2 text-sm bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors w-full ${
                                candidate.coverLetter === "Not provided"
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                              disabled={
                                candidate.coverLetter === "Not provided"
                              }
                            >
                              <FileText
                                size={16}
                                className="text-green-600 dark:text-green-400"
                              />
                              <span>View Cover Letter</span>
                            </button>

                            <button
                              onClick={() =>
                                candidate.recommendationPath !==
                                  "Not available" &&
                                window.open(
                                  candidate.recommendationPath,
                                  "_blank"
                                )
                              }
                              className={`flex items-center gap-2 px-3 py-2 text-sm bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors w-full ${
                                candidate.recommendationPath === "Not available"
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                              disabled={
                                candidate.recommendationPath === "Not available"
                              }
                            >
                              <Award
                                size={16}
                                className="text-purple-600 dark:text-purple-400"
                              />
                              <span>View AI Recommendation</span>
                            </button>
                          </div>
                        </div>

                        {/* CV History */}
                        {candidate.cvHistory &&
                          candidate.cvHistory.length > 0 && (
                            <div>
                              <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                CV History
                              </h5>
                              <div className="space-y-2">
                                {candidate.cvHistory.map((cv, index) => (
                                  <div
                                    key={index}
                                    className="border border-gray-200 dark:border-gray-700 rounded-md p-2"
                                  >
                                    <div className="flex justify-between items-center">
                                      <div className="flex items-center gap-2">
                                        <FileText
                                          size={14}
                                          className="text-blue-600 dark:text-blue-400"
                                        />
                                        <span className="text-sm truncate max-w-[150px]">
                                          {cv.fileName || "CV " + (index + 1)}
                                        </span>
                                      </div>
                                      <span className="text-xs text-gray-500">
                                        {cv.uploadDate
                                          ? new Date(
                                              cv.uploadDate
                                            ).toLocaleDateString()
                                          : "N/A"}
                                      </span>
                                    </div>
                                    <div className="mt-2 flex justify-end">
                                      <button
                                        onClick={() =>
                                          window.open(cv.fileUrl, "_blank")
                                        }
                                        disabled={!cv.fileUrl}
                                        className="text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-2 py-1 rounded hover:bg-blue-100 dark:hover:bg-blue-800/30 transition-colors"
                                      >
                                        View
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                        {/* Action buttons */}
                        <div className="pt-2">
                          <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Actions
                          </h5>

                          {/* Modal */}
                          {isModalOpen && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
                                <div className="flex justify-between items-center mb-4">
                                  <h2 className="text-lg font-semibold">
                                    Contact {candidate.name}
                                  </h2>
                                  <button
                                    onClick={closeModal}
                                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-6 w-6"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                      />
                                    </svg>
                                  </button>
                                </div>

                                <div className="mb-4">
                                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Reason for Contact
                                  </label>
                                  <textarea
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                    rows="3"
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    placeholder="Specify the reason for contacting the candidate..."
                                  ></textarea>
                                </div>

                                <div className="mb-6">
                                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Interview Planning
                                  </h3>
                                  <div className="grid grid-cols-2 gap-3 mb-3">
                                    <div>
                                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                                        Date
                                      </label>
                                      <input
                                        type="date"
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                        value={interviewDate}
                                        onChange={(e) =>
                                          setInterviewDate(e.target.value)
                                        }
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                                        Time
                                      </label>
                                      <input
                                        type="time"
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                        value={interviewTime}
                                        onChange={(e) =>
                                          setInterviewTime(e.target.value)
                                        }
                                      />
                                    </div>
                                  </div>

                                  {/* Google Meet Link Field */}
                                  <div>
                                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                                      Google Meet Link
                                    </label>
                                    <div className="flex">
                                      <input
                                        type="url"
                                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                        value={meetLink}
                                        onChange={(e) =>
                                          setMeetLink(e.target.value)
                                        }
                                        placeholder="https://meet.google.com/xxx-xxxx-xxx"
                                      />
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                      Enter a Google Meet link or generate a
                                      placeholder
                                    </p>
                                  </div>
                                  <h1>Schedule a Meeting</h1>
                                  <GoogleMeetIntegration />
                                </div>

                                {/* Status actions */}
                                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-4">
                                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Update Application Status
                                  </h3>
                                  <div className="flex flex-wrap gap-2">
                                    {candidate.status && (
                                      <>
                                        <button
                                          className="flex items-center px-3 py-1.5 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                                          onClick={() =>
                                            handleStatusUpdate("Review")
                                          }
                                        >
                                          Review
                                        </button>
                                        <button
                                          className="flex items-center px-3 py-1.5 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
                                          onClick={() =>
                                            handleStatusUpdate("Approve")
                                          }
                                        >
                                          Approve
                                        </button>
                                        <button
                                          className="flex items-center px-3 py-1.5 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                                          onClick={() =>
                                            handleStatusUpdate("Reject")
                                          }
                                        >
                                          Reject
                                        </button>
                                      </>
                                    )}
                                  </div>
                                </div>

                                <div className="flex justify-end gap-2">
                                  <button
                                    onClick={closeModal}
                                    className="px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    onClick={handleSubmitInterview}
                                    className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 rounded-lg transition-colors"
                                  >
                                    Schedule & Contact
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const PastApplications = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { isDarkMode, toggleTheme } = useDarkMode(); // Use the hook
  const navigation_menu = [
    {
      name: "Dashboard",
      href: "/dashboard/recuiter",
      icon: Menu,
      current: false,
    },
    {
      name: "Applied Candidates",
      href: "/dashboard/AppliedCandidates",
      icon: Users,
      current: true,
    },
    {
      name: "Jobs",
      href: "/dashboard/recuiter/joblist",
      icon: Briefcase,
      current: false,
    },
    { name: "Billing", href: "/Pricing", icon: CreditCard, current: false },
  ];
  const navigation_option = [
    {
      name: "Settings",
      href: "/dashboard/recuiter/settings",
      icon: Settings,
      current: false,
    },
    {
      name: "Support",
      href: "/dashboard/recuiter/jobbuilder",
      icon: Wrench,
      current: false,
    },
  ];

  useEffect(() => {
    // Ensure the dark class is applied globally
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);
  const [candidates, setCandidates] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAppliedCandidates();
  }, []);

  const fetchAppliedCandidates = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/recruiters/candidates/applied",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const text = await response.text();

      if (response.status === 404) {
        // Handle no candidates found
        setCandidates([]);
        setError("No applications found for your jobs.");
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }

      try {
        const data = JSON.parse(text);
        setCandidates(data);
      } catch (jsonError) {
        throw new Error("Invalid JSON response received.");
      }
    } catch (err) {
      console.error("Error fetching applied candidates:", err);
      setError("Failed to load applied candidates");
    }
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
          <div className="flex items-center justify-between p-5  border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg">
                <Menu className="w-5 h-5 text-gray-600 dark:text-white transition-all duration-300 ease-in-out z-3 " />
              </div>
              {isSidebarOpen && (
                <span className="text-lg font-semibold text-gray-900 dark:text-white transition-all duration-300 ease-in-out z-">
                  TalentSync
                </span>
              )}
            </div>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {isSidebarOpen ? (
                <ChevronLeft className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-400" />
              )}
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto p-4 space-y-8">
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

        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-gray-50 dark:bg-black transition-all duration-300 ease-in-out z-30">
          {/* Header */}
          <header className="bg-white dark:bg-black border-gray-200 dark:border-gray-800 sticky top-0 transition-all duration-300 ease-in-out z-30">
            <div className="flex items-center justify-between px-6 py-4">
              <SearchBar
                navigationMenu={[
                  {
                    name: "Dashboard",
                    href: "/dashboard/recuiter",
                    icon: Menu,
                  },
                  {
                    name: "History",
                    href: "/dashboard/AppliedCandidates",
                    icon: History,
                  },
                  {
                    name: "Job List",
                    href: "/dashboard/recuiter/joblist",
                    icon: Menu,
                  },
                  { name: "Billing", href: "/Pricing", icon: PlusSquare },
                ]}
                navigationOption={[
                  {
                    name: "Settings",
                    href: "/dashboard/recuiter/settings",
                    icon: Settings,
                  },
                  {
                    name: "Support",
                    href: "/dashboard/recuiter/jobbuilder",
                    icon: Wrench,
                  },
                  { name: "cv testing", href: "/Testing", icon: FlaskConical },
                ]}
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

          {/* Main Content Area */}
          <div className="p-6 space-y-6 transition-all duration-300 ease-in-out z-30">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white transition-all duration-300 ease-in-out z-30">
                Applied Candidates
              </h1>
              <p className="text-gray-500 dark:text-gray-400 transition-all duration-300 ease-in-out z-30">
                View and manage candidates who applied to your jobs
              </p>
            </div>
            <AppliedCandidatesContent className="transition-all duration-300 ease-in-out z-30" />
          </div>
        </main>
      </div>
    </div>
  );
};

export default PastApplications;
