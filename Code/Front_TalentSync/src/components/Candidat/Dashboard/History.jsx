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
  Wrench,
  FlaskConical,
  Trash2, // Import the delete icon
  BadgeAlert, // Import the badge alert icon
  Filter, 
  UserCheck,// Add the Filter icon here
} from "lucide-react";
import { Menu as HeadlessMenu } from "@headlessui/react";
import { BellIcon } from "@heroicons/react/24/outline";
import { MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { useDarkMode } from "../../DarkModeProvider"; // Import the hook
import { Link } from "react-router-dom";

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

const SearchBarWithDropdown = ({ navigationMenu, navigationOption }) => {
 
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

function DeleteConfirmationModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-lg text-center">
        <p className="text-gray-800 dark:text-white mb-4">
          Are you sure you want to delete this?
        </p>
        <div className="flex justify-center gap-4">
          <button
            className="px-4 py-2 bg-gray-300 dark:bg-zinc-700 text-gray-800 dark:text-white rounded-md hover:bg-gray-400 dark:hover:bg-zinc-600"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}


function CardStatus({ status }) {
  const statusColors = {
    Incomplete: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-400",
    Complete: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400",
    Rejected: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-400",
  };

  return (
    <span className={`absolute top-4 left-4 px-2 py-1 text-xs rounded-full font-medium ${statusColors[status]}`}>
      {status}
    </span>
  );
}

function CardScore({ score }) {
  const getScoreColor = (score) => {
    if (score >= 8) return "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400";
    if (score >= 5) return "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-400";
    return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  };

  return (
    <div className={`absolute top-4 right-4 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(score)}`}>
      <BadgeAlert className="w-3 h-3" />
      {score} Score
    </div>
  );
}


function CardInfo({ icon, text }) {
  return (
    <div className="mt-2 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 truncate">
      {icon} <span className="truncate">{text}</span>
    </div>
  );
}

function Badge({ level }) {
  const levelColors = {
    JUNIOR: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-400",
    MID: "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-400",
    SENIOR: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-400",
  };

  return (
    <span className={`text-xs px-2 py-1 rounded-full font-medium ${levelColors[level]}`}>
      {level}
    </span>
  );
}

const SidebarLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { isDarkMode, toggleTheme } = useDarkMode(); // Use the hook
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);


  const handleConfirmDelete = () => {
    console.log(`Deleted application with ID: ${selectedApplication.id}`);
    // Add your deletion logic here
    setIsModalOpen(false);
    setSelectedApplication(null);
  };

  const handleCancelDelete = () => {
    setIsModalOpen(false);
    setSelectedApplication(null);
  };

  const navigation_menu = [
    { name: "Dashboard", href: "/dashboard", icon: Menu, current: false },
    {
      name: "History",
      href: "/dashboard/history",
      icon: History,
      current: true,
    },
    { name: "Job List", href: "/Jobcandidate", icon: Menu, current: false },
    { name: "Billing", href: "/Pricing", icon: PlusSquare, current: false },
  ];
  const navigation_option = [
    { name: "Settings", href: "/Settings", icon: Settings, current: false },
    { name: "Support", href: "/cv", icon: Wrench, current: false },
    {
      name: "cv testing",
      href: "/Testing",
      icon: FlaskConical,
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
  const initialApplications = [
    {
      id: 1,
      title: "Backend Developer",
      level: "JUNIOR",
      file: "cv.pdf",
      date: "February 6, 2025",
      status: "Incomplete",
      score: 0,
    },
    {
      id: 2,
      title: "Frontend Developer",
      level: "JUNIOR",
      file: "achref.cv_(2).pdf",
      date: "February 1, 2025",
      status: "Incomplete",
      score: 0,
    },
  ];
  const [applications, setApplications] = useState(initialApplications);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter applications based on active filter and search query
  const filteredApplications = applications.filter(app => {
    const matchesFilter = 
      activeFilter === "all" || 
      (activeFilter === "high-score" && app.score >= 7) || 
      (activeFilter === "needs-work" && app.score < 7);
    
    const matchesSearch = 
      searchQuery === "" || 
      app.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.level.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const handleDeleteClick = (application) => {
    setApplications(applications.filter(app => app.id !== application.id));
  };
  function Card({ children, className, onDelete }) {
    return (
      <div
        className={`group  relative border dark:border-zinc-600 rounded-lg shadow-md p-9 transition-transform duration-300 ease-in-out hover:shadow-lg hover:scale-105 ${className}`}
      >
        {/* Score in the top-right corner */}
        <div className="absolute top-4 right-4  bg-gray-200 dark:bg-gray-700 px-3 py-1 text-sm rounded-full text-gray-800 dark:text-white">
          <BadgeAlert className="inline-block w-4 h-4 mr-1" />0 Score
        </div>

        {children}

        {/* Bottom section with Delete and Continue buttons */}
        <div className="mt-4 flex justify-between items-center gap-1">
          <button
            className="p-2 rounded-md text-zinc-400 hover:bg-zinc-200 hover:text-red-600 focus:outline-none focus:ring-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            onClick={onDelete}
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <Button
            className={`group flex items-center gap-1 px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              isDarkMode
                ? "bg-zinc-800 text-white hover:bg-zinc-700 focus:ring-offset-black"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-offset-white"
            }`}
          >
            Continue
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 ml-2 transition-transform duration-300 transform group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Button>
        </div>
      </div>
    );
  }

  function CardContent({ children }) {
    return <div className="mt-4  p-2">{children}</div>;
  }
  function Button({ children, variant, className }) {
    const baseStyle =
      "px-4 py-2  rounded-md font-medium transition-all duration-300";

    const styles = {
      outline:
        "border border-zinc-300 bg-white text-zinc-800 hover:bg-zinc-200 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700",
      ghost:
        "text-zinc-600 hover:bg-zinc-200 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-200",
      link: "text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300",
    };

    return (
      <button className={`${baseStyle} ${styles[variant]} ${className}`}>
        {children}
      </button>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? "dark" : ""}`}>
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
          <header className="bg-white dark:bg-black  border-gray-200 dark:border-gray-800 sticky top-0 transition-all duration-300 ease-in-out z-30">
            <div className="flex items-center justify-between px-6 py-4">
              <SearchBarWithDropdown
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

          {/* Main Content Area */}

          <div className="p-4 sm:p-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Past Applications
          </h1>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
            Access and manage your application history
          </p>
        </div>
        
        <div className="mt-4 sm:mt-0 relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              type="text"
              placeholder="Search applications..."
              className="w-full sm:w-64 pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400 mr-2 flex items-center">
          <Filter className="h-4 w-4 mr-1" /> Filter:
        </span>
        <Button 
          variant={activeFilter === "all" ? "active" : "outline"}
          onClick={() => setActiveFilter("all")}
        >
          All Applications
        </Button>
        <Button 
          variant={activeFilter === "high-score" ? "active" : "ghost"}
          onClick={() => setActiveFilter("high-score")}
        >
          High Score
        </Button>
        <Button 
          variant={activeFilter === "needs-work" ? "active" : "ghost"}
          onClick={() => setActiveFilter("needs-work")}
        >
          Needs Work
        </Button>
      </div>
      
      {filteredApplications.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <UserCheck className="h-12 w-12 mx-auto text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No applications found</h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {searchQuery ? 'Try a different search term' : 'Applications matching your filter criteria will appear here'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredApplications.map((application) => (
            <Card
              key={application.id}
              onDelete={() => handleDeleteClick(application)}
            >
              <CardStatus status={application.status} />
              <CardScore score={application.score} />
              <CardContent>
                <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white truncate">
                  {application.title}
                </h2>
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge level={application.level} />
                </div>
                <CardInfo icon={<FileText size={16} />} text={application.file} />
                <CardInfo icon={<Calendar size={16} />} text={application.date} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  
        </main>
      </div>

      <DeleteConfirmationModal
        isOpen={isModalOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default SidebarLayout;
