import { React, useState } from "react";
import {
  Search,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Twitter,
  Github,
  Linkedin,
  ChevronDown,
  X,
  LogIn,
  UserPlus,
  Users,
  Shield,
  ArrowLeft
} from "lucide-react";
import { useDarkMode } from "../../components/DarkModeProvider";
import CandidateLogin from "../candidat/Login/Login";
import CandidateSignup from "../candidat/Singup/Signup";
import RecruiterLogin from "../recruiter/Login/Login";
import RecruiterSignup from "../recruiter/Signup/Signup";
import { Dialog, DialogPanel } from "@headlessui/react";

import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
function BackButton({ isExpanded }) {
  return (
    <a
      onClick={() => window.history.back()}
      href="#" // Add href attribute to make it a proper anchor
      className="flex items-center p-2 rounded-lg text-gray-100 dark:text-gray-400 hover:bg-gray-800 dark:hover:bg-gray-800 hover:text-gray-100 dark:hover:text-gray-100 transition-colors cursor-pointer"
    >
      <ArrowLeft size={20} />
      {isExpanded && <span className="ml-2">Back</span>}
    </a>
  );
}
const BlogPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOneOpen, setIsModalOneOpen] = useState(false);
  const [isModalTwoOpen, setIsModalTwoOpen] = useState(false);
  const [isModalThreeOpen, setIsModalThreeOpen] = useState(false);
  const [isModalFourOpen, setIsModalFourOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useDarkMode();
  const Modal = ({ isOpen, onClose, children }) => {
    return (
      <Dialog open={isOpen} onClose={onClose} className="relative z-50">
        <div className="fixed inset-0 backdrop-blur-sm" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel
            className={`
    ${
      isDarkMode
        ? "dark bg-black text-white border-gray-900"
        : "bg-white text-black"
    } 
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
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const navigation = [
    { name: "Pricing", href: "/Pricing" },
    { name: "Blog", href: "/Blog" },
    { name: "About", href: "#about" },
  ];
  const handleClick = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      setShowWarning(true);
      setIsOpen(!isOpen);
      setTimeout(() => {
        setShowWarning(false);
      }, 10000);
    }
  };
  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "bg-zinc-900 text-white" : "bg-gray-50 text-black"
      }`}
    >
      {" "}
      {/* Blog Header */}
      <nav
        className={`fixed w-full z-50 backdrop-blur-sm bg-opacity-10 border-b ${
          isDarkMode ? "border-zinc-700" : "border-zinc-300"
        }`}
      >
        {" "}
        <div className="container mx-auto px-0 py-4">
          <div className="flex items-center justify-between">
            <a href="/" className="-m-1.5 pr-4">
            <nav className="flex-1 overflow-y-auto p-2">
            

           

            <div className="mt-0">
              <BackButton isExpanded={isSidebarOpen} />
            </div>
          </nav>
              <span className="sr-only">TalentSync</span>
            </a>
            <div className="flex items-center">
              <span className="text-2xl font-bold"></span>
            </div>

            <div className="flex lg:flex-1 text-2xl font-bold">TalentSync</div>
            <div className="flex lg:flex-1 lg:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="-m-2.5 inline-flex items-center justify-center rounded-md p-5 text-gray-700"
              >
                <span className="sr-only">Open main menu</span>
                <Bars3Icon aria-hidden="true" className="size-6" />
              </button>
            </div>
            <div className="flex justify-center">
              <div className="hidden lg:flex lg:gap-x-10">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-sm/6 font-semibold"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>

            <div className="hidden lg:flex lg:flex-1 lg:justify-end">
              <div className="relative ">
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
                      <CandidateLogin />
                    </Modal>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setIsModalThreeOpen(true);
                      }}
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
                      <CandidateSignup />
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
                      <RecruiterLogin />
                    </Modal>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setIsModalFourOpen(true);
                      }}
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
                      <RecruiterSignup />
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
              <button onClick={handleClick} className="text-sm/6 font-semibold">
                Start Now <span aria-hidden="true">&rarr;</span>
              </button>
              <Modal
                isOpen={isModalThreeOpen}
                onClose={() => setIsModalThreeOpen(false)}
              >
                <CandidateSignup />
              </Modal>
            </div>
          </div>
        </div>
      </nav>
      <header
        className={`py-16 md:py-24 ${
          isDarkMode
            ? "bg-gradient-to-r from-zinc-800 to-zinc-900"
            : "bg-gradient-to-r from-blue-600 to-purple-600"
        }`}
      >
        {" "}
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              TalentSync Blog
            </h1>
            <p className="text-lg text-blue-100 mb-8">
              Insights, guides, and best practices for tech interviews and
              career growth
            </p>
            <div className="relative max-w-xl mx-auto">
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white dark:bg-gray-800 rounded-full px-6 py-3 pl-12 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-700 dark:text-white"
              />
              <Search
                className="absolute left-4 top-3.5 text-gray-400"
                size={20}
              />
            </div>
          </div>
        </div>
      </header>
      {/* Featured Post */}
      <section className="container mx-auto px-4 max-w-6xl -mt-12 relative z-10">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 h-64 md:h-auto bg-gradient-to-br from-blue-400 to-purple-500 relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center text-white text-opacity-10 text-9xl font-bold">
                BLOG
              </div>
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/60 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6 md:p-8">
                <span className="bg-blue-600 text-white text-xs font-medium px-2.5 py-1 rounded">
                  FEATURED
                </span>
              </div>
            </div>
            <div className="md:w-1/2 p-6 md:p-8">
              <div className="flex items-center mb-4">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  April 10, 2025
                </span>
                <span className="mx-2 text-gray-300 dark:text-gray-600">•</span>
                <span className="text-sm text-blue-600 dark:text-blue-400">
                  Interview Tips
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                10 Essential System Design Concepts Every Developer Should Know
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Master the key concepts of distributed systems design that can
                help you ace your next technical interview and build scalable
                applications.
              </p>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium">
                    JD
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Jane Doe
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Senior Software Engineer
                  </p>
                </div>
                <div className="ml-auto">
                  <a
                    href="#read-more"
                    className="flex items-center text-blue-600 dark:text-blue-400 font-medium hover:text-blue-700 dark:hover:text-blue-300"
                  >
                    Read article
                    <ArrowRight size={16} className="ml-1" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Categories */}
      <section className="container mx-auto px-4 max-w-6xl mt-12">
        <div className="flex flex-wrap gap-2 mb-8">
          <CategoryButton text="All" active />
          <CategoryButton text="Interview Tips" />
          <CategoryButton text="System Design" />
          <CategoryButton text="Algorithms" />
          <CategoryButton text="Career Growth" />
          <CategoryButton text="Open Source" />
        </div>
      </section>
      {/* Blog Articles */}
      <section className="container mx-auto px-4 max-w-6xl pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ArticleCard
            title="How to Approach Behavioral Interview Questions"
            excerpt="Learn effective strategies to showcase your soft skills and stand out in behavioral interviews."
            category="Interview Tips"
            date="April 8, 2025"
            author="Alex Johnson"
            role="HR Specialist"
            initials="AJ"
          />

          <ArticleCard
            title="Building a Portfolio That Gets You Noticed"
            excerpt="Discover what recruiters are actually looking for in developer portfolios and how to make yours shine."
            category="Career Growth"
            date="April 5, 2025"
            author="Maria Garcia"
            role="Frontend Developer"
            initials="MG"
            gradientFrom="from-green-500"
            gradientTo="to-teal-600"
          />

          <ArticleCard
            title="Understanding Big O Notation: A Visual Guide"
            excerpt="A beginner-friendly explanation of algorithm complexity with intuitive visualizations."
            category="Algorithms"
            date="April 2, 2025"
            author="Thomas Wang"
            role="Algorithms Specialist"
            initials="TW"
            gradientFrom="from-amber-500"
            gradientTo="to-red-600"
          />

          <ArticleCard
            title="Contributing to Open Source: First Steps"
            excerpt="A step-by-step guide to making your first meaningful open source contribution."
            category="Open Source"
            date="March 28, 2025"
            author="Priya Sharma"
            role="Open Source Advocate"
            initials="PS"
            gradientFrom="from-indigo-500"
            gradientTo="to-purple-600"
          />

          <ArticleCard
            title="Effective Database Schema Design"
            excerpt="Learn how to design database schemas that are scalable, efficient, and maintainable."
            category="System Design"
            date="March 25, 2025"
            author="David Kim"
            role="Database Engineer"
            initials="DK"
            gradientFrom="from-cyan-500"
            gradientTo="to-blue-600"
          />

          <ArticleCard
            title="Mastering Asynchronous JavaScript"
            excerpt="Deep dive into promises, async/await, and handling complex asynchronous workflows."
            category="Technical Guides"
            date="March 22, 2025"
            author="Emma Wilson"
            role="JavaScript Developer"
            initials="EW"
            gradientFrom="from-yellow-500"
            gradientTo="to-orange-600"
          />
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-12">
          <nav className="inline-flex items-center">
            <a
              href="#prev"
              className="px-3 py-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
            >
              <ChevronLeft size={20} />
            </a>
            <a
              href="#page1"
              className="px-3 py-2 bg-blue-600 text-white rounded-md"
            >
              1
            </a>
            <a
              href="#page2"
              className="px-3 py-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
            >
              2
            </a>
            <a
              href="#page3"
              className="px-3 py-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
            >
              3
            </a>
            <span className="px-3 py-2 text-gray-500 dark:text-gray-400">
              ...
            </span>
            <a
              href="#page10"
              className="px-3 py-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
            >
              10
            </a>
            <a
              href="#next"
              className="px-3 py-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
            >
              <ChevronRight size={20} />
            </a>
          </nav>
        </div>
      </section>
      {/* Newsletter Section */}
      <section className=" py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-100 dark:text-white mb-4">
              Stay updated with our newsletter
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Get the latest articles, resources, and career tips delivered
              straight to your inbox.
            </p>
            <form className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-4 py-3 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
              />
              <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200">
                Subscribe
              </button>
            </form>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-zinc-900 dark:bg-zinc-950 text-gray-400 py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">
                TalentSync
              </h3>
              <p className="mb-4">
                Free and open source interview preparation platform for
                developers.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#twitter"
                  className="text-gray-400 hover:text-blue-400"
                >
                  <Twitter size={20} />
                </a>
                <a href="#github" className="text-gray-400 hover:text-white">
                  <Github size={20} />
                </a>
                <a
                  href="#linkedin"
                  className="text-gray-400 hover:text-blue-500"
                >
                  <Linkedin size={20} />
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4">
                Resources
              </h3>
              <ul className="space-y-2">
                <li>
                  <a href="#blog" className="hover:text-white">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#guides" className="hover:text-white">
                    Interview Guides
                  </a>
                </li>
                <li>
                  <a href="#questions" className="hover:text-white">
                    Practice Questions
                  </a>
                </li>
                <li>
                  <a href="#videos" className="hover:text-white">
                    Video Tutorials
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#about" className="hover:text-white">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#support" className="hover:text-white">
                    Support
                  </a>
                </li>
                <li>
                  <a href="#contribute" className="hover:text-white">
                    Contribute
                  </a>
                </li>
                <li>
                  <a href="#careers" className="hover:text-white">
                    Careers
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#privacy" className="hover:text-white">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#terms" className="hover:text-white">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#cookies" className="hover:text-white">
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p>
              &copy; {new Date().getFullYear()} TalentSync. All rights reserved.
            </p>
            <p className="mt-4 md:mt-0">
              Made with ❤️ by the open source community
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Helper components
function CategoryButton({ text, active }) {
  return (
    <button
      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
        active
          ? "bg-blue-600 text-white"
          : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
      }`}
    >
      {text}
    </button>
  );
}

function ArticleCard({
  title,
  excerpt,
  category,
  date,
  author,
  role,
  initials,
  gradientFrom = "from-blue-500",
  gradientTo = "to-purple-600",
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="h-3 bg-gradient-to-r from-blue-500 to-purple-600"></div>
      <div className="p-6">
        <div className="flex items-center mb-4">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {date}
          </span>
          <span className="mx-2 text-gray-300 dark:text-gray-600">•</span>
          <span className="text-sm text-blue-600 dark:text-blue-400">
            {category}
          </span>
        </div>

        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
          {title}
        </h3>

        <p className="text-gray-600 dark:text-gray-300 mb-6">{excerpt}</p>

        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div
              className={`w-8 h-8 rounded-full bg-gradient-to-r ${gradientFrom} ${gradientTo} flex items-center justify-center text-white text-sm font-medium`}
            >
              {initials}
            </div>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {author}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{role}</p>
          </div>
          <div className="ml-auto">
            <a
              href="#read-article"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogPage;
