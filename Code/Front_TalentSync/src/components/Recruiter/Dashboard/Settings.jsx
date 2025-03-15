import React, { useState, useEffect } from "react";
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
} from "lucide-react";
import { Dialog } from "@headlessui/react";
import { Menu as HeadlessMenu } from "@headlessui/react";
import { BellIcon } from "@heroicons/react/24/outline";
import { MenuButton, MenuItem, MenuItems } from "@headlessui/react";
const NavLink = ({ href, icon: Icon, children, isActive }) => (
  <a
    href={href}
    className={`group flex items-center gap-3 px-3 py-2 rounded-lg  transition-all duration-300 ease-in-out z-30
      ${
        isActive
          ? "bg-zinc-200 text-black dark:bg-zinc-900 dark:text-white transition-all duration-300 ease-in-out z-30"
          : "text-gray-500 hover:bg-gray-100 hover:text-black dark:text-gray-400 dark:hover:bg-zinc-900  dark:hover:text-white "
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

const  SettingsComp = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Initialize dark mode based on system preference
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check if window is defined (client-side)
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

 const navigation_menu = [
     { name: "Dashboard", href: "/dashboard/recuiter", icon: Menu, current: false },
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
     { name: "Settings", href: "/dashboard/recuiter/Settings", icon: Settings, current: true },
     { name: "Support", href: "/dashboard/recuiter/jobbuilder", icon: Settings, current: false },
   ];

  // Handle system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => setIsDarkMode(e.matches);

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Apply dark mode class
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  // Theme toggle function
  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? "dark" : ""} `}>
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
              className="p-2 rounded-lg hover:bg-gray-100  dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

          <nav className="flex-1 overflow-y-auto p-4 space-y-8">
            <div className="space-y-3 ">
              <div className="text-sm font-medium text-gray-400 px-2 ">MENU</div>
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
              <div className="text-sm font-medium  text-gray-400 px-2">
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
                {/* Dark mode toggle */}
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label={
                    isDarkMode ? "Switch to light mode" : "Switch to dark mode"
                  }
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
          <div className="container mx-auto p-4 ">
      <div className=" rounded-lg shadow-sm ">
        {/* Header */}
        <div className="border-b">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-semibold dark:text-gray-200 text-gray-700 transition-all duration-300 ease-in-out z-30">Settings</h1>
                <p className="text-sm text-gray-500 transition-all duration-300 ease-in-out z-30">Manage account and website settings</p>
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
            <h2 className="text-lg font-medium mb-4 dark:text-gray-300 text-gray-700 transition-all duration-300 ease-in-out z-30">Personal Information</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-600 dark:text-gray-400 transition-all duration-300 ease-in-out z-30">
                  First Name
                </label>
                <input 
                  id="firstName"
                  type="text"
                  placeholder="Enter your first name"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 dark:bg-black text-black bg-gray-200 transition-all duration-300 ease-in-out z-30"
                  aria-required="true" 
                  
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-600 dark:text-gray-400 transition-all duration-300 ease-in-out z-30">
                  Last Name
                </label>
                <input 
                  id="lastName"
                  type="text"
                  placeholder="Enter your last name"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 dark:bg-black text-black bg-gray-200 transition-all duration-300 ease-in-out z-30"
                  aria-required="true"
                />
              </div>
            </div>
          </section>

          {/* Contact Information Section */}
          <section>
            <h2 className="text-lg font-medium mb-4 dark:text-gray-300  text-gray-700 transition-all duration-300 ease-in-out z-30">Contact Information</h2>
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-600 dark:text-gray-400 transition-all duration-300 ease-in-out z-30">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="your.email@domain.com"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 dark:bg-black text-black bg-gray-200 transition-all duration-300 ease-in-out z-30"
                aria-required="true"
              />
            </div>
          </section>

          {/* Profile Picture Section */}
          <section>
            <h2 className="text-lg font-medium mb-4 dark:text-gray-300 text-gray-700 transition-all duration-300 ease-in-out z-30">Profile Picture</h2>
            <div className="border-2 border-dashed rounded-lg p-6 text-center space-y-4 border-gray-400 dark:border-gray-200">
              <div className="mx-auto w-24 h-24 rounded-full bg-gray-50 flex items-center justify-center border-2 dark:border-gray-200">
                <Upload className="h-8 w-8 text-gray-400" />
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
            <h2 className="text-lg font-medium text-red-600 ">Delete Account </h2>
            <h3 className="  dark:text-gray-400 text-gray-500 mb-4 ">This is a danger zone - Be careful !</h3>
            <div className=" border border-red-200 rounded-lg p-4">
              <div className="flex gap-3">
                <AlertTriangle className="h-5 w-5 text-red-600  flex-shrink-0" />
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold dark:text-red-600  text-red-600 "> Are you sure ?
                    </h3>
                    <p className="text-sm dark:text-gray-400">
                      Permanently delete your TalentSync account. 
                      This action cannot be undone - please proceed with caution.
                    </p>
                  </div>
                  <button className="px-4 py-2 dark:text-red-200 text-red-100 border-2 border-red-500 rounded-lg hover:bg-red-600  bg-red-500 transition-colors">
                    Delete Account
                  </button>
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

export default SettingsComp;


