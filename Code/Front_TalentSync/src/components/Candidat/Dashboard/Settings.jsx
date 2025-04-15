import React, { useState, useRef,useEffect } from "react";
import {
  Menu,
  History,
  PlusSquare,
  Settings,
  CreditCard,
  Moon,
  Sun,
  ChevronLeft,
  ChevronRight,
  Search,
  Upload,
  AlertTriangle,
  X,
  FlaskConical,
  Wrench,
  LogOut,
  FileClock,
  Briefcase
  
} from "lucide-react";
import { Dialog } from "@headlessui/react";
import { Menu as HeadlessMenu } from "@headlessui/react";
import { BellIcon } from "@heroicons/react/24/outline";
import { MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import Card from "./Desactivate";
import styled from "styled-components";
import { useDarkMode } from "../../DarkModeProvider";
import { Link } from "react-router-dom";
import axios from "axios"; // Import axios for API calls

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
const SettingsComp = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { isDarkMode } = useDarkMode();
  const [profilePic, setProfilePic] = useState(""); // Default to an empty string
  const [firstName, setFirstName] = useState(""); // Default to an empty string
  const [lastName, setLastName] = useState(""); // Default to an empty string
  const [email, setEmail] = useState(""); // Default to an empty string

  useEffect(() => {
    // Ensure the dark class is applied globally
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Fetch user data from the backend
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token"); // Get the token from localStorage
        const response = await axios.get(
          "http://localhost:5000/api/candidates/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
            },
          }
        );

        // Assuming the backend returns { profilePic: "url", firstName: "John", lastName: "Doe", email: "john.doe@example.com" }
        const { profilePic, firstName, lastName, email } = response.data;
        setProfilePic(profilePic || ""); // Ensure fallback to an empty string
        setFirstName(firstName || ""); // Ensure fallback to an empty string
        setLastName(lastName || ""); // Ensure fallback to an empty string
        setEmail(email || ""); // Ensure fallback to an empty string
        console.log(email);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [isDarkMode]);

  const navigation_menu = [
    { name: "Dashboard", href: "/dashboard", icon: Menu, current: false },
    {
      name: "Past Applications",
      href: "/dashboard/history",
      icon: FileClock,
      current: false,
    },
    { name: "Jobs", href: "/Jobcandidate", icon: Briefcase, current: false },
    { name: "Billing", href: "/Pricing", icon: CreditCard, current: false },
  ];
  const navigation_option = [
    { name: "Settings", href: "/Settings", icon: Settings, current: true },
    { name: "Support", href: "/cv", icon: Wrench, current: false },
  ];

  const [showDesactivate, setShowDesactivate] = useState(false);
  const handleDesactivate = () => {
    setShowDesactivate(true);
    setTimeout(() => {
      setShowDesactivate(false);
    }, 10000);
  };
  const handleCancel = () => {
    setShowDesactivate(false);
  };

  const handleSupp = () => {
    setTimeout(() => {
      setShowDesactivate(false);
    }, 100);
    alert("Account deleted");
  };
  console.log(email);
  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "dark" : ""
      } transition-all duration-300 ease-in-out`}
    >
      <div className="flex h-screen bg-white dark:bg-black transition-all duration-300 ease-in-out z-30">
        {/* Sidebar */}
        <aside
          className={`fixed md:relative flex flex-col h-full bg-white dark:bg-black border-gray-200 dark:border-gray-800
           transition-all duration-300 ease-in-out z-30
            ${isSidebarOpen ? "w-64" : "w-20"}`}
        >
          {/* Rest of the sidebar content remains the same, but update classes to use dark: prefix */}
          <div className="flex items-center justify-between p-4  border-gray-200 dark:border-gray-800 transition-all duration-300 ease-in-out z-30">
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

        <main className="flex-1 overflow-auto bg-white dark:bg-black transition-all duration-300 ease-in-out z-30">
          {/* Header */}
          <header className="bg-white dark:bg-black  border-gray-200 dark:border-gray-800 sticky top-0 transition-all duration-300 ease-in-out z-30">
            <div className="flex items-center justify-between px-6 py-4">
              <SearchBar
                navigationMenu={[
                  { name: "Dashboard", href: "/dashboard", icon: Menu },
                  { name: "History", href: "/dashboard/history", icon: History },
                  { name: "Job List", href: "/Jobcandidate", icon: Menu },
                  { name: "Billing", href: "/Pricing", icon: PlusSquare },
                ]}
                navigationOption={[
                  { name: "Settings", href: "/Settings", icon: Settings },
                  { name: "Support", href: "/cv", icon: Wrench },
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
          <div className="container mx-auto p-4 ">
            <div className=" rounded-lg shadow-sm ">
              {/* Header */}
              <div className="border-b">
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-xl font-semibold dark:text-gray-200 text-gray-700 transition-all duration-300 ease-in-out z-30">
                        Settings
                      </h1>
                      <p className="text-sm text-gray-500 transition-all duration-300 ease-in-out z-30">
                        Manage account and website settings
                      </p>
                    </div>
                    <div className="hidden sm:flex gap-3">
                      <button className="px-4 py-2 dark:text-gray-300 text-gray-700  border-gray-600 border rounded-lg hover:bg-red-500  transition-colors">
                        Cancel
                      </button>
                      <button className="px-4 py-2 text-white bg-gray-500 rounded-lg hover:bg-gray-800 transition-colors">
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-8 p-6">
                {/* Personal Information Section */}
                <section>
                  <h2 className="text-lg font-medium mb-4 dark:text-gray-300 text-gray-700 transition-all duration-300 ease-in-out z-30">
                    Personal Information
                  </h2>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label
                        htmlFor="firstName"
                        className="block text-sm font-medium text-gray-600 dark:text-gray-400 transition-all duration-300 ease-in-out z-30"
                      >
                        First Name
                      </label>
                      <input
                        id="firstName"
                        type="text"
                        value={firstName} // Bind the state to the input
                        onChange={(e) => setFirstName(e.target.value)} // Update state on change
                        placeholder="Enter your first name"
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 dark:bg-black text-black bg-gray-200 transition-all duration-300 ease-in-out z-30"
                        aria-required="true"
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="lastName"
                        className="block text-sm font-medium text-gray-600 dark:text-gray-400 transition-all duration-300 ease-in-out z-30"
                      >
                        Last Name
                      </label>
                      <input
                        id="lastName"
                        type="text"
                        value={lastName} // Bind the state to the input
                        onChange={(e) => setLastName(e.target.value)} // Update state on change
                        placeholder="Enter your last name"
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 dark:bg-black text-black bg-gray-200 transition-all duration-300 ease-in-out z-30"
                        aria-required="true"
                      />
                    </div>
                  </div>
                </section>

                {/* Contact Information Section */}
                <section>
                  <h2 className="text-lg font-medium mb-4 dark:text-gray-300  text-gray-700 transition-all duration-300 ease-in-out z-30">
                    Contact Information
                  </h2>
                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-600 dark:text-gray-400 transition-all duration-300 ease-in-out z-30"
                    >
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email} // Bind the state to the input
                      onChange={(e) => setEmail(e.target.value)} // Update state on change
                      placeholder="your.email@domain.com"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 dark:bg-black text-black bg-gray-200 transition-all duration-300 ease-in-out z-30"
                      aria-required="true"
                    />
                  </div>
                </section>

                {/* Profile Picture Section */}
                <section>
                  <h2 className="text-lg font-medium mb-4 dark:text-gray-300 text-gray-700 transition-all duration-300 ease-in-out z-30">
                    Profile Picture
                  </h2>
                  <div className="border-2 border-dashed rounded-lg p-6 text-center space-y-4 border-gray-400 dark:border-gray-200">
                    <div className="mx-auto w-24 h-24 rounded-full bg-gray-50 flex items-center justify-center border-2 dark:border-gray-200">
                      {profilePic ? (
                        <img
                          src={profilePic}
                          alt="Profile"
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <Upload className="h-8 w-8 text-gray-400" />
                      )}
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm dark:text-gray-400 text-gray-600">
                        Drop an image here or click to upload
                      </p>
                      <p className="text-xs dark:text-gray-400 text-gray-600">
                        PNG, JPG up to 10MB
                      </p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="w-full max-w-xs mx-auto text-sm dark:text-gray-600"
                      aria-label="Upload profile picture"
                    />
                  </div>
                </section>

                {/* Danger Zone Section */}
                <section className="border-t pt-8">
                  <h2 className="text-lg font-medium text-red-600 ">
                    Delete Account{" "}
                  </h2>
                  <h3 className="  dark:text-gray-400 text-gray-500 mb-4 ">
                    This is a danger zone - Be careful !
                  </h3>
                  <div className=" border border-red-200 rounded-lg p-4">
                    <div className="flex gap-3">
                      <AlertTriangle className="h-5 w-5 text-red-600  flex-shrink-0" />
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-semibold dark:text-red-600  text-red-600 ">
                            {" "}
                            Are you sure ?
                          </h3>
                          <p className="text-sm dark:text-gray-400">
                            Permanently delete your TalentSync account. This
                            action cannot be undone - please proceed with
                            caution.
                          </p>
                        </div>
                        <button
                          className="px-4 py-2 dark:text-red-200 text-red-100 border-2 border-red-500 rounded-lg hover:bg-red-600 bg-red-500 transition-colors"
                          onClick={handleDesactivate}
                        >
                          Delete Account
                        </button>

                        {showDesactivate && (
                          <StyledWrapper>
                            <div className="card" role="alert">
                              <div className="group select-none w-[250px] flex flex-col p-4 relative items-center justify-center bg-gray-800 border border-gray-800 shadow-lg rounded-2xl">
                                <div>
                                  <div className="text-center p-3 flex-auto justify-center">
                                    <svg
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                      className="group-hover:animate-bounce w-12 h-12 flex items-center text-gray-600 fill-red-500 mx-auto"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        clipRule="evenodd"
                                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                        fillRule="evenodd"
                                      />
                                    </svg>
                                    <h2 className="text-xl font-bold py-4 text-gray-200">
                                      Are you sure?
                                    </h2>
                                    <p className="font-bold text-sm text-gray-500 px-2">
                                      Do you really want to continue? This
                                      process cannot be undone.
                                    </p>
                                  </div>
                                  <div className="p-2 mt-2 text-center space-x-1 md:block">
                                    <button
                                      className="mb-2 md:mb-0 bg-gray-700 px-5 py-2 text-sm shadow-sm font-medium tracking-wider border-2 border-gray-600 hover:border-gray-700 text-gray-300 rounded-full hover:shadow-lg hover:bg-gray-800 transition ease-in duration-300"
                                      type="button"
                                      onClick={handleCancel} // Close modal on Cancel
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      type="button"
                                      onClick={handleSupp}
                                      className="bg-red-500 hover:bg-transparent px-5 ml-4 py-2 text-sm shadow-sm hover:shadow-lg font-medium tracking-wider border-2 border-red-500 hover:border-red-500 text-white hover:text-red-500 rounded-full transition ease-in duration-300"
                                    >
                                      Confirm
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </StyledWrapper>
                        )}
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              {/* Mobile Actions */}
              <div className="p-6 border-t sm:hidden">
                <div className="flex gap-3">
                  <button className="flex-1 px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-100 transition-colors">
                    Cancel
                  </button>
                  <button className="flex-1 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                    Save Changes
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
const StyledWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;

  .card {
    overflow: hidden;
    position: relative;

    text-align: left;
    border-radius: 0.5rem;
    max-width: 290px;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
      0 10px 10px -5px rgba(0, 0, 0, 0.04);
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .header {
    padding: 1.25rem 1rem 1rem 1rem;
    background-color: #ffffff;
  }

  .image {
    display: flex;
    margin-left: auto;
    margin-right: auto;
    background-color: #fee2e2;
    flex-shrink: 0;
    justify-content: center;
    align-items: center;
    width: 3rem;
    height: 3rem;
    border-radius: 9999px;
  }

  .image svg {
    color: #dc2626;
    width: 1.5rem;
    height: 1.5rem;
  }

  .content {
    margin-top: 0.75rem;
    text-align: center;
  }

  .title {
    color: #111827;
    font-size: 1rem;
    font-weight: 600;
    line-height: 1.5rem;
  }

  .message {
    margin-top: 0.5rem;
    color: #6b7280;
    font-size: 0.875rem;
    line-height: 1.25rem;
  }

  .actions {
    margin: 0.75rem 1rem;
    background-color: #f9fafb;
  }

  .desactivate {
    display: inline-flex;
    padding: 0.5rem 1rem;
    background-color: #dc2626;
    color: #ffffff;
    font-size: 1rem;
    line-height: 1.5rem;
    font-weight: 500;
    justify-content: center;
    width: 100%;
    border-radius: 0.375rem;
    border-width: 1px;
    border-color: transparent;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  }

  .cancel {
    display: inline-flex;
    margin-top: 0.75rem;
    padding: 0.5rem 1rem;
    background-color: #ffffff;
    color: #374151;
    font-size: 1rem;
    line-height: 1.5rem;
    font-weight: 500;
    justify-content: center;
    width: 100%;
    border-radius: 0.375rem;
    border: 1px solid #d1d5db;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  }

  button {
    cursor: pointer;
  }
`;
export default SettingsComp;
