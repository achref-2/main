import React, { useState,useRef, useEffect } from "react";
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
  UserCheck, // Add the Filter icon here
   User, 
     
    LogOut, 
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

function ApplicationDetailsModal({ isOpen, onClose, application }) {
  if (!isOpen) return null;

  // Define status badge styles based on application status
  const getStatusBadge = (status) => {
    const statusStyles = {
      Approved: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      Pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      Rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      "In Review": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    };

    return statusStyles[status] || "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      aria-labelledby="application-details-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="border-b border-gray-200 dark:border-zinc-700 p-4 sm:p-6">
          <div className="flex justify-between items-center">
            <h2
              id="application-details-title"
              className="text-xl font-bold text-gray-900 dark:text-white"
            >
              Application Details
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
              aria-label="Close application details"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {application.title}
            </h3>
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                application.status
              )}`}
            >
              {application.status}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 dark:bg-zinc-900 p-3 rounded-lg">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Score</p>
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                {application.score}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-zinc-900 p-3 rounded-lg">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Submitted On</p>
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                {application.date}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </h4>
            <div className="bg-gray-50 dark:bg-zinc-900 p-4 rounded-lg text-gray-700 dark:text-gray-300">
              {application.description}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 dark:bg-zinc-900 px-4 py-3 sm:px-6 flex justify-end gap-3">
          <button
            className="px-4 py-2 bg-gray-200 dark:bg-zinc-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-zinc-600 transition-colors"
            onClick={onClose}
          >
            Close
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            onClick={() => window.open(application.detailsUrl, "_blank")}
            aria-label="View full application details"
          >
            View Full Details
          </button>
        </div>
      </div>
    </div>
  );
}

function CardStatus({ status }) {
  const statusColors = {
    Pending: "bg-yellow-100 text-yellow-800 dark:bg-black dark:text-yellow-400",
    Accepted: "bg-green-100 text-green-800 dark:bg-black dark:text-green-400",
    Refused: "bg-red-100 text-red-800 dark:bg-black dark:text-red-400",
    // Add fallback for unknown status
    default: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
  };

  const colorClass = statusColors[status] || statusColors.default;

  return (
    <span
      className={`absolute top-4 left-4 px-2 py-1 text-xs rounded-full font-medium ${colorClass}`}
    >
      {status}
    </span>
  );
}

function CardScore({ score }) {
  const getScoreColor = (score) => {
    if (score >= 8)
      return "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400";
    if (score >= 5)
      return "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-400";
    return "bg-red-50 text-red-800  dark:bg-black dark:text-red-400";
  };

  return (
    <div
      className={`absolute top-4 right-4 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(
        score
      )}`}
    >
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
    SENIOR:
      "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-400",
    // Add fallback for unknown level
    default: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
  };

  const colorClass = levelColors[level] || levelColors.default;

  return (
    <span
      className={`text-xs px-2 py-1 rounded-full font-medium ${colorClass}`}
    >
      {level}
    </span>
  );
}

function filterApplications(applications, activeFilter, searchQuery) {
  return applications.filter((app) => {
    // Handle filter conditions
    let matchesFilter = false;

    switch (activeFilter) {
      case "all":
        matchesFilter = true;
        break;
      case "high-score":
        matchesFilter = app.score >= 7;
        break;
      case "needs-work":
        matchesFilter = app.score < 7;
        break;
      case "incomplete":
        matchesFilter = app.status === "Incomplete";
        break;
      case "complete":
        matchesFilter = app.status === "Complete";
        break;
      case "rejected":
        matchesFilter = app.status === "Rejected";
        break;
      default:
        matchesFilter = true;
    }

    // Handle search query - more comprehensive search across multiple fields
    const lowerSearchQuery = searchQuery.toLowerCase();
    const matchesSearch =
      searchQuery === "" ||
      app.title?.toLowerCase().includes(lowerSearchQuery) ||
      app.level?.toLowerCase().includes(lowerSearchQuery) ||
      app.status?.toLowerCase().includes(lowerSearchQuery) ||
      app.description?.toLowerCase().includes(lowerSearchQuery) ||
      (app.tags &&
        app.tags.some((tag) => tag.toLowerCase().includes(lowerSearchQuery)));

    return matchesFilter && matchesSearch;
  });
}

// Improved Card component with proper score display
function Card({ application, children, className, onDelete, isDarkMode, onViewDetails }) {
  const { score, status } = application || { score: 0, status: "Incomplete" };

  return (
    <div
      className={`group relative border dark:border-zinc-600 rounded-lg shadow-md p-9 transition-transform duration-300 ease-in-out hover:shadow-lg hover:scale-105 ${className}`}
    >
      {/* Status in the top-left corner */}
      {status && <CardStatus status={status} />}

      {/* Score in the top-right corner */}
      <CardScore score={score} />

      {children}

      {/* Bottom section with Delete and View Details buttons */}
      <div className="mt-4 flex justify-between items-center gap-1">
        <button
          className="p-2 rounded-md text-zinc-400 hover:bg-zinc-200 hover:text-red-600 focus:outline-none focus:ring-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 dark:hover:bg-zinc-700"
          onClick={() => onDelete && onDelete(application)}
          aria-label="Delete application"
        >
          <Trash2 className="w-4 h-4" />
        </button>
        <button
          className={`group flex items-center gap-1 px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            isDarkMode
              ? "bg-zinc-800 text-white hover:bg-zinc-700 focus:ring-offset-black"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-offset-white"
          }`}
          onClick={() => onViewDetails && onViewDetails(application)}
        >
          View Details
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
        </button>
      </div>
    </div>
  );
}

function CardContent({ children }) {
  return <div className="mt-4 p-2">{children}</div>;
}

// Enhanced Button component with primary variant
function Button({ children, variant = "outline", isActive, className, onClick }) {
  const baseStyle =
    "px-3 py-1 text-sm rounded-full  transition-all duration-300";

  const styles = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600",
    outline:
      "border border-zinc-300 bg-white text-zinc-800 hover:bg-zinc-200 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700",
    ghost:
      "text-zinc-600 hover:bg-zinc-200 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-200",
    link: "text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300",
    filter: `px-3 py-1 text-sm rounded-full ${
      isActive
        ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
        : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
    } hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors`,
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
  const { isDarkMode, toggleTheme } = useDarkMode(); // Use the hook
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalTwoOpen, setIsModalTwoOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [applications, setApplications] = useState([]); // Ensure applications is initialized as an empty array
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const handleViewDetails = (application) => {
    setSelectedApplication(application);
    setIsModalTwoOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalTwoOpen(false);
    setSelectedApplication(null);
  };

  // Fetch applications from the backend
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await fetch("http://localhost:5000/api/candidates/applications", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("Unauthorized: Please log in again.");
          }
          throw new Error("Failed to fetch applications");
        }

        const data = await response.json();
        if (data && Array.isArray(data.applications)) {
          setApplications(data.applications); // Update the applications state with the applications array
        } else {
          console.error("Unexpected response format:", data);
          setApplications([]); // Fallback to an empty array
        }
      } catch (error) {
        console.error("Error fetching applications:", error);
        if (error.message.includes("Unauthorized")) {
          alert("Session expired. Please log in again.");
          window.location.href = "/login"; // Redirect to login page
        }
      }
    };

    fetchApplications();
  }, []); // Empty dependency array ensures this runs only once

  const filteredApplications = Array.isArray(applications)
    ? filterApplications(applications, activeFilter, searchQuery)
    : []; // Safeguard to ensure applications is an array

  const handleDeleteClick = (application) => {
    setApplications(applications.filter((app) => app.id !== application.id));
  };

  const handleConfirmDelete = () => {
    console.log(`Deleted application with ID: ${selectedApplication.id}`);
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
      name: "Past Applications",
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

  return (
    <div className={`min-h-screen ${isDarkMode ? "dark" : ""}`}>
      <div className="flex h-screen bg-white dark:bg-black">
        {/* Sidebar */}
        <aside
          className={`fixed md:relative flex flex-col h-full bg-white dark:bg-black border-gray-200 dark:border-gray-800
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
              <div className="space-y-2">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                    Application History
                  </h1>
                  <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
                    Review, track, and manage all your previous submissions in one place
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
                variant={activeFilter === "all" ? "primary" : "outline"}
                onClick={() => setActiveFilter("all")}
              >
                All
              </Button>
              <Button
                variant={activeFilter === "high-score" ? "primary" : "outline"}
                onClick={() => setActiveFilter("high-score")}
              >
                High Score
              </Button>
              <Button
                variant={activeFilter === "complete" ? "primary" : "outline"}
                onClick={() => setActiveFilter("complete")}
              >
                Complete
              </Button>
              <Button
                variant={activeFilter === "incomplete" ? "primary" : "outline"}
                onClick={() => setActiveFilter("incomplete")}
              >
                Incomplete
              </Button>
              
            </div>

            {filteredApplications.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 dark:bg-zinc-900 rounded-lg">
                <UserCheck className="h-12 w-12 mx-auto text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                  No applications found
                </h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {searchQuery
                    ? "Try a different search term"
                    : "Applications matching your filter criteria will appear here"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredApplications.map((application, index) => (
                  <Card
                    key={application.id || index} // Use application.id if available, otherwise fallback to index
                    application={application}
                    onDelete={() => handleDeleteClick(application)}
                    onViewDetails={handleViewDetails}
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
                      <CardInfo
                        icon={<FileText size={16} />}
                        text={application.file}
                      />
                      <CardInfo
                        icon={<Calendar size={16} />}
                        text={application.date}
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      <ApplicationDetailsModal
        isOpen={isModalTwoOpen}
        onClose={handleCloseModal}
        application={selectedApplication}
      />

      <DeleteConfirmationModal
        isOpen={isModalOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default SidebarLayout;
