import React, { useState, useRef, useEffect } from "react";
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
  X,
  Wrench,
  FlaskConical,
  Plus,
  LogOut,
  Hammer,
  Palette,
  Megaphone,
  Briefcase,
  Package,
  Headset,
  Wallet,
  Users,
  Monitor,
} from "lucide-react";
import { Dialog } from "@headlessui/react";
import { Menu as HeadlessMenu } from "@headlessui/react";
import { BellIcon } from "@heroicons/react/24/outline";
import { MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { useDarkMode } from "../../components/DarkModeProvider";
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

const Modal = ({ isOpen, onClose, children, title }) => {
  const { isDarkMode } = useDarkMode();
  const modalRef = React.useRef(null);

  // Close modal when pressing Escape key
  React.useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscapeKey);
    return () => document.removeEventListener("keydown", handleEscapeKey);
  }, [isOpen, onClose]);

  // Trap focus inside modal when open
  React.useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
      initialFocus={modalRef}
    >
      {/* Backdrop */}
      <div
        className={`fixed inset-0 ${
          isDarkMode ? "bg-black/70" : "bg-black/30"
        } backdrop-blur-sm transition-opacity duration-300 ease-in-out`}
        aria-hidden="true"
      />

      {/* Modal container */}
      <div className="fixed inset-0 flex items-center justify-center p-4 sm:p-2 overflow-y-auto">
        {/* Modal Panel */}
        <Dialog.Panel
          ref={modalRef}
          className={`w-full max-w-3xl rounded-xl ${
            isDarkMode
              ? "bg-zinc-900 text-gray-100 border-zinc-700"
              : "bg-white text-gray-900 border-gray-200"
          } shadow-2xl transition-transform duration-300 transform ${
            isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
          } focus:outline-none`}
          tabIndex={-1}
        >
          {/* Header */}
          <div
            className={`flex items-center justify-between px-4 py-0 ${
              isDarkMode
                ? "border-b border-zinc-700"
                : "border-b border-gray-200"
            }`}
          >
            {title && (
              <Dialog.Title className="text-lg font-semibold">
                {title}
              </Dialog.Title>
            )}
            <h2 className="text-2xl font-bold  py-4 px-4">Add New Job</h2>
            <button
              onClick={onClose}
              className={`ml-auto p-2 rounded-lg ${
                isDarkMode
                  ? "hover:bg-zinc-800 text-gray-400"
                  : "hover:bg-gray-100 text-gray-500"
              } transition-colors`}
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(100vh-12rem)]">
            {children}
          </div>

          {/* Footer 
          <div
            className={`px-4 py-2 ${
              isDarkMode
                ? "border-t border-zinc-700 bg-zinc-800/50"
                : "border-t border-gray-100 bg-gray-50"
            } rounded-b-xl`}
          >
           
          </div>*/}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};
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
                src="../../assets/images/avatar.jpg"
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
const AddJobForm = ({ onClose }) => {
  const { isDarkMode } = useDarkMode();
  const [jobDetails, setJobDetails] = useState({
    companyName: "",
    role: "",
    location: "",
    salary: "",
    type: "",
    description: "",
    requirements: "",
    skills: [],
    deadline: "",
    category: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSkillsChange = (e) => {
    const skillsArray = e.target.value
      .split(",")
      .map((skill) => skill.trim())
      .filter((skill) => skill);
    setJobDetails((prev) => ({
      ...prev,
      skills: skillsArray,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");

    console.log("Submitting job details:", jobDetails);

    // Validate required fields
    if (
      !jobDetails.companyName ||
      !jobDetails.role ||
      !jobDetails.location ||
      !jobDetails.salary ||
      !jobDetails.type ||
      !jobDetails.description ||
      !jobDetails.requirements ||
      !jobDetails.category
    ) {
      setErrorMessage("All fields are required.");
      setIsSubmitting(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      console.log("Token from localStorage:", token);

      // Format the job data according to backend API expectations
      const jobData = {
        title: jobDetails.role,
        companyName: jobDetails.companyName,
        location: jobDetails.location,
        salary: jobDetails.salary,
        jobType: jobDetails.type,
        description: jobDetails.description,
        requirements: jobDetails.requirements,
        skills: jobDetails.skills,
        category: jobDetails.category,
        deadline: jobDetails.deadline || undefined,
      };

      const response = await fetch(
        "http://localhost:5000/api/recruiters/jobs",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(jobData),
        }
      );

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to add job");
        }

        console.log("Job added successfully:", data);
        setSuccessMessage("Job added successfully!");

        // Reset form
        setJobDetails({
          companyName: "",
          role: "",
          location: "",
          salary: "",
          type: "",
          description: "",
          requirements: "",
          skills: [],
          deadline: "",
        });

        onClose();
      } else {
        const textResponse = await response.text();
        console.error("Non-JSON response:", textResponse);

        if (response.status === 401) {
          throw new Error("Authentication failed. Please log in again.");
        } else {
          throw new Error(
            `Server error: ${response.status} ${response.statusText}`
          );
        }
      }
    } catch (error) {
      console.error("Error adding job:", error.message);
      setErrorMessage(error.message || "An unexpected error occurred.");

      if (error.message.includes("Authentication failed")) {
        // Optional: redirect to login page
        // window.location.href = '/login';
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3  ">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Basic Job Information */}
        <div className=" p-1">
          <h3 className="text-lg font-semibold  mb-4  pb-2">
            Basic Job Information
          </h3>

          <div className="space-y-4">
            {/* Company Name */}
            <div>
              <label className="block text-sm font-medium  mb-1">
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="companyName"
                value={jobDetails.companyName}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg  ${
                  isDarkMode
                    ? "bg-black/70 text-white border-zinc-700"
                    : "bg-white text-black"
                }`}
                required
              />
            </div>

            {/* Job Title */}
            <div>
              <label className="block text-sm font-medium  mb-1">
                Job Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="role"
                value={jobDetails.role}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg  ${
                  isDarkMode
                    ? "bg-black/70 text-white border-zinc-700"
                    : "bg-white text-black"
                }`}
                required
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium  mb-1">
                Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="location"
                value={jobDetails.location}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg  ${
                  isDarkMode
                    ? "bg-black/70 text-white border-zinc-700"
                    : "bg-white text-black"
                }`}
                required
              />
            </div>

            {/* Salary */}
            <div>
              <label className="block text-sm font-medium  mb-1">
                Salary <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="salary"
                value={jobDetails.salary}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg  ${
                  isDarkMode
                    ? "bg-black/70 text-white border-zinc-700"
                    : "bg-white text-black"
                }`}
                required
                placeholder="e.g. $60,000 - $80,000"
              />
            </div>

            {/* Job Requirements */}
            <div>
              <label className="block text-sm font-medium  mb-1">
                Job Requirements <span className="text-red-500">*</span>
              </label>
              <textarea
                name="requirements"
                value={jobDetails.requirements}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg  ${
                  isDarkMode
                    ? "bg-black/70 text-white border-zinc-700"
                    : "bg-white text-black"
                }`}
                rows="4"
                required
                placeholder="List key qualifications and requirements"
              />
            </div>
          </div>
        </div>

        {/* Card 2: Additional Details */}
        <div className=" p-1 ">
          <h3 className="text-lg font-semibold  mb-4  pb-2">
            Additional Details
          </h3>

          <div className="space-y-4">
            {/* Job Type */}
            <div>
              <label className="block text-sm font-medium  mb-1">
                Job Type <span className="text-red-500">*</span>
              </label>
              <select
                name="type"
                value={jobDetails.type}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg  ${
                  isDarkMode
                    ? "bg-black/70 text-white border-zinc-700"
                    : "bg-white text-black"
                }`}
                required
              >
                <option value="">Select Job Type</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Remote">Remote</option>
              </select>
            </div>
            {/* Job Category */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Job Category <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="category"
                  value={jobDetails.category}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg appearance-none ${
                    isDarkMode
                      ? "bg-black/70 text-white border-zinc-700"
                      : "bg-white text-black"
                  }`}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Engineering">🛠️ Engineering</option>
                  <option value="Design">🎨 Design</option>
                  <option value="Marketing">📣 Marketing</option>
                  <option value="Sales">💼 Sales</option>
                  <option value="Product">📦 Product</option>
                  <option value="Support">🧑‍💻 Support</option>
                  <option value="Finance">💰 Finance</option>
                  <option value="HR">🧠 Human Resources</option>
                  <option value="IT">💻 IT</option>
                </select>
              </div>
            </div>

            {/* Skills */}
            <div>
              <label className="block text-sm font-medium  mb-1">
                Skills (comma separated)
              </label>
              <input
                type="text"
                value={jobDetails.skills.join(", ")}
                onChange={handleSkillsChange}
                className={`w-full px-4 py-2 border rounded-lg  ${
                  isDarkMode
                    ? "bg-black/70 text-white border-zinc-700"
                    : "bg-white text-black"
                }`}
                placeholder="e.g. React, TypeScript, Node.js"
              />
            </div>

            {/* Deadline */}
            <div>
              <label className="block text-sm font-medium  mb-1">
                Application Deadline
              </label>
              <input
                type="date"
                name="deadline"
                value={jobDetails.deadline}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg  ${
                  isDarkMode
                    ? "bg-black/70 text-white border-zinc-700"
                    : "bg-white text-black"
                }`}
              />
            </div>

            {/* Job Description */}
            <div>
              <label className="block text-sm font-medium  mb-1">
                Job Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={jobDetails.description}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg  ${
                  isDarkMode
                    ? "bg-black/70 text-white border-zinc-700"
                    : "bg-white text-black"
                }`}
                rows="4"
                required
                placeholder="Detailed job description and responsibilities"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Status Messages */}
      {successMessage && (
        <div className="p-4 bg-green-100 border-l-4 border-green-500 text-green-700 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-green-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm">{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm">{errorMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Form Actions */}
      <div className="flex justify-end space-x-4 mb-9">
        <button
          type="button"
          onClick={onClose}
          className="px-5 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium flex items-center"
        >
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Submitting...
            </>
          ) : (
            "Add Job"
          )}
        </button>
      </div>
    </form>
  );
};
const SidebarLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigation_menu = [
    {
      name: "Dashboard",
      href: "/dashboard/recuiter",
      icon: Menu,
      current: true,
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
      current: false,
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

  const { isDarkMode, toggleTheme } = useDarkMode();
  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "dark" : ""
      } transition-all duration-300 ease-in-out z-30 `}
    >
      <div className="flex h-screen bg-white dark:bg-black">
        {/* Sidebar */}
        <aside
          className={`fixed md:relative flex flex-col h-full bg-white dark:bg-black  border-gray-200 dark:border-gray-800
            transition-all duration-300 ease-in-out z-30
            ${isSidebarOpen ? "w-64" : "w-20"}`}
        >
          {/* Rest of the sidebar content remains the same, but update classes to use dark: prefix */}
          <div className="flex items-center justify-between p-5  border-gray-200 dark:border-gray-800 transition-all duration-300 ease-in-out z-30">
            <div className="flex items-center gap-3">
              <div className="p-2  rounded-lg">
                <Menu className="w-5 h-5 text-gray-600 dark:text-white transition-all duration-300 ease-in-out z-3 " />
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

          {/* Navigation - update classes for dark mode */}

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
          <header className="bg-white dark:bg-black  border-gray-200 dark:border-gray-800 sticky top-0 transition-all duration-300 ease-in-out z-30">
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
                    href: "/dashboard/AppliedCandidates",
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

          <div className="p-8">
            <div className="flex flex-col items-center justify-center min-h-[60vh] border-2 border-dashed rounded-xl text-center border-gray-300 dark:border-gray-700 p-8 shadow-lg bg-white dark:bg-zinc-950 transition-all duration-300 transform hover:scale-60 hover:shadow-2xl">
              <div className="p-4 bg-gradient-to-br from-blue-900 to-purple-900 rounded-full mb-6 animate-pulse">
                <PenTool className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 animate-fade-in">
                Create Your Next Job Opportunity
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md text-lg">
                Start building your dream team by adding a new job opening. Let
                the right talent find you today!
              </p>

              <button
                className="group flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full hover:bg-gradient-to-r hover:from-blue-700 hover:to-purple-700 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 animate-slide-up"
                onClick={() => setIsModalOpen(true)}
              >
                Post Job
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-2 transition-transform transform group-hover:translate-x-1"
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

              <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <AddJobForm onClose={() => setIsModalOpen(false)} />
              </Modal>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SidebarLayout;
