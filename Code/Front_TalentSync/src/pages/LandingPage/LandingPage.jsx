import React, { useEffect } from "react";
import { Moon, Sun, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import "../LandingPage.css";
import { BlurText } from "./BlurText";
import { ShinyText } from "./Shiny";
import { Squares } from "./Squares";
import { X } from "lucide-react";
import { ChevronDown, LogIn, UserPlus, Users, Shield } from "lucide-react";
import { useDarkMode } from '../../components/DarkModeProvider';
import styled from 'styled-components';


import  CandidateLogin from "../../components/Candidat/Login/Login";
import CandidateSignup from "../../components/Candidat/Singup/Signup";
import RecruiterLogin from "../../components/Recruiter/Login/Login";
import RecruiterSignup from "../../components/Recruiter/Signup/Signup";

const LandingPage = ({ user }) => { 

  const { isDarkMode, toggleTheme } = useDarkMode();
 

  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);



  const navigation = [
    { name: "Pricing", href: "#" },
    { name: "Blog", href: "#" },
    { name: "About", href: "#" },
  ];

  const [isModalOneOpen, setIsModalOneOpen] = useState(false);
  const [isModalTwoOpen, setIsModalTwoOpen] = useState(false);
  const [isModalThreeOpen, setIsModalThreeOpen] = useState(false);
  const [isModalFourOpen, setIsModalFourOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const Modal = ({ isOpen, onClose, children }) => {
    return (
      <Dialog open={isOpen} onClose={onClose} className="relative z-50">
        <div className="fixed inset-0 backdrop-blur-sm" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel
  className={`
    ${isDarkMode ? "dark bg-black text-white border-gray-900" : "bg-white text-black"} 
 w-full max-w-md mx-auto backdrop-blur-sm rounded-2xl border border-gray-200  shadow-2xl 
    
  `}
>


            <div className="relative ">
              <button
                onClick={onClose}
                className="absolute right-4 top-4 p-1 text-zinc-500 hover:text-zinc-300 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="p-8">{children}</div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    );
  };
  const [showWarning, setShowWarning] = useState(false); // State to control the warning visibility

  const warning = () => (
    <div
      role="alert"
      className="fixed bottom-9 right-8 bg-yellow-100 dark:bg-yellow-900 border-l-4 border-yellow-500 dark:border-yellow-700 text-yellow-900 dark:text-yellow-100 p-4 rounded-lg flex items-center transition duration-300 ease-in-out hover:bg-yellow-200 dark:hover:bg-yellow-800 transform hover:scale-105 z-50"
    >
      <svg
        stroke="currentColor"
        viewBox="0 0 24 24"
        fill="none"
        className="h-5 w-5 flex-shrink-0 mr-2 text-yellow-600"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M13 16h-1v-4h1m0-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        ></path>
      </svg>
      <p className="text-xs font-semibold">
        Warning - Login before you start.
      </p>
    </div>
  );

  const handleClick = () => {
    if (user) {
      
      navigate('/dashboard');
    } else {
      // Show the warning if user is not logged in
      setShowWarning(true);
      setIsOpen(!isOpen);
      setTimeout(() => {
        setShowWarning(false); // Hide the warning after a few seconds
      }, 10000); // Adjust time as needed
    }
  };
  
  

 
  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "dark bg-black text-white" : "bg-white text-gray-900"
      }`}
    >
      
      <nav className="fixed w-full top-0 z-50 backdrop-blur-sm bg-opacity-90 border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <a href="#" className="-m-1.5 pr-3">
              <span className="sr-only">TalentSync</span>
              <img
                alt=""
                src="img/Logo2.png"
                className="h-9 w-auto rounded-lg"
              />
            </a>
            <div className="flex items-center">
              <span className="text-2xl font-bold">TalentSync</span>
            </div>

            <div className="flex lg:flex-1"></div>
            <div className="flex lg:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              >
                <span className="sr-only">Open main menu</span>
                <Bars3Icon aria-hidden="true" className="size-6" />
              </button>
            </div>
            <div className="hidden lg:flex lg:gap-x-12 ">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-sm/6 font-semibold "
                >
                  {item.name}
                </a>
              ))}
            </div>
            <div className="hidden lg:flex lg:flex-1 lg:justify-end">
              <div className="relative ">
                {/* Main Button */}
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="flex items-center space-x-2 px-4  hover:text-gray-500 dark:hover:text-gray-200 focus:outline-none"
                >
                  <span>Login</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {isOpen && (
                  <div
                    className={`absolute right-0 mt-2 w-56 border rounded-md shadow-lg py-1 z-50 bg-opacity-100 backdrop-blur-sm
                   ${
                     isDarkMode
                       ? "bg-black text-white bg-opacity-60"
                       : "bg-white bg-opacity-60 text-black"
                   }`}
                  >
                    <div className="px-4 py-2 text-sm  border-b">
                      Candidates
                    </div>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault(); 
                        setIsModalOneOpen(true);
                      }}
                      className={`flex items-center px-4 py-2 text-sm rounded-md transition ${
                        isDarkMode
                          ? "hover:bg-zinc-700 text-white bg-opacity-60"
                          : "hover:bg-zinc-300 text-black"
                      }`}
                    >
                      <LogIn className="w-4 h-4 mr-2" />
                      Candidate Login
                    </a>

                    <Modal
                      isOpen={isModalOneOpen}
                      onClose={() => setIsModalOneOpen(false)}
                    >
                      < CandidateLogin />
                    </Modal>
                    <a
                     href="#"
                     onClick={(e) => {
                       e.preventDefault(); 
                       setIsModalThreeOpen(true);}}
                      className={`flex items-center px-4 py-2 text-sm  ${
                        isDarkMode
                          ? " hover:bg-zinc-700 text-white bg-opacity-60"
                          : "hover:bg-zinc-300  text-black"
                      }`}
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Candidate Sign Up
                    </a>
                    <Modal
                      isOpen={isModalThreeOpen}
                      onClose={() => setIsModalThreeOpen(false)}
                    >
                      < CandidateSignup />
                    </Modal>
                    {/* Recruiter Section */}
                    <div className="px-4 py-2 text-sm  border-b border-t">
                      Recruiters
                    </div>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault(); 
                        setIsModalTwoOpen(true);
                      }}
                      className={`flex items-center px-4 py-2 text-sm rounded-md transition ${
                        isDarkMode
                          ? "hover:bg-zinc-700 text-white bg-opacity-60"
                          : "hover:bg-zinc-300 text-black"
                      }`}
                    >
                     
                      <Users className="w-4 h-4 mr-2" />
                      Recruiter Login
                    </a>
                    <Modal
                      isOpen={isModalTwoOpen}
                      onClose={() => setIsModalTwoOpen(false)}
                    >
                      < RecruiterLogin/>
                    </Modal>
                    <a
                     href="#"
                     onClick={(e) => {
                       e.preventDefault(); 
                       setIsModalFourOpen(true);}}
                      className={`flex items-center px-4 py-2 text-sm  ${
                        isDarkMode
                          ? " hover:bg-zinc-700 text-white bg-opacity-60"
                          : "hover:bg-zinc-300  text-black"
                      }`}
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Recruiter Sign Up
                    </a>
                    <Modal
                      isOpen={isModalFourOpen}
                      onClose={() => setIsModalFourOpen(false)}
                    >
                      <RecruiterSignup/>
                    </Modal>
                    <div className="px-4 py-2 text-sm  border-t">Admin</div>
                    <a
                      href="/admin"
                     
                      className={`flex items-center px-4 py-2 text-sm rounded-md transition ${
                        isDarkMode
                          ? "hover:bg-zinc-700 text-white bg-opacity-60"
                          : "hover:bg-zinc-300 text-black"
                      }`}
                    >
                    
                      <Shield className="w-4 h-4 mr-2" />
                      Admin Login
                    </a>
                  </div>
                )}
              </div>
              <button 
      onClick={handleClick}
      className="text-sm/6 font-semibold"
    >
      Start Now <span aria-hidden="true">&rarr;</span>
    </button>
    <Modal
                      isOpen={isModalThreeOpen}
                      onClose={() => setIsModalThreeOpen(false)}
                    >
                      < CandidateSignup />
                    </Modal>
            </div>
          </div>
        </div>
      </nav>

      <section>
        <header className="absolute inset-x-0 top-30 z-50">
          <Dialog
            open={mobileMenuOpen}
            onClose={setMobileMenuOpen}
            className="lg:hidden"
          >
            <div className="fixed inset-0 z-50" />
            <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
              <div className="flex items-center justify-between">
                <a href="#" className="-m-1.5 p-1.5">
                  <span className="sr-only">Your Company</span>
                  <img
                    alt=""
                    src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
                    className="h-8 w-auto"
                  />
                </a>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="-m-2.5 rounded-md p-2.5 text-gray-700"
                >
                  <span className="sr-only">Close menu</span>
                  <XMarkIcon aria-hidden="true" className="size-6" />
                </button>
              </div>
              <div className="mt-6 flow-root">
                <div className="-my-6 divide-y divide-gray-500/10 ">
                  <div className="space-y-2 py-6">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold  hover:bg-gray-50  "
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                  <div className="py-6 ">
                    <a
                      href="/candidate/login"
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold  hover:bg-gray-50 "
                    >
                      Log in
                    </a>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </Dialog>
        </header>

        <section className="relative py-24 sm:py-32 md:py-40 lg:py-52 xl:py-64 text-center">
          <div className="absolute inset-0 z-0  ">
            <Squares
              direction="down"
              speed={0}
              borderColor={isDarkMode ? "#555" : "#ccc"}
              hoverFillColor={isDarkMode ? "#222" : "#ddd"}
              theme={isDarkMode ? "dark" : "light"}
            />
          </div>
          <div className="relative max-w-2xl mx-auto">
            <h1 className="text-4xl sm:text-7xl font-bold ">
              <BlurText
                text="Land Your Dream Job With Us"
                delay={150}
                animateBy="words"
                direction="top"
              />
            </h1>
            <p className="mt-8 text-lg ">
              Get instant feedback, improve fast, and land your dream role. 95%
              of users increased confidence after just 3 sessions.
            </p>
            <div className="mt-10 flex justify-center gap-x-4">
            <a
                     href="#"
                     onClick={(e) => {
                       e.preventDefault(); 
                       setIsModalThreeOpen(true);}}>
    <StyledWrapper>
      <button className="button relative font-bold text-white dark:text-zinc-100" >
        Start For Free <span className="ml-1">→</span>
        <div className="hoverEffect">
          <div />
        </div>
      </button>
    </StyledWrapper>
  </a>
              
            </div>
            <div className="mt-4">
              <a   href="#"
                     onClick={(e) => {
                       e.preventDefault(); 
                       setIsModalFourOpen(true);}}
                       className="text-sm text-zinc-700 dark:text-zinc-300 hover:underline"

                       >
                    <Modal
                      isOpen={isModalFourOpen}
                      onClose={() => setIsModalFourOpen(false)}
                    >
                      <RecruiterSignup/>
                    </Modal>
              
              
                Are you a recruiter? Sign up here.
              </a>
            </div>
          </div>
        </section>
      </section>
      {showWarning && warning()}

      {/* About Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-12 text-center">About Us</h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-semibold mb-4">Our Mission</h3>
              <p className="text-lg mb-6">
                We're dedicated to helping professionals ace their interviews
                and land their dream jobs through AI-powered practice and
                personalized feedback.
              </p>
              <button className="border border-gray-300  px-6 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                Learn More
              </button>
            </div>
            <div className="h-64 rounded-lg">
              <div className="w-full h-full flex items-center justify-center">
                <img
                  src="/api/placeholder/400/320"
                  alt="About Us"
                  className="rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Projects</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="rounded-lg shadow-lg overflow-hidden">
                <div className="h-48 ">
                  <img
                    src={`/api/placeholder/${300 + item}/${200 + item}`}
                    alt={`Project ${item}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">Project {item}</h3>
                  <p className="">
                    Description of project {item}. Click to learn more about
                    this exciting initiative.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20  bg-white-800 ">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-12 text-center">Questions</h2>

          <div className="join join-vertical w-full">
            <div className="collapse collapse-arrow join-item border-base-300 border">
              <input type="radio" name="my-accordion-4" />
              <div className="collapse-title text-xl font-medium">
                Is TalentSync really free to use?
              </div>
              <div className="collapse-content">
                <p>
                  Yes! Entretien AI is completely free and open-source. We
                  believe everyone should have access to quality interview
                  preparation tools, regardless of their financial situation.
                </p>
              </div>
            </div>
            <div className="collapse collapse-arrow join-item border-base-300 border">
              <input type="radio" name="my-accordion-4" />
              <div className="collapse-title text-xl font-medium">
                Click to open this one and close others
              </div>
              <div className="collapse-content">
                <p>hello</p>
              </div>
            </div>
            <div className="collapse collapse-arrow join-item border-base-300 border">
              <input type="radio" name="my-accordion-4" />
              <div className="collapse-title text-xl font-medium">
                Click to open this one and close others
              </div>
              <div className="collapse-content">
                <p>hello</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className=" py-12">
<div class="space-y-2 p-4">
  <div
    role="alert"
    class="bg-green-100 dark:bg-green-900 border-l-4 border-green-500 dark:border-green-700 text-green-900 dark:text-green-100 p-2 rounded-lg flex items-center transition duration-300 ease-in-out hover:bg-green-200 dark:hover:bg-green-800 transform hover:scale-105"
  >
    <svg
      stroke="currentColor"
      viewBox="0 0 24 24"
      fill="none"
      class="h-5 w-5 flex-shrink-0 mr-2 text-green-600"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13 16h-1v-4h1m0-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        strokeWidth="2"
        strokelinejoin="round"
        strokelinecap="round"
      ></path>
    </svg>
    <p class="text-xs font-semibold">Success - Everything went smoothly!</p>
  </div>

  <div
    role="alert"
    class="bg-blue-100 dark:bg-blue-900 border-l-4 border-blue-500 dark:border-blue-700 text-blue-900 dark:text-blue-100 p-2 rounded-lg flex items-center transition duration-300 ease-in-out hover:bg-blue-200 dark:hover:bg-blue-800 transform hover:scale-105"
  >
    <svg
      stroke="currentColor"
      viewBox="0 0 24 24"
      fill="none"
      class="h-5 w-5 flex-shrink-0 mr-2 text-blue-600"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13 16h-1v-4h1m0-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        strokewidth="2"
        strokelinejoin="round"
        strokelinecap="round"
      ></path>
    </svg>
    <p class="text-xs font-semibold">
      Info - This is some information for you.
    </p>
  </div>

  <div
    role="alert"
    class="bg-yellow-100 dark:bg-yellow-900 border-l-4 border-yellow-500 dark:border-yellow-700 text-yellow-900 dark:text-yellow-100 p-2 rounded-lg flex items-center transition duration-300 ease-in-out hover:bg-yellow-200 dark:hover:bg-yellow-800 transform hover:scale-105"
  >
    <svg
      stroke="currentColor"
      viewBox="0 0 24 24"
      fill="none"
      class="h-5 w-5 flex-shrink-0 mr-2 text-yellow-600"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13 16h-1v-4h1m0-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        strokewidth="2"
        strokelinejoin="round"
        strokelinecap="round"
      ></path>
    </svg>
    <p class="text-xs font-semibold">
      Warning - Be careful with this next step.
    </p>
  </div>

  <div
    role="alert"
    class="bg-red-100 dark:bg-red-900 border-l-4 border-red-500 dark:border-red-700 text-red-900 dark:text-red-100 p-2 rounded-lg flex items-center transition duration-300 ease-in-out hover:bg-red-200 dark:hover:bg-red-800 transform hover:scale-105"
  >
    <svg
      stroke="currentColor"
      viewBox="0 0 24 24"
      fill="none"
      class="h-5 w-5 flex-shrink-0 mr-2 text-red-600"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13 16h-1v-4h1m0-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        strokewidth="2"
        strokelinejoin="round"
        strokelinecap="round"
      ></path>
    </svg>
    <p class="text-xs font-semibold">Error - Something went wrong.</p>
  </div>
</div>

        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-blue-500">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-500">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-500">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-blue-500">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-500">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-500">
                    Help Center
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-blue-500">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-500">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-500">
                    Security
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Connect</h4>

              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-blue-500">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-500">
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-500">
                    GitHub
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
  
  
          <div className="border-t mt-12 pt-8 flex justify-between items-center">
  <div className="flex-1 text-center ml-9 ">
    <p>&copy; 2025 TalentSync. All rights reserved.</p>
    
  </div>
  <button
      onClick={toggleTheme}
      className="flex items-center justify-between w-28 px-3 py-2 rounded-lg 
                 bg-zinc-200 dark:bg-zinc-800 
                 hover:bg-zinc-300 dark:hover:bg-zinc-700 
                 transition-colors duration-200"
      aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
    >
      <span className="text-zinc-900 dark:text-zinc-100 text-sm font-medium">
        {isDarkMode ? 'Dark' : 'Light'}
      </span>
      
      {isDarkMode ? (
        <Moon className="h-5 w-5 text-zinc-100" />
      ) : (
        <Sun className="h-5 w-5 text-zinc-900" />
      )}
    </button>
</div>

  


        </div>
      </footer>
    </div>

  );
 
};
const StyledWrapper = styled.div`
  .button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 15px 30px;
    border: none;
    position: relative;
    overflow: hidden;
    border-radius: 10rem;
    transition: all 0.2s ease;
    font-weight: bold;
    cursor: pointer;
    background: transparent;
    z-index: 0;
    box-shadow: 0 0 7px -5px rgba(0, 0, 0, 0.5);
  }

  .button:hover {
    background: rgb(193, 228, 248);
    color: rgb(33, 0, 85);
  }

  .button:active {
    transform: scale(0.97);
  }

  .hoverEffect {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: -1;
  }

  .hoverEffect div {
    background: linear-gradient(
      90deg,
      rgba(122, 0, 51, 1) 0%,
      rgba(131, 40, 180, 1) 49%,
      rgba(0, 162, 204, 1) 100%
    );
    border-radius: 40rem;
    width: 10rem;
    height: 10rem;
    transition: all 0.4s ease;
    filter: blur(20px);
    animation: effect 3s linear infinite;
    opacity: 0.85;
  }

  .button:hover .hoverEffect div {
    width: 7rem;
    height: 7rem;
  }

  @keyframes effect {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;





const StyledWrapper1 = styled.div`
  .theme-switch {
    --toggle-size: 15px;
    /* the size is adjusted using font-size,
       this is not transform scale,
       so you can choose any size */
    --container-width: 5.625em;
    --container-height: 2.5em;
    --container-radius: 6.25em;
    /* radius 0 - minecraft mode :) */
    --container-light-bg: #3D7EAE;
    --container-night-bg: #1D1F2C;
    --circle-container-diameter: 3.375em;
    --sun-moon-diameter: 2.125em;
    --sun-bg: #ECCA2F;
    --moon-bg: #C4C9D1;
    --spot-color: #959DB1;
    --circle-container-offset: calc((var(--circle-container-diameter) - var(--container-height)) / 2 * -1);
    --stars-color: #fff;
    --clouds-color: #F3FDFF;
    --back-clouds-color: #AACADF;
    --transition: .5s cubic-bezier(0, -0.02, 0.4, 1.25);
    --circle-transition: .3s cubic-bezier(0, -0.02, 0.35, 1.17);
  }

  .theme-switch, .theme-switch *, .theme-switch *::before, .theme-switch *::after {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-size: var(--toggle-size);
  }

  .theme-switch__container {
    width: var(--container-width);
    height: var(--container-height);
    background-color: var(--container-light-bg);
    border-radius: var(--container-radius);
    overflow: hidden;
    cursor: pointer;
    -webkit-box-shadow: 0em -0.062em 0.062em rgba(0, 0, 0, 0.25), 0em 0.062em 0.125em rgba(255, 255, 255, 0.94);
    box-shadow: 0em -0.062em 0.062em rgba(0, 0, 0, 0.25), 0em 0.062em 0.125em rgba(255, 255, 255, 0.94);
    -webkit-transition: var(--transition);
    -o-transition: var(--transition);
    transition: var(--transition);
    position: relative;
  }

  .theme-switch__container::before {
    content: "";
    position: absolute;
    z-index: 1;
    inset: 0;
    -webkit-box-shadow: 0em 0.05em 0.187em rgba(0, 0, 0, 0.25) inset, 0em 0.05em 0.187em rgba(0, 0, 0, 0.25) inset;
    box-shadow: 0em 0.05em 0.187em rgba(0, 0, 0, 0.25) inset, 0em 0.05em 0.187em rgba(0, 0, 0, 0.25) inset;
    border-radius: var(--container-radius)
  }

  .theme-switch__checkbox {
    display: none;
  }

  .theme-switch__circle-container {
    width: var(--circle-container-diameter);
    height: var(--circle-container-diameter);
    background-color: rgba(255, 255, 255, 0.1);
    position: absolute;
    left: var(--circle-container-offset);
    top: var(--circle-container-offset);
    border-radius: var(--container-radius);
    -webkit-box-shadow: inset 0 0 0 3.375em rgba(255, 255, 255, 0.1), inset 0 0 0 3.375em rgba(255, 255, 255, 0.1), 0 0 0 0.625em rgba(255, 255, 255, 0.1), 0 0 0 1.25em rgba(255, 255, 255, 0.1);
    box-shadow: inset 0 0 0 3.375em rgba(255, 255, 255, 0.1), inset 0 0 0 3.375em rgba(255, 255, 255, 0.1), 0 0 0 0.625em rgba(255, 255, 255, 0.1), 0 0 0 1.25em rgba(255, 255, 255, 0.1);
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-transition: var(--circle-transition);
    -o-transition: var(--circle-transition);
    transition: var(--circle-transition);
    pointer-events: none;
  }

  .theme-switch__sun-moon-container {
    pointer-events: auto;
    position: relative;
    z-index: 2;
    width: var(--sun-moon-diameter);
    height: var(--sun-moon-diameter);
    margin: auto;
    border-radius: var(--container-radius);
    background-color: var(--sun-bg);
    -webkit-box-shadow: 0.062em 0.062em 0.062em 0em rgba(254, 255, 239, 0.61) inset, 0em -0.062em 0.062em 0em #a1872a inset;
    box-shadow: 0.062em 0.062em 0.062em 0em rgba(254, 255, 239, 0.61) inset, 0em -0.062em 0.062em 0em #a1872a inset;
    -webkit-filter: drop-shadow(0.062em 0.125em 0.125em rgba(0, 0, 0, 0.25)) drop-shadow(0em 0.062em 0.125em rgba(0, 0, 0, 0.25));
    filter: drop-shadow(0.062em 0.125em 0.125em rgba(0, 0, 0, 0.25)) drop-shadow(0em 0.062em 0.125em rgba(0, 0, 0, 0.25));
    overflow: hidden;
    -webkit-transition: var(--transition);
    -o-transition: var(--transition);
    transition: var(--transition);
  }

  .theme-switch__moon {
    -webkit-transform: translateX(100%);
    -ms-transform: translateX(100%);
    transform: translateX(100%);
    width: 100%;
    height: 100%;
    background-color: var(--moon-bg);
    border-radius: inherit;
    -webkit-box-shadow: 0.062em 0.062em 0.062em 0em rgba(254, 255, 239, 0.61) inset, 0em -0.062em 0.062em 0em #969696 inset;
    box-shadow: 0.062em 0.062em 0.062em 0em rgba(254, 255, 239, 0.61) inset, 0em -0.062em 0.062em 0em #969696 inset;
    -webkit-transition: var(--transition);
    -o-transition: var(--transition);
    transition: var(--transition);
    position: relative;
  }

  .theme-switch__spot {
    position: absolute;
    top: 0.75em;
    left: 0.312em;
    width: 0.75em;
    height: 0.75em;
    border-radius: var(--container-radius);
    background-color: var(--spot-color);
    -webkit-box-shadow: 0em 0.0312em 0.062em rgba(0, 0, 0, 0.25) inset;
    box-shadow: 0em 0.0312em 0.062em rgba(0, 0, 0, 0.25) inset;
  }

  .theme-switch__spot:nth-of-type(2) {
    width: 0.375em;
    height: 0.375em;
    top: 0.937em;
    left: 1.375em;
  }

  .theme-switch__spot:nth-last-of-type(3) {
    width: 0.25em;
    height: 0.25em;
    top: 0.312em;
    left: 0.812em;
  }

  .theme-switch__clouds {
    width: 1.25em;
    height: 1.25em;
    background-color: var(--clouds-color);
    border-radius: var(--container-radius);
    position: absolute;
    bottom: -0.625em;
    left: 0.312em;
    -webkit-box-shadow: 0.937em 0.312em var(--clouds-color), -0.312em -0.312em var(--back-clouds-color), 1.437em 0.375em var(--clouds-color), 0.5em -0.125em var(--back-clouds-color), 2.187em 0 var(--clouds-color), 1.25em -0.062em var(--back-clouds-color), 2.937em 0.312em var(--clouds-color), 2em -0.312em var(--back-clouds-color), 3.625em -0.062em var(--clouds-color), 2.625em 0em var(--back-clouds-color), 4.5em -0.312em var(--clouds-color), 3.375em -0.437em var(--back-clouds-color), 4.625em -1.75em 0 0.437em var(--clouds-color), 4em -0.625em var(--back-clouds-color), 4.125em -2.125em 0 0.437em var(--back-clouds-color);
    box-shadow: 0.937em 0.312em var(--clouds-color), -0.312em -0.312em var(--back-clouds-color), 1.437em 0.375em var(--clouds-color), 0.5em -0.125em var(--back-clouds-color), 2.187em 0 var(--clouds-color), 1.25em -0.062em var(--back-clouds-color), 2.937em 0.312em var(--clouds-color), 2em -0.312em var(--back-clouds-color), 3.625em -0.062em var(--clouds-color), 2.625em 0em var(--back-clouds-color), 4.5em -0.312em var(--clouds-color), 3.375em -0.437em var(--back-clouds-color), 4.625em -1.75em 0 0.437em var(--clouds-color), 4em -0.625em var(--back-clouds-color), 4.125em -2.125em 0 0.437em var(--back-clouds-color);
    -webkit-transition: 0.5s cubic-bezier(0, -0.02, 0.4, 1.25);
    -o-transition: 0.5s cubic-bezier(0, -0.02, 0.4, 1.25);
    transition: 0.5s cubic-bezier(0, -0.02, 0.4, 1.25);
  }

  .theme-switch__stars-container {
    position: absolute;
    color: var(--stars-color);
    top: -100%;
    left: 0.312em;
    width: 2.75em;
    height: auto;
    -webkit-transition: var(--transition);
    -o-transition: var(--transition);
    transition: var(--transition);
  }

  /* actions */

  .theme-switch__checkbox:checked + .theme-switch__container {
    background-color: var(--container-night-bg);
  }

  .theme-switch__checkbox:checked + .theme-switch__container .theme-switch__circle-container {
    left: calc(100% - var(--circle-container-offset) - var(--circle-container-diameter));
  }

  .theme-switch__checkbox:checked + .theme-switch__container .theme-switch__circle-container:hover {
    left: calc(100% - var(--circle-container-offset) - var(--circle-container-diameter) - 0.187em)
  }

  .theme-switch__circle-container:hover {
    left: calc(var(--circle-container-offset) + 0.187em);
  }

  .theme-switch__checkbox:checked + .theme-switch__container .theme-switch__moon {
    -webkit-transform: translate(0);
    -ms-transform: translate(0);
    transform: translate(0);
  }

  .theme-switch__checkbox:checked + .theme-switch__container .theme-switch__clouds {
    bottom: -4.062em;
  }

  .theme-switch__checkbox:checked + .theme-switch__container .theme-switch__stars-container {
    top: 50%;
    -webkit-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    transform: translateY(-50%);
  }`;
export default LandingPage;
