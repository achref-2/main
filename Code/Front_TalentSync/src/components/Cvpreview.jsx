import React, { useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowDownToLine, ArrowLeft, Printer } from "lucide-react";
import html2pdf from "html2pdf.js";

const CvPreview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const cvRef = useRef(null);
  // Retrieve formData and isDarkMode from state, with fallback values
  const { formData = {}, isDarkMode = false } = location.state || {};

  // Redirect back to CV creation if formData is missing
  if (!formData || Object.keys(formData).length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
        <div className="text-center max-w-md w-full bg-white p-8 rounded-lg shadow-md">
          <svg className="mx-auto h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No CV data available</h3>
          <p className="mt-2 text-sm text-gray-500">Please create your CV first before viewing the preview.</p>
          <button
            onClick={() => window.history.back()}
            className="mt-6 w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back to CV Creation
          </button>
        </div>
      </div>
    );
  }

  const downloadPdf = async () => {
   
    window.print();
  };

  const handlePrint = () => {
    window.print();
  };

  return (

         <div
        className={`py-8 px-4  min-h-screen transition-all ${
          isDarkMode ? "bg-zinc-900 text-gray-100" : "bg-white text-zinc-950"
        }`}
      >
      {/* Controls */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
      <button
        onClick={() => window.history.back()}
        className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
          isDarkMode 
            ? 'bg-gray-800 hover:bg-gray-700 text-white' 
            : 'bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-200'
        }`}
        aria-label="Back to editor"
      >
        <ArrowLeft className="mr-2 h-5 w-5" />
        Back to Editor
      </button>
      
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handlePrint}
          className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
            isDarkMode
              ? 'bg-gray-700 hover:bg-gray-600 text-white'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-200'
          }`}
          aria-label="Print document"
        >
          <Printer className="mr-2 h-5 w-5" />
          Print
        </button>
        
        <button
          onClick={downloadPdf}
          className="flex items-center px-4 py-2 bg-blue-600 text-white hover:bg-blue-500 rounded-lg transition-colors shadow-sm"
          aria-label="Download as PDF"
        >
          <ArrowDownToLine className="mr-2 h-5 w-5" />
          Download PDF
        </button>
      </div>
    </div>
      
      {/* CV Document */}
      <div 
        ref={cvRef}
        className={`max-w-4xl mx-auto p-8 rounded-lg shadow-lg ${
          isDarkMode ? "bg-zinc-800 text-gray-100" : "bg-zinc-100 text-gray-900"
        }`}
      >
        {/* Header/Personal Info */}
        <header className={`border-b-2 ${isDarkMode ? "border-gray-700" : "border-gray-300"} pb-4 mb-6`}>
          <h1 className="text-3xl font-bold">{formData.personalInfo.name}</h1>
          <h2 className={`text-xl ${isDarkMode ? "text-blue-400" : "text-blue-600"} mt-1`}>
            {formData.personalInfo.position}
          </h2>
          
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <div className="flex items-center">
              <span className={`${isDarkMode ? "text-gray-400" : "text-gray-600"} mr-2`}>📧</span> {formData.personalInfo.email}
            </div>
            <div className="flex items-center">
              <span className={`${isDarkMode ? "text-gray-400" : "text-gray-600"} mr-2`}>📱</span> {formData.personalInfo.phone}
            </div>
            <div className="flex items-center">
              <span className={`${isDarkMode ? "text-gray-400" : "text-gray-600"} mr-2`}>📍</span> {formData.personalInfo.location}
            </div>
            {formData.personalInfo.linkedin && (
              <div className="flex items-center">
                <span className={`${isDarkMode ? "text-gray-400" : "text-gray-600"} mr-2`}>🔗</span> {formData.personalInfo.linkedin}
              </div>
            )}
          </div>
          
          {formData.personalInfo.summary && (
            <p className="mt-4 text-sm leading-relaxed">{formData.personalInfo.summary}</p>
          )}
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Professional Experience */}
            {formData.experience && formData.experience.length > 0 && (
              <section>
                <h2 className={`text-lg font-bold mb-4 ${isDarkMode ? "text-blue-400" : "text-blue-700"} border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"} pb-1`}>
                  Professional Experience
                </h2>
                {formData.experience.map((exp, index) => (
                  <div key={index} className={`mb-5 ${index !== formData.experience.length - 1 ? "pb-4" : ""}`}>
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-semibold">{exp.title}</h3>
                      <span className="text-sm italic">{exp.period}</span>
                    </div>
                    <div className="flex justify-between items-start mb-2">
                      <p className={`${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                        <span className="font-medium">{exp.company}</span> 
                        {exp.location && <span>, {exp.location}</span>}
                      </p>
                    </div>
                    {exp.responsibilities && exp.responsibilities.length > 0 && (
                      <ul className="list-disc ml-5 text-sm space-y-1">
                        {exp.responsibilities.map((resp, i) => (
                          <li key={i}>{resp}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </section>
            )}

            {/* Education */}
            {formData.education && formData.education.length > 0 && (
              <section>
                <h2 className={`text-lg font-bold mb-4 ${isDarkMode ? "text-blue-400" : "text-blue-700"} border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"} pb-1`}>
                  Education
                </h2>
                {formData.education.map((edu, index) => (
                  <div key={index} className={`mb-4 ${index !== formData.education.length - 1 ? "pb-3" : ""}`}>
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold">{edu.degree}</h3>
                      <span className="text-sm italic">{edu.period}</span>
                    </div>
                    <p className={`${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                      <span className="font-medium">{edu.institution}</span>
                      {edu.location && <span>, {edu.location}</span>}
                    </p>
                  </div>
                ))}
              </section>
            )}
            
            {/* Activities (if exists) */}
            {formData.activities && formData.activities.length > 0 && (
              <section>
                <h2 className={`text-lg font-bold mb-3 ${isDarkMode ? "text-blue-400" : "text-blue-700"} border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"} pb-1`}>
                  Activities & Volunteer Work
                </h2>
                <ul className="list-disc ml-5 space-y-1">
                  {formData.activities.map((activity, index) => (
                    <li key={index}>{activity}</li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Skills */}
            {formData.skills && formData.skills.length > 0 && (
              <section>
                <h2 className={`text-lg font-bold mb-3 ${isDarkMode ? "text-blue-400" : "text-blue-700"} border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"} pb-1`}>
                  Skills
                </h2>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.skills.map((skill, index) => (
                    <span 
                      key={index}
                      className={`px-2 py-1 rounded-md text-sm ${
                        isDarkMode 
                          ? "bg-gray-800 text-gray-200" 
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Certifications */}
            {formData.certifications && formData.certifications.length > 0 && (
              <section>
                <h2 className={`text-lg font-bold mb-3 ${isDarkMode ? "text-blue-400" : "text-blue-700"} border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"} pb-1`}>
                  Certifications
                </h2>
                <ul className="list-disc ml-5 space-y-1">
                  {formData.certifications.map((cert, index) => (
                    <li key={index}>{cert}</li>
                  ))}
                </ul>
              </section>
            )}

            {/* Languages */}
            {formData.languages && formData.languages.length > 0 && (
              <section>
                <h2 className={`text-lg font-bold mb-3 ${isDarkMode ? "text-blue-400" : "text-blue-700"} border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"} pb-1`}>
                  Languages
                </h2>
                <ul className="list-disc ml-5 space-y-1">
                  {formData.languages.map((language, index) => (
                    <li key={index}>{language}</li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </div>
      </div>
      
      {/* Print styling - hidden in normal view */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @media print {
            body {
              background-color: white !important;
              padding: 0 !important;
            }
            .print\\:hidden {
              display: none !important;
            }
          }
        `
      }} />
    </div>
  );
};

export default CvPreview;