import React, { useState, useEffect } from "react";
import {
  Menu,
  History,
  PlusSquare,
  Settings,
  CreditCard,
  Moon,
  Sun,
  Filter,
  ChevronLeft,
  ChevronRight,
  Search,
  Wrench,
  FlaskConical,
  Share2,
  X,
  CheckCircle,
  RefreshCw,
  ChevronDown

} from "lucide-react";
import { Menu as HeadlessMenu } from "@headlessui/react";
import { BellIcon } from "@heroicons/react/24/outline";
import { MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Link } from "react-router-dom";
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
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-black dark:text-zinc-300" />
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
            className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-lg w-full max-w-md relative"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
          >
            {/* Close Button - Fixed positioning */}
            <button
              className="absolute top-3 right-3 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition-colors"
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
            <div className="relative mb-4 mt-5">
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
    { label: "Your History", href: "#profile" },
    { label: "Settings", href: "/Settings" },
  ];

  return (
    <HeadlessMenu as="div" className="relative z-50"> {/* Ensure high z-index */}
      <MenuButton className="flex rounded-full ring-offset-gray-800 focus-visible:ring-2">
        <span className="sr-only">Open user menu</span>
        <img
          className="h-8 w-8 rounded-full ring-2 ring-gray-700 hover:ring-blue-500 transition-all"
          src="../../assets/images/avatar.jpg"
          alt="User avatar"
        />
      </MenuButton>

      <MenuItems
        className={`absolute right-0 z-50 mt-2 w-48 rounded-md py-1 border-2 border-dashed shadow-xl focus:outline-none 
     ${
       isDarkMode
         ? "bg-zinc-900 text-white bg-opacity-100 border-zinc-400"
         : "bg-zinc-200 text-black bg-opacity-5 border-zinc-700"
     } backdrop-blur-sm`}
      >
        {menuItems.map(({ label, href }) => (
          <MenuItem key={label}>
            {({ active }) => (
              <a
                href={href}
                className={`block px-4 py-2 text-sm border-b-2 border-dashed ${
                  active
                    ? isDarkMode
                      ? "bg-zinc-900 text-white"
                      : "bg-zinc-300 text-black"
                    : isDarkMode
                    ? "bg-zinc-950 text-zinc-100 border-zinc-400"
                    : "text-black"
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
                    ? "bg-zinc-900 text-white"
                    : "bg-zinc-300 text-black"
                  : isDarkMode
                  ? "bg-zinc-950 text-zinc-100 border-zinc-400"
                  : "text-black"
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
              className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between ${
                active
                  ? isDarkMode
                    ? "bg-zinc-900 text-white"
                    : "bg-zinc-300 text-black"
                  : isDarkMode
                  ? "bg-zinc-950 text-zinc-100 border-zinc-400"
                  : "text-black"
              }`}
              aria-label={
                isDarkMode ? "Switch to light mode" : "Switch to dark mode"
              }
            >
              <span>Theme</span>
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-gray-600 dark:text-white" />
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

function Button({ children, variant = "outline", className, onClick }) {
  const baseStyle =
    "px-4 py-2 rounded-md font-medium transition-all duration-300";

  const styles = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600",
    outline:
      "border border-zinc-300 bg-white text-zinc-800 hover:bg-zinc-200 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700",
    ghost:
      "text-zinc-600 hover:bg-zinc-200 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-200",
    link: "text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300",
  };

  const variantStyle = styles[variant] || styles.outline;

  return (
    <button
      className={`${baseStyle} ${variantStyle} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

const SidebarLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { isDarkMode } = useDarkMode();
  const [jobType, setJobType] = useState("all");
  const [salaryRange, setSalaryRange] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [experienceLevel, setExperienceLevel] = useState('all');
  const [activeTab, setActiveTab] = useState('all');
  const [savedJobs, setSavedJobs] = useState([]);
  const [pinnedJobs, setPinnedJobs] = useState([]);

  const navigation_menu = [
    { name: "Dashboard", href: "/dashboard", icon: Menu, current: false },
    {
      name: "History",
      href: "/dashboard/history",
      icon: History,
      current: false,
    },
    { name: "Job List", href: "/Jobcandidate", icon: Menu, current: true },
    { name: "Billing", href: "/Pricing", icon: PlusSquare, current: false },
  ];
  const navigation_option = [
    { name: "Settings", href: "/Settings", icon: Settings, current: false },
    { name: "Support", href: "/cv", icon: Wrench, current: false },
    {
      name: "CV Testing",
      href: "/Testing",
      icon: FlaskConical,
      current: false,
    },
  ];
  const [showFilters, setShowFilters] = useState(false);

  const [selectedJob, setSelectedJob] = useState(null);
  const [allJobs, setAllJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    fullTime: false,
    partTime: false,
    salary50_100: false,
    salary100_150: false,
  });
  const [activeFilter, setActiveFilter] = useState("all");

  // Handler function for job type change
  const handleJobTypeChange = (event) => {
    setJobType(event.target.value);
  };

  // Handler function for salary range change
  const handleSalaryRangeChange = (event) => {
    setSalaryRange(event.target.value);
  };
  const resetFilters = () => {
    setSearchQuery('');
    setJobType('all');
    setSalaryRange('all');
    setExperienceLevel('all');
  };
  // Fetch jobs from the backend
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        console.log("Fetching jobs...");
        const response = await fetch("http://localhost:5000/api/jobs");
        if (!response.ok) {
          throw new Error("Failed to fetch jobs");
        }
        const data = await response.json();
        console.log("Jobs fetched:", data);
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
  const applyFilters = () => {
    // Implement your filter application logic here
    console.log('Applying filters:', {
      searchQuery,
      jobType,
      salaryRange,
      experienceLevel
    });
  };
  // Combined filtering function
  const getFilteredJobs = () => {
    let result = allJobs;

    // Apply search query filter
    if (searchQuery) {
      result = result.filter(
        (job) =>
          (job.role &&
            job.role.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (job.company &&
            job.company.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply job type filter
    if (jobType !== "all") {
      result = result.filter(
        (job) => job.type && job.type.toLowerCase() === jobType.toLowerCase()
      );
    }

    // Apply salary range filter
    if (salaryRange !== "all") {
      result = result.filter((job) => {
        const salaryString = job.salary
          ? job.salary.replace(/[^0-9-]/g, "")
          : "0";
        const [minSalary] = salaryString.split("-").map(Number);

        if (salaryRange === "under50k") return minSalary < 50;
        if (salaryRange === "50k_100k")
          return minSalary >= 50 && minSalary <= 100;
        if (salaryRange === "100k_150k")
          return minSalary >= 100 && minSalary <= 150;
        if (salaryRange === "over150k") return minSalary > 150;

        return true;
      });
    }

    // Apply experience level filter
    if (experienceLevel !== "all") {
      result = result.filter(
        (job) =>
          job.experienceLevel &&
          job.experienceLevel.toLowerCase() === experienceLevel.toLowerCase()
      );
    }

    // Apply active filter (all, suggested, recent, pinned)
    if (activeFilter === "suggested") {
      result = result.filter((job) => job.suggested === true);
    } else if (activeFilter === "recent") {
      result = savedJobs; // Use the saved jobs for the "Recent" category
    } else if (activeFilter === "pinned") {
      result = savedJobs.filter((job) => job.isPinned); // Filter only pinned jobs
    }

    return result;
  };

  const filteredJobs = getFilteredJobs();

  // Function to safely render requirements
  const renderRequirements = (requirements) => {
    if (!requirements) return [];

    if (Array.isArray(requirements)) {
      return requirements.map((req, index) => (
        <li key={index} className="ml-4 text-gray-600 dark:text-gray-400">
          {req}
        </li>
      ));
    } else if (typeof requirements === "string") {
      return requirements.split("\n").map((line, index) => (
        <li key={index} className="ml-4 text-gray-600 dark:text-gray-400">
          {line}
        </li>
      ));
    } else {
      return [];
    }
  };
  const getButtonStyle = (filter) => {
    return `px-3 py-1 text-sm rounded-full ${
      activeFilter === filter
        ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
        : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
    } hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors`;
  };

  const handleSaveJob = (job) => {
    setSavedJobs((prevSavedJobs) => {
      // Check if the job is already saved
      const isAlreadySaved = prevSavedJobs.some((savedJob) => savedJob.id === job.id);

      if (isAlreadySaved) {
        // If the job is already saved, update its `isPinned` property
        return prevSavedJobs.map((savedJob) =>
          savedJob.id === job.id ? { ...savedJob, isPinned: true } : savedJob
        );
      }

      // If the job is not already saved, add it with `isPinned` set to true
      return [...prevSavedJobs, { ...job, isPinned: true }];
    });
  };

  const handlePinJob = (jobId) => {
    setSavedJobs((prevSavedJobs) =>
      prevSavedJobs.map((job) =>
        job.id === jobId ? { ...job, isPinned: !job.isPinned } : job
      )
    );
  };

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
          {/* Sidebar header */}
          <div className="flex items-center justify-between p-4 border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg">
                <Menu className="w-5 h-5 text-gray-600 dark:text-white transition-all duration-300 ease-in-out z-30" />
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

          {/* Sidebar navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
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

          {/* Sidebar footer */}
          {isSidebarOpen && (
            <div className="p-3 border-gray-200 dark:border-gray-900 transition-all duration-300 ease-in-out z-30">
              <div className="rounded-lg p-4 space-y-4 transition-all duration-300 ease-in-out z-30">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                    <CreditCard className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 dark:text-white transition-all duration-300 ease-in-out z-30">
                      Buy us a coffee
                    </h3>
                    <p className="text-sm text-gray-400 dark:text-gray-500 transition-all duration-300 ease-in-out z-30">
                      TalentSync is free thanks to donations, please support us
                      to keep the project running.
                    </p>
                  </div>
                </div>
                <button className="w-full dark:bg-zinc-900 dark:hover:bg-zinc-800 bg-zinc-200 hover:bg-gray-300 text-black dark:text-white py-2 px-4 rounded-lg transition-colors">
                  Donate
                </button>
              </div>
            </div>
          )}
        </aside>

        <main className="flex-1 overflow-auto bg-gray-50 dark:bg-black transition-all duration-300 ease-in-out z-30">
          {/* Header */}

          <header className="bg-white dark:bg-black border-gray-200 dark:border-gray-900 sticky top-0 transition-all duration-300 ease-in-out z-30">
            <div className="flex items-center justify-between px-6 py-4">
              <SearchBar
                navigationMenu={navigation_menu}
                navigationOption={navigation_option}
              />
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  className="relative p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          <div className="p-4 sm:p-6 max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between  ">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Find Your Dream Job
                </h1>
                <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-6">
                  Access thousands of job opportunities tailored to your skills
                  and preferences.
                </p>

                {/* Filter buttons section */}
                <div className="flex flex-wrap items-center mb-6 gap-2">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400 mr-2 flex items-center">
                    <Filter className="h-4 w-4 mr-1" /> Filter:
                  </span>
                  <button
                    className={getButtonStyle("all")}
                    onClick={() => setActiveFilter("all")}
                  >
                    All
                  </button>
                  <button
                    className={getButtonStyle("suggested")}
                    onClick={() => setActiveFilter("suggested")}
                  >
                    Suggested For You
                  </button>
                  <button
                    className={getButtonStyle("recent")}
                    onClick={() => setActiveFilter("recent")}
                  >
                    Recent
                  </button>
                  <button
                    className={getButtonStyle("pinned")}
                    onClick={() => setActiveFilter("pinned")}
                  >
                    Pinned
                  </button>
                </div>

              {/* Job listings section */}
<div className="space-y-9">
  {loading ? (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-12 p-12">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse border dark:border-zinc-700 rounded-lg shadow-sm p-12 bg-white dark:bg-zinc-800"
        >
          <div className="flex items-center gap-9">
            <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            <div className="space-y-2 flex-1">
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
          </div>
          <div className="mt-4">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          </div>
        </div>
      ))}
    </div>
  ) : error ? (
    <div className="p-12 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-center">
      <div className="mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 mx-auto text-red-500 dark:text-red-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <p className="text-red-500 dark:text-red-400 font-medium mb-2">
        {error}
      </p>
      <button className="mt-2 px-4 py-2 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-600 dark:text-red-300 rounded-lg font-medium transition-colors">
        Try Again
      </button>
    </div>
  ) : filteredJobs.length === 0 ? (
    <div className="text-center py-12 bg-white dark:bg-zinc-800 rounded-lg shadow-sm border dark:border-zinc-700">
      <div className="mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
        No matching jobs found
      </h3>
      <p className="text-gray-500 dark:text-gray-400 mb-4">
        Try adjusting your filters to see more results
      </p>
      <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors">
        Reset Filters
      </button>
    </div>
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4 sm:gap-6">
      {filteredJobs.map((job) => (
        <div
          key={job.id}
          className="group relative border dark:border-zinc-700 rounded-xl shadow-sm overflow-hidden transition-all duration-300 ease-in-out hover:shadow-md hover:-translate-y-1 bg-white dark:bg-zinc-800 cursor-pointer"
          onClick={() => setSelectedJob(job)}
        >
          {/* New badge */}
          {job.isNew && (
            <span className="absolute top-3 right-3 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300 text-xs font-bold px-2.5 py-1 rounded-full z-10 shadow-sm">
              New
            </span>
          )}
          
          <div className="p-4 sm:p-5">
            <div className="flex items-start gap-3 sm:gap-4">
              {/* Company logo */}
              <div className="flex-shrink-0 h-12 w-12 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center overflow-hidden">
                {job.logo ? (
                  <img
                    src={job.logo}
                    alt={`${job.company || "Company"} logo`}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <span className="text-gray-500 dark:text-gray-400 text-lg font-bold">
                    {job.company ? job.company.charAt(0) : "J"}
                  </span>
                )}
              </div>
              
              {/* Job info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-500 dark:text-gray-400 text-sm mb-1">
                  {job.company || "Company"}
                </h3>
                <p className="text-lg font-semibold text-gray-800 dark:text-white truncate">
                  {job.role || "Position"}
                </p>
                
                {/* Tags */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {job.location && (
                    <span className="inline-flex items-center bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {job.location}
                    </span>
                  )}
                  
                  {job.salary && (
                    <span className="inline-flex items-center bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {job.salary}
                    </span>
                  )}
                  
                  {job.type && (
                    <span className="inline-flex items-center bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      {job.type}
                    </span>
                  )}
                  
                  {job.skills && (
                    <span className="inline-flex items-center bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      Skills: {job.skills.join(", ")}
                    </span>
                  )}
                  
                  {job.deadline && (
                    <span className="inline-flex items-center bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 00-2 2z"
                        />
                      </svg>
                      Deadline: {new Date(job.deadline).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Action button */}
          <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-2 flex justify-between items-center">
            
            <button className="w-full px-4 py-2.5 bg-zinc-600 hover:bg-blue-700 dark:bg-zinc-900 dark:hover:bg-blue-800 text-white rounded-lg font-medium transition-colors flex items-center justify-center group-hover:shadow-sm">
              View Details
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  )}
</div>
</div>
{/* Job Details Modal */}
{selectedJob && (
  <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
    <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-xl w-full max-w-3xl relative animate-fadeIn">
      {/* Header with close button */}
      <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-4">
          {/* Company logo */}
          <div className="h-14 w-14 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden">
            {selectedJob.logo ? (
              <img
                src={selectedJob.logo}
                alt={`${selectedJob.company} logo`}
                className="w-full h-full object-contain"
              />
            ) : (
              <span className="text-gray-500 dark:text-gray-400 text-xl font-bold">
                {selectedJob.company ? selectedJob.company.charAt(0) : "J"}
              </span>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {selectedJob.role}
            </h1>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm mt-1">
              <span className="font-medium">{selectedJob.company}</span>
              <span>•</span>
              <span>{selectedJob.location}</span>
              {selectedJob.type && (
                <>
                  <span>•</span>
                  <span>{selectedJob.type}</span>
                </>
              )}
            </div>
          </div>
        </div>
        <button
          onClick={() => setSelectedJob(null)}
          className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition-colors rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="Close"
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

      {/* Content area with scroll */}
      <div className="p-6 max-h-[calc(80vh-100px)] overflow-y-auto">
        {/* Important details section */}
        <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-4 mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {selectedJob.salary && (
            <div className="flex flex-col">
              <span className="text-sm text-gray-500 dark:text-gray-400">Salary</span>
              <span className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {selectedJob.salary}
              </span>
            </div>
          )}
          
          {selectedJob.experienceLevel && (
            <div className="flex flex-col">
              <span className="text-sm text-gray-500 dark:text-gray-400">Experience</span>
              <span className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                {selectedJob.experienceLevel}
              </span>
            </div>
          )}
          
          {selectedJob.deadline && (
            <div className="flex flex-col">
              <span className="text-sm text-gray-500 dark:text-gray-400">Application Deadline</span>
              <span className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 00-2 2z"
                  />
                </svg>
                {new Date(selectedJob.deadline).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>
        
        {/* Description section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Description
          </h2>
          <div className="text-gray-600 dark:text-gray-300 prose prose-sm dark:prose-invert max-w-none">
            {selectedJob.description}
          </div>
        </div>
        
        {/* Requirements section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Requirements
          </h2>
          <ul className="list-none text-gray-600 dark:text-gray-300 space-y-3">
            {renderRequirements(selectedJob.requirements)}
          </ul>
        </div>
        
        {/* Skills section */}
        {selectedJob.skills && selectedJob.skills.length > 0 && (
          <div className="mb-8">
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
          </div>
        )}
        
        {/* Additional details section */}
        <div className="mb-6 bg-gray-50 dark:bg-zinc-800 rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-yellow-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Additional Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedJob.educationRequirements && (
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Education Requirements</p>
                <p className="text-gray-900 dark:text-white font-medium">
                  {selectedJob.educationRequirements}
                </p>
              </div>
            )}
            
            {selectedJob.industry && (
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Industry</p>
                <p className="text-gray-900 dark:text-white font-medium">
                  {selectedJob.industry}
                </p>
              </div>
            )}
            
            {selectedJob.applicationCount && (
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Applications</p>
                <p className="text-gray-900 dark:text-white font-medium">
                  {selectedJob.applicationCount}
                </p>
              </div>
            )}
            
            {selectedJob.company && (
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Company</p>
                <p className="text-gray-900 dark:text-white font-medium">
                  {selectedJob.company}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Action buttons fixed at bottom */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-zinc-900 sticky bottom-0 flex items-center justify-between">
        <div className="flex items-center">
          {selectedJob.applicationCount && (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              <strong>{selectedJob.applicationCount}</strong> people have applied
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button 
            className="border border-gray-300 dark:border-gray-600 p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-center"
            aria-label="Share job"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-600 dark:text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
              />
            </svg>
          </button>
          
          <button 
            className="border border-gray-300 dark:border-gray-600 p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-center"
            aria-label="Save job"
            onClick={() => handleSaveJob(selectedJob)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-600 dark:text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
          </button>
          
          <Link
            to={{
              pathname: "/Application",
            }}
            state={{ job: selectedJob }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2 font-medium shadow-sm"
          >
            Apply Now
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  </div>
)}
            </div>
          </div>

          {/* Floating Filter Panel */}
          <div className="   lg:fixed lg:top-36 lg:right-6 lg:w-90 w-full md:w-80 sm:mx-auto p-3 md:p-3 bg-white dark:bg-zinc-950 rounded-lg shadow-lg border-gray-200 dark:border-zinc-800 z-10 mb-6">
  <div className="space-y-6 ">
    {/* Header with better spacing and alignment */}
    <div className="flex items-center justify-between  border-gray-300 dark:border-zinc-700 pb-1">
      <h2 className="text-base md:text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center">
        <Filter size={18} className="mr-2 hidden sm:inline" />
        Filter Jobs
      </h2>
      <button
        className="flex items-center justify-center h-8 w-8 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
        onClick={() => setShowFilters((prev) => !prev)}
        aria-label={showFilters ? "Hide Filters" : "Show Filters"}
      >
        {showFilters ? <X size={18} /> : <Filter size={18} />}
      </button>
    </div>

    {/* Filter Content with better transitions - Default to closed state */}
    <div
      className={`transition-all duration-300 ease-in-out ${
        showFilters
          ? "max-h-[600px] opacity-100"
          : "max-h-0 opacity-0 overflow-hidden"
      }`}
    >
      {/* Search Bar with improved styling */}
      <div className="mb-5">
        <label
          htmlFor="jobSearch"
          className="block font-medium text-sm text-gray-700 dark:text-gray-300 mb-2"
        >
          Search Jobs
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            id="jobSearch"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Job title, company..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white dark:bg-zinc-800 dark:text-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm text-sm transition-colors"
          />
        </div>
      </div>

      {/* Job Type Filter with improved aesthetics */}
      <div className="mb-5">
        <label
          htmlFor="jobType"
          className="block font-medium text-sm text-gray-700 dark:text-gray-300 mb-2"
        >
          Job Type
        </label>
        <div className="relative">
          <select
            id="jobType"
            value={jobType}
            onChange={handleJobTypeChange}
            className="w-full pl-4 pr-8 py-2 border border-gray-300 rounded-md text-gray-700 bg-white dark:bg-zinc-800 dark:text-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm text-sm appearance-none transition-colors"
          >
            <option value="all">All Job Types</option>
            <option value="fullTime">Full Time</option>
            <option value="partTime">Part Time</option>
            <option value="contract">Contract</option>
            <option value="freelance">Freelance</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Salary Range Filter with improved dropdown */}
      <div className="mb-5">
        <label
          htmlFor="salaryRange"
          className="block font-medium text-sm text-gray-700 dark:text-gray-300 mb-2"
        >
          Salary Range
        </label>
        <div className="relative">
          <select
            id="salaryRange"
            value={salaryRange}
            onChange={handleSalaryRangeChange}
            className="w-full pl-4 pr-8 py-2 border border-gray-300 rounded-md text-gray-700 bg-white dark:bg-zinc-800 dark:text-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm text-sm appearance-none transition-colors"
          >
            <option value="all">All Salary Ranges</option>
            <option value="under50k">Under $50K</option>
            <option value="50k_100k">$50K - $100K</option>
            <option value="100k_150k">$100K - $150K</option>
            <option value="over150k">Over $150K</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Experience Level Filter - Added new filter */}
      <div className="mb-5">
        <label
          htmlFor="experienceLevel"
          className="block font-medium text-sm text-gray-700 dark:text-gray-300 mb-2"
        >
          Experience Level
        </label>
        <div className="relative">
          <select
            id="experienceLevel"
            value={experienceLevel || "all"}
            onChange={(e) => setExperienceLevel(e.target.value)}
            className="w-full pl-4 pr-8 py-2 border border-gray-300 rounded-md text-gray-700 bg-white dark:bg-zinc-800 dark:text-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm text-sm appearance-none transition-colors"
          >
            <option value="all">All Experience Levels</option>
            <option value="entry">Entry Level</option>
            <option value="mid">Mid Level</option>
            <option value="senior">Senior Level</option>
            <option value="executive">Executive</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Action Buttons with improved layout */}
      <div className="flex flex-col sm:flex-row gap-3 mt-6">
        <button
          onClick={resetFilters}
          className="flex-1 px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-gray-300 rounded-md font-medium transition-colors flex items-center justify-center"
        >
          <RefreshCw size={14} className="mr-1.5" />
          Reset Filters
        </button>
        <button
          onClick={applyFilters}
          className="flex-1 px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors flex items-center justify-center"
        >
          <CheckCircle size={14} className="mr-1.5" />
          Apply Filters
        </button>
      </div>
    </div>
  </div>
</div>
        </main>
      </div>
    </div>
  );
};

export default SidebarLayout;
