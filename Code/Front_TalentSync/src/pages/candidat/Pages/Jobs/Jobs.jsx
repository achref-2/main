import React, { useState, useRef, useEffect, useContext } from "react";
import {
  Menu,
  History,
  PlusSquare,
  Settings,
  CreditCard,
  Moon,
  Sun,
  ChevronUp,
  Filter,
  ChevronLeft,
  ChevronRight,
  Search,
  Wrench,
  FlaskConical,
  Share2,
  Share,
  X,
  MapPin,
  CheckCircle,
  RefreshCw,
  ChevronDown,
  DollarSign,
  Briefcase,
  BookmarkPlus,
  ArrowRight,
  LogOut,
  FileClock,
  Users,
  Mail,
  Calendar,
} from "lucide-react";
import { Menu as HeadlessMenu } from "@headlessui/react";
import { BellIcon } from "@heroicons/react/24/outline";
import { MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Link } from "react-router-dom";
import { useDarkMode } from "../../../../components/DarkModeProvider";
import { JobCategoryIcon } from "../../../../components/Joblogo";
import { UserContext } from "../../../../components/UserContext";

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
const UserMessage = () => {
  const { isDarkMode } = useDarkMode();

  const notifications = [
    {
      message: "Your application has been reviewed.",
      time: "2 hours ago",
      icon: Users,
    },
    {
      message: "You have a new message from the recruiter.",
      time: "1 day ago",
      icon: Mail,
    },
    {
      message: "Your interview is scheduled for tomorrow.",
      time: "3 days ago",
      icon: Calendar,
    },
  ];
  return (
    <HeadlessMenu as="div" className="relative">
      {({ open }) => (
        <>
          <MenuButton className="flex items-center focus:outline-none">
            <div className="relative">
              <button
                type="button"
                className="relative p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <span className="sr-only">View notifications</span>
                <BellIcon className="h-5 w-5" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-900" />
              </button>
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
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Messages
                  </p>
                </div>
              </div>
            </div>

            <div className="py-1">
              {notifications.map(({ message, time, icon: Icon }, index) => (
                <div
                  key={index}
                  className="group flex items-center justify-between px-4 py-2 text-sm bg-gray-100 dark:bg-zinc-800 rounded-lg mb-2"
                >
                  <div className="flex items-center">
                    <div className="mr-3 p-1 rounded-md bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {message}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {time}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </MenuItems>
        </>
      )}
    </HeadlessMenu>
  );
};
const UserMenu = ({ profilePic, firstName, lastName, email }) => {
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
      href: "/dashboard/PastApplications",
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
                src={profilePic} // Use the profilePic prop
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
                    src={profilePic} // Use the profilePic prop
                    alt="User avatar"
                  />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {`${firstName} ${lastName}`}{" "}
                    {/* Use the firstName and lastName props */}
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
// Improved Card component with proper score display

const Jobs = () => {
  const { profilePic, firstName, lastName, email } = useContext(UserContext);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { isDarkMode } = useDarkMode();
  const [jobType, setJobType] = useState("all");
  const [salaryRange, setSalaryRange] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("all");
  const [setActiveTab] = useState("all");
  const [savedJobs, setSavedJobs] = useState([]);
  const [pinnedJobs, setPinnedJobs] = useState([]);

  const navigation_menu = [
    { name: "Dashboard", href: "/dashboard", icon: Menu, current: false },
    {
      name: "Past Applications",
      href: "/dashboard/PastApplications",
      icon: FileClock,
      current: false,
    },
    { name: "Jobs", href: "/Jobs", icon: Briefcase, current: true },
    { name: "Billing", href: "/Pricing", icon: CreditCard, current: false },
  ];
  const navigation_option = [
    { name: "Settings", href: "/Settings", icon: Settings, current: false },
    { name: "Support", href: "/cv", icon: Wrench, current: false },
  ];
  const [showFilters, setShowFilters] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortOption, setSortOption] = useState("newest"); // State for sorting

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
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobs, setJobs] = useState([]); // Your original jobs from API/source
  const [isLoading, setIsLoading] = useState(true);
  const [allJobs, setAllJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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
  const [activeFilter, setActiveFilter] = useState("all");

  // Fetch jobs from the backend
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/jobs");
        if (!response.ok) {
          throw new Error("Failed to fetch jobs");
        }
        const data = await response.json();
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
  const handleSortChange = (event) => {
    setSortOption(event.target.value); // Ensure this updates the state
  };

  const [filteredJobs, setFilteredJobs] = useState([]);
  useEffect(() => {
    let sortedJobs = [...allJobs];

    if (sortOption === "newest") {
      sortedJobs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortOption === "oldest") {
      sortedJobs.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortOption === "most-applications") {
      sortedJobs.sort((a, b) => b.applicationCount - a.applicationCount);
    } else if (sortOption === "least-applications") {
      sortedJobs.sort((a, b) => a.applicationCount - b.applicationCount);
    }

    setFilteredJobs(sortedJobs);
  }, [sortOption, allJobs]);
  const handleFilterChange = (filterName) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: !prev[filterName],
    }));
  };

  // Update the `getFilteredJobs` function to include all filters, sorting, and search logic
  const getFilteredJobs = () => {
    let result = [...allJobs];

    // Apply search query filter
    if (searchQuery) {
      result = result.filter(
        (job) =>
          (job.title &&
            job.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (job.skills &&
            job.skills.some((skill) =>
              skill.toLowerCase().includes(searchQuery.toLowerCase())
            )) ||
          (job.location &&
            job.location.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply job type filter
    if (filters.fullTime || filters.partTime || filters.contract) {
      result = result.filter((job) => {
        if (filters.fullTime && job.type === "Full Time") return true;
        if (filters.partTime && job.type === "Part Time") return true;
        if (filters.contract && job.type === "Contract") return true;
        return false;
      });
    }

    // Apply salary range filter
    if (
      filters.salary50_100 ||
      filters.salary100_150 ||
      filters.salary150Plus
    ) {
      result = result.filter((job) => {
        const salaryString = job.salary
          ? job.salary.replace(/[^0-9-]/g, "")
          : "0";
        const [minSalary] = salaryString.split("-").map(Number);

        if (filters.salary50_100 && minSalary >= 50 && minSalary <= 100)
          return true;
        if (filters.salary100_150 && minSalary >= 100 && minSalary <= 150)
          return true;
        if (filters.salary150Plus && minSalary > 150) return true;

        return false;
      });
    }

    // Apply location filter
    if (filters.remote || filters.onsite || filters.hybrid) {
      result = result.filter((job) => {
        if (filters.remote && job.location === "Remote") return true;
        if (filters.onsite && job.location === "Onsite") return true;
        if (filters.hybrid && job.location === "Hybrid") return true;
        return false;
      });
    }

    // Apply experience level filter
    if (filters.entry || filters.mid || filters.senior || filters.executive) {
      result = result.filter((job) => {
        if (filters.entry && job.experienceLevel === "Entry Level") return true;
        if (filters.mid && job.experienceLevel === "Mid Level") return true;
        if (filters.senior && job.experienceLevel === "Senior Level")
          return true;
        if (filters.executive && job.experienceLevel === "Executive Level")
          return true;
        return false;
      });
    }

    // Apply active filter (all, suggested, pinned)
    if (activeFilter === "suggested") {
      result = result.filter((job) => job.suggested === true);
    } else if (activeFilter === "pinned") {
      result = getPinnedJobs();
    }

    // Apply sorting
    if (sortOption === "newest") {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortOption === "oldest") {
      result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortOption === "most-applications") {
      result.sort((a, b) => b.applicationCount - a.applicationCount);
    } else if (sortOption === "least-applications") {
      result.sort((a, b) => a.applicationCount - b.applicationCount);
    }

    return result;
  };

  {
  }

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

  const [pinnedJobIds, setPinnedJobIds] = useState([]); // Only store IDs of pinned jobs

  const getPinnedJobs = () => {
    const pinnedJobs = allJobs.filter((job) => pinnedJobIds.includes(job._id));
    return pinnedJobs;
  };
  const handlePinJob = async (jobToPin) => {
    if (!jobToPin || !jobToPin._id) {
      console.error("Cannot pin job: Invalid job or missing _id", jobToPin);
      return;
    }

    try {
      const isCurrentlyPinned = pinnedJobIds.includes(jobToPin._id);

      if (isCurrentlyPinned) {
        // Unpin the job
        const response = await fetch(
          `http://localhost:5000/api/candidates/pinned-jobs/${jobToPin._id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to unpin job");
        }

        setPinnedJobIds((prevPinnedIds) =>
          prevPinnedIds.filter((id) => id !== jobToPin._id)
        );
      } else {
        // Pin the job
        const response = await fetch(
          "http://localhost:5000/api/candidates/pinned-jobs",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ jobId: jobToPin._id }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to pin job");
        }

        setPinnedJobIds((prevPinnedIds) => [...prevPinnedIds, jobToPin._id]);
      }
    } catch (error) {
      console.error("Error pinning/unpinning job:", error.message);
    }
  };
  useEffect(() => {
    const fetchPinnedJobs = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/candidates/pinned-jobs",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch pinned jobs");
        }

        const data = await response.json();
        setPinnedJobIds(data.map((job) => job._id)); // Assuming the backend returns an array of pinned jobs
      } catch (error) {
        console.error("Error fetching pinned jobs:", error.message);
      }
    };

    fetchPinnedJobs();
  }, []);
  const isJobPinned = (jobId) => {
    return pinnedJobIds.includes(jobId);
  };
  useEffect(() => {
    const filtered = getFilteredJobs();
    setFilteredJobs(filtered);
  }, [searchQuery, filters, activeFilter, sortOption, allJobs, pinnedJobIds]); // Add pinnedJobIds as a dependency
  // Update the JSX for Quick Filters, Sort, and Advanced Filters

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

        <main className="flex-1 overflow-auto bg-gray-50  dark:bg-black transition-all duration-300 ease-in-out z-30">
          {/* Streamlined Header */}
          <header className="bg-white dark:bg-black  border-gray-200 dark:border-gray-800 sticky top-0 transition-all duration-300 ease-in-out z-30">
            <div className="flex items-center justify-between px-6 py-4">
              <SearchBar
                navigationMenu={navigation_menu}
                navigationOption={navigation_option}
              />
              <div className="flex items-center gap-4">
                <UserMessage />

                <UserMenu
                  profilePic={profilePic || "../../assets/images/avatar.jpg"}
                  firstName={firstName || "First Name"}
                  lastName={lastName || "Last Name"}
                  email={email || "example@example.com"}
                />
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <div className="px-4 py-4 max-w-7xl mx-auto">
            <div className="flex flex-col space-y-4">
              {/* Page Title & Quick Stats */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Find Your Next Opportunity
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Access thousands of job opportunities tailored to your
                    skills and preferences.
                  </p>
                </div>
                <div className="hidden md:flex items-center gap-4 text-sm mt-2 sm:mt-0">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 dark:text-gray-400">
                      Total:
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {filteredJobs.length} jobs
                    </span>
                  </div>
                  <div className="w-px h-4 bg-gray-300 dark:bg-gray-700"></div>
                 
                </div>
              </div>

              {/* Search & Filter Bar */}
              <div className="flex flex-col space-y-3">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-grow">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search jobs by title, skills or location..."
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                      value={searchQuery} // Bind the input value to the state
                      onChange={(e) => setSearchQuery(e.target.value)} // Update the state on input change
                    />
                  </div>
                  <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="sm:hidden inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <Filter size={16} />
                    <span>Filters</span>
                    {isFilterOpen ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    )}
                  </button>
                </div>

                {/* Quick Filter Chips - Horizontal Scrollable */}
                <div className="flex items-center gap-2 overflow-x-auto py-1 pb-2 scrollbar-hide">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">
                    Quick filters:
                  </span>
                  <div className="inline-flex p-1 bg-gray-50 dark:bg-zinc-900 rounded-lg shadow-sm">
                    <button
                      className={`relative px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500 ${
                        activeFilter === "all"
                          ? "text-zinc-700 dark:text-zinc-200 shadow-sm"
                          : " text-zinc-200 hover:text-zinc-900 dark:hover:text-white"
                      }`}
                      onClick={() => setActiveFilter("all")}
                      aria-current={activeFilter === "all" ? "page" : undefined}
                    >
                      {activeFilter === "all" && (
                        <span
                          className="absolute  bg-zinc-100  inset-0 group-hover:bg-zinc-300 dark:group-hover:bg-zinc-700 hover:bg-zinc-200 active:bg-zinc-300 text-zinc-700 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 shadow-sm border border-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:active:bg-zinc-600 dark:text-zinc-200 dark:border-zinc-700 group"

                          aria-hidden="true"
                        ></span>
                      )}
                      <span className="relative">All Jobs</span>
                    </button>

                    <button
                      className={`relative px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500 ${
                        activeFilter === "suggested"
                          ? "text-white shadow-sm"
                          : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                      }`}
                      onClick={() => setActiveFilter("suggested")}
                      aria-current={
                        activeFilter === "suggested" ? "page" : undefined
                      }
                    >
                      {activeFilter === "suggested" && (
                        <span
                          className="absolute inset-0 bg-zinc-600 dark:bg-zinc-700 rounded-md"
                          aria-hidden="true"
                        ></span>
                      )}
                      <span className="relative">Suggested For You</span>
                    </button>

                    <button
                      className={`relative px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500 ${
                        activeFilter === "pinned"
                          ? "text-white shadow-sm"
                          : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                      }`}
                      onClick={() => setActiveFilter("pinned")}
                      aria-current={
                        activeFilter === "pinned" ? "page" : undefined
                      }
                    >
                      {activeFilter === "pinned" && (
                        <span
                          className="absolute inset-0 bg-zinc-600 dark:bg-zinc-700 rounded-md"
                          aria-hidden="true"
                        ></span>
                      )}
                      <span className="relative">Pinned</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Main content layout with sidebar */}
              <div className="flex flex-col-reverse lg:flex-row gap-4 mt-2">
                {/* Filter sidebar - Desktop */}

                {/* Job listings section */}
                <div className="flex-1">
                  <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                      <div className="flex items-center">
                        <h2 className="font-medium text-gray-900 dark:text-white">
                          Job Listings
                        </h2>
                        <div className="ml-2 px-2 py-0.5 bg-zinc-50 dark:bg-zinc-900 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300">
                          {filteredJobs.length}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Sort:
                        </span>
                        <select
                          className="bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-gray-700 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 text-gray-700 dark:text-gray-300"
                          value={sortOption}
                          onChange={handleSortChange}
                        >
                          <option value="newest">Newest</option>
                          <option value="oldest">Oldest</option>
                          <option value="most-applications">
                            Most Applications
                          </option>
                          <option value="least-applications">
                            Least Applications
                          </option>
                        </select>
                      </div>
                    </div>

                    <div className="p-4">
                      {loading ? (
                        <div className="space-y-4">
                          {[1, 2, 3].map((_, index) => (
                            <div
                              key={index}
                              className="animate-pulse border dark:border-zinc-700 rounded-lg p-4 bg-white dark:bg-zinc-800"
                            >
                              <div className="flex items-center gap-4">
                                <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                                <div className="space-y-2 flex-1">
                                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                                  <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                                </div>
                              </div>
                              <div className="mt-4 flex flex-wrap gap-2">
                                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                              </div>
                              <div className="mt-4">
                                <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : error ? (
                        <div className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-center">
                          <div className="mb-3">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-8 w-8 mx-auto text-red-500 dark:text-red-400"
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
                          <button className="mt-2 px-4 py-2 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-600 dark:text-red-300 rounded-lg text-sm font-medium transition-colors">
                            Try Again
                          </button>
                        </div>
                      ) : filteredJobs.length === 0 ? (
                        <div className="text-center py-10 bg-white dark:bg-zinc-900 rounded-lg">
                          <div className="mb-3">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-10 w-10 mx-auto text-gray-400 dark:text-gray-500"
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
                          <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium transition-colors">
                            Reset Filters
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {filteredJobs.map((job) => (
                            <div
                              key={job.id}
                              className="group relative border dark:border-zinc-700 rounded-lg overflow-hidden transition-all duration-200 ease-in-out hover:shadow-md hover:-translate-y-0.5 bg-white dark:bg-zinc-900 cursor-pointer"
                              onClick={() => setSelectedJob(job)}
                            >
                              {/* New badge */}
                              {job.isNew && (
                                <span className="absolute top-2 right-2 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300 text-xs font-medium px-2 py-0.5 rounded-full z-10">
                                  New
                                </span>
                              )}

                              <div className="p-4">
                                <div className="flex items-start gap-3">
                                  {/* Company logo */}
                                  <div className="w-10 h-10 flex-shrink-0  rounded-lg  overflow-hidden">
                                    {job.category === "Engineering" ? (
                                      <JobCategoryIcon
                                        category="Engineering"
                                        size="sm"
                                      />
                                    ) : job.logo ? (
                                      <div className="w-full h-full flex items-center justify-center">
                                        {job.logo}
                                      </div>
                                    ) : (
                                      <JobCategoryIcon
                                        category={job.category || "Default"}
                                        size="sm"
                                      />
                                    )}
                                  </div>

                                  {/* Job info */}
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1.5 mb-0.5">
                                      <span className="text-xs text-gray-500 dark:text-gray-400">
                                        {job.company}
                                      </span>
                                      {job.isActive && (
                                        <span className="inline-block w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                      )}
                                    </div>
                                    <h3 className="text-base font-medium text-gray-900 dark:text-white truncate">
                                      {job.title || "Position"}
                                    </h3>

                                    {/* Compact tag row */}
                                    <div className="flex flex-wrap gap-2 mt-2">
                                      {job.location && (
                                        <span className="inline-flex items-center text-xs text-gray-600 dark:text-gray-400">
                                          <MapPin size={12} className="mr-1" />
                                          {job.location}
                                        </span>
                                      )}
                                      {job.salary && (
                                        <span className="inline-flex items-center text-xs text-gray-600 dark:text-gray-400">
                                          <DollarSign
                                            size={12}
                                            className="mr-1"
                                          />
                                          {job.salary}
                                        </span>
                                      )}
                                      {job.jobType && (
                                        <span className="inline-flex items-center text-xs text-gray-600 dark:text-gray-400">
                                          <Briefcase
                                            size={12}
                                            className="mr-1"
                                          />
                                          {job.jobType}
                                        </span>
                                      )}
                                    </div>

                                    {/* Skills tags - only show first 3 */}
                                    {job.skills && job.skills.length > 0 && (
                                      <div className="flex flex-wrap gap-1.5 mt-2">
                                        {job.skills
                                          .slice(0, 3)
                                          .map((skill, index) => (
                                            <span
                                              key={index}
                                              className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs px-2 py-0.5 rounded"
                                            >
                                              {skill}
                                            </span>
                                          ))}
                                        {job.skills.length > 3 && (
                                          <span className="text-xs text-gray-500 dark:text-gray-400">
                                            +{job.skills.length - 3} more
                                          </span>
                                        )}
                                      </div>
                                    )}
                                  </div>

                                  {/* Right section with match score & deadline */}
                                  <div className="flex flex-col items-end gap-2">
                                    {/* Match Score Indicator - New Feature */}
                                    <div className="flex items-center gap-1.5">
                                      <div className="h-2 w-16 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                        <div
                                          className="h-full bg-green-500 rounded-full"
                                          style={{
                                            width: `${job.matchScore || 0}%`,
                                          }}
                                        ></div>
                                      </div>
                                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                        {job.matchScore || 0}%
                                      </span>
                                    </div>

                                    {/* Deadline */}
                                    {job.deadline && (
                                      <span className="text-xs text-gray-500 dark:text-gray-400">
                                        Closes:{" "}
                                        {new Date(
                                          job.deadline
                                        ).toLocaleDateString()}
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {/* Action buttons */}
                                <div className="mt-4 flex gap-2 justify-end">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handlePinJob(job);
                                    }}
                                    className={`p-2.5 rounded-full transition-colors flex items-center justify-center
          ${
            isJobPinned(job._id)
              ? " text-blue-600 dark:bg-zinc-900 dark:text-blue-400"
              : " text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-300 hover:text-zinc-950 dark:hover:bg-zinc-900"
          }`}
                                    aria-label={
                                      isJobPinned(job._id)
                                        ? "Unsave job"
                                        : "Save job"
                                    }
                                    title={
                                      isJobPinned(job._id)
                                        ? "Unsave job"
                                        : "Save job"
                                    }
                                  >
                                    <BookmarkPlus size={18} />
                                  </button>

                                  <button
                                    className="px-4 py-2 bg-zinc-100 group-hover:bg-zinc-300 dark:group-hover:bg-zinc-700 hover:bg-zinc-200 active:bg-zinc-300 text-zinc-700 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 shadow-sm border border-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:active:bg-zinc-600 dark:text-zinc-200 dark:border-zinc-700 group"
                                    aria-label="View Details"
                                  >
                                    <span>View Details</span>
                                    <ArrowRight
                                      size={14}
                                      className="transform group-hover:translate-x-1 transition-transform"
                                    />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Pagination - New Feature */}
                      {filteredJobs.length > 0 && (
                        <div className="mt-6 flex justify-center">
                          <div className="flex items-center gap-1">
                            <button className="p-1.5 rounded border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                              <ChevronLeft size={16} />
                            </button>
                            <button className="w-8 h-8 flex items-center justify-center rounded bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 font-medium">
                              1
                            </button>
                            <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors">
                              2
                            </button>
                            <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors">
                              3
                            </button>
                            <span className="text-gray-500 dark:text-gray-400 px-1">
                              ...
                            </span>
                            <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors">
                              12
                            </button>
                            <button className="p-1.5 rounded border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                              <ChevronRight size={16} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Filter section - Right column */}
                  </div>
                </div>
                <div className="hidden lg:block w-72 flex-shrink-0 sticky top-20 self-start h-full">
                  <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                      <h2 className="font-medium text-gray-900 dark:text-white flex items-center">
                        <Filter size={16} className="mr-2" />
                        Advanced Filters
                      </h2>
                    </div>

                    <div className="p-4 space-y-6">
                      {/* Job Type Filter */}
                      <div>
                        <h3 className="font-medium mb-3 text-gray-700 dark:text-gray-300 text-sm">
                          Job Type
                        </h3>
                        <div className="space-y-2">
                          {["fullTime", "partTime", "contract"].map((type) => (
                            <label
                              key={type}
                              className="flex items-center cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={filters[type]}
                                onChange={() => handleFilterChange(type)}
                                className="rounded border-gray-300 text-purple-600 shadow-sm focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50 h-4 w-4"
                              />
                              <span className="ml-2 text-gray-600 dark:text-gray-400 text-sm">
                                {type === "fullTime"
                                  ? "Full Time"
                                  : type === "partTime"
                                  ? "Part Time"
                                  : "Contract"}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Salary Range Filter */}
                      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                        <h3 className="font-medium mb-3 text-gray-700 dark:text-gray-300 text-sm">
                          Salary Range
                        </h3>
                        <div className="space-y-2">
                          {[
                            { id: "salary50_100", label: "$50k - $100k" },
                            { id: "salary100_150", label: "$100k - $150k" },
                            { id: "salary150Plus", label: "$150k+" },
                          ].map((range) => (
                            <label
                              key={range.id}
                              className="flex items-center cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={filters[range.id]}
                                onChange={() => handleFilterChange(range.id)}
                                className="rounded border-gray-300 text-purple-600 shadow-sm focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50 h-4 w-4"
                              />
                              <span className="ml-2 text-gray-600 dark:text-gray-400 text-sm">
                                {range.label}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Location Filter */}
                      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                        <h3 className="font-medium mb-3 text-gray-700 dark:text-gray-300 text-sm">
                          Location
                        </h3>
                        <div className="space-y-2">
                          {["remote", "onsite", "hybrid"].map((loc) => (
                            <label
                              key={loc}
                              className="flex items-center cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={filters[loc]}
                                onChange={() => handleFilterChange(loc)}
                                className="rounded border-gray-300 text-purple-600 shadow-sm focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50 h-4 w-4"
                              />
                              <span className="ml-2 text-gray-600 dark:text-gray-400 text-sm">
                                {loc.charAt(0).toUpperCase() + loc.slice(1)}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Experience Level Filter - New */}
                      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                        <h3 className="font-medium mb-3 text-gray-700 dark:text-gray-300 text-sm">
                          Experience Level
                        </h3>
                        <div className="space-y-2">
                          {["entry", "mid", "senior", "executive"].map(
                            (exp) => (
                              <label
                                key={exp}
                                className="flex items-center cursor-pointer"
                              >
                                <input
                                  type="checkbox"
                                  checked={filters[exp] || false}
                                  onChange={() => handleFilterChange(exp)}
                                  className="rounded border-gray-300 text-purple-600 shadow-sm focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50 h-4 w-4"
                                />
                                <span className="ml-2 text-gray-600 dark:text-gray-400 text-sm">
                                  {exp === "entry"
                                    ? "Entry Level"
                                    : exp === "mid"
                                    ? "Mid Level"
                                    : exp === "senior"
                                    ? "Senior Level"
                                    : "Executive Level"}
                                </span>
                              </label>
                            )
                          )}
                        </div>
                      </div>

                      {/* Filter Actions */}
                      <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between">
                        <button
                          onClick={clearFilters}
                          className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-sm"
                        >
                          Clear all
                        </button>
                        <button                                     className="px-4 py-2 bg-zinc-100 group-hover:bg-zinc-300 dark:group-hover:bg-zinc-700 hover:bg-zinc-200 active:bg-zinc-300 text-zinc-700 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 shadow-sm border border-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:active:bg-zinc-600 dark:text-zinc-200 dark:border-zinc-700 group"
                        >
                          Apply
                        </button>
                      </div>
                    </div>
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
                          <div className="h-14 w-14 bg-gray-100 dark:bg-gray-800 rounded-lg ">
                            {selectedJob.category === "Engineering" ? (
                              <JobCategoryIcon
                                category="Engineering"
                                size="md"
                              />
                            ) : selectedJob.logo ? (
                              <div className=" bg-gray-100 dark:bg-gray-800  ">
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
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                              {selectedJob.title || "Job Title"}
                            </h1>
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm mt-1">
                              <span className="font-medium">
                                {selectedJob.companyName}
                              </span>
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
                        <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-4 mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                          {selectedJob.salary && (
                            <div className="flex flex-col">
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                Salary
                              </span>
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
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                Experience
                              </span>
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
                                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 00-2 2z"
                                  />
                                </svg>
                                {selectedJob.experienceLevel}
                              </span>
                            </div>
                          )}
                          {selectedJob.location && (
                            <div className="flex flex-col">
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                Location
                              </span>
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
                                {selectedJob.location}
                              </span>
                            </div>
                          )}
                          {selectedJob.deadline && (
                            <div className="flex flex-col">
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                Application Deadline
                              </span>
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
                                {new Date(
                                  selectedJob.deadline
                                ).toLocaleDateString()}
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
                        {selectedJob.skills &&
                          selectedJob.skills.length > 0 && (
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
                              <p className="text-gray-900 dark:text-white font-medium">
                                {selectedJob.educationRequirements}
                              </p>
                            )}

                            {selectedJob && (
                              <div>
                                <p className="text-gray-500 dark:text-gray-400 text-sm">
                                  Applications
                                </p>
                                <p className="text-gray-900 dark:text-white font-medium">
                                  {selectedJob.applicationCount} Applicants
                                </p>
                              </div>
                            )}

                            {selectedJob && (
                              <div>
                                <p className="text-gray-500 dark:text-gray-400 text-sm">
                                  Company
                                </p>
                                <p className="text-gray-900 dark:text-white font-medium">
                                  {selectedJob.companyName}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action buttons fixed at bottom */}
                      <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-zinc-900 sticky bottom-0 flex items-center justify-between">
                        <div className="flex items-center">
                          {selectedJob && (
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              <strong>{selectedJob.applicationCount} </strong>{" "}
                              people have applied
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4">
                          {/* Share Button */}
                          <button
                            className="text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-300 hover:text-zinc-950 dark:hover:bg-zinc-900"
                            aria-label="Share job"
                          >
                            <Share2 size={18} />
                          </button>

                          {/* Save/Pin Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePinJob(selectedJob);
                            }}
                            className={`p-2.5 rounded-full transition-colors flex items-center justify-center
          ${
            isJobPinned(selectedJob._id)
              ? "text-blue-600 dark:bg-zinc-900 dark:text-blue-400"
              : "text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-300 hover:text-zinc-950 dark:hover:bg-zinc-900"
          }`}
                            aria-label={
                              isJobPinned(selectedJob._id)
                                ? "Unsave job"
                                : "Save job"
                            }
                            title={
                              isJobPinned(selectedJob._id)
                                ? "Unsave job"
                                : "Save job"
                            }
                          >
                            <BookmarkPlus size={18} />
                          </button>

                          {/* Apply Button */}
                          <Link
                            to={{
                              pathname: "/Application",
                            }}
                            state={{ job: selectedJob }}
                            className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 active:bg-zinc-300 text-zinc-700 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 shadow-sm border border-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:active:bg-zinc-600 dark:text-zinc-200 dark:border-zinc-700 group"
                            aria-label="Apply for this job"
                          >
                            <span className="text-base">Apply Now</span>
                            <ArrowRight
                              size={20}
                              className="transition-transform duration-300 group-hover:translate-x-1"
                            />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Floating Filter Panel */}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Jobs;
