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
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  TrendingDown,
  Star,
  StarHalf,
  Stars,
  Tag,
  ChevronLeft,
  ChevronRight,
  Search,
  FileText,
  Download,
  Loader2,
  Calendar,
  Wrench,
  Briefcase,
  FlaskConical,
  Trash2, // Import the delete icon
  BadgeAlert, // Import the badge alert icon
  Filter,
  UserCheck, // Add the Filter icon here
   User, 
   FileClock,
      Mail,
      
    LogOut, 
    Users,
    MapPin
} from "lucide-react";
import { Menu as HeadlessMenu } from "@headlessui/react";
import { BellIcon } from "@heroicons/react/24/outline";
import { MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { useDarkMode } from "../../DarkModeProvider"; // Import the hook
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

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
  if (!isOpen || !application) return null;

  // Format date strings properly
  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Improved status badge styles with better semantic colors
  const getStatusBadge = (status) => {
    const statusStyles = {
      Approved: "bg-green-700 text-green-800 border border-green-200 dark:bg-green-900/40 dark:text-green-300 dark:border-green-800",
      Pending: "bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-800",
      Rejected: "bg-red-100 text-red-800 border border-red-200 dark:bg-red-900/40 dark:text-red-300 dark:border-red-800",
      "In Review": "bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-800",
    };

    return statusStyles[status] || "bg-gray-100 text-gray-800 border border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700";
  };

  // Parse requirements into array
  const parseRequirements = (requirements) => {
    if (!requirements) return [];
    if (Array.isArray(requirements)) return requirements;
    return requirements.split(/[,;]/).map(item => item.trim()).filter(Boolean);
  };

  // Handle file download
  const handleFileDownload = () => {
    const fileUrl = application.file || application.cvPath;
    if (!fileUrl) {
      alert("No resume file available");
      return;
    }
    
    // Determine if it's a full URL or relative path
    const fullUrl = fileUrl.startsWith('http') 
      ? fileUrl 
      : `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/${fileUrl}`;
    
    window.open(fullUrl, '_blank');
  };

  // Extract skills from job data
  const skills = application.jobId?.skills || application.skills || [];
  
  // Parse requirements from job data
  const requirements = parseRequirements(application.jobId?.requirements || application.requirements);
  const description = parseRequirements(application.jobId?.description || application.description || "No description provided");

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity animate-in fade-in"
      aria-labelledby="application-details-title"
      role="dialog"
      aria-modal="true"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div 
        className="bg-white dark:bg-zinc-900 rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in slide-in-from-bottom-4 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="border-b border-gray-200 dark:border-zinc-800 px-6 py-4">
          <div className="flex justify-between items-center">
            <h2
              id="application-details-title"
              className="text-xl font-semibold text-gray-900 dark:text-white"
            >
              Application Details
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
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
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {/* Header Section with visual hierarchy */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {application.jobId?.title || application.title || "No Title Provided"}
              </h3>
              <div className="flex flex-wrap gap-2 items-center">
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                    application.status
                  )}`}
                >
                  {application.status || "Pending"}
                </span>
                {(application.jobId?.deadline || application.deadline) && (
                  <span className="inline-flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Deadline: {formatDate(application.jobId?.deadline || application.deadline)}
                  </span>
                )}
                {application.level && (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200 dark:bg-purple-900/40 dark:text-purple-300 dark:border-purple-800">
                    {application.level}
                  </span>
                )}
              </div>
            </div>
            
            {/* Score displayed prominently with visual indicator */}
            {application.score !== undefined && (
              <div className="flex items-center gap-2 bg-gray-50 dark:bg-zinc-800 rounded-full px-3 py-1">
                <div className="relative w-8 h-8">
                  <svg className="w-8 h-8" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15.5" stroke="#e5e7eb" strokeWidth="3" fill="none" className="dark:stroke-zinc-700" />
                    <circle 
                      cx="18" cy="18" r="15.5" 
                      stroke={
                        application.score >= 0.8 ? "#10b981" : 
                        application.score >= 0.6 ? "#6366f1" : 
                        application.score >= 0.4 ? "#f59e0b" : "#ef4444"
                      } 
                      strokeWidth="3" 
                      fill="none" 
                      strokeDasharray={`${application.score * 100}, 100`}
                      strokeDashoffset="25"
                      strokeLinecap="round"
                      transform="rotate(-90 18 18)"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold">
                    {Math.round(application.score * 100)}
                  </div>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">Score</span>
              </div>
            )}
          </div>

          {/* Company & Location */}
          <div className="mb-6 bg-gray-50 dark:bg-zinc-800 rounded-lg p-4">
            <div className="flex flex-col sm:flex-row justify-between">
              <div className="mb-4 sm:mb-0">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Company</p>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1.5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                  </svg>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {application.jobId?.companyName || application.companyName || "No Company Provided"}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Location</p>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1.5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {application.jobId?.location || application.location || "No Location Provided"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Key Details Section - More organized and scannable */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
              <svg className="w-4 h-4 mr-1.5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              Key Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-zinc-800 p-3 rounded-lg flex flex-col">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Submitted On</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatDate(application.appliedAt || application.date)}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-zinc-800 p-3 rounded-lg flex flex-col">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Job Type</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {application.jobId?.jobType || application.jobType || "Not Specified"}
                </p>
              </div>
              {(application.jobId?.salary || application.salary) && (
                <div className="bg-gray-50 dark:bg-zinc-800 p-3 rounded-lg flex flex-col">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Salary Range</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {application.jobId?.salary || application.salary}
                  </p>
                </div>
              )}
              {application.coverLetter && application.coverLetter !== "N/A" && (
                <div className="bg-gray-50 dark:bg-zinc-800 p-3 rounded-lg flex flex-col">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Cover Letter</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {application.coverLetter.length > 50 
                      ? `${application.coverLetter.substring(0, 50)}...` 
                      : application.coverLetter}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Requirements Section */}
          {requirements.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                <svg className="w-4 h-4 mr-1.5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7"></path>
                </svg>
                Requirements
              </h4>
              <div className="bg-gray-50 dark:bg-zinc-800 p-4 rounded-lg text-gray-700 dark:text-gray-300 text-sm">
                <ul className="list-disc pl-5 space-y-1">
                  {requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          
          {description && description.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                <svg
                  className="w-4 h-4 mr-1.5 text-gray-500 dark:text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h7"
                  ></path>
                </svg>
                Description
              </h4>
              <div className="bg-gray-50 dark:bg-zinc-800 p-4 rounded-lg text-gray-700 dark:text-gray-300 text-sm">
                <ul className="list-disc pl-5 space-y-1">
                  {Array.isArray(description) ? (
                    description.map((req, index) => <li key={index}>{req}</li>)
                  ) : (
                    <li>{description}</li>
                  )}
                </ul>
              </div>
            </div>
          )}

          {/* Skills */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
              <svg className="w-4 h-4 mr-1.5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
              Skills
            </h4>
            <div className="bg-gray-50 dark:bg-zinc-800 p-3 rounded-lg">
              <div className="flex flex-wrap gap-2">
                {skills && skills.length > 0 ? (
                  skills.map((skill, index) => (
                    <span 
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400">No Skills Provided</p>
                )}
              </div>
            </div>
          </div>

          {/* Resume File Section */}
          {(application.file || application.cvPath) && (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                <svg className="w-4 h-4 mr-1.5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                </svg>
                Resume
              </h4>
              <div className="bg-gray-50 dark:bg-zinc-800 p-4 rounded-lg flex items-center justify-between">
                <div className="flex items-center text-gray-700 dark:text-gray-300">
                  <svg className="w-8 h-8 text-gray-400 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd"></path>
                  </svg>
                  <div>
                    <p className="text-sm font-medium">Resume File</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {application.file?.split('\\').pop() || application.cvPath?.split('\\').pop() || "Resume File"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleFileDownload}
                  className="inline-flex items-center px-3 py-1 bg-gray-200 dark:bg-zinc-700 rounded-md text-sm text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-zinc-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                  </svg>
                  Download
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 dark:bg-zinc-800 px-6 py-4 border-t border-gray-200 dark:border-zinc-800 flex justify-between items-center">
          <button
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600 rounded-md px-3 py-1.5"
            onClick={onClose}
          >
            Close
          </button>
          
        </div>
      </div>
    </div>
  );
}

function CardContent({ children }) {
  return <div className="mt-4">{children}</div>;
}
const UserMessage = () => {
  const { isDarkMode, toggleTheme } = useDarkMode();
  
 

  
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
          <p className="font-medium text-gray-900 dark:text-white">{message}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{time}</p>
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
function Button({ children, variant = "outline", isActive, className, onClick }) {
  const baseStyle = "px-3 py-2 text-sm rounded-md font-medium transition-all duration-200 flex items-center gap-2";

  const styles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 focus:ring-blue-500",
    secondary: "bg-zinc-100 text-zinc-800 hover:bg-zinc-200 dark:bg-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-600 focus:ring-zinc-500",
    outline: "border border-zinc-300 bg-white text-zinc-800 hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700 focus:ring-zinc-500",
    ghost: "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 focus:ring-zinc-500",
    link: "text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 focus:ring-blue-500",
    danger: "bg-red-600 text-white hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 focus:ring-red-500",
    filter: `px-3 py-1 text-sm rounded-full ${
      isActive
        ? "bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200"
        : "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300"
    } hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors focus:ring-blue-500`,
  };

  const variantStyle = styles[variant] || styles.outline;

  return (
    <button
      className={`${baseStyle} ${variantStyle} focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-zinc-800 ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function CardStatus({ status }) {
  const statusConfig = {
    Pending: {
      color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-400",
      icon: <Clock className="w-3 h-3" />
    },
    approve: {
      color: "bg-green-900 text-green-800 dark:bg-green-900/40 dark:text-green-400",
      icon: <CheckCircle className="w-3 h-3" />
    },
    Refused: {
      color: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-400",
      icon: <XCircle className="w-3 h-3" />
    },
    Incomplete: {
      color: "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-400",
      icon: <AlertCircle className="w-3 h-3" />
    },
    default: {
      color: "bg-zinc-900 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-400",
      icon: <Info className="w-3 h-3" />
    }
  };

  const config = statusConfig[status] || statusConfig.default;

  return (
    <div
      className={`absolute -top-3   py-1 px-2 text-xs rounded-full font-medium flex items-center gap-1 ${config.color}`}
    >
      {config.icon}
      {status}
    </div>
  );
}

