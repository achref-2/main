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
} from "lucide-react";
import { Menu as HeadlessMenu } from "@headlessui/react";
import { BellIcon } from "@heroicons/react/24/outline";
import { MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import {
  Layout,
  Server,
  Globe,
  Terminal,
  ArrowLeft,
  Share2,
} from "lucide-react";
const NavLink = ({ href, icon: Icon, children, isActive }) => (
  <a
    href={href}
    className={`group flex items-center gap-3 px-3 py-2 rounded-lg  transition-all duration-300 ease-in-out z-30
      ${
        isActive
          ? "bg-zinc-200 text-black dark:bg-zinc-900 dark:text-white transition-all duration-300 ease-in-out z-30"
          : "text-gray-500 hover:bg-zinc-200 hover:text-black dark:text-gray-400 dark:hover:bg-zinc-900  dark:hover:text-white "
      }
    `}
    aria-current={isActive ? "page" : undefined}
  >
    <Icon className="w-5 h-5 flex-shrink-0" />
    <span className="truncate">{children}</span>
  </a>
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

const SidebarLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

 const navigation_menu = [
     { name: "Dashboard", href: "/dashboard/recuiter", icon: Menu, current: true },
     {
       name: "History",
       href: "/dashboard/recuiter/history",
       icon: History,
       current: false,
     },
     { name: "Job List", href: "/dashboard/recuiter/joblist", icon: Menu, current: false },
     { name: "Billing", href: "/Pricing", icon: PlusSquare, current: false },
   ];
   const navigation_option = [
     { name: "Settings", href: "/dashboard/recuiter/Settings", icon: Settings, current: false },
     { name: "Support", href: "/dashboard/recuiter/jobbuilder", icon: Settings, current: false },
   ];

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => setIsDarkMode(e.matches);

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

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
    // If no filters are selected, show all jobs
    const noJobTypeFilters = !filters.fullTime && !filters.partTime;
    const noSalaryFilters = !filters.salary50_100 && !filters.salary100_150;

    if (noJobTypeFilters && noSalaryFilters) return true;

    // Check job type filters
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
            <a href="/cv" className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-md"  >
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
                {selectedJob.requirements?.map((req, index) => (
                  <li key={index} className="ml-4">
                    {req}
                  </li>
                ))}
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
    <div className={`min-h-screen ${isDarkMode ? "dark" : ""} `}>
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

        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-gray-50  dark:bg-black transition-all duration-300 ease-in-out z-30">

        
          {/* Header */}
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
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          <div className="p-6 space-y-6  transition-all duration-300 ease-in-out z-30">
            <div>
              <div >
                <div className="max-w-6xl mx-auto p-0">
                  <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2 text-gray-200">
                      Pick <span className="text-purple-500">One</span>
                    </h1>
                    <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md">
                      Post a job
                    </button>
                  </div>

                  <div className="flex gap-12  transition-all duration-300 ease-in-out z-30">
                    <div className="w-3/4">
                      <div className="dark:bg-black bg-white rounded-lg shadow-sm  transition-all duration-300 ease-in-out z-30">
                        <div className="p-4 border-b border-gray-500">
                          <h2 className="text-xl font-semibold">Latest jobs</h2>
                        </div>
                        <div className="p-4">
                          <div className="space-y-4">
                            {loading ? (
                              <p>Loading jobs...</p>
                            ) : error ? (
                              <p className="text-red-500">{error}</p>
                            ) : (
                              filteredJobs.map((job) => (
                                <div
                                  key={job.id}
                                  className="flex items-center p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
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

                    <div className="w-1/4 transition-all duration-300 ease-in-out z-30">
                      <div className="dark:bg-black bg-white transition-all duration-300 ease-in-out z-30 rounded-lg shadow-sm border border-gray-100 dark:border-gray-600 ">
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
                                  <span className="ml-2">$100k - $150k</span>
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
