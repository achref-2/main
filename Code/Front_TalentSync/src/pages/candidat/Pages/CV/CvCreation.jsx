import React, { useState } from "react";
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
  const { isDarkMode, toggleTheme } = useDarkMode(); // Access the theme state
  const [currentStep, setCurrentStep] = useState(0);
  const [citySearch, setCitySearch] = useState("");
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [formData, setFormData] = useState({
    personalInfo: {
      name: "",
      email: "",
      phone: "",
      location: "",
      summary: "",
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
    languages: [""], // Add languages field
    activities: [""], // Add activities field
  });

  const steps = [
    {
      title: "Personal Information",
      icon: <User className="w-6 h-6" />,
    },
    {
      title: "Professional Experience",
      icon: <Briefcase className="w-6 h-6" />,
    },
    {
      title: "Education",
      icon: <GraduationCap className="w-6 h-6" />,
    },
    {
      title: "Skills & Certifications",
      icon: <Award className="w-6 h-6" />,
    },
    {
      title: "Languages & Activities", // New step
      icon: <Award className="w-6 h-6" />,
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
  };
  const fetchCitySuggestions = async (query) => {
    if (!query) {
      setCitySuggestions([]);
      return;
    }

    try {
      const response = await axios.get(
        "https://wft-geo-db.p.rapidapi.com/v1/geo/cities",
        {
          params: { namePrefix: query },
          headers: {
            "X-RapidAPI-Key":
              "2f24ab8f79msh9947d3c74067c97p11ef2djsnd4b048614de1",
            "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
          },
        }
      );
      console.log(response.data);
      setCitySuggestions(response.data.data.map((city) => city.city));
    } catch (error) {
      console.error("Error fetching city suggestions:", error);
    }
  };
  const handleCityInputChange = (e) => {
    const query = e.target.value;
    setCitySearch(query);
    fetchCitySuggestions(query);
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
  };

  const handleArrayChange = (field, index, value) => {
    setFormData((prev) => {
      const newArray = [...prev[field]];
      newArray[index] = value;
      return { ...prev, [field]: newArray };
    });
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
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <Input
              placeholder="Full Name"
              name="name"
              value={formData.personalInfo.name}
              onChange={handlePersonalInfoChange}
              isDarkMode={isDarkMode}
            />
            <Input
              placeholder="Email"
              name="email"
              type="email"
              value={formData.personalInfo.email}
              onChange={handlePersonalInfoChange}
              isDarkMode={isDarkMode}
            />
            <Input
              placeholder="Phone"
              name="phone"
              value={formData.personalInfo.phone}
              onChange={handlePersonalInfoChange}
              isDarkMode={isDarkMode}
            />
            <Input
              placeholder="LinkedIn Profile"
              value={formData.personalInfo.linkedin}
              onChange={(e) => handlePersonalInfoChange(e)}
              name="linkedin"
              isDarkMode={isDarkMode}
            />
            <Input
              placeholder="Your Position (e.g., Software Engineering Student)"
              value={formData.personalInfo.position}
              onChange={(e) => handlePersonalInfoChange(e)}
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
                <ul className="absolute bg-white border rounded shadow-md max-h-40 overflow-y-auto z-10">
                  {citySuggestions.map((city, idx) => (
                    <li
                      key={idx}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setCitySearch(city);
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
            {formData.experience.map((exp, index) => (
              <div
                key={index}
                className="space-y-6 border-b pb-6 last:border-b-0 dark:border-zinc-700"
              >
                <div className="flex justify-end">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeArrayItem("experience", index)}
                    isDarkMode={isDarkMode}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <Input
                  placeholder="Job Title"
                  value={exp.title}
                  onChange={(e) =>
                    handleExperienceChange(index, "title", e.target.value)
                  }
                  isDarkMode={isDarkMode}
                />
                <Input
                  placeholder="Company"
                  value={exp.company}
                  onChange={(e) =>
                    handleExperienceChange(index, "company", e.target.value)
                  }
                  isDarkMode={isDarkMode}
                />
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
            {formData.education.map((edu, index) => (
              <div
                key={index}
                className="space-y-4 border-b pb-6 last:border-b-0 dark:border-zinc-700"
              >
                <div className="flex justify-end">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeArrayItem("education", index)}
                    isDarkMode={isDarkMode}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <Input
                  placeholder="Degree"
                  value={edu.degree}
                  onChange={(e) =>
                    handleEducationChange(index, "degree", e.target.value)
                  }
                  isDarkMode={isDarkMode}
                />
                <Input
                  placeholder="Institution"
                  value={edu.institution}
                  onChange={(e) =>
                    handleEducationChange(index, "institution", e.target.value)
                  }
                  isDarkMode={isDarkMode}
                />
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
              {formData.skills.map((skill, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="Skill"
                    value={skill}
                    onChange={(e) =>
                      handleArrayChange("skills", index, e.target.value)
                    }
                    isDarkMode={isDarkMode}
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeArrayItem("skills", index)}
                    isDarkMode={isDarkMode}
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
              <h3 className="text-lg font-semibold">Languages</h3>
              {formData.languages.map((language, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="Language"
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
              <h3 className="text-lg font-semibold">Activities</h3>
              {formData.activities.map((activity, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="Activity"
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
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  const navigate = useNavigate(); // Initialize navigate
  const [isLoading, setIsLoading] = useState(false); // State to manage loading

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log in to save your data");
        return;
      }

      setIsLoading(true); // Start loading
      toast.info("Your data is being processed...");

      const response = await fetch(
        "http://localhost:5000/api/candidates/save-candidate-data",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData), // Send the formData as JSON
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save candidate data");
      }

      const data = await response.json();
      toast.success("Candidate data saved successfully!");
      console.log("Response:", data);

      navigate("/Jobcandidate"); // Redirect to /job
    } catch (error) {
      console.error("Error saving candidate data:", error);
      toast.error(error.message || "Failed to save candidate data");
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <div
      className={`max-w-7xl mx-auto  transition-all ${
        isDarkMode ? "bg-zinc-900 text-gray-100" : "bg-white text-gray-900"
      }`}
    >
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
          >
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                index <= currentStep
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 dark:bg-zinc-700"
              }`}
            >
              {index + 1}
            </div>
            <span className="text-sm font-medium mt-2">{step.title}</span>
          </div>
        ))}
      </div>

      {/* Form Content */}
      <Card isDarkMode={isDarkMode}>
        <CardHeader isDarkMode={isDarkMode}>
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            {steps[currentStep].icon}
            {steps[currentStep].title}
          </h2>
        </CardHeader>
        <CardContent>{renderStepContent()}</CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center mt-8 pt-4  border-gray-200 dark:border-zinc-700">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className={`
      px-4 py-2 rounded-md text-sm font-medium flex items-center
      ${
        currentStep === 0
          ? "opacity-50 cursor-not-allowed"
          : "hover:bg-gray-100 dark:hover:bg-zinc-800"
      }
      ${
        isDarkMode
          ? "bg-zinc-900 text-gray-300 border-zinc-700"
          : "bg-white text-gray-700 border-gray-300"
      }
      transition-colors duration-200
    `}
          aria-label="Go to previous step"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        {currentStep === steps.length - 1 ? (
          <Button
            onClick={handleSubmit}
            disabled={isLoading} // Disable button while loading
            className={`
        px-5 py-2 rounded-md text-sm font-medium flex items-center
        ${
          isDarkMode
            ? "bg-blue-600 hover:bg-blue-700 text-white"
            : "bg-blue-600 hover:bg-blue-700 text-white"
        }
        transition-colors duration-200 shadow-sm
        ${isLoading ? "opacity-50 cursor-not-allowed" : ""}
      `}
            aria-label="Submit form"
          >
            {isLoading ? (
              <>
                <span className="loader mr-2"></span> Processing...
              </>
            ) : (
              <>
                Submit
                <CheckCircle className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            className={`
        px-5 py-2 rounded-md text-sm font-medium flex items-center
        ${
          isDarkMode
            ? "bg-blue-600 hover:bg-blue-700 text-white"
            : "bg-blue-600 hover:bg-blue-700 text-white"
        }
        transition-colors duration-200 shadow-sm
      `}
            aria-label="Go to next step"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default CV;