function ApplicationGrid({ filteredApplications, handleDeleteClick, handleViewDetails, isDarkMode }) {
  // Empty state handling
  if (!filteredApplications || filteredApplications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-zinc-50 dark:bg-zinc-800/30 rounded-lg border border-dashed border-zinc-300 dark:border-zinc-700">
        <FolderSearch className="h-12 w-12 text-zinc-400 dark:text-zinc-500 mb-4" />
        <h3 className="text-xl font-medium text-zinc-800 dark:text-zinc-200 mb-2">No applications found</h3>
        <p className="text-zinc-500 dark:text-zinc-400 max-w-md">
          Try adjusting your filters or create a new application to get started.
        </p>
        <button className="mt-6 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-800">
          Create New Application
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredApplications.map((application, index) => (
        <Card
          key={application.id || index}
          application={application}
          onDelete={() => handleDeleteClick(application)}
          onViewDetails={() => handleViewDetails(application)}
          isDarkMode={isDarkMode}
        />
      ))}
    </div>
  );
}

function Card({ application, onDelete, isDarkMode, onViewDetails }) {
  const { id, score, status, title, level, tags, file, appliedAt, location, company } = application || {};
  /***bg of card status */
  const getStatusColor = (status) => {
    const statusMap = {
      // Pending state - waiting for action
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300",
      
      // Positive states - showing success/approval
      accepted: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300",
      approved: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300",
      
      // Negative states - showing rejection/failure
      rejected: "bg-red-200 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300",
      
      // Process states - in progress
      review: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300",
      
      // Action states - available actions
      approve: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300",
      reject: "bg-red-200 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300",
      
      // Default fallback state
      default: "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800/80 dark:text-gray-300",
    };
    return statusMap[status?.toLowerCase()] || "";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      }).format(date);
    } catch (e) {
      return dateString;
    }
  };

  // For improved animations with state
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div
      className={`group relative border-l-4 rounded-lg shadow-sm transition-all duration-300 ease-in-out
        ${getStatusColor(status)}
        ${isDarkMode ? 'bg-zinc-800/90 border-t border-r border-b border-zinc-700' : 'bg-white border-t border-r border-b border-zinc-200'}`}
      data-testid={`application-card-${id}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onViewDetails(application)}
    >
      {/* Status badge */}
      <div className="absolute top-4 right-4 z-10">
        <StatusBadge status={status} />
      </div>
      
      {/* Score indicator */}
      {score !== undefined && <CardScore score={score} />}
      
      {/* Card Content */}
      <div className="p-6">
        {/* Header */}
        <div className="mb-4 mt-9">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 truncate pr-20">
            {title || "Untitled Application"}
          </h2>
          
          {company && (
            <div className="flex items-center mt-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
              <Building className="w-3.5 h-3.5 mr-1.5" />
              <span className="truncate">{company}</span>
            </div>
          )}
        </div>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {level && <Badge level={level} />}
          
          {tags?.slice(0, 3).map(tag => (
            <Badge key={tag} level={tag} size="small" />
          ))}
          
          {tags && tags.length > 3 && (
            <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300">
              +{tags.length - 3}
            </span>
          )}
        </div>
        
        {/* Info items */}
        <div className="space-y-2">
          <CardInfo
            icon={<FileText size={16} />}
            text={file}
            tooltip={`File: ${file}`}
          />
          <CardInfo
            icon={<Calendar size={16} />}
            text={formatDate(appliedAt)}
            tooltip={`Applied on: ${formatDate(appliedAt)}`}
          />
          {location && (
            <CardInfo
              icon={<MapPin size={16} />}
              text={location}
              tooltip={`Location: ${location}`}
            />
          )}
        </div>
      </div>
      
      {/* Action buttons footer */}
      <div className={`px-6 py-3 bg-zinc-50 dark:bg-zinc-800/50 border-t border-zinc-200 dark:border-zinc-700 rounded-b-lg flex justify-between items-center
        ${isHovered ? 'opacity-100' : 'opacity-0 md:opacity-0 sm:opacity-100'} transition-opacity duration-200`}>
        <button
          className="p-2 rounded-md text-zinc-500 hover:bg-zinc-200 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200
          dark:text-zinc-400 dark:hover:bg-zinc-700 dark:focus:ring-offset-zinc-800"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(application);
          }}
          aria-label="Delete application"
        >
          <Trash2 className="w-4 h-4" />
        </button>
        
        <div className="flex space-x-2">
          <button
            className="p-2 rounded-md text-zinc-500 hover:bg-zinc-200 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200
            dark:text-zinc-400 dark:hover:bg-zinc-700 dark:focus:ring-offset-zinc-800"
            onClick={(e) => {
              e.stopPropagation();
              // Add your download/export functionality here
            }}
            aria-label="Export application"
          >
            <Download className="w-4 h-4" />
          </button>
          
          <button
            className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 
            ${isDarkMode
              ? "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 focus:ring-offset-zinc-800"
              : "bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-500 focus:ring-offset-white"
            } focus:outline-none focus:ring-2 focus:ring-offset-2`}
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(application);
            }}
          >
            Details
            <ChevronRight className="h-4 w-4 transition-transform duration-200 transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
      
      {/* Hover overlay for better UX feedback */}
      <div className={`absolute inset-0 bg-zinc-900/5 dark:bg-zinc-100/5 rounded-lg pointer-events-none transition-opacity duration-200
        ${isHovered ? 'opacity-100' : 'opacity-0'}`} 
        aria-hidden="true"
      />
    </div>
  );
}

