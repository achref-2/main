import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const PendingRecruiters = () => {
  const [pendingRecruiters, setPendingRecruiters] = useState([]);

  useEffect(() => {
    fetchPendingRecruiters();
  }, []);

  // Fetch the list of pending recruiters from the API
  const fetchPendingRecruiters = async () => {
    try {
      const token = localStorage.getItem("token"); // Get the token from localStorage
      const response = await axios.get("/api/admins/pending-recruiters", {
        headers: { Authorization: `Bearer ${token}` }, // Add token to headers
      });
      setPendingRecruiters(response.data); // Set the recruiters in the state
    } catch (error) {
      console.error("Error fetching recruiters:", error);
      toast.error("Failed to fetch pending recruiters");
    }
  };

  // Function to approve a recruiter by updating their status
  const approveRecruiter = async (id) => {
    try {
      const response = await axios.post(
        `/api/admins/approve-recruiter/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Include token for authorization
          },
        }
      );
      toast.success(response.data.message); // Display success message
      fetchPendingRecruiters(); // Re-fetch the pending recruiters to update the list
    } catch (error) {
      console.error("Error approving recruiter:", error);
      toast.error("Failed to approve recruiter");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Pending Recruiters</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 p-2">Name</th>
            <th className="border border-gray-300 p-2">Email</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {pendingRecruiters.map((recruiter) => (
            <tr key={recruiter._id} className="border border-gray-300">
              <td className="border border-gray-300 p-2">{recruiter.name}</td>
              <td className="border border-gray-300 p-2">{recruiter.email}</td>
              <td className="border border-gray-300 p-2">
                <button
                  onClick={() => approveRecruiter(recruiter._id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Approve
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PendingRecruiters;
