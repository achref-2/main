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
  ChevronLeft,
  ChevronRight,
  Search,
  FileText,
  Download,
  Loader2,
  Calendar,
  ArrowLeft,
  Share2,
  FlaskConical, Wrench
} from "lucide-react";
import { Menu as HeadlessMenu } from "@headlessui/react";
import { BellIcon } from "@heroicons/react/24/outline";
import { MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Link } from 'react-router-dom';
import { useDarkMode } from '../../DarkModeProvider';
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
    { name: "cv testing", href: "/Testing", icon: FlaskConical, current: false },
  ];

  const [selectedJob, setSelectedJob] = useState(null);
  const [filters, setFilters] = useState({
    fullTime: false,
    partTime: false,
    salary50_100: false,
    salary100_150: false,
  });

  const [allJobs, setAllJobs] = useState([]); // State for jobs
  const [loading, setLoading] = useState(true); // State for loading
  const [error, setError] = useState(""); // State for error

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

  // Function to safely render requirements
  const renderRequirements = (requirements) => {
    // Check if requirements exists and is an array
    if (Array.isArray(requirements)) {
      return requirements.map((req, index) => (
        <li key={index} className="ml-4">
          {req}
        </li>
      ));
    } else if (typeof requirements === 'string') {
      // If it's a string, split by newlines or render as is
      return requirements.split('\n').map((line, index) => (
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
    return (
      <div className="max-w-4xl mx-auto p-6">
        <button
          onClick={() => setSelectedJob(null)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          All Jobs
        </button>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{selectedJob.role}</h1>
            <div className="flex items-center gap-4">
              <span className="text-gray-600">{selectedJob.company}</span>
              <span className="text-gray-600">•</span>
              <span className="text-gray-600">{selectedJob.location}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <a href="/cv" className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-md">
              Apply Now
            </a>
            <button className="border border-gray-300 p-2 rounded-md hover:bg-gray-50">
              <Share2 className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">The Role</h2>
              <p className="text-gray-600 whitespace-pre-line mb-6">
                {selectedJob.description}
              </p>

              <h2 className="text-xl font-semibold mb-4">About You</h2>
              <p className="text-gray-600 whitespace-pre-line mb-6">
                {selectedJob.aboutYou}
              </p>

              <h2 className="text-xl font-semibold mb-4">
                Things You Might Do
              </h2>
              <ul className="list-disc list-inside text-gray-600 space-y-3">
                {renderRequirements(selectedJob.requirements)}
              </ul>
            </div>
          </div>

          <div className="col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gray-100 rounded-lg">
                  {selectedJob.logo}
                </div>
                <div>
                  <h3 className="font-semibold">{selectedJob.company}</h3>
                  <p className="text-sm text-gray-500">
                    Posted {selectedJob.postedDate}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm text-gray-500">Location</h4>
                  <p className="font-medium">{selectedJob.location}</p>
                </div>
                <div>
                  <h4 className="text-sm text-gray-500">Salary Range</h4>
                  <p className="font-medium">{selectedJob.salary}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`min-h-screen ${isDarkMode ? "dark" : ""} transition-all duration-300 ease-in-out`}>
      <div className="flex h-screen bg-white dark:bg-black">
       
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

        <main className="flex-1 overflow-auto bg-gray-50  dark:bg-black transition-all duration-300 ease-in-out z-30">

        
          <header className="bg-white dark:bg-black  border-gray-200 dark:border-gray-900 sticky top-0 transition-all duration-300 ease-in-out z-30 ">
            <div className="flex items-center justify-between px-6 py-4">
              <SearchBar />
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
          <div className="p-6 space-y-6  transition-all duration-300 ease-in-out z-30">
            <div>
              <div >
                <div className="max-w-6xl mx-auto p-0">
                  <div className="mb-8">
                    
                    
                  </div>

                  <div className="flex gap-12  transition-all duration-300 ease-in-out z-30">
                    <div className="w-3/4">
                    <div className="bg-zinc-50 dark:bg-black rounded-lg shadow-sm  transition duration-300 ease-in-out z-30">
                    <div className="p-4 border-b border-gray-300 dark:border-gray-600 ">
                          <h2 className="text-xl font-semibold">Latest jobs</h2>
                        </div>
                        <div className="p-4">
                          <div className="space-y-4 ">
                            {loading ? (
                              <p>Loading jobs...</p>
                            ) : error ? (
                              <p className="text-red-500 ">{error}</p>
                            ) : (
                              filteredJobs.map((job) => (
                                <div
                                  key={job.id}
                                  className="flex items-center p-5 border border-zinc-300 dark:border-zinc-700 dark:bg-zinc-950 rounded-lg hover:shadow-md dark:hover:shadow-zinc-800 dark:shadow-lg transition-shadow cursor-pointer dark:hover:bg-zinc-900"
                                  onClick={() => setSelectedJob(job)}>
                                  <div className="mr-4 p-2 bg-gray-100 rounded-lg">
                                    {job.logo}
                                  </div>
                                  <div className="flex-grow">
                                    <h3 className="font-medium">{job.company}</h3>
                                    <p className="text-lg font-semibold">
                                      {job.role}
                                    </p>
                                    <div className="flex gap-2 text-sm text-gray-500">
                                      <span>{job.location}</span>
                                      <span>•</span>
                                      <span>{job.salary}</span>
                                      <span>•</span>
                                      <span>{job.type}</span>
                                    </div>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="w-1/4 transition-all duration-300 ease-in-out mt-32">
                      <div className="dark:bg-zinc-950 bg-white transition-all duration-300 ease-in-out z-30 rounded-lg shadow-sm border border-gray-100 dark:border-gray-600 ">
                        <div className="p-4">
                          <div className="space-y-6  transition-all duration-300 ease-in-out z-30">
                            <div className="transition-all duration-300 ease-in-out z-30">
                              <h3 className="font-medium mb-2">Job Type</h3>
                              <div className="space-y-2 ">
                                <label className="flex items-center">
                                  <input
                                    type="checkbox"
                                    checked={filters.fullTime}
                                    onChange={() =>
                                      handleFilterChange("fullTime")
                                    }
                                    className="form-checkbox h-4 w-4 text-purple-600"
                                  />
                                  <span className="ml-2">Full Time</span>
                                </label>
                                <label className="flex items-center">
                                  <input
                                    type="checkbox"
                                    checked={filters.partTime}
                                    onChange={() =>
                                      handleFilterChange("partTime")
                                    }
                                    className="form-checkbox h-4 w-4 text-purple-600"
                                  />
                                  <span className="ml-2">Part Time</span>
                                </label>
                              </div>
                            </div>

                            <div>
                              <h3 className="font-medium mb-2">Salary Range</h3>
                              <div className="space-y-2">
                                <label className="flex items-center">
                                  <input
                                    type="checkbox"
                                    checked={filters.salary50_100}
                                    onChange={() =>
                                      handleFilterChange("salary50_100")
                                    }
                                    className="form-checkbox h-4 w-4 text-purple-600"
                                  />
                                  <span className="ml-2">$50k - $100k</span>
                                </label>
                                <label className="flex items-center">
                                  <input
                                    type="checkbox"
                                    checked={filters.salary100_150}
                                    onChange={() =>
                                      handleFilterChange("salary100_150")
                                    }
                                    className="form-checkbox h-4 w-4 text-purple-600"
                                  />
                                  <span className="ml-2">100dt - 150dt</span>
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
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