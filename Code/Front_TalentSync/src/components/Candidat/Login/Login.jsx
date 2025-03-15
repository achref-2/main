import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { Eye, EyeOff } from "lucide-react";
import { useDarkMode } from "../../DarkModeProvider";
import styles from "./styles.module.css";

const Login = () => {
  const [data, setData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();

  const clientId = "9748260171-v0tq98gnchgvvr9v6jvblpivlbina5q9.apps.googleusercontent.com";

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Add role to data if not already included
      const dataWithRole = {
        ...data,
        role: "candidate" // Set default role to candidate
      };
      
      const url = "http://localhost:5000/api/candidates/login";
      const { data: res } = await axios.post(url, dataWithRole);
      
      // Store token and user info
      localStorage.setItem("token", res.token);
      localStorage.setItem("userRole", "candidate");
      
      window.location = "/dashboard";
    } catch (error) {
      if (error.response && error.response.status >= 400 && error.response.status <= 500) {
        setError(error.response.data.message || "Login failed");
      }
    }
  };

  const handleLoginSuccess = async (response) => {
    try {
     
      const res = await axios.post("http://localhost:5000/api/auth/google", {
        token: response.credential,
        role: "candidate" // Set role for Google login
      });
      
     
      
      // Store token and user info
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userRole", "candidate");
      
      navigate("/dashboard");
    }  catch (error) {
      if (error.response) {
        setError(error.response.data.message || "Login failed");
      } else {
        setError("Network error. Please try again later.");
      }
    }
    
  };

  const handleLoginError = () => {
    console.error("Google Login Failed");
    setError("Google login failed. Please try again.");
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div>
      <div>
        <img
          alt="TalentSync"
          src="img/Logo2.png"
          className="mx-auto h-9 w-auto"
        />
        <h2 className="my-4 text-center text-2xl font-semibold tracking-tight  ">
          Sign In
        </h2>
        <p className="text-center  font-thin tracking-tight border-b  border-zinc-300 text-zinc-500 dark:border-zinc-700 pb-7">
          Ready to ace your dream Job ?
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm ">
        <form
          className="flex flex-col items-center justify-center space-y-4"
          onSubmit={handleSubmit}
        >
          <div className="w-[80%] max-w-md">
          <label htmlFor="email" className="block text-sm w-[90%] mx-auto font-medium">
              Email
            </label>
            <div className="mt-2">
              <input
                type="email"
                placeholder="hello@example.com"
                name="email"
                onChange={handleChange}
                value={data.email}
                required
                className="block w-[90%] mx-auto rounded-md bg-zinc-50 dark:border-zinc-600 border-zinc-300 dark:bg-black px-4 py-2 text-base text-gray-900 dark:text-gray-100 border  outline-1 outline-gray-300 focus:outline-2  placeholder:text-gray-500"
              />
            </div>
          </div>

          <div className="w-[80%] max-w-md">
            <div className="flex w-[90%] mx-auto items-center justify-between">
            <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <div className="text-sm">
                <a
                  href="#"
                  className="font-semibold text-zinc-400 hover:text-zinc-500"
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
                className="block w-[90%] mx-auto rounded-md bg-zinc-50 dark:text-gray-100 dark:border-zinc-600 border-zinc-300 dark:bg-black px-4 py-2 text-base text-gray-900 border  outline-1 outline-gray-400 focus:outline-2  placeholder:text-gray-500"
              />
            </div>
          </div>

          <div className="w-[80%] max-w-md">
            <button
              type="submit"
              className="w-[90%] mx-auto py-2 px-4  bg-zinc-300 dark:bg-zinc-800 dark:text-white text-zinc-900 rounded hover:bg-zinc-400 dark:hover:bg-zinc-700 transition-colors flex items-center justify-center"
            >
              Sign in
            </button>

            <p className="mt-1 text-center text-sm text-gray-500">
              Not a member?{" "}
              <Link to="/candidate/signup">
                <button type="button"  className="text-blue-500 hover:text-blue-600">
                  Sign Up
                </button>
              </Link>
            </p>
          </div>

          {error && <div className={styles.error_msg}>{error}</div>}
        </form>

        <div className="flex items-center my-4 w-[71%] mx-14 ">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="mx-4 text-gray-500 text-sm">or</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

        <div className="flex flex-col gap-3 items-center w-[80%] mx-auto">
          {/* Divider with "OR CONTINUE WITH" text */}

          {/* Google Sign In */}
          <div className="w-[90%] mx-auto ">
            <GoogleOAuthProvider clientId={clientId}>
              <GoogleLogin
                onSuccess={handleLoginSuccess}
                onError={handleLoginError}
                theme="outline"
                size="large" // Ensures proper size
                text="signin_with"
                shape="rectangular"
              />
            </GoogleOAuthProvider>
          </div>

          
        </div>
      </div>
    </div>
  );
};

export default Login;
