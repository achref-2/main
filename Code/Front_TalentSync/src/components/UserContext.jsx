import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [profilePic, setProfilePic] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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

  return (
    <UserContext.Provider
      value={{
        profilePic,
        firstName,
        lastName,
        email,
        isLoading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};