function CardScore({ score }) {
  const getScoreConfig = (score) => {
    if (score >= 8) return {
      color: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400",
      icon: <TrendingUp className="w-3 h-3" />
    };
    if (score >= 5) return {
      color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-400",
      icon: <MinusCircle className="w-3 h-3" />
    };
    return {
      color: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-400",
      icon: <TrendingDown className="w-3 h-3" />
    };
  };

  const config = getScoreConfig(score);

  return (
    <div
      className={`absolute top-4 left-4 py-1 px-2 flex items-center gap-1 rounded-full text-xs font-medium ${config.color}`}
    >
      {config.icon}
      <span>{score}</span>
    </div>
  );
}

function CardInfo({ icon, text, tooltip }) {
  if (!text) return null;
  
  return (
    <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 truncate" title={tooltip || text}>
      <span className="text-zinc-400 dark:text-zinc-500 flex-shrink-0">{icon}</span> 
      <span className="truncate">{text}</span>
    </div>
  );
}

function Badge({ level, size = "default" }) {
  const levelConfig = {
    JUNIOR: {
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-400",
      icon: <Star className="w-3 h-3" />
    },
    MID: {
      color: "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-400",
      icon: <StarHalf className="w-3 h-3" />
    },
    SENIOR: {
      color: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-400",
      icon: <Stars className="w-3 h-3" />
    },
    default: {
      color: "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300",
      icon: <Tag className="w-3 h-3" />
    }
  };

  const config = levelConfig[level?.toUpperCase()] || levelConfig.default;
  const sizeClass = size === "small" ? "text-xs px-1.5 py-0.5" : "text-xs px-2 py-1";

  return (
    <span
      className={`rounded-full font-medium flex items-center gap-1 ${sizeClass} ${config.color}`}
    >
      {config.icon}
      {level}
    </span>
  );
}


