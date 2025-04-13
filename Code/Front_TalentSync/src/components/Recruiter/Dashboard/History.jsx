import React, { useState, useEffect } from 'react';
import { Menu, History, PlusSquare, Settings, CreditCard, PenTool, Moon, Sun, 
  ChevronLeft, ChevronRight, Search, FileText, Download, Loader2, Calendar, Wrench, FlaskConical } from 'lucide-react';
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




const SearchBar = ({ navigationMenu, navigationOption }) => {
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
const AppliedCandidatesContent = () => {
  const [candidates, setCandidates] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAppliedCandidates();
  }, []);

  const fetchAppliedCandidates = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/recruiters/candidates/applied', {
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
        console.log("Fetched applied candidates:", data);
        setCandidates(data);
      } catch (jsonError) {
        throw new Error("Invalid JSON response received.");
      }
    } catch (err) {
      console.error("Error fetching applied candidates:", err);
      setError('Failed to load applied candidates');
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {candidates.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No applied candidates found
        </div>
      ) : (
        <div className="grid gap-4">
          {candidates.map((candidate, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="space-y-1">
                <div className="font-medium text-gray-900 dark:text-white">
                  {candidate.name}
                </div>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Calendar className="h-4 w-4 mr-1" />
                  Applied on: {new Date(candidate.appliedDate).toLocaleString()}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.open(candidate.cvPath, '_blank')}
                  className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  View CV
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const SidebarLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { isDarkMode, toggleTheme } = useDarkMode(); // Use the hook
const navigation_menu = [
    { name: "Dashboard", href: "/dashboard/recuiter", icon: Menu, current: false },
    {
      name: "History",
      href: "/dashboard/recuiter/history",
      icon: History,
      current: true,
    },
    { name: "Job List", href: "/dashboard/recuiter/joblist", icon: Menu, current: false },
    { name: "Billing", href: "/Pricing", icon: PlusSquare, current: false },
  ];
  const navigation_option = [
    { name: "Settings", href: "/dashboard/recuiter/settings", icon: Settings, current: false },
    { name: "Support", href: "/dashboard/recuiter/jobbuilder", icon: Settings, current: false },
  ];

  useEffect(() => {
    // Ensure the dark class is applied globally
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);
  const [candidates, setCandidates] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAppliedCandidates();
  }, []);

  const fetchAppliedCandidates = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/recruiters/candidates/applied', {
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
        console.log("Fetched applied candidates:", data);
        setCandidates(data);
      } catch (jsonError) {
        throw new Error("Invalid JSON response received.");
      }
    } catch (err) {
      console.error("Error fetching applied candidates:", err);
      setError('Failed to load applied candidates');
    }
  };
  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <div className="flex h-screen bg-white dark:bg-black">
        {/* Sidebar */}
        <aside
          className={`fixed md:relative flex flex-col h-full bg-white dark:bg-black  border-gray-200 dark:border-gray-800
            transition-all duration-300 ease-in-out z-30
            ${isSidebarOpen ? 'w-64' : 'w-20'}`}
        >
          <div className="flex items-center justify-between p-5  border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg">
                <Menu className="w-5 h-5 text-gray-600 dark:text-white transition-all duration-300 ease-in-out z-3 " />
              </div>
              {isSidebarOpen && (
                <span className="text-lg font-semibold text-gray-900 dark:text-white transition-all duration-300 ease-in-out z-">TalentSync</span>
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
  <header className="bg-white dark:bg-black border-gray-200 dark:border-gray-800 sticky top-0 transition-all duration-300 ease-in-out z-30">
    <div className="flex items-center justify-between px-6 py-4">
      <SearchBar
        navigationMenu={[
          { name: "Dashboard", href: "/dashboard/recuiter", icon: Menu },
          { name: "History", href: "/dashboard/recuiter/history", icon: History },
          { name: "Job List", href: "/dashboard/recuiter/joblist", icon: Menu },
          { name: "Billing", href: "/Pricing", icon: PlusSquare },
        ]}
        navigationOption={[
          { name: "Settings", href: "/dashboard/recuiter/settings", icon: Settings },
          { name: "Support", href: "/dashboard/recuiter/jobbuilder", icon: Wrench },
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
  <div className="p-6 space-y-6 transition-all duration-300 ease-in-out z-30">
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white transition-all duration-300 ease-in-out z-30">Applied Candidates</h1>
      <p className="text-gray-500 dark:text-gray-400 transition-all duration-300 ease-in-out z-30">View and manage candidates who applied to your jobs</p>
    </div>
    <AppliedCandidatesContent className="transition-all duration-300 ease-in-out z-30" />
  </div>
</main>
      </div>
    </div>
  );
};

export default SidebarLayout;