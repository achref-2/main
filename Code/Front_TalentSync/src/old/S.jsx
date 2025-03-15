import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import './cv.css'; // Ensure this CSS file exists and is properly styled

const CVUpload = () => {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/create"); // Navigate to the CV creation route
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('cv', file);
    formData.append('jobDescription', jobDescription);

    try {
      // Get the token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to analyze your CV.');
        navigate('/login'); // Redirect to login if not authenticated
        return;
      }

      const response = await axios.post('http://localhost:5000/api/analyze', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setAnalysis(response.data);
    } catch (error) {
      console.error('API error:', error.response ? error.response.data : error.message);
      alert('An error occurred while processing your CV. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-8 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">CV Analysis</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Upload CV (PDF)</label>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setFile(e.target.files[0])}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Job Description</label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows="4"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter the job description here..."
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading || !file}
          className={`w-full py-2 px-4 rounded ${
            loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
          } text-white font-bold`}
        >
          {loading ? 'Analyzing...' : 'Analyze CV'}
        </button>
      </form>

      {analysis && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Analysis Results</h2>
          <div className="bg-gray-100 p-4 rounded shadow">
            <h3 className="font-bold">Match Score:</h3>
            <p>{(analysis.similarity_score * 100).toFixed(1)}%</p>

            <h3 className="font-bold mt-4">Skills Found:</h3>
            <ul className="list-disc ml-5">
              {analysis.entities.SKILL.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>

            <h3 className="font-bold mt-4">Improvement Suggestions:</h3>
            <ul className="list-disc ml-5">
              {analysis.suggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <button
        onClick={handleNavigate}
        className="mt-6 w-full py-2 px-4 rounded bg-green-500 hover:bg-green-600 text-white font-bold"
      >
        Create CV &gt;
      </button>
    </div>
  );
};

export default CVUpload;
