import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styles from "./styles.module.css";
import { Navigation } from "../../../components/Example/navigation";
import { useNavigate } from "react-router-dom";
import JsonData from "../../../data/data.json";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Contact } from "../../../components/Example/contact";
import { Moon, Sun, ArrowRight } from "lucide-react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
const Login = () => {
  const [data, setData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("theme") === "dark" ||
      window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => setIsDarkMode(e.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const toggleTheme = () => {
    const newTheme = isDarkMode ? "light" : "dark";
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = "http://localhost:5000/api/auth";
      const { data: res } = await axios.post(url, data);
      localStorage.setItem("token", res.data);
      window.location = "/dashboard";
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setError(error.response.data.message);
      }
    }
  };
  const navigation = [
    { name: "Pricing", href: "#" },
    { name: "Blog", href: "#" },
    { name: "About", href: "#" },
  ];
  const [landingPageData, setLandingPageData] = useState({});
  useEffect(() => {
    setLandingPageData(JsonData);
  }, []);

  const clientId = "9748260171-v0tq98gnchgvvr9v6jvblpivlbina5q9.apps.googleusercontent.com"; // Replace with your actual Google Client ID


  const navigate = useNavigate(); // Hook for navigation

    const handleLoginSuccess = async (response) => {
        try {
            console.log("Google Token:", response.credential);

            const res = await axios.post("http://localhost:5000/api/auth/google", {
                token: response.credential,
            });

            console.log("Google Auth Success:", res.data);
            localStorage.setItem("token", res.data.token);

            // Redirect to /dashboard
            navigate("/dashboard");
        } catch (error) {
            console.error("Google Auth Error:", error);
        }
    };
  const handleLoginError = () => {
    console.error("Google Login Failed");
  };
  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "dark bg-black text-white" : "bg-white text-gray-900"
      }`}
    >
      <nav className=" fixed w-full top-0 z-50 backdrop-blur-sm bg-opacity-90 border-b border-gray-400 dark:border-gray-700">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <a href="#" className="-m-1.5 pr-3">
              <span className="sr-only">Your Company</span>
              <img
                alt=""
                src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
                className="h-8 w-auto"
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
            <div className="hidden lg:flex lg:gap-x-12">
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
              <a href="/login" className="text-sm/6 font-semibold ">
                Log in <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </nav>
      <div className={styles.login_container}>
        <div
          className={`${styles.login_form_container} border border-gray-200 dark:border-gray-700`}
        >
          <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
              <img
                alt="Your Company"
                src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
                className="mx-auto h-10 w-auto"
              />
              <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight">
                Sign in to your account
              </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm/6 font-medium"
                  >
                    Email address
                  </label>
                  <div className="mt-2">
                    <input
                      type="email"
                      placeholder="Email"
                      name="email"
                      onChange={handleChange}
                      value={data.email}
                      required
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="block text-sm/6 font-medium"
                    >
                      Password
                    </label>
                    <div className="text-sm">
                      <a
                        href="#"
                        className="font-semibold text-indigo-600 hover:text-indigo-500"
                      >
                        Forgot password?
                      </a>
                    </div>
                  </div>
                  <div className="mt-2">
                    <input
                      type="password"
                      placeholder="Password"
                      name="password"
                      onChange={handleChange}
                      value={data.password}
                      required
                      autoComplete="current-password"
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Sign in
                  </button>
                </div>
                {error && <div className={styles.error_msg}>{error}</div>}
              </form>
              <div class="google">
			  <GoogleOAuthProvider clientId={clientId}>
                  <GoogleLogin
                    onSuccess={handleLoginSuccess}
                    onError={handleLoginError}
                  />
                </GoogleOAuthProvider>
              </div>
              <p className="mt-10 text-center text-sm/6 text-gray-500">
                Not a member?{" "}
                <Link to="/candidate/signup">
                  <button type="button" className={styles.white_btn}>
                    Sign Up
                  </button>
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <footer className="  py-12">
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
          <div className="border-t mt-12 pt-8 text-center">
            <p>&copy; 2025 Your Company. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Login;
