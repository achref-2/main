import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
import { Moon, Sun } from "lucide-react";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useDarkMode } from '../../DarkModeProvider';

const Signup = () => {
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
 


  
  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };
  const navigation = [
    { name: "Pricing", href: "#" },
    { name: "Blog", href: "#" },
    { name: "About", href: "#" },
  ];
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = "http://localhost:5000/api/users";
      const { data: res } = await axios.post(url, data);
      navigate("/login");
      console.log(res.message);
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
 

  const clientId =
    "9748260171-v0tq98gnchgvvr9v6jvblpivlbina5q9.apps.googleusercontent.com"; // Replace with your actual Google Client ID

  const handleLoginSuccess = async (response) => {
    try {
      console.log("Google Token:", response.credential);

      const res = await axios.post("http://localhost:5000/api/auth/google", {
        token: response.credential,
      });

      console.log("Google Auth Success:", res.data);
      localStorage.setItem("token", res.data.token);
    } catch (error) {
      console.error("Google Auth Error:", error);
    }
  };

  const handleLoginError = () => {
    console.error("Google Auth Failed");
  };

    const { isDarkMode, toggleTheme } = useDarkMode();
  
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
                className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 "
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
      <div className={styles.signup_container}>
        <div
          className={`${styles.signup_form_container} border border-gray-200 dark:border-gray-700`}
        >
          {/* 
  <div className={`${styles.left} border-gray-200 dark:border-gray-700`}>
    <h1 className="text-zinc-900 dark:text-gray-100">Welcome Back</h1>
    <Link to="/candidate/login">
      <button type="" className={`${styles.white_btn} text-gray-200`}>
        Sign in
      </button>
    </Link>
  </div>
*/}

          <div
            className={`${styles.right} border border-gray-200 dark:border-gray-700`}
          >
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
              <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <img
                  alt="Your Company"
                  src="img/Logo2.png"
                  className="mx-auto h-10 w-auto"
                />
                <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight ">
                  Sign in to your account
                </h2>
              </div>

              <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className={styles.form_container} onSubmit={handleSubmit}>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm/6 font-medium "
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
                    <label
                      htmlFor="First Name"
                      className="block text-sm/6 font-medium "
                    >
                      First Name
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        placeholder="First Name"
                        name="firstName"
                        onChange={handleChange}
                        value={data.firstName}
                        required
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="Last Name"
                      className="block text-sm/6 font-medium "
                    >
                      Last Name
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        placeholder="Last Name"
                        name="lastName"
                        onChange={handleChange}
                        value={data.lastName}
                        required
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="password"
                        className="block text-sm/6 font-medium "
                      >
                        Password
                      </label>
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

                  <div className="mt-4">
                    <button
                      type="submit"
                      className="flex w-full justify-center rounded-md bg-indigo-600 px-12 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Sign Up
                    </button>
                  </div>

                  {error && <div className={styles.error_msg}>{error}</div>}
                  <div className="mt-4">
                    <GoogleOAuthProvider clientId={clientId}>
                      <GoogleLogin
                        onSuccess={handleLoginSuccess}
                        onError={handleLoginError}
                      />
                    </GoogleOAuthProvider>
                  </div>
                </form>

                <p className="mt-10 text-center text-sm/6 text-gray-400">
                  Already a member?{" "}
                  <Link to="/candidate/login">
                    <button type="button" className={styles.white_btn}>
                      Sign Up
                    </button>
                  </Link>
                </p>
              </div>
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

export default Signup;
