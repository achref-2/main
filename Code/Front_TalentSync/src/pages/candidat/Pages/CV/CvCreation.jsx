import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  User,
  Briefcase,
  GraduationCap,
  Award,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Globe,
  Activity,
  Eye
} from "lucide-react";
import { useDarkMode } from "../../../../components/DarkModeProvider";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Input = (props) => (
  <input
    className={`border p-1 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${
      props.isDarkMode
        ? "bg-zinc-900 text-gray-100 border-zinc-700"
        : "bg-white text-gray-900 border-gray-300"
    }`}
    {...props}
  />
);

const Textarea = (props) => (
  <textarea
    className={`border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${
      props.isDarkMode
        ? "bg-zinc-900 text-gray-100 border-zinc-700"
        : "bg-white text-gray-900 border-gray-300"
    }`}
    rows={4}
    {...props}
  />
);

const Button = ({ variant, size, disabled, isDarkMode, children, ...rest }) => {
  let baseClass = "px-4 py-2 rounded font-medium transition-colors";
  if (variant === "outline") {
    baseClass += ` border ${
      isDarkMode
        ? "border-blue-400 text-blue-400 hover:bg-zinc-800"
        : "border-blue-500 text-blue-500 hover:bg-blue-50"
    }`;
  } else if (variant === "destructive") {
    baseClass += " bg-red-500 text-white hover:bg-red-600";
  } else {
    baseClass += " bg-blue-500 text-white hover:bg-blue-600";
  }
  if (size === "sm") {
    baseClass += " text-sm";
  }
  if (disabled) {
    baseClass += " opacity-50 cursor-not-allowed";
  }
  return (
    <button className={baseClass} disabled={disabled} {...rest}>
      {children}
    </button>
  );
};

const Card = ({ children, isDarkMode }) => (
  <div
    className={`border rounded shadow p-5 ${
      isDarkMode
        ? "bg-zinc-900 text-gray-100 border-zinc-700"
        : "bg-white text-gray-900 border-gray-300"
    }`}
  >
    {children}
  </div>
);

const CardHeader = ({ children, isDarkMode }) => (
  <div
    className={`border-b pb-2 mb-4 ${
      isDarkMode ? "border-zinc-700" : "border-gray-300"
    }`}
  >
    {children}
  </div>
);

const CardContent = ({ children }) => <div>{children}</div>;