// Example usage
function ApplicationCardList({ filteredApplications, handleDeleteClick, handleViewDetails, isDarkMode }) {
  // For empty state
  if (filteredApplications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-4 mb-4">
          <FileSearch size={32} className="text-gray-500 dark:text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No applications found</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md">
          Try adjusting your filters or adding a new application to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
      {filteredApplications.map((application, index) => (
        <Card
          key={application.id || index}
          application={application}
          onDelete={() => handleDeleteClick(application)}
          onViewDetails={() => handleViewDetails(application)}
          isDarkMode={isDarkMode}
          className={`transform transition-all duration-200 hover:translate-y-px hover:shadow-md 
            ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
        >
          {/* Status indicator bar */}
          <div className={`h-1 w-full rounded-t-lg ${getStatusColor(application.status)}`}></div>
          
          <div className="p-4">
            {/* Header section with title and actions */}
            <div className="flex justify-between items-start mb-2">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white truncate flex-1 pr-2">
                {application.title}
              </h2>
              
              <div className="flex items-center space-x-1">
                {/* Status badge */}
                <StatusBadge status={application.status} />
                
                {/* Score indicator if available */}
                {application.score !== undefined && (
                  <span className={`inline-flex items-center justify-center h-6 w-6 rounded-full text-xs font-medium 
                    ${getScoreColor(application.score)}`}>
                    {application.score}
                  </span>
                )}
              </div>
            </div>
            
            {/* Description - limited to 2 lines */}
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3 min-h-8">
              {application.description || "No description provided"}
            </p>
            
            {/* Company name if available */}
            {application.company && (
              <div className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                <Building size={14} className="mr-1 flex-shrink-0" />
                <span className="truncate">{application.company}</span>
              </div>
            )}
            
            {/* Tags and skill level */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {application.level && (
                <Badge 
                  level={application.level} 
                  className={`${getBadgeColorByLevel(application.level)}`}
                />
              )}
              
              {application.tags?.slice(0, 3).map(tag => (
                <Badge 
                  key={tag} 
                  level={tag} 
                  size="small"
                  className="bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                />
              ))}
              
              {/* Show count of additional tags if more than 3 */}
              {application.tags && application.tags.length > 3 && (
                <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                  +{application.tags.length - 3}
                </span>
              )}
            </div>
          </div>
          
          {/* Footer with metadata */}
          <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700 
            rounded-b-lg grid grid-cols-2 gap-y-2 text-sm">
            <CardInfo
              icon={<FileText size={14} />}
              text={application.file}
              tooltip={`File: ${application.file}`}
              className="text-gray-600 dark:text-gray-400"
            />
            <CardInfo
              icon={<Calendar size={14} />}
              text={formatDate(application.date)}
              tooltip={`Applied on: ${formatDate(application.date)}`}
              className="text-gray-600 dark:text-gray-400"
            />
            
            {application.location && (
              <CardInfo
                icon={<MapPin size={14} />}
                text={application.location}
                tooltip={`Location: ${application.location}`}
                className="text-gray-600 dark:text-gray-400 col-span-2"
              />
            )}
          </div>
          
          {/* Action buttons */}
          <div className="absolute bottom-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex space-x-1">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewDetails(application);
                }}
                className="p-1 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 
                  text-gray-600 dark:text-gray-300"
                aria-label="View details"
              >
                <Eye size={16} />
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteClick(application);
                }}
                className="p-1 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-red-100 dark:hover:bg-red-900
                  text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400"
                aria-label="Delete application"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

// Helper functions
function getStatusColor(status) {
  const statusMap = {
    pending: 'bg-yellow-100',
    interview: 'bg-blue-500',
    offer: 'bg-green-500',
    reject: 'bg-red-500',
    applied: 'bg-purple-500',
    // Add more statuses as needed
  };
  return statusMap[status?.toLowerCase()] || 'bg-gray-400';
}

function getScoreColor(score) {
  if (score >= 80) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
  if (score >= 60) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
  return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
}

function getBadgeColorByLevel(level) {
  const levelMap = {
    entry: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    mid: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    senior: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
    // Add more levels as needed
  };
  return levelMap[level?.toLowerCase()] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
}

function formatDate(dateString) {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  } catch (e) {
    return dateString; // Fallback to original string if parsing fails
  }
}
/*** Colores for status text **/
function StatusBadge({ status }) {
  const statusClasses = {
    pending: "text-yellow-800 border-yellow-300 dark:text-yellow-300",
    accepted: " text-green-800 border-green-200  dark:text-green-300",
    rejected: " text-red-800 border-red-200  dark:text-red-300",
    review: " text-blue-800 border-blue-200  dark:text-blue-300",
    approve: " text-green-800 border-green-300  dark:text-green-300",
    reject: " text-red-800 border-red-200  dark:text-red-300",
    default: " text-gray-800 border-gray-200  dark:text-gray-300",
  };
  
  const className = statusClasses[status?.toLowerCase()] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${className}`}>
      {status || 'Unknown'}
    </span>
  );
}

// Empty state component for when there are no applications
function EmptyState({ message = "No applications found", actionText = "Add New Application", onAction }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-white dark:bg-zinc-800 rounded-lg border border-dashed border-zinc-300 dark:border-zinc-700">
      <FolderOpenDot className="w-12 h-12 text-zinc-400 dark:text-zinc-500 mb-4" />
      <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">{message}</h3>
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
        No applications match your current filters.
      </p>
      {onAction && (
        <Button variant="primary" className="mt-4" onClick={onAction}>
          <Plus className="w-4 h-4" />
          {actionText}
        </Button>
      )}
    </div>
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

const SidebarLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { isDarkMode, toggleTheme } = useDarkMode(); // Use the hook
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalTwoOpen, setIsModalTwoOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [applications, setApplications] = useState([]); // Ensure applications is initialized as an empty array
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate(); // If using react-router-dom

  const handleViewDetails = (application) => {
    setSelectedApplication(application);
    setIsModalTwoOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalTwoOpen(false);
    setSelectedApplication(null);
  };
  const [loading, setLoading] = useState(false);

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
          throw new Error(`Failed to fetch applications: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data && data.message === "Applications retrieved successfully" && Array.isArray(data.applications)) {
          const formattedApplications = data.applications.map((app) => ({
            id: app._id,
            title: app.jobId?.title || app.title || "No Title Provided",
            companyName: app.jobId?.companyName || "Unknown Company",
            location: app.jobId?.location || "Unknown Location",
            jobType: app.jobId?.jobType || "Not Specified",
            deadline: app.jobId?.deadline
              ? new Date(app.jobId.deadline).toLocaleDateString()
              : "No Deadline",
            appliedAt: app.appliedAt
              ? new Date(app.appliedAt).toLocaleDateString()
              : "Unknown Date",
              description: app.description || app.jobId?.description || "No Description Provided", // Updated logic
              salary: app.jobId?.salary || "Not Specified",
            requirements: app.jobId?.requirements || "No Requirements Provided",
            skills: app.jobId?.skills || [],
            status: app.status || "Pending",
            score: app.score || 0,
            file: app.file || app.cvPath || "No File Provided",
            level: app.level || "Not Specified",
            coverLetter: app.coverLetter || "No Cover Letter",
            recruiter: app.recruiterId?._id || "Unknown Recruiter",
          }));
          setApplications(formattedApplications);
        } else {
          console.warn("Unexpected response format:", data);
          setApplications([]);
        }
      } catch (error) {
        console.error("Error fetching applications:", error);
        setError(error.message);
        
        if (error.message.includes("Unauthorized")) {
          toast.error("Session expired. Please log in again.");
          // Use react-router-dom navigation instead of direct window location change
          navigate("/login");
        } else {
          toast.error("Failed to load applications. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };
  
    setLoading(true);
    fetchApplications();
  }, [navigate]); // Add navigate to dependency array if using react-router// Empty dependency array ensures this runs only once // Empty dependency array ensures this runs only once // Empty dependency array ensures this runs only once
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
      icon: FileClock,
      current: true,
    },
    { name: "Jobs", href: "/Jobcandidate", icon: Briefcase, current: false },
    { name: "Billing", href: "/Pricing", icon: CreditCard, current: false },
  ];
  const navigation_option = [
    { name: "Settings", href: "/Settings", icon: Settings, current: false },
    { name: "Support", href: "/cv", icon: Wrench, current: false },
   
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
                <UserMessage />
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
    key={application.id || index}
    application={application}
    onDelete={() => handleDeleteClick(application)}
    onViewDetails={() => handleViewDetails(application)}
    isDarkMode={isDarkMode} // Add this prop, you'll need to pass it from a parent component
    className="cursor-pointer hover:border-blue-500 dark:hover:border-blue-400"
  >
    {/* No need to manually add CardStatus and CardScore here as they're handled in the Card component */}
    <div className="mb-6 pt-2"> {/* Add padding to avoid overlapping with status badges */}
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
        {application.title}
      </h2>
      
      <div className="flex flex-wrap gap-2 mt-6">
        <Badge level={application.level} />
        
        {/* Optional: If you have tags, you can map them here */}
        {application.tags?.map(tag => (
          <Badge key={tag} level={tag} size="small" />
        ))}
        
      </div>
      
    </div>
    
    <CardContent>
      
      <CardInfo
        icon={<FileText size={16} />}
        text={application.file}
        tooltip={`File: ${application.file}`}
      />
       <CardStatus status={application.status} />
       <CardScore score={application.score} />
      <CardInfo
        icon={<Calendar size={16} />}
        text={application.appliedAt}
        tooltip={`Date: ${application.appliedAt}`}
      />
      
      {/* Optional: Add location if available */}
      {application.location && (
        <CardInfo
          icon={<MapPin size={16} />}
          text={application.location}
          tooltip={`Location: ${application.location}`}
        />
      )}
     
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
