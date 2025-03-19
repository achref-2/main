import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
import { Moon, Sun } from "lucide-react";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useDarkMode } from "../../DarkModeProvider";
import { Check } from "lucide-react";
import { Eye, EyeOff } from "lucide-react";

const Signup = () => {
  const [data, setData] = useState({
    firstName: "",
    email: "",
    password: "",
   
    role: "recruiter"
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    setIsSubmitting(true);
    try {
      const response = await axios.post("http://localhost:5000/api/recruiters/signup", data);
      setMessage(response.data.message);
    } catch (error) {
      console.error("Error details:", error.response?.data);
      setMessage(error.response?.data?.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const clientId =
    "9748260171-v0tq98gnchgvvr9v6jvblpivlbina5q9.apps.googleusercontent.com";

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

  const { isDarkMode } = useDarkMode();

  return (
    <div>
      <div>
        <img
          alt="TalentSync"
          src="img/Logo2.png"
          className="mx-auto h-9 w-auto"
        />
        <h2 className="my-4 text-center text-2xl font-semibold tracking-tight  ">
          Sign Up
        </h2>
        <p className="text-center  font-thin tracking-tight border-b  border-zinc-300 text-zinc-500 dark:border-zinc-700 pb-7">
          Ready to ace your next Candidate ?
        </p>
     

        <div className=" mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit} className="  w-full max-w-md  relative">
            

            {/* First Name 
        <div className="mb-4">
          <input
            type="text"
            placeholder="First Name"
            name="firstName"
            onChange={handleChange}
            value={data.firstName}
            required
            className="w-full rounded-md bg-white px-3 py-2 text-gray-900 border border-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
          />
        </div>
*/}
            {/* Last Name */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Name"
                name="firstName"
                onChange={handleChange}
                value={data.firstName}
                required
                className="block w-[90%] mx-auto rounded-md  bg-zinc-50 dark:border-zinc-600 border-zinc-300 dark:bg-black px-4 py-2 text-base text-gray-900 dark:text-gray-100 border  outline-1 outline-gray-300 focus:outline-2  placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent pr-10"
              />
            </div>
           
            <div className="mb-4">
              <input
                type="email"
                placeholder="hello@example.com"
                name="email"
                onChange={handleChange}
                value={data.email}
                required
                className="block w-[90%] mx-auto rounded-md bg-zinc-50 dark:border-zinc-600 border-zinc-300 dark:bg-black px-4 py-2 text-base text-gray-900 dark:text-gray-100 border  outline-1 outline-gray-300 focus:outline-2  placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent pr-10"
              />
            </div>
           
            <div className="mb-6 relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                name="password"
                onChange={handleChange}
                value={data.password}
                required
                autoComplete="current-password"
                className="block w-[90%] mx-auto rounded-md bg-zinc-50 dark:border-zinc-600 border-zinc-300 dark:bg-black px-4 py-2 text-base text-gray-900 dark:text-gray-100 border  outline-1 outline-gray-300 focus:outline-2  placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent pr-10"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-950  dark:text-gray-400  hover:text-gray-600"
              >
                {showPassword ?   <EyeOff size={20}/> : <Eye size={20} /> }
              </button>
            </div>

            {error && (
              <div className="mb-4 text-sm text-red-600 text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-[90%] mx-auto py-2 px-4 mb-5 bg-zinc-300 dark:bg-zinc-800 dark:text-white text-zinc-900 rounded hover:bg-zinc-400 dark:hover:bg-zinc-700 transition-colors flex items-center justify-center"
            >
              Sign Up
            </button>
            {message && <div className="alert alert-info  ">{message}</div>}


            <div className="text-center text-sm text-gray-600 mt-4">
              Already have an account?{" "}
              <a
                href="/candidate/login"
                className="text-blue-500 hover:text-blue-600"
              >
                Log In
              </a>
            </div>

            {/* Or Divider */}
            <div className="flex items-center  my-4 w-[90%] mx-4">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="mx-4 text-gray-500 text-sm">or</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            {/* Google Login */}
            <div className="w-[90%] mx-auto">
              <GoogleOAuthProvider clientId={clientId}>
                <GoogleLogin
                  onSuccess={handleLoginSuccess}
                  onError={handleLoginError}
                  theme="outline"
                  size="large"
                  text="signin_with"
                  shape="rectangular"
                  width="100%"
                />
              </GoogleOAuthProvider>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