/* CV Component */
const CV = () => {
  const { isDarkMode } = useDarkMode(); 
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [citySearch, setCitySearch] = useState("");
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [isSaved, setIsSaved] = useState(false);
  
  const [formData, setFormData] = useState({
    personalInfo: {
      name: "",
      email: "",
      phone: "",
      location: "",
      summary: "",
      linkedin: "",
      position: "",
    },
    experience: [
      {
        title: "",
        company: "",
        location: "",
        period: "",
        responsibilities: [""],
      },
    ],
    education: [
      {
        degree: "",
        institution: "",
        location: "",
        period: "",
      },
    ],
    skills: [""],
    certifications: [""],
    languages: [""],
    activities: [""],
  });

  // Fetch existing CV data if available
  useEffect(() => {
    const fetchCandidateData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        setIsLoading(true);
        const response = await fetch(
          "http://localhost:5000/api/candidates/get-candidate-data",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.candidate) {
            setFormData(data.candidate);
            toast.info("Your existing CV data has been loaded");
            setIsSaved(true);
          }
        }
      } catch (error) {
        console.error("Error fetching candidate data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCandidateData();
  }, []);

  const steps = [
    {
      title: "Personal Information",
      icon: <User className="w-6 h-6" />,
      validate: () => {
        const errors = {};
        const { name, email, phone } = formData.personalInfo;
        
        if (!name.trim()) errors.name = "Name is required";
        if (!email.trim()) errors.email = "Email is required";
        else if (!/^\S+@\S+\.\S+$/.test(email)) errors.email = "Email is invalid";
        if (!phone.trim()) errors.phone = "Phone is required";
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
      }
    },
    {
      title: "Professional Experience",
      icon: <Briefcase className="w-6 h-6" />,
      validate: () => {
        const errors = {};
        if (formData.experience.length === 0) {
          errors.experience = "At least one experience entry is required";
        } else {
          formData.experience.forEach((exp, index) => {
            if (!exp.title.trim()) errors[`exp_title_${index}`] = "Job title is required";
            if (!exp.company.trim()) errors[`exp_company_${index}`] = "Company is required";
          });
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
      }
    },
    {
      title: "Education",
      icon: <GraduationCap className="w-6 h-6" />,
      validate: () => {
        const errors = {};
        if (formData.education.length === 0) {
          errors.education = "At least one education entry is required";
        } else {
          formData.education.forEach((edu, index) => {
            if (!edu.degree.trim()) errors[`edu_degree_${index}`] = "Degree is required";
            if (!edu.institution.trim()) errors[`edu_institution_${index}`] = "Institution is required";
          });
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
      }
    },
    {
      title: "Skills & Certifications",
      icon: <Award className="w-6 h-6" />,
      validate: () => {
        const errors = {};
        if (formData.skills.length === 0 || !formData.skills[0].trim()) {
          errors.skills = "At least one skill is required";
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
      }
    },
    {
      title: "Languages & Activities",
      icon: <Globe className="w-6 h-6" />,
      validate: () => true // Optional section
    },
  ];

  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [name]: value,
      },
    }));
    
    // Clear error when field is filled
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const fetchCitySuggestions = async (query) => {
    if (!query || query.length < 2) {
      setCitySuggestions([]);
      return;
    }

    try {
      const response = await axios.get(
        "https://wft-geo-db.p.rapidapi.com/v1/geo/cities",
        {
          params: { namePrefix: query, limit: 7 },
          headers: {
            "X-RapidAPI-Key": "2f24ab8f79msh9947d3c74067c97p11ef2djsnd4b048614de1",
            "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
          },
        }
      );
      
      if (response.data && response.data.data) {
        setCitySuggestions(response.data.data.map(city => 
          `${city.city}, ${city.countryCode}`
        ));
      }
    } catch (error) {
      console.error("Error fetching city suggestions:", error);
      // Fallback to empty suggestions with a warning
      setCitySuggestions([]);
      toast.warning("Could not fetch city suggestions");
    }
  };

  const handleCityInputChange = (e) => {
    const query = e.target.value;
    setCitySearch(query);
    
    // Update formData with location
    setFormData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        location: query
      }
    }));
    
    // Debounce API call
    const handler = setTimeout(() => {
      fetchCitySuggestions(query);
    }, 300);
    
    return () => clearTimeout(handler);
  };

  const handleExperienceChange = (index, field, value) => {
    setFormData((prev) => {
      const newExperience = [...prev.experience];
      newExperience[index] = {
        ...newExperience[index],
        [field]: value,
      };
      return { ...prev, experience: newExperience };
    });
    
    // Clear error when field is filled
    if (formErrors[`exp_${field}_${index}`]) {
      setFormErrors(prev => ({ ...prev, [`exp_${field}_${index}`]: undefined }));
    }
  };

  const handleEducationChange = (index, field, value) => {
    setFormData((prev) => {
      const newEducation = [...prev.education];
      newEducation[index] = {
        ...newEducation[index],
        [field]: value,
      };
      return { ...prev, education: newEducation };
    });
    
    // Clear error when field is filled
    if (formErrors[`edu_${field}_${index}`]) {
      setFormErrors(prev => ({ ...prev, [`edu_${field}_${index}`]: undefined }));
    }
  };

  const handleArrayChange = (field, index, value) => {
    setFormData((prev) => {
      const newArray = [...prev[field]];
      newArray[index] = value;
      return { ...prev, [field]: newArray };
    });
    
    // If first item is filled and there was an error, clear it
    if (index === 0 && value.trim() && formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const addArrayItem = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]:
        field === "experience"
          ? [
              ...prev.experience,
              {
                title: "",
                company: "",
                location: "",
                period: "",
                responsibilities: [""],
              },
            ]
          : field === "education"
          ? [
              ...prev.education,
              {
                degree: "",
                institution: "",
                location: "",
                period: "",
              },
            ]
          : [...prev[field], ""],
    }));
  };

  const removeArrayItem = (field, index) => {
    // Prevent removing last item for required fields
    if ((field === 'skills' || field === 'experience' || field === 'education') && 
        formData[field].length <= 1) {
      toast.warning(`At least one ${field.slice(0, -1)} item is required`);
      return;
    }
    
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleNext = () => {
    // Validate current step
    if (steps[currentStep].validate()) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    } else {
      toast.error("Please fill in all required fields");
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Auto-save draft every 60 seconds
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (isSaved) return; // Skip if already saved recently
      
      const isFormValid = steps.every(step => step.validate());
      if (isFormValid) {
        handleSaveDraft();
      }
    }, 60000);
    
    return () => clearInterval(autoSaveInterval);
  }, [formData, isSaved]);
  
  const handleSaveDraft = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Session expired. Please log in again.");
       
        return;
      }
  
      const response = await fetch(
        "http://localhost:5000/api/candidates/save-candidate-draft",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );
  
      if (!response.ok) {
        if (response.status === 401) {
          toast.error("Unauthorized. Please log in again.");
          
        } else {
          toast.error("Failed to save draft. Please try again.");
        }
        return;
      }
  
      toast.success("Draft saved successfully!");
    } catch (error) {
      console.error("Error saving draft:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };
  const handleSubmit = async () => {
    try {
      // Final validation of all steps
      const isValid = steps.every(step => step.validate());
      if (!isValid) {
        toast.error("Please fill in all required fields in all sections");
        return;
      }
      
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log in to save your data");
        return;
      }

      setIsLoading(true);
      toast.info("Your data is being processed...");

      const response = await fetch(
        "http://localhost:5000/api/candidates/save-candidate-data",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to save candidate data");
      }

      toast.success("CV data saved successfully!");
      setIsSaved(true);
      
      // Redirect after a short delay so the user sees the success message
      setTimeout(() => navigate("/Jobs"), 1500);
    } catch (error) {
      console.error("Error saving candidate data:", error);
      toast.error(error.message || "Failed to save candidate data");
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <div>
              <Input
                placeholder="Full Name"
                name="name"
                value={formData.personalInfo.name}
                onChange={handlePersonalInfoChange}
                isDarkMode={isDarkMode}
                aria-invalid={!!formErrors.name}
              />
              {formErrors.name && (
                <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
              )}
            </div>
            
            <div>
              <Input
                placeholder="Email"
                name="email"
                type="email"
                value={formData.personalInfo.email}
                onChange={handlePersonalInfoChange}
                isDarkMode={isDarkMode}
                aria-invalid={!!formErrors.email}
              />
              {formErrors.email && (
                <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
              )}
            </div>
            
            <div>
              <Input
                placeholder="Phone"
                name="phone"
                value={formData.personalInfo.phone}
                onChange={handlePersonalInfoChange}
                isDarkMode={isDarkMode}
                aria-invalid={!!formErrors.phone}
              />
              {formErrors.phone && (
                <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>
              )}
            </div>
            
            <Input
              placeholder="LinkedIn Profile"
              value={formData.personalInfo.linkedin}
              onChange={handlePersonalInfoChange}
              name="linkedin"
              isDarkMode={isDarkMode}
            />
            
            <Input
              placeholder="Your Position (e.g., Software Engineering Student)"
              value={formData.personalInfo.position}
              onChange={handlePersonalInfoChange}
              name="position"
              isDarkMode={isDarkMode}
            />
            
            <div className="relative">
              <Input
                placeholder="City"
                value={citySearch}
                onChange={handleCityInputChange}
                isDarkMode={isDarkMode}
              />
              {citySuggestions.length > 0 && (
                <ul className={`absolute z-10 border rounded shadow-md max-h-40 overflow-y-auto w-full ${
                  isDarkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-300"
                }`}>
                  {citySuggestions.map((city, idx) => (
                    <li
                      key={idx}
                      className={`px-4 py-2 cursor-pointer ${
                        isDarkMode 
                          ? "hover:bg-zinc-700" 
                          : "hover:bg-gray-100"
                      }`}
                      onClick={() => {
                        setCitySearch(city);
                        setFormData(prev => ({
                          ...prev,
                          personalInfo: {
                            ...prev.personalInfo,
                            location: city
                          }
                        }));
                        setCitySuggestions([]);
                      }}
                    >
                      {city}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <Textarea
              placeholder="Professional Summary"
              name="summary"
              value={formData.personalInfo.summary}
              onChange={handlePersonalInfoChange}
              isDarkMode={isDarkMode}
            />
          </div>
        );

      case 1:
        return (
          <div className="space-y-9">
            {formErrors.experience && (
              <p className="text-red-500 text-sm mt-1">{formErrors.experience}</p>
            )}
            
            {formData.experience.map((exp, index) => (
              <div
                key={index}
                className={`space-y-6 border-b pb-6 last:border-b-0 ${
                  isDarkMode ? "border-zinc-700" : "border-gray-200"
                }`}
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">{`Experience ${index + 1}`}</h3>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeArrayItem("experience", index)}
                    isDarkMode={isDarkMode}
                    aria-label="Remove experience"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                
                <div>
                  <Input
                    placeholder="Job Title"
                    value={exp.title}
                    onChange={(e) =>
                      handleExperienceChange(index, "title", e.target.value)
                    }
                    isDarkMode={isDarkMode}
                    aria-invalid={!!formErrors[`exp_title_${index}`]}
                  />
                  {formErrors[`exp_title_${index}`] && (
                    <p className="text-red-500 text-sm mt-1">{formErrors[`exp_title_${index}`]}</p>
                  )}
                </div>
                
                <div>
                  <Input
                    placeholder="Company"
                    value={exp.company}
                    onChange={(e) =>
                      handleExperienceChange(index, "company", e.target.value)
                    }
                    isDarkMode={isDarkMode}
                    aria-invalid={!!formErrors[`exp_company_${index}`]}
                  />
                  {formErrors[`exp_company_${index}`] && (
                    <p className="text-red-500 text-sm mt-1">{formErrors[`exp_company_${index}`]}</p>
                  )}
                </div>
                
                <Input
                  placeholder="Location"
                  value={exp.location}
                  onChange={(e) =>
                    handleExperienceChange(index, "location", e.target.value)
                  }
                  isDarkMode={isDarkMode}
                />
                
                <Input
                  placeholder="Period (e.g., 2020 - Present)"
                  value={exp.period}
                  onChange={(e) =>
                    handleExperienceChange(index, "period", e.target.value)
                  }
                  isDarkMode={isDarkMode}
                />
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium">
                    Key Responsibilities (optional)
                  </label>
                  <Textarea
                    placeholder="Describe your key responsibilities and achievements"
                    value={exp.responsibilities?.join("\n") || ""}
                    onChange={(e) =>
                      handleExperienceChange(index, "responsibilities", e.target.value.split("\n"))
                    }
                    isDarkMode={isDarkMode}
                  />
                </div>
              </div>
            ))}
            
            <Button
              variant="outline"
              onClick={() => addArrayItem("experience")}
              isDarkMode={isDarkMode}
            >
              <Plus className="w-4 h-4 mr-2" /> Add Experience
            </Button>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            {formErrors.education && (
              <p className="text-red-500 text-sm mt-1">{formErrors.education}</p>
            )}
            
            {formData.education.map((edu, index) => (
              <div
                key={index}
                className={`space-y-4 border-b pb-6 last:border-b-0 ${
                  isDarkMode ? "border-zinc-700" : "border-gray-200"
                }`}
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">{`Education ${index + 1}`}</h3>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeArrayItem("education", index)}
                    isDarkMode={isDarkMode}
                    aria-label="Remove education"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                
                <div>
                  <Input
                    placeholder="Degree"
                    value={edu.degree}
                    onChange={(e) =>
                      handleEducationChange(index, "degree", e.target.value)
                    }
                    isDarkMode={isDarkMode}
                    aria-invalid={!!formErrors[`edu_degree_${index}`]}
                  />
                  {formErrors[`edu_degree_${index}`] && (
                    <p className="text-red-500 text-sm mt-1">{formErrors[`edu_degree_${index}`]}</p>
                  )}
                </div>
                
                <div>
                  <Input
                    placeholder="Institution"
                    value={edu.institution}
                    onChange={(e) =>
                      handleEducationChange(index, "institution", e.target.value)
                    }
                    isDarkMode={isDarkMode}
                    aria-invalid={!!formErrors[`edu_institution_${index}`]}
                  />
                  {formErrors[`edu_institution_${index}`] && (
                    <p className="text-red-500 text-sm mt-1">{formErrors[`edu_institution_${index}`]}</p>
                  )}
                </div>
                
                <Input
                  placeholder="Location"
                  value={edu.location}
                  onChange={(e) =>
                    handleEducationChange(index, "location", e.target.value)
                  }
                  isDarkMode={isDarkMode}
                />
                
                <Input
                  placeholder="Period (e.g., 2016 - 2020)"
                  value={edu.period}
                  onChange={(e) =>
                    handleEducationChange(index, "period", e.target.value)
                  }
                  isDarkMode={isDarkMode}
                />
              </div>
            ))}
            
            <Button
              variant="outline"
              onClick={() => addArrayItem("education")}
              isDarkMode={isDarkMode}
            >
              <Plus className="w-4 h-4 mr-2" /> Add Education
            </Button>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Skills</h3>
              {formErrors.skills && (
                <p className="text-red-500 text-sm">{formErrors.skills}</p>
              )}
              
              {formData.skills.map((skill, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="Skill"
                    value={skill}
                    onChange={(e) =>
                      handleArrayChange("skills", index, e.target.value)
                    }
                    isDarkMode={isDarkMode}
                    aria-invalid={index === 0 && !!formErrors.skills}
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeArrayItem("skills", index)}
                    isDarkMode={isDarkMode}
                    aria-label="Remove skill"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              
              <Button
                variant="outline"
                onClick={() => addArrayItem("skills")}
                isDarkMode={isDarkMode}
              >
                <Plus className="w-4 h-4 mr-2" /> Add Skill
              </Button>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Certifications</h3>
              {formData.certifications.map((cert, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="Certification"
                    value={cert}
                    onChange={(e) =>
                      handleArrayChange("certifications", index, e.target.value)
                    }
                    isDarkMode={isDarkMode}
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeArrayItem("certifications", index)}
                    isDarkMode={isDarkMode}
                    aria-label="Remove certification"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              
              <Button
                variant="outline"
                onClick={() => addArrayItem("certifications")}
                isDarkMode={isDarkMode}
              >
                <Plus className="w-4 h-4 mr-2" /> Add Certification
              </Button>
            </div>
          </div>
        );
        
      case 4:
        return (
          <div className="space-y-6">
            {/* Languages Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Globe className="w-5 h-5" /> Languages
              </h3>
              
              {formData.languages.map((language, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="Language (e.g., English - Native)"
                    value={language}
                    onChange={(e) =>
                      handleArrayChange("languages", index, e.target.value)
                    }
                    isDarkMode={isDarkMode}
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeArrayItem("languages", index)}
                    isDarkMode={isDarkMode}
                    aria-label="Remove language"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              
              <Button
                variant="outline"
                onClick={() => addArrayItem("languages")}
                isDarkMode={isDarkMode}
              >
                <Plus className="w-4 h-4 mr-2" /> Add Language
              </Button>
            </div>

            {/* Activities Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Activity className="w-5 h-5" /> Activities
              </h3>
              
              {formData.activities.map((activity, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="Activity (e.g., Volunteer Work, Hobbies)"
                    value={activity}
                    onChange={(e) =>
                      handleArrayChange("activities", index, e.target.value)
                    }
                    isDarkMode={isDarkMode}
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeArrayItem("activities", index)}
                    isDarkMode={isDarkMode}
                    aria-label="Remove activity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                
                <Button
                  variant="outline"
                  onClick={() => addArrayItem("activities")}
                  isDarkMode={isDarkMode}
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Activity
                </Button>
                
                <div className="mt-6 p-4 border rounded bg-opacity-50 text-sm space-y-2 border-dashed 
                    ${isDarkMode ? 'border-zinc-600 bg-zinc-800' : 'border-gray-300 bg-gray-50'}">
                  <p>
                    <strong>Tip:</strong> Including language skills and personal activities can make your CV more well-rounded and help you stand out to employers.
                  </p>
                  <p>
                    For languages, consider mentioning your proficiency level (e.g., Native, Fluent, Intermediate, Basic).
                  </p>
                </div>
              </div>
            </div>
          );
        default:
          return null;
      }
    };
  
    const isLastStep = currentStep === steps.length - 1;
  
    return (
      <div
        className={`max-w-7xl mx-auto transition-all ${
          isDarkMode ? "bg-zinc-900 text-gray-100" : "bg-white text-gray-900"
        }`}
      >
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className={`p-6 rounded-lg shadow-lg ${isDarkMode ? 'bg-zinc-800' : 'bg-white'}`}>
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                <p className="text-lg">Processing your CV data...</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Progress Bar */}
        <div className="relative w-full h-2 bg-gray-200 dark:bg-zinc-700 rounded-full mb-8">
          <div
            className="absolute top-0 left-0 h-2 bg-blue-500 rounded-full transition-all"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          ></div>
        </div>
  
        {/* Step Indicators */}
        <div className="flex justify-between items-center mb-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex flex-col items-center ${
                index <= currentStep
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-400 dark:text-gray-500"
              }`}
              role="button"
              onClick={() => {
                // Allow clicking on completed steps to revisit them
                if (index <= currentStep) {
                  setCurrentStep(index);
                } else {
                  // For future steps, only go there if all previous steps are valid
                  const canProceed = steps.slice(0, index).every(s => s.validate());
                  if (canProceed) {
                    setCurrentStep(index);
                  } else {
                    toast.warning("Please complete the current section first");
                  }
                }
              }}
            >
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${
                  index < currentStep
                    ? "bg-blue-500 text-white"
                    : index === currentStep
                    ? "bg-blue-600 text-white ring-4 ring-blue-200 dark:ring-blue-900"
                    : "bg-gray-300 dark:bg-zinc-700"
                }`}
              >
                {index < currentStep ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  index + 1
                )}
              </div>
              <span className="text-sm font-medium mt-2 text-center max-w-[100px] truncate">
                {step.title}
              </span>
            </div>
          ))}
        </div>
  {/* Progress indicator */}
  <div className="mt-6 mb-10 flex justify-center">
          <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
            Step {currentStep + 1} of {steps.length} • {Math.round((currentStep + 1) / steps.length * 100)}% Complete
          </p>
        </div>
        {/* Form Content */}
        <Card isDarkMode={isDarkMode}>
          <CardHeader isDarkMode={isDarkMode}>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                {steps[currentStep].icon}
                {steps[currentStep].title}
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSaveDraft}
                disabled={isLoading}
                isDarkMode={isDarkMode}
                className="px-3 py-1 text-xs"
              >
                Save Draft
              </Button>
            </div>
          </CardHeader>
          <CardContent>{renderStepContent()}</CardContent>
        </Card>
  
        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200 dark:border-zinc-700">
      {/* Previous Button */}
      <button
        onClick={handlePrevious}
        disabled={currentStep === 0 || isLoading}
        className={`
          px-4 py-2 rounded-lg text-sm font-medium flex items-center
          transition-all duration-200
          ${currentStep === 0 || isLoading ? "opacity-50 cursor-not-allowed" : ""}
          ${
            isDarkMode 
              ? "bg-zinc-800 hover:bg-zinc-700 text-gray-200 border border-zinc-700" 
              : "bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 hover:border-gray-400"
          }
          focus:outline-none focus:ring-2 focus:ring-offset-2
          ${isDarkMode ? "focus:ring-zinc-600" : "focus:ring-gray-400"}
        `}
        aria-label="Go to previous step"
      >
        <ChevronLeft className="w-4 h-4 mr-2" />
        Previous
      </button>

      {/* Right-sided buttons */}
      <div className="flex gap-3">
        {/* Preview Button - Only shown on last step */}
        {isLastStep && (
          <button
            onClick={() => {
              navigate("/cv-preview", { state: { formData, isDarkMode } });
            }}
            disabled={isLoading}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2
              transition-all duration-200
              ${isLoading ? "opacity-50 cursor-not-allowed" : "hover:shadow-sm"}
              ${
                isDarkMode 
                  ? "bg-zinc-800 hover:bg-zinc-700 text-gray-200 border border-zinc-700" 
                  : "bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 hover:border-gray-400"
              }
              focus:outline-none focus:ring-2 focus:ring-offset-2
              ${isDarkMode ? "focus:ring-blue-600" : "focus:ring-blue-500"}
            `}
            aria-label="Preview CV"
          >
            <Eye className="w-4 h-4" />
            Preview cv
            {isLoading && (
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
          </button>
        )}

        {/* Next/Submit Button */}
        <button
          onClick={isLastStep ? handleSubmit : handleNext}
          disabled={isLoading}
          className={`
            px-5 py-2 rounded-lg text-sm font-medium flex items-center gap-2
            transition-all duration-200 
            ${isLoading ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-500"}
            bg-blue-600 text-white shadow-sm
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
          `}
          aria-label={isLastStep ? "Submit form" : "Go to next step"}
        >
          {isLastStep ? (
            isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>Submit</span>
                <CheckCircle className="w-4 h-4" />
              </>
            )
          ) : (
            <>
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
        
        
      </div>
    );
  };
  
  export default CV;