import { React, useState, useEffect } from "react";
import {
  Coffee,
  Github,
  Star,
  Menu,
  Heart,
  Code,
  ExternalLink,
  ChevronRight,
  ArrowLeft,
  Share2,
  MessageSquare,
  AlertTriangle,
  Sun,
  Moon
} from "lucide-react";

import { useDarkMode } from "../../components/DarkModeProvider";

// Helper components
function BackButton({ isExpanded }) {
  const { isDarkMode } = useDarkMode();
  return (
    <a
      onClick={() => window.history.back()}
      href="#"
      className={`flex items-center p-2 rounded-lg ${
        isDarkMode ? "text-gray-400 hover:bg-gray-800 hover:text-gray-100" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
      } transition-colors cursor-pointer`}
    >
      <ArrowLeft size={20} />
      {isExpanded && <span className="ml-3">Back</span>}
    </a>
  );
}

function SupportButton({ href, icon: Icon, text }) {
  const { isDarkMode } = useDarkMode();
  return (
    <a
      href={href}
      className={`${
        isDarkMode ? "bg-gray-800/70 hover:bg-gray-700/70 text-gray-200 border-gray-700 hover:border-gray-600" : "bg-gray-200/70 hover:bg-gray-300/70 text-gray-800 border-gray-300 hover:border-gray-400"
      } px-5 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 border`}
    >
      <Icon size={16} />
      <span>{text}</span>
    </a>
  );
}

