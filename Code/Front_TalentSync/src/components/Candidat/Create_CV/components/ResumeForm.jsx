import React, { useState } from "react";
import { fetchAIContent } from "../api";

const ResumeForm = ({ onUpdate }) => {
  const [formData, setFormData] = useState({
    name: "",
    jobTitle: "",
    summary: "",
    skills: "",
    experience: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const generateWithAI = async (field) => {
    const prompts = {
      summary: `Generate a professional summary for someone in ${formData.jobTitle}.`,
      skills: `List the top 5 skills for a ${formData.jobTitle}.`,
      experience: `Write a brief experience description for a ${formData.jobTitle}.`,
    };
    const result = await fetchAIContent(prompts[field]);
    setFormData((prev) => ({ ...prev, [field]: result }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Full Name"
      />
      <input
        type="text"
        name="jobTitle"
        value={formData.jobTitle}
        onChange={handleChange}
        placeholder="Job Title"
      />
      <textarea
        name="summary"
        value={formData.summary}
        onChange={handleChange}
        placeholder="Professional Summary"
      />
      <button type="button" onClick={() => generateWithAI("summary")}>
        Generate Summary with AI
      </button>

      <textarea
        name="skills"
        value={formData.skills}
        onChange={handleChange}
        placeholder="Skills"
      />
      <button type="button" onClick={() => generateWithAI("skills")}>
        Generate Skills with AI
      </button>

      <textarea
        name="experience"
        value={formData.experience}
        onChange={handleChange}
        placeholder="Experience"
      />
      <button type="button" onClick={() => generateWithAI("experience")}>
        Generate Experience with AI
      </button>

      <button type="submit">Update Resume</button>
    </form>
  );
};

export default ResumeForm;
