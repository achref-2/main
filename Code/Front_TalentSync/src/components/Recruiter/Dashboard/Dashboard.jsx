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
  X,
} from "lucide-react";
import { Dialog } from "@headlessui/react";
import { Menu as HeadlessMenu } from "@headlessui/react";
import { BellIcon } from "@heroicons/react/24/outline";
import { MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import CV from "./CV/CvCreation";
import { useDarkMode } from '../../DarkModeProvider';
import { Link } from 'react-router-dom';

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




const Modal = ({ isOpen, onClose, children }) => (
  <Dialog open={isOpen} onClose={onClose} className="relative z-50">
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
    <div className="fixed inset-0 flex items-center justify-center p-4">
      <Dialog.Panel className="w-full max-w-3xl rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-xl">
        <div className="flex justify-end p-4">
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </Dialog.Panel>
    </div>
  </Dialog>
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
 

  const handleSignout = () => {
    localStorage.removeItem('token');
        fetch('http://localhost:5000/api/auth/logout', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    })
    .then(() => {
      window.location.href = '/';
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
         ${isDarkMode ? "bg-zinc-900 text-white bg-opacity-100 border-zinc-400" : "bg-zinc-200 text-black bg-opacity-5  border-zinc-700"} backdrop-blur-sm`}
     >
       {menuItems.map(({ label, href }) => (
         <MenuItem key={label}>
           {({ active }) => (
          <a
          href={href}
          className={`block px-4 py-2 text-sm  border-b-2 border-dashed ${
            active 
              ? isDarkMode 
                ? "bg-zinc-900 text-white "  // Dark mode: Different active bg color
                : "bg-zinc-300 text-black border-zinc-500"  // Light mode: Default active color
              : isDarkMode 
                ? "bg-zinc-950 text-zinc-100 border-zinc-400"  // Dark mode: Normal state
                : "text-black border-zinc-600 "  // Light mode: Normal state
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
                 ? "bg-zinc-900 text-white "  // Dark mode: Different active bg color
                 : "bg-zinc-300 text-black border-zinc-500"  // Light mode: Default active color
               : isDarkMode 
                 ? "bg-zinc-950 text-zinc-100 border-zinc-400"  // Dark mode: Normal state
                 : "text-black border-zinc-600"  // Light mode: Normal state
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
                 ? "bg-zinc-900 text-white"  // Dark mode: Active bg color
                 : "bg-zinc-300 text-black"  // Light mode: Active bg color
               : isDarkMode
               ? "bg-zinc-950 text-zinc-100 border-zinc-400"  // Dark mode: Normal state
               : "text-black"  // Light mode: Normal state
           }`}
           aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
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
const AddJobForm = ({ onClose }) => {
  const [jobDetails, setJobDetails] = useState({
    companyName: "",
    role: "",
    location: "",
    salary: "",
    type: "",
    description: "",
    requirements: "",
    skills: [], // Added skills array
    deadline: "" // Added deadline field
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

  // For handling skills input (comma separated)
  const handleSkillsChange = (e) => {
    const skillsArray = e.target.value.split(',').map(skill => skill.trim()).filter(skill => skill);
    setJobDetails(prev => ({
      ...prev,
      skills: skillsArray
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
      !jobDetails.requirements
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
        deadline: jobDetails.deadline || undefined
      };
      
      // Updated endpoint to match backend route
      const response = await fetch("http://localhost:5000/api/recruiters/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(jobData),
      });
  
      // Check the content type of the response
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        // It's a JSON response
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
          deadline: ""
        });
        
        onClose();
      } else {
        // It's not a JSON response (probably HTML)
        const textResponse = await response.text();
        console.error("Non-JSON response:", textResponse);
        
        // Check if it's an authentication issue
        if (response.status === 401) {
          throw new Error("Authentication failed. Please log in again.");
        } else {
          throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }
      }
    } catch (error) {
      console.error("Error adding job:", error.message);
      setErrorMessage(error.message || "An unexpected error occurred.");
      
      // If it's an authentication error, redirect to login
      if (error.message.includes("Authentication failed")) {
        // Optional: redirect to login page
        // window.location.href = '/login';
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add a New Job</h2>
      {/* Company Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Company Name
        </label>
        <input
          type="text"
          name="companyName"
          value={jobDetails.companyName}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-300"
          required
        />
      </div>
      
      {/* Job Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Job Title
        </label>
        <input
          type="text"
          name="role"
          value={jobDetails.role}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-300"
          required
        />
      </div>
      
      {/* Job Requirements */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Job Requirements
        </label>
        <textarea
          name="requirements"
          value={jobDetails.requirements}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-300"
          required
        />
      </div>
      
      {/* Location */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Location
        </label>
        <input
          type="text"
          name="location"
          value={jobDetails.location}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-300"
          required
        />
      </div>
      
      {/* Salary */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Salary
        </label>
        <input
          type="text"
          name="salary"
          value={jobDetails.salary}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-300"
          required
        />
      </div>
      
      {/* Job Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Job Type
        </label>
        <select
          name="type"
          value={jobDetails.type}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-300"
          required
        >
          <option value="">Select Job Type</option>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Contract">Contract</option>
          <option value="Remote">Remote</option>
        </select>
      </div>
      
      {/* Skills */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Skills (comma separated)
        </label>
        <input
          type="text"
          value={jobDetails.skills.join(', ')}
          onChange={handleSkillsChange}
          className="w-full px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-300"
        />
      </div>
      
      {/* Deadline */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Application Deadline
        </label>
        <input
          type="date"
          name="deadline"
          value={jobDetails.deadline}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-300"
        />
      </div>
      
      {/* Job Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Job Description
        </label>
        <textarea
          name="description"
          value={jobDetails.description}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-300 h-32"
          required
        />
      </div>
      
      {/* Form Actions */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-300 rounded-lg"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? "Submitting..." : "Add Job"}
        </button>
      </div>
      
      {/* Status Messages */}
      {successMessage && (
        <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {errorMessage}
        </div>
      )}
    </form>
  );
};
const SidebarLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
 

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



  const { isDarkMode, toggleTheme } = useDarkMode();
  return (
    <div className={`min-h-screen ${isDarkMode ? "dark" : ""} transition-all duration-300 ease-in-out z-30 `}>
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

        <main className="flex-1 overflow-auto bg-white dark:bg-black transition-all duration-300 ease-in-out z-30">
          <header className="bg-white dark:bg-black  border-gray-200 dark:border-gray-800 sticky top-0 transition-all duration-300 ease-in-out z-30">
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

          <div className="p-8">
          <div className="flex flex-col items-center justify-center min-h-[60vh] border-2 border-dashed rounded-xl text-center border-gray-300 dark:border-gray-700 p-8 shadow-lg bg-white dark:bg-zinc-950 transition-all duration-300 transform hover:scale-60 hover:shadow-2xl">
                     <div className="p-4 bg-gradient-to-br from-blue-900 to-purple-900 rounded-full mb-6 animate-pulse">
                       <PenTool className="w-12 h-12 text-white" />
                     </div>
                       <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 animate-fade-in">
                       Add a new Job
                     </h1>
                       <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md text-lg">
                       Add a new job to your list and start recruiting today.

                       </p>
         
                       <button
                       className="group flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full hover:bg-gradient-to-r hover:from-blue-700 hover:to-purple-700 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 animate-slide-up"
                       onClick={() => setIsModalOpen(true)}
                     >
                     Add New Job
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
         
                   <Modal
                     isOpen={isModalOpen}
                     onClose={() => setIsModalOpen(false)}
                    
                   >
                     <CV />
                   </Modal>
         
                     </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SidebarLayout;