const SupportSection = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  
  // Apply dark mode class to body element
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className={`${isDarkMode ? "dark" : ""} transition-colors duration-300`}>
      <div className={`flex h-screen ${isDarkMode ? "bg-gray-900" : "bg-white"}`}>
        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className={`${isDarkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"} border-b sticky top-0 z-30`}>
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                {/* Mobile sidebar toggle */}
                <button
                  className={`md:hidden p-2 rounded-lg ${
                    isDarkMode ? "hover:bg-gray-800 text-gray-400" : "hover:bg-gray-100 text-gray-500"
                  }`}
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                >
                  <BackButton isExpanded={isSidebarOpen} />
                </button>

                {/* Breadcrumb */}
                <nav className={`hidden sm:flex items-center text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  <nav className="flex-1 overflow-y-auto p-2">
                    <div className="mt-0">
                      <BackButton isExpanded={isSidebarOpen} />
                    </div>
                  </nav>
                  <ChevronRight size={16} className="mx-1" />
                  <span className={`font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                    Support
                  </span>
                </nav>
              </div>
              
              {/* Dark mode toggle button */}
             
            </div>
          </header>

          {/* Main scrollable content */}
          <main className={`flex-1 overflow-auto ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
            {/* Content section */}
            <div className={`${
              isDarkMode 
                ? "bg-gradient-to-b from-gray-900 to-gray-950" 
                : "bg-gradient-to-b from-white to-gray-100"
              } min-h-screen flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden`}>
              
              {/* Background decorations */}
              <div className="absolute inset-0 overflow-hidden">
                <div className={`absolute top-0 left-1/4 w-64 h-64 bg-blue-500 opacity-${isDarkMode ? "10" : "5"} rounded-full filter blur-3xl`}></div>
                <div className={`absolute bottom-1/4 right-1/3 w-80 h-80 bg-purple-600 opacity-${isDarkMode ? "10" : "5"} rounded-full filter blur-3xl`}></div>
                <div className={`absolute top-1/3 right-1/4 w-60 h-60 bg-indigo-500 opacity-${isDarkMode ? "10" : "5"} rounded-full filter blur-3xl`}></div>
              </div>

              {/* Floating code symbols */}
              <div className={`absolute top-20 left-20 ${isDarkMode ? "text-gray-700" : "text-gray-300"} opacity-20 text-6xl`}>
                &lt;/&gt;
              </div>
              <div className={`absolute bottom-20 right-20 ${isDarkMode ? "text-gray-700" : "text-gray-300"} opacity-20 text-6xl`}>{`{}`}</div>

              {/* Header Section */}
              <div className="relative z-10 text-center mb-16 max-w-3xl">
                <div className="inline-block mb-8 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-md"></div>
                  <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 p-1 rounded-full">
                    <div className={`${isDarkMode ? "bg-gray-950" : "bg-white"} rounded-full p-5`}>
                      <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        $0
                      </span>
                    </div>
                  </div>
                </div>
                <h1 className={`text-4xl md:text-6xl font-extrabold ${isDarkMode ? "text-white" : "text-gray-900"} mb-6 tracking-tight`}>
                  <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    100% Free
                  </span>{" "}
                  &amp; Open Source
                </h1>
                <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"} text-lg md:text-xl max-w-2xl mx-auto leading-relaxed`}>
                  TalentSync is and always will be completely free and open
                  source. We believe everyone deserves access to quality
                  interview preparation tools.
                </p>
              </div>

              {/* Cards Section */}
              <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl relative z-10">
                {/* Support Card */}
                <div className={`${
                  isDarkMode 
                    ? "bg-gray-850 border-gray-800" 
                    : "bg-white border-gray-200"
                  } border rounded-2xl overflow-hidden shadow-xl transform transition-all duration-300 hover:-translate-y-2 hover:shadow-indigo-500/20 hover:border-yellow-500/50 group`}>
                  <div className="h-1.5 bg-gradient-to-r from-yellow-400 to-amber-500"></div>
                  <div className="p-8">
                    <div className="bg-gradient-to-r from-yellow-400 to-amber-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Coffee className="w-8 h-8 text-gray-900" />
                    </div>
                    <h2 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"} mb-4 text-center`}>
                      Support Our Work
                    </h2>
                    <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"} mb-8 text-center leading-relaxed`}>
                      If you find our service valuable, consider buying us a
                      coffee to help maintain and improve the platform.
                    </p>
                    <div className="flex flex-col space-y-4">
                      <a
                        href="#buyacoffee"
                        className="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-gray-900 font-semibold px-6 py-3 rounded-lg flex items-center justify-center transition-all duration-200 shadow-lg group-hover:shadow-yellow-500/20"
                      >
                        <Coffee className="w-5 h-5 mr-2" />
                        Buy us a coffee
                        <Heart className="w-4 h-4 ml-2 fill-current" />
                      </a>
                      <div className="flex items-center justify-center text-gray-400 text-sm mt-2">
                        <Star className="w-4 h-4 text-yellow-400 mr-1" />
                        <span>100+ supporters</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Open Source Card */}
                <div className={`${
                  isDarkMode 
                    ? "bg-gray-850 border-gray-800" 
                    : "bg-white border-gray-200"
                  } border rounded-2xl overflow-hidden shadow-xl transform transition-all duration-300 hover:-translate-y-2 hover:shadow-blue-500/20 hover:border-blue-500/50 group`}>
                  <div className="h-1.5 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                  <div className="p-8">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Github className="w-8 h-8 text-white" />
                    </div>
                    <h2 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"} mb-4 text-center`}>
                      Contribute to Open Source
                    </h2>
                    <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"} mb-8 text-center leading-relaxed`}>
                      We are fully open source. Explore our codebase, report
                      issues, suggest features, or contribute directly to our
                      GitHub repository.
                    </p>
                    <div className="flex flex-col space-y-4">
                      <a
                        href="https://github.com"
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold px-6 py-3 rounded-lg flex items-center justify-center transition-all duration-200 shadow-lg group-hover:shadow-blue-500/20"
                      >
                        <Github className="w-5 h-5 mr-2" />
                        Star on GitHub
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </a>
                      <div className="flex items-center justify-center text-gray-400 text-sm mt-2">
                        <Code className="w-4 h-4 text-blue-400 mr-1" />
                        <span>Open source under MIT license</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Ways to Support */}
              <div className="mt-16 text-center relative z-10 max-w-2xl">
                <h3 className={`text-xl md:text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"} mb-6`}>
                  More Ways to Support
                </h3>
                <div className="flex flex-wrap justify-center gap-4">
                  <SupportButton
                    href="#share"
                    icon={Share2}
                    text="Share with others"
                  />
                  <SupportButton
                    href="#feedback"
                    icon={MessageSquare}
                    text="Give feedback"
                  />
                  <SupportButton
                    href="#report"
                    icon={AlertTriangle}
                    text="Report bugs"
                  />
                </div>
              </div>

              {/* Testimonial */}
              <div className={`mt-16 ${
                isDarkMode 
                  ? "bg-gray-800/50 border-gray-700" 
                  : "bg-gray-100/50 border-gray-300"
                } backdrop-blur-sm p-6 rounded-xl border max-w-2xl relative z-10 transform transition hover:shadow-blue-500/10 hover:-translate-y-1`}>
                <div className={`absolute -top-4 -left-4 ${isDarkMode ? "text-gray-600" : "text-gray-400"} text-4xl opacity-30`}>
                  "
                </div>
                <div className={`absolute -bottom-4 -right-4 ${isDarkMode ? "text-gray-600" : "text-gray-400"} text-4xl opacity-30`}>
                  "
                </div>
                <blockquote className={`${isDarkMode ? "text-gray-300" : "text-gray-700"} italic text-center`}>
                  TalentSync helped me prepare for my tech interviews and land
                  my dream job. I'm happy to support this amazing free resource!
                </blockquote>
                <div className="mt-4 flex items-center justify-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center font-bold text-white mr-2">
                    A
                  </div>
                  <span className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Achref, Software Engineer
                  </span>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-16 text-center text-gray-500 text-sm">
                <p>
                  © {new Date().getFullYear()} TalentSync - Made with ❤️ by the
                  open source community
                </p>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default SupportSection;