import React, { useState, useEffect } from "react";
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
  Users
} from "lucide-react";
import { Menu as HeadlessMenu } from "@headlessui/react";
import { BellIcon } from "@heroicons/react/24/outline";
import { MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ArrowLeft, Share2 } from "lucide-react";
import { useDarkMode } from "../../DarkModeProvider";
import { Link } from "react-router-dom";
import {JobCategoryIcon} from "../../Components/Joblogo";
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

const SidebarLayout = () => {
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
      name: "History",
      href: "/dashboard/recuiter/history",
      icon: History,
      current: false,
    },
    {
      name: "Job List",
      href: "/dashboard/recuiter/joblist",
      icon: Menu,
      current: true,
    },
    { name: "Billing", href: "/Pricing", icon: PlusSquare, current: false },
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
      icon: Settings,
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
  if (selectedJob) {
    const handleDeleteJob = async (jobId) => {
      console.log("Received jobId for deletion:", jobId); // Debug log

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
        setAllJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
      } catch (error) {
        console.error("Error deleting job:", error.message);
      }
    };

    return (
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-6">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => setSelectedJob(null)}
            className="inline-flex items-center mb-6 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to All Jobs
          </button>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
            {/* Header section */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center">
                  <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg mr-4 w-16 h-16 flex items-center justify-center">
                    {selectedJob.logo}
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                      {selectedJob.role}
                    </h1>
                    <div className="flex flex-wrap items-center mt-2">
                      <span className="text-gray-600 dark:text-gray-300">
                        {selectedJob.company}
                      </span>
                      <span className="text-gray-400 mx-2">•</span>
                      <span className="text-gray-600 dark:text-gray-300 flex items-center">
                        <MapPin className="h-4 w-4 mr-1 text-gray-400 dark:text-gray-500" />
                        {selectedJob.location}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Recruiter actions */}
                <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
                  <button
                    onClick={() => handleEditJob(selectedJob._id)}
                    className="flex items-center bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-800/50 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-md transition-colors"
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
                    className="flex items-center bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:hover:bg-red-800/50 text-red-600 dark:text-red-400 px-4 py-2 rounded-md transition-colors"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </button>

                  <button
                    className="border border-gray-200 dark:border-gray-700 p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
                    aria-label="Share job"
                  >
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mt-4">
                <span className="inline-flex items-center px-3 py-1 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium">
                  <DollarSign className="h-3.5 w-3.5 mr-1" />
                  {selectedJob.salary}
                </span>
                <span className="inline-flex items-center px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-full text-sm font-medium">
                  <Clock className="h-3.5 w-3.5 mr-1" />
                  Posted {selectedJob.postedDate}
                </span>
                {selectedJob.type && (
                  <span className="inline-flex items-center px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                    <Briefcase className="h-3.5 w-3.5 mr-1" />
                    {selectedJob.type}
                  </span>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 p-6">
              <div className="md:col-span-2 space-y-8">
                <section>
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-purple-500" />
                    About The Role
                  </h2>
                  <div className="bg-gray-50 dark:bg-gray-800/70 rounded-lg p-5 border border-gray-100 dark:border-gray-700">
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
                      {selectedJob.description}
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                    <CheckSquare className="h-5 w-5 mr-2 text-purple-500" />
                    Things You Might Do
                  </h2>
                  <div className="bg-gray-50 dark:bg-gray-800/70 rounded-lg p-5 border border-gray-100 dark:border-gray-700">
                    <ul className="space-y-3">
                      {renderRequirements(selectedJob.requirements)}
                    </ul>
                  </div>
                </section>
              </div>

              <div className="md:col-span-1">
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700 p-5 sticky top-6">
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-4 text-lg flex items-center">
                    <Info className="h-5 w-5 mr-2 text-purple-500" />
                    Job Details
                  </h3>

                  <div className="space-y-5">
                    <div className="p-3 bg-white dark:bg-gray-800 rounded-md border border-gray-100 dark:border-gray-700">
                      <h4 className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        Location
                      </h4>
                      <div className="flex items-center">
                        <MapPin className="h-5 w-5 text-purple-500 mr-2" />
                        <p className="font-medium text-gray-700 dark:text-gray-200">
                          {selectedJob.location}
                        </p>
                      </div>
                    </div>

                    <div className="p-3 bg-white dark:bg-gray-800 rounded-md border border-gray-100 dark:border-gray-700">
                      <h4 className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        Salary Range
                      </h4>
                      <div className="flex items-center">
                        <DollarSign className="h-5 w-5 text-purple-500 mr-2" />
                        <p className="font-medium text-gray-700 dark:text-gray-200">
                          {selectedJob.salary}
                        </p>
                      </div>
                    </div>

                    {selectedJob.department && (
                      <div className="p-3 bg-white dark:bg-gray-800 rounded-md border border-gray-100 dark:border-gray-700">
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

                    <div className="p-3 bg-white dark:bg-gray-800 rounded-md border border-gray-100 dark:border-gray-700">
                      <h4 className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        Listing Status
                      </h4>
                      <button
                        onClick={() => handleJobStatus(selectedJob._id)}
                        className={`w-full py-2 px-4 rounded-md ${
                          selectedJob.isActive
                            ? "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/60"
                            : "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-200 dark:hover:bg-yellow-900/60"
                        } text-center font-medium flex items-center justify-center transition-colors`}
                      >
                        {selectedJob.isActive ? (
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

                    <div className="pt-2">
                      <button className="mt-2 w-full bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600 text-white py-3 px-6 rounded-lg font-medium flex items-center justify-center transition-colors md:hidden">
                        <Send className="h-4 w-4 mr-2" />
                        Apply for this position
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
                    href: "/dashboard/recuiter/history",
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
                  <span className="ml-1 font-semibold"> jobs</span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Active:</span> 
                  <span className="ml-1 font-semibold"> jobs</span>
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
                             
                             {job.category|| "Company"}
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
                              
                              <button className="w-full px-2 py-1 bg-zinc-400 group-hover:bg-zinc-600 text-zinc-400 group-hover:text-white dark:bg-zinc-700   rounded-lg font-medium transition-colors flex items-center justify-center group-hover:shadow-sm">
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

export default SidebarLayout;