import React, { useState, useLayoutEffect } from "react";
import axios from "axios";
import Dashboard from "./Dashboard";
import Jobs from "./Jobs/Jobs";
import { Loader } from "lucide-react";

const SinglePage = () => {
  const [profilePic, setProfilePic] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useLayoutEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");

        // Check if user data is already in sessionStorage
        const storedData = sessionStorage.getItem("userData");
        if (storedData) {
          const { profilePic, firstName, lastName, email } = JSON.parse(storedData);
          setProfilePic(profilePic);
          setFirstName(firstName);
          setLastName(lastName);
          setEmail(email);
          setIsLoading(false);
          return;
        }

        // If not in sessionStorage, fetch from API
        const response = await axios.get("http://localhost:5000/api/candidates/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const { candidate } = response.data;

        const userData = {
          profilePic: candidate.profilePic || "../../assets/images/avatar.jpg",
          firstName: candidate.name?.split(" ")[0] || "First Name",
          lastName: candidate.name?.split(" ").slice(1).join(" ") || "Last Name",
          email: candidate.email || "example@example.com",
        };

        // Save user data in state
        setProfilePic(userData.profilePic);
        setFirstName(userData.firstName);
        setLastName(userData.lastName);
        setEmail(userData.email);

        // Save user data in sessionStorage
        sessionStorage.setItem("userData", JSON.stringify(userData));
      } catch (error) {
        console.error("Error fetching user data:", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="w-8 h-8 animate-spin text-blue-500" />
        <span className="ml-2">Loading user data...</span>
      </div>
    );
  }

  return (
    <div className="single-page-layout">
      {/* Render the Jobs component */}
     

      {/* Render the Dashboard component */}
      <Dashboard
        profilePic={profilePic}
        firstName={firstName}
        lastName={lastName}
        email={email}
      />
    </div>
  );
};

export default SinglePage;