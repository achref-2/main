import React, { useState, useEffect } from 'react';
import { Menu, History, PlusSquare, Settings, CreditCard, PenTool, Moon, Sun, 
  ChevronLeft, ChevronRight, Search, FileText, Download, Loader2, Calendar } from 'lucide-react';
import { Menu as HeadlessMenu } from '@headlessui/react';
import { BellIcon } from '@heroicons/react/24/outline';
import { MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { useDarkMode } from "../../DarkModeProvider"; // Import the hook
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
const CVHistoryContent = () => {
  const [history, setHistory] = useState([]);
 
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCVHistory();
  }, []);

  const fetchCVHistory = async () => {
    try {
        const response = await fetch('http://localhost:5000/api/cv-history', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        const text = await response.text(); 
        console.log("Raw response text:", text);

        if (!response.ok) {
            throw new Error(`HTTP Error! Status: ${response.status}`);
        }

        try {
            const data = JSON.parse(text); 
            console.log("Fetched CV history:", data);
            setHistory(data);
        } catch (jsonError) {
            throw new Error("Invalid JSON response received.");
        }
    } catch (err) {
        console.error("Error fetching CV history:", err);
        setError('Failed to load CV history');
    }
};





fetch('/api/cv-history', {
  method: 'GET',
  headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
})
.then(res => res.json())
.then(console.log)
.catch(console.error);


  const handleDownload = async (cvPath, fileName) => {
    try {
      const response = await fetch(cvPath);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName || 'cv-document';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to download CV');
    }
  };

 

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {history.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No CV upload history found
        </div>
      ) : (
        <div className="grid gap-4">
          {history.map((cv, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:lue-500 dark:hover:lue-500 transition-colors"
            >
              <div className="space-y-1">
                <div className="font-medium text-gray-900 dark:text-white">
                  CV Version {history.length - index}
                </div>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(cv.uploadDate).toLocaleString()}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownload(cv.cvPath, `cv-${cv.uploadDate}.pdf`)}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  Download
                </button>
                
                <button
                  onClick={() => window.open(cv.cvPath, '_blank')}
                  className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Reuse your existing components

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

const SidebarLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { isDarkMode, toggleTheme } = useDarkMode(); // Use the hook

  const navigation_menu = [
    { name: 'Dashboard', href: '/dashboard', icon: Menu, current: false},
    { name: 'History', href: '/dashboard/history', icon: History, current: true },
    { name: "Job List", href: "/JobList", icon: Menu, current:false },
    { name: 'Billing', href: '/Pricing', icon: PlusSquare, current: false }
  ];
  
  const navigation_option = [
    { name: 'Settings', href: '/Settings', icon: Settings, current: false },
    { name: 'Support', href: '#', icon: Settings, current: false }
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
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
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
              <div className="text-sm font-medium text-gray-400 px-2">OPTIONS</div>
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
        <main className="flex-1 overflow-auto bg-gray-50 dark:bg-black transition-all duration-300 ease-in-out z-30">
          {/* Header */}
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

          {/* Main Content Area */}
          <div className="p-6 space-y-6 transition-all duration-300 ease-in-out z-30">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white transition-all duration-300 ease-in-out z-30">CV History</h1>
              <p className="text-gray-500 dark:text-gray-400 transition-all duration-300 ease-in-out z-30">View and manage your CV uploads</p>
            </div>
            <CVHistoryContent className="transition-all duration-300 ease-in-out z-30"/>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SidebarLayout;