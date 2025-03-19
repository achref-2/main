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
    company: "",
    role: "",
    location: "",
    salary: "",
    type: "",
    description: "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");
  
    console.log("Submitting job details:", jobDetails); // Debugging
  
    // Validate job details before sending the request
    if (
      !jobDetails.company ||
      !jobDetails.role ||
      !jobDetails.location ||
      !jobDetails.salary ||
      !jobDetails.type ||
      !jobDetails.description
    ) {
      setErrorMessage("All fields are required.");
      setIsSubmitting(false);
      return;
    }
  
    try {
      const token = localStorage.getItem("token"); // Retrieve the JWT token from localStorage
      const response = await fetch("http://localhost:5000/api/jobs/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
        body: JSON.stringify(jobDetails),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add job");
      }
  
      const data = await response.json();
      console.log("Job added successfully:", data); // Debugging
  
      setSuccessMessage("Job added successfully!");
      setJobDetails({
        company: "",
        role: "",
        location: "",
        salary: "",
        type: "",
        description: "",
      });
      onClose(); // Close the modal after successful submission
    } catch (error) {
      console.error("Error adding job:", error.message); // Debugging
      setErrorMessage(error.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add a New Job</h2>
      <input
        type="text"
        name="company"
        placeholder="Company Name"
        value={jobDetails.company}
        onChange={handleChange}
        className="w-full px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-300"
        required
      />
      <input
        type="text"
        name="role"
        placeholder="Job Role"
        value={jobDetails.role}
        onChange={handleChange}
        className="w-full px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-300"
        required
      />
      <input
        type="text"
        name="location"
        placeholder="Location"
        value={jobDetails.location}
        onChange={handleChange}
        className="w-full px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-300"
        required
      />
      <input
        type="text"
        name="salary"
        placeholder="Salary"
        value={jobDetails.salary}
        onChange={handleChange}
        className="w-full px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-300"
        required
      />
      <select
        name="type"
        value={jobDetails.type}
        onChange={handleChange}
        className="w-full px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-300"
        required
      >
        <option value="">Select Job Type</option>
        <option value="Full Time">Full Time</option>
        <option value="Part Time">Part Time</option>
      </select>
      <textarea
        name="description"
        placeholder="Job Description"
        value={jobDetails.description}
        onChange={handleChange}
        className="w-full px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-300"
        required
      />
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
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {isSubmitting ? "Submitting..." : "Add Job"}
        </button>
      </div>
      {successMessage && <p className="text-green-500">{successMessage}</p>}
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
    </form>
  );
};
const SidebarLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Initialize dark mode based on system preference
 

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

          {/* Premium Card - already has dark mode styling */}
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
        <main className="flex-1 overflow-auto bg-white dark:bg-black transition-all duration-300 ease-in-out z-30">
          {/* Header */}
          <header className="bg-white dark:bg-black  border-gray-200 dark:border-gray-800 sticky top-0 transition-all duration-300 ease-in-out z-30">
            <div className="flex items-center justify-between px-6 py-4">
              <SearchBar />
              <div className="flex items-center gap-4">
                {/* Notification button */}
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
          <div className="p-8">
            <div className="flex flex-col items-center justify-center min-h-[60vh] border-2 border-dashed rounded-lg text-center border-gray-400 dark:border-gray-800">
              <PenTool className="w-12 h-12 text-blue-500 mb-6" />
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Add a new Job
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md text-lg">
                Add a new job to your list and start recruiting today.
              </p>
              <button
                className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700"
                onClick={() => {
                  console.log("Opening modal..."); // Debugging
                  setIsModalOpen(true);
                }}
              >
                Add Job
              </button>
              <Modal isOpen={isModalOpen} onClose={() => {
                console.log("Closing modal..."); // Debugging
                setIsModalOpen(false);
              }}>
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
