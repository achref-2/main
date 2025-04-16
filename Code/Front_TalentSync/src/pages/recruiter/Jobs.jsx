import React, { useState,useRef, useEffect } from "react";
import {
  Menu,
  History,
  PlusSquare,
  Settings,
  CreditCard,
  Moon,
  Sun,
  ChevronDown,
  Edit,
  Trash2,
  MapPin,
  ChevronUp,
  Plus,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
  Filter,
  Wrench,
  FlaskConical,
  DollarSign,
  AlertCircle,
  Clock,
  FileText,
  User,
  CheckSquare,
  Send,
  Info,
  Briefcase,
  MoreVertical,
  Star,
  CheckCircle,
  Users,
  LogOut
} from "lucide-react";
import { Menu as HeadlessMenu } from "@headlessui/react";
import { BellIcon } from "@heroicons/react/24/outline";
import { MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ArrowLeft, Share2 } from "lucide-react";
import { useDarkMode } from "../../components/DarkModeProvider";
import { Link } from "react-router-dom";
import {JobCategoryIcon} from "../../components/Joblogo";
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
      setActiveIndex((prev) => (prev < allFilteredItems.length - 1 ? prev + 1 : prev));
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
      if (isModalOpen && event.target.classList.contains('modal-backdrop')) {
        setIsModalOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
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
          <span className="text-gray-500 dark:text-gray-400 text-sm">Search...</span>
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
            if (e.target.classList.contains('modal-backdrop')) {
              setIsModalOpen(false);
            }
          }}
        >
          <div 
            className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl w-full max-w-lg border border-zinc-200 dark:border-zinc-700 overflow-hidden animate-fadeIn"
          >
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
              {filteredMenu.length === 0 && filteredOption.length === 0 && searchQuery && (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="bg-zinc-100 dark:bg-zinc-800 p-3 rounded-full mb-3">
                    <Search className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400">No results found</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500">Try different keywords</p>
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
                            ? 'bg-zinc-200 dark:bg-zinc-700 text-gray-900 dark:text-white' 
                            : 'text-gray-700 dark:text-gray-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
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
                            ? 'bg-zinc-200 dark:bg-zinc-700 text-gray-900 dark:text-white' 
                            : 'text-gray-700 dark:text-gray-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                        } transition-colors duration-75`}
                        onMouseEnter={() => setActiveIndex(index + filteredMenu.length)}
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
}

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
      description: "View your past activities"
    },
    { 
      label: "Settings", 
      href: "/Settings", 
      icon: Settings,
      description: "Manage your preferences"
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
                    ? 'ring-blue-500 ring-offset-2 ring-offset-white dark:ring-offset-zinc-900' 
                    : 'ring-gray-200 dark:ring-gray-700 hover:ring-blue-400'
                }`}
                src="../../assets/images/avatar.jpg"
                alt="User avatar"
              />
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 ring-1 ring-white dark:ring-zinc-900"></span>
            </div>
          </MenuButton>

          <MenuItems
            className={`absolute right-0 z-50 mt-2 w-64 origin-top-right rounded-xl py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none transform transition-all duration-100 ${
              open ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
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
                        <div className={`mr-3 p-1 rounded-md ${
                          active 
                            ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300' 
                            : 'bg-gray-100 text-gray-500 dark:bg-zinc-700 dark:text-gray-400'
                        }`}>
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
                      <ChevronRight className={`w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-150 ${
                        active ? 'opacity-100' : ''
                      }`} />
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
                      <div className={`mr-3 p-1 rounded-md ${
                        active 
                          ? 'bg-amber-100 text-amber-600 dark:bg-indigo-900 dark:text-indigo-300' 
                          : 'bg-gray-100 text-gray-500 dark:bg-zinc-700 dark:text-gray-400'
                      }`}>
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
                          isDarkMode 
                            ? "bg-indigo-600" 
                            : "bg-gray-300"
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
                      <div className={`mr-3 p-1 rounded-md ${
                        active 
                          ? 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300' 
                          : 'bg-gray-100 text-gray-500 dark:bg-zinc-700 dark:text-gray-400'
                      }`}>
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

const Jobs = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { isDarkMode } = useDarkMode();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const clearFilters = () => {
    setFilters({
      fullTime: false,
      partTime: false,
      contract: false,
      remote: false,
      onsite: false,
      hybrid: false,
      salary50_100: false,
      salary100_150: false,
      salary150Plus: false,
    });
  };
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
      current: false,
    },
    {
      name: "Jobs",
      href: "/dashboard/recuiter/joblist",
      icon: Briefcase,
      current: true,
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

  const [selectedJob, setSelectedJob] = useState(null);
  const [filters, setFilters] = useState({
    fullTime: false,
    partTime: false,
    contract: false,
    remote: false,
    onsite: false,
    hybrid: false,
    salary50_100: false,
    salary100_150: false,
    salary150Plus: false,
  });

  const [allJobs, setAllJobs] = useState([]); // State for jobs
  const [loading, setLoading] = useState(true); // State for loading
  const [error, setError] = useState(""); // State for error

  // Fetch jobs from the backend
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        console.log("Fetching jobs...");
        const token = localStorage.getItem("token"); // Retrieve token from localStorage
        const response = await fetch(
          "http://localhost:5000/api/recruiters/jobs",
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include the token in the Authorization header
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch jobs");
        }
        const data = await response.json();
        console.log("Fetched jobs:", JSON.stringify(data, null, 2)); // Debug log
        setAllJobs(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching jobs:", err.message);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleFilterChange = (filterName) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: !prev[filterName],
    }));
  };

  const filteredJobs = allJobs.filter((job) => {
    const noJobTypeFilters = !filters.fullTime && !filters.partTime;
    const noSalaryFilters = !filters.salary50_100 && !filters.salary100_150;

    if (noJobTypeFilters && noSalaryFilters) return true;

    const matchesJobType =
      (filters.fullTime && job.type === "Full Time") ||
      (filters.partTime && job.type === "Part Time") ||
      (!filters.fullTime && !filters.partTime);

    // Parse salary range
    const salaryString = job.salary.replace(/[^0-9-]/g, "");
    const [minSalary] = salaryString.split("-").map(Number);

    // Check salary filters
    const matchesSalary =
      (filters.salary50_100 && minSalary >= 50 && minSalary <= 100) ||
      (filters.salary100_150 && minSalary >= 100 && minSalary <= 150) ||
      (!filters.salary50_100 && !filters.salary100_150);

    return matchesJobType && matchesSalary;
  });
  const renderRequirements = (requirements) => {
    // Check if requirements exists and is an array
    if (Array.isArray(requirements)) {
      return requirements.map((req, index) => (
        <li key={index} className="ml-4">
          {req}
        </li>
      ));
    } else if (typeof requirements === "string") {
      // If it's a string, split by newlines or render as is
      return requirements.split("\n").map((line, index) => (
        <li key={index} className="ml-4">
          {line}
        </li>
      ));
    } else {
      // If it's neither array nor string, return empty array
      return [];
    }
  };
  const [showToast, setShowToast] = useState(false);
  const [applicants, setApplicants] = useState([]); // State for storing applicants

  const SuccessToast = () => (
    <div
      role="alert"
      className="fixed bottom-9 right-8 bg-green-100 dark:bg-green-900 border-l-4 border-green-500 dark:border-green-700 text-green-900 dark:text-green-100 p-4 rounded-lg flex items-center transition duration-300 ease-in-out hover:bg-green-200 dark:hover:bg-green-800 transform hover:scale-105 z-50"
    >
      <svg
        stroke="currentColor"
        viewBox="0 0 24 24"
        fill="none"
        className="h-5 w-5 flex-shrink-0 mr-2 text-green-600"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5 13l4 4L19 7"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        ></path>
      </svg>
      <p className="text-xs font-semibold">Job deleted successfully!</p>
    </div>
  );
  
  if (selectedJob) {
    const { isDarkMode } = useDarkMode(); // Use the isDarkMode context
  
    const handleDeleteJob = async (jobId) => {
      console.log("Received jobId for deletion:", jobId);
  
      if (!jobId) {
        console.error("Job ID is undefined. Cannot proceed with deletion.");
        return;
      }
  
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:5000/api/recruiters/jobs/${jobId}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to delete job");
        }
  
        console.log("Job deleted successfully");
  
        // Remove job from local state
        setAllJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
  
        // Show toast
        setShowToast(true);
  
        // Clear selected job after short delay (e.g., close a modal)
        setTimeout(() => {
          setShowToast(false);
          setSelectedJob(null); // Exit the "selectedJob" view/modal
        }, 2000); // 2 seconds is enough for toast
      } catch (error) {
        console.error("Error deleting job:", error.message);
      }
    };
    const fetchApplicants = async (jobId) => {
      if (!jobId) {
        console.error("Missing jobId or token");
        return;
      }
    
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Token is missing");
          return;
        }
    
        const response = await fetch(`http://localhost:5000/api/recruiters/jobs/${jobId}/applicants`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
    
        if (!response.ok) {
          const errorData = await response.json();
          console.error('Error fetching applicants:', errorData.message);
          return;
        }
    
        const applicantsData = await response.json();
        console.log('Applicants fetched successfully:', applicantsData);
        setApplicants(applicantsData); // Update state
      } catch (error) {
        console.error('Error during fetch:', error.message);
      }
    };
    return (
      <div
        className={`min-h-screen ${
          isDarkMode ? "bg-black text-white" : "bg-white text-black"
        } p-6`}
      >
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => setSelectedJob(null)}
            className="inline-flex items-center mb-6 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to All Jobs
          </button>
          {showToast && <SuccessToast />}
          <div
            className={`rounded-lg shadow-md overflow-hidden border ${
              isDarkMode ? "bg-zinc-900 border-gray-700" : "bg-white border-gray-200"
            }`}
          >
            {/* Header section */}
            <div
              className={`p-6 border-b ${
                isDarkMode ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center">
                  <div
                    className={`h-14 w-14 ${
                      isDarkMode ? "bg-gray-800" : "bg-gray-100"
                    } rounded-lg`}
                  >
                    {selectedJob.category === "Engineering" ? (
                      <JobCategoryIcon category="Engineering" size="md" />
                    ) : selectedJob.logo ? (
                      <div
                        className={`${
                          isDarkMode ? "bg-gray-800" : "bg-gray-100"
                        }`}
                      >
                        {selectedJob.logo}
                      </div>
                    ) : (
                      <JobCategoryIcon
                        category={selectedJob.category || "Default"}
                        size="md"
                      />
                    )}
                  </div>
                  <div>
                    <h1
                      className={`text-2xl ml-5 font-bold ${
                        isDarkMode ? "text-white" : "text-gray-800"
                      }`}
                    >
                      {selectedJob.title}
                    </h1>
                    <div className="flex flex-wrap items-center mt-2">
                      <span
                        className={`${
                          isDarkMode ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        {selectedJob.companyName}
                      </span>
                      <span className="text-gray-400 mx-2">•</span>
                      <span
                        className={`flex items-center ${
                          isDarkMode ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        <MapPin
                          className={`h-4 w-4 mr-1 ${
                            isDarkMode ? "text-gray-500" : "text-gray-400"
                          }`}
                        />
                        {selectedJob.location}
                      </span>
                    </div>
                  </div>
                </div>
  
                {/* Recruiter actions */}
                <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
                  <button
                    onClick={() => handleEditJob(selectedJob._id)}
                    className={`flex items-center ${
                      isDarkMode
                        ? "bg-blue-900/30 hover:bg-blue-800/50 text-blue-400"
                        : "bg-blue-50 hover:bg-blue-100 text-blue-600"
                    } px-4 py-2 rounded-md transition-colors`}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      if (!selectedJob?._id) {
                        console.error("Error: No job selected for deletion.");
                        return;
                      }
                      console.log(
                        "Attempting to delete job with ID:",
                        selectedJob._id
                      );
                      handleDeleteJob(selectedJob._id);
                    }}
                    className={`flex items-center ${
                      isDarkMode
                        ? "bg-red-900/30 hover:bg-red-800/50 text-red-400"
                        : "bg-red-50 hover:bg-red-100 text-red-600"
                    } px-4 py-2 rounded-md transition-colors`}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </button>
  
                  <button
                    className={`border ${
                      isDarkMode
                        ? "border-gray-700 hover:bg-gray-700 text-gray-400"
                        : "border-gray-200 hover:bg-gray-50 text-gray-500"
                    } p-2 rounded-md transition-colors`}
                    aria-label="Share job"
                  >
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
  
              <div className="flex flex-wrap gap-3 mt-4">
                <span
                  className={`inline-flex items-center px-3 py-1 ${
                    isDarkMode
                      ? "0 text-purple-300"
                      : " text-purple-700"
                  } rounded-full text-sm font-medium`}
                >
                  <DollarSign className="h-3.5 w-3.5 mr-1" />
                  {selectedJob.salary}
                </span>
                {selectedJob.jobType && (
                  <span
                    className={`inline-flex items-center px-3 py-1 ${
                      isDarkMode
                        ? " text-blue-300"
                        : " text-blue-700"
                    } rounded-full text-sm font-medium`}
                  >
                    <Briefcase className="h-3.5 w-3.5 mr-1" />
                    {selectedJob.jobType}
                  </span>
                )}{selectedJob.experienceLevel && (
                  <span
                    className={`inline-flex items-center px-3 py-1 ${
                      isDarkMode
                        ? " text-blue-300"
                        : " text-blue-700"
                    } rounded-full text-sm font-medium`}
                  >
                    <Briefcase className="h-3.5 w-3.5 mr-1" />
                    {selectedJob.  experienceLevel}
                  </span>
                )}
              
                <span
                  className={`inline-flex items-center px-3 py-1 ${
                    isDarkMode
                      ? " text-green-300"
                      : " text-green-700"
                  } rounded-full text-sm font-medium`}
                >
                  <Clock className="h-3.5 w-3.5 mr-1" />
                 Added at  {new Date(selectedJob.createdAt).toLocaleDateString()}
                </span>
                <span
                  className={`inline-flex items-center px-3 py-1 ${
                    isDarkMode
                      ? " text-red-300"
                      : " text-red-700"
                  } rounded-full text-sm font-medium`}
                >
                  <Clock className="h-3.5 w-3.5 mr-1" />
                 DeadLine {new Date(selectedJob.deadline).toLocaleDateString()}
                </span>
                
              </div>
         
            </div>

            <div className="grid md:grid-cols-3 gap-6 p-6">
              <div className="md:col-span-2 space-y-8">
                <section>
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-purple-500" />
                    About The Role
                  </h2>
                  <div className=
                  {`  ${
                    isDarkMode
                      ? "border-gray-700 "
                      : "border-gray-200 "
                  } rounded-lg p-5 border`}>
                    <p className=" whitespace-pre-line leading-relaxed">
                      {selectedJob.description}
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="text-xl font-semibold  mb-4 flex items-center">
                    <CheckSquare className="h-5 w-5 mr-2 text-purple-500" />
                    Job Requirements
                  </h2>
                  <div className= {`  ${
                    isDarkMode
                      ? "border-gray-700 "
                      : "border-gray-200 "
                  } rounded-lg p-5 border`}>
                    <ul className="space-y-3">
                      {renderRequirements(selectedJob.requirements)}
                    </ul>
                  </div>
                </section>
                <section>
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-purple-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
                    Required Skills
                  </h2>
                  <div className="flex flex-wrap gap-2">
              {selectedJob.skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 px-3 py-1 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
                </section>
                {selectedJob && (
  <>
    <h1>Get applied candidates</h1>
    <button
  onClick={() => {
    console.log("Selected Job:", selectedJob); // Log the entire selectedJob object
    console.log("Job ID:", selectedJob?._id); // Log the _id specifically
    fetchApplicants(selectedJob?._id); // Use _id instead of job_id
  }}
>
  Get Applicants
</button>
<div>
  <p>Total Applicants: {applicants.length}</p>
  <div>
    {applicants.map((applicant, index) => (
      <div key={index} className="p-4 border-b border-gray-200 dark:border-gray-700">
        <p><strong>Name:</strong> {applicant.name}</p>
        <p><strong>Email:</strong> {applicant.email}</p>
        <p><strong>Phone:</strong> {applicant.phone}</p>
        <p><strong>Resume:</strong> <a href={applicant.resumeUrl} target="_blank" rel="noopener noreferrer">View Resume</a></p>
        <p><strong>Applied Date:</strong> {new Date(applicant.appliedDate).toLocaleDateString()}</p>
      </div>
    ))}
  </div>
</div>
  </>

)}

              </div>

              <div className="md:col-span-1">
                <div 
                className={`rounded-lg p-5 sticky top-6shadow-md overflow-hidden border ${
                  isDarkMode ? "bg-zinc-900 border-gray-700" : "bg-white border-gray-200"
                }`}
                >
                  <h3 className="font-semibold  mb-4 text-lg flex items-center">
                    <Info className="h-5 w-5 mr-2 text-purple-500" />
                    Job Details
                  </h3>
                  <div className={`rounded-lg p-3 sticky  top-6shadow-md overflow-hidden border  ${
                      isDarkMode ? "bg-zinc-900 border-gray-700 text-white" : "bg-white border-gray-200"
                    }`}>
                      <h4 className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        Category
                      </h4>
                      <div className="flex items-center">
                        {selectedJob.category === "Engineering" ? (
                                             <JobCategoryIcon category="Engineering" size="xs" />
                                           ) : selectedJob.logo ? (
                                             <div className=" bg-gray-100 dark:bg-gray-800  ">
                                               {selectedJob.logo}
                                             </div>
                                           ) : (
                                             <JobCategoryIcon category={selectedJob.category || "Default"} size="xs" />
                                           )}
                        <p className= {`font-medium ${
                          isDarkMode ? "bg-zinc-900 border-gray-700 text-white" : "bg-white border-gray-200"
                        }`}>
                          {selectedJob.category}
                        </p>
                      </div>
                    </div>
                  <div className="space-y-5 mt-5">
                    <div 
                     className={`rounded-lg p-3 sticky  top-6shadow-md overflow-hidden border ${
                      isDarkMode ? "bg-zinc-900 border-gray-700 text-white" : "bg-white border-gray-200"
                    }`}
                    >
                      <h4 className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        Location
                      </h4>
                      <div className="flex items-center">
                        <MapPin className="h-5 w-5 text-purple-500 mr-2" />
                        <p className=
                        {`font-medium ${
                          isDarkMode ? "bg-zinc-900 border-gray-700 text-white" : "bg-white border-gray-200"
                        }`}>
                          {selectedJob.location}
                        </p>
                      </div>
                    </div>

                    <div className={`rounded-lg p-3 sticky  top-6shadow-md overflow-hidden border ${
                      isDarkMode ? "bg-zinc-900 border-gray-700 text-white" : "bg-white border-gray-200"
                    }`}>
                      <h4 className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        Salary Range
                      </h4>
                      <div className="flex items-center">
                        <DollarSign className="h-5 w-5 text-green-500 mr-2" />
                        <p className= {`font-medium ${
                          isDarkMode ? " border-gray-700 text-green-500" : "bg-white border-gray-200"
                        }`}>
                          {selectedJob.salary}
                        </p>
                      </div>
                    </div>

                    {selectedJob.department && (
                      <div className={`rounded-lg p-3 sticky  top-6shadow-md overflow-hidden border ${
                        isDarkMode ? "bg-zinc-900 border-gray-700 text-white" : "bg-white border-gray-200"
                      }`}>
                        <h4 className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                          Department
                        </h4>
                        <div className="flex items-center">
                          <Users className="h-5 w-5 text-purple-500 mr-2" />
                          <p className="font-medium text-gray-700 dark:text-gray-200">
                            {selectedJob.department}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className={`rounded-lg p-3 sticky  top-6shadow-md overflow-hidden border ${
                        isDarkMode ? "bg-zinc-900 border-gray-700 text-white" : "bg-white border-gray-200"
                      }`}>
                      <h4 
                      className= {`text-sm mb-2 ${
                        isDarkMode ? "bg-zinc-900 border-gray-700 text-white" : "bg-white border-gray-200"
                      }`}>
                        Listing Status
                      </h4>
                      <button
                        onClick={() => handleJobStatus(selectedJob._id)}
                        className={`w-full py-2 px-4 rounded-md ${
                          selectedJob.status === "active"
                          ? "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/60"
                          : selectedJob.status === "paused"
                          ? "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-200 dark:hover:bg-yellow-900/60"
                          : "bg-gray-100 dark:bg-gray-900/40 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800/60"
                      }text-center font-medium flex items-center justify-center transition-colors`}
                      >
                        {selectedJob.status== "active" ? (
                          <>
                            <CheckCircle className="h-5 w-5 mr-2" />
                            Active Listing
                          </>
                        ) : (
                          <>
                            <AlertCircle className="h-5 w-5 mr-2" />
                            Inactive Listing
                          </>
                        )}
                      </button>
                      
                    </div>

                   
                  </div>
                  
                </div>
                
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "dark" : ""
      } transition-all duration-300 ease-in-out`}
    >
      <div className="flex h-screen bg-white dark:bg-black">
        <aside
          className={`fixed md:relative flex flex-col h-full bg-white dark:bg-black border-gray-200 dark:border-gray-800
           transition-all duration-300 ease-in-out z-30
            ${isSidebarOpen ? "w-64" : "w-20"}`}
        >
          <div className="flex items-center  justify-between p-5  border-gray-200 dark:border-gray-800 ">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg">
                <Menu className="w-5 h-5 text-gray-600 dark:text-white transition-all duration-300 ease-in-out z-30 " />
              </div>
              {isSidebarOpen && (
                <span className="text-lg font-semibold text-gray-900 dark:text-white  transition-all duration-300 ease-in-out z-30 ">
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

        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-gray-50  dark:bg-black transition-all duration-300 ease-in-out z-30">
          {/* Header */}
          <header className="bg-white dark:bg-black  border-gray-200 dark:border-gray-900 sticky top-0 transition-all duration-300 ease-in-out z-30 ">
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
                    href: "/dashboard/PastApplications",
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
          <div className="p-6 bg-gray-50 dark:bg-black min-h-screen">
            <div className="max-w-6xl mx-auto">
            <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Manage Your Job Listings</h1>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors">
              <Plus size={18} /> Add New Job
            </button>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            View, edit, or delete the jobs you've posted. Keep your listings
            up-to-date to attract the best talent.
          </p>

          {/* Search and stats bar */}
         <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input 
                type="text" 
                placeholder="Search jobs by title, skills or location..." 
                className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="flex gap-2">
            <div className="hidden md:flex items-center gap-6">
              <div className="text-sm">
                <span className="text-gray-500 dark:text-gray-400">Total:</span> 
                <span className="ml-1 font-semibold">{filteredJobs.length} jobs</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-500 dark:text-gray-400">Active:</span> 
                <span className="ml-1 font-semibold">{filteredJobs.filter(job => job.isActive).length} jobs</span>
              </div>
            </div>
            {/* Filter button for mobile */}
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)} 
              className="md:hidden flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-zinc-900"
            >
              <Filter size={18} />
              <span>Filters</span>
              {isFilterOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters panel - hidden on mobile unless toggled */}
          <div className={`w-full md:w-1/4 order-2 md:order-2 ${isFilterOpen ? 'block' : 'hidden md:block'}`}>
            <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800 sticky top-4">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h2 className="font-semibold text-lg flex items-center">
                  <Filter size={18} className="mr-2" />
                  Filters
                </h2>
                <button 
                  onClick={() => setIsFilterOpen(false)}
                  className="text-gray-500 md:hidden"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-5 space-y-6">
                {/* Job Type Filter */}
                <div>
                  <h3 className="font-medium mb-3 text-gray-800 dark:text-gray-200">Job Type</h3>
                  <div className="space-y-3">
                    {['fullTime', 'partTime', 'contract'].map((type) => (
                      <label key={type} className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters[type]}
                          onChange={() => handleFilterChange(type)}
                          className="rounded border-gray-300 text-purple-600 shadow-sm focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50 h-5 w-5"
                        />
                        <span className="ml-3 text-gray-700 dark:text-gray-300">
                          {type === 'fullTime' ? 'Full Time' : type === 'partTime' ? 'Part Time' : 'Contract'}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Salary Range Filter */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="font-medium mb-3 text-gray-800 dark:text-gray-200">Salary Range</h3>
                  <div className="space-y-3">
                    {[
                      { id: 'salary50_100', label: '$50k - $100k' },
                      { id: 'salary100_150', label: '$100k - $150k' },
                      { id: 'salary150Plus', label: '$150k+' }
                    ].map((range) => (
                      <label key={range.id} className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters[range.id]}
                          onChange={() => handleFilterChange(range.id)}
                          className="rounded border-gray-300 text-purple-600 shadow-sm focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50 h-5 w-5"
                        />
                        <span className="ml-3 text-gray-700 dark:text-gray-300">{range.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Location Filter */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="font-medium mb-3 text-gray-800 dark:text-gray-200">Location</h3>
                  <div className="space-y-3">
                    {['remote', 'onsite', 'hybrid'].map((loc) => (
                      <label key={loc} className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters[loc]}
                          onChange={() => handleFilterChange(loc)}
                          className="rounded border-gray-300 text-purple-600 shadow-sm focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50 h-5 w-5"
                        />
                        <span className="ml-3 text-gray-700 dark:text-gray-300">
                          {loc.charAt(0).toUpperCase() + loc.slice(1)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Filter Actions */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between">
                  <button 
                    onClick={clearFilters}
                    className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 text-sm font-medium"
                  >
                    Clear all
                  </button>
                  <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-1.5 rounded-md text-sm font-medium transition-colors">
                    Apply filters
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Job Listings - Main content area */}
          <div className="w-full md:w-3/4 order-1 md:order-1">
            <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <div className="flex items-center">
                  <h2 className="text-xl font-semibold">Your Job Listings</h2>
                  <div className="ml-2 px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm">
                    {filteredJobs.length}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Sort by:</span>
                  <select className="bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-gray-700 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500">
                    <option>Newest</option>
                    <option>Oldest</option>
                    <option>Most Applications</option>
                    <option>Status</option>
                  </select>
                </div>
              </div>
             

              <div className="p-4">
                {loading ? (
                  <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                  </div>
                ) : error ? (
                  <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                    <p className="text-red-600 dark:text-red-400 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {error}
                    </p>
                  </div>
                ) : filteredJobs.length === 0 ? (
                  <div className="text-center py-12">
                    <Briefcase className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium">No jobs found</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 mb-4">
                      Try adjusting your filters or create your first job listing.
                    </p>
                    <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium mx-auto transition-colors">
                      <Plus size={18} /> Add New Job
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredJobs.map((job) => (
                      <div
                        key={job._id}
                        className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-gray-800 hover:shadow-md transition-all group overflow-hidden cursor-pointer"
                        onClick={() => setSelectedJob(job)} // Set the selected job on click
                      >
                        <div className="relative">
                          {/* Status indicator */}
                          <div className={`absolute top-0 left-0 w-1 h-full ${
                            job.status === 'active' ? 'bg-green-500' : 
                            job.status === 'paused' ? 'bg-yellow-500' : 'bg-gray-400'
                          }`}></div>
                          
                          <div className="flex items-center p-5 pl-6">
                          <div className="mr-4 w-14 h-14 flex items-center justify-center text-2xl">
        {job.category === "Engineering" ? (
          <JobCategoryIcon category="Engineering" size="md" />
        ) : job.logo ? (
          <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg w-full h-full flex items-center justify-center">
            {job.logo}
          </div>
        ) : (
          <JobCategoryIcon category={job.category || "Default"} size="md" />
        )}
      </div>

                            
                            <div className="flex-grow">
                              <div className="flex items-center mb-1">
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                  {job.company}
                                </h3>
                                {job.featured && (
                                  <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 rounded-full flex items-center">
                                    <Star size={10} className="mr-1" /> Featured
                                  </span>
                                )}
                                {job.new && (
                                  <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded-full">
                                    New
                                  </span>
                                )}
                                <span className={`ml-2 px-2 py-0.5 text-xs font-medium rounded-full ${
                                  job.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 
                                  job.status === 'paused' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' : 
                                  'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                }`}>
                                  {job.status === 'active' ? 'Active' : job.status === 'paused' ? 'Paused' : 'Expired'}
                                </span>
                              </div>
                              <p className="text-lg font-semibold group-hover:text-blue-500 dark:group-hover:text-purple-400 transition-colors">
                              {job.title || "Position"}
                             
                              </p>
                              <p className="text-l font-semibold group-hover:text-zinc-500 dark:group-hover:text-purple-400 transition-colors">
                             
                              {job.companyName || "Company"}
                              </p>
                              <p className="text-l font-semibold group-hover:text-zinc-500 dark:group-hover:text-purple-400 transition-colors">
                             
                             {job.category|| ""}
                             </p>
                              
                              <div className="flex flex-wrap gap-4 mt-2">
                                <div className="flex items-center text-sm text-blue-700  dark:text-blue-300  font-medium px-2 py-0.5 rounded-full">
                                  <MapPin size={16} className="mr-1" />
                                  <span>{job.location}</span>
                                </div>

                                <div className="flex items-center text-sm text-green-700  dark:text-green-300 font-medium px-2 py-0.5 rounded-full">
                                  <DollarSign size={16} className="mr-1" />
                                  <span>{job.salary}</span>
                                </div>

                                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                  <Briefcase size={16} className="mr-1" />
                                  <span>{job.jobType}</span>
                                </div>
                                
                                <div className="flex items-center text-sm text-red-500  dark:text-red-300  font-medium px-2 py-0.5 rounded-full">
                                  <Clock size={16} className="mr-1" />
                                  <span> Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
                                </div>
                              </div>
                            </div>

                            <div className="ml-4 flex flex-col items-end">
                              <div className="text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 px-2 py-1 rounded-full mb-2">
                                {job.applicationCount} Applicants
                              </div>
                              
                              <button className="w-full px-2 py-1 bg-zinc-400 group-hover:bg-zinc-600 text-zinc-100 group-hover:text-white dark:bg-zinc-700   rounded-lg font-medium transition-colors flex items-center justify-center group-hover:shadow-sm">
              View Details
                                
            </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Pagination */}
              {filteredJobs.length > 0 && (
                <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredJobs.length}</span> of <span className="font-medium">{filteredJobs.length}</span> results
                  </div>
                  <div className="flex">
                    <button disabled className="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded-l-md bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500">
                      Previous
                    </button>
                    <button className="px-3 py-1 border border-gray-300 dark:border-gray-700 border-l-0 bg-white dark:bg-gray-900 text-purple-600 dark:text-purple-400 font-medium">
                      1
                    </button>
                    <button className="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded-r-md border-l-0 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
    

            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Jobs;