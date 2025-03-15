import React, { useState } from 'react';
import { toast } from 'react-toastify';
import {
  User,
  Briefcase,
  GraduationCap,
  Award,
  Plus,
  Trash2
} from 'lucide-react';

const Input = (props) => (
  <input
    className="border p-1 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
    {...props}
  />
);

const Textarea = (props) => (
  <textarea
    className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
    {...props}
  />
);

const Button = ({ variant, size, disabled, children, ...rest }) => {
  let baseClass = "px-4 py-2 rounded font-medium transition-colors";
  if (variant === 'outline') {
    baseClass += " border border-blue-500 text-blue-500 hover:bg-blue-50";
  } else if (variant === 'destructive') {
    baseClass += " bg-red-500 text-white hover:bg-red-600";
  } else {
    // default variant
    baseClass += " bg-blue-500 text-white hover:bg-blue-600";
  }
  if (size === 'sm') {
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

const Card = ({ children }) => (
  <div className="border rounded shadow p-5 bg-white dark:bg-black">
    {children}
  </div>
);

const CardHeader = ({ children }) => (
  <div className="border-b pb-2 mb-4">
    {children}
  </div>
);

const CardContent = ({ children }) => <div>{children}</div>;

/* CV Component */
const CV = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    personalInfo: {
      name: "",
      email: "",
      phone: "",
      location: "",
      summary: ""
    },
    experience: [
      {
        title: "",
        company: "",
        location: "",
        period: "",
        responsibilities: [""]
      }
    ],
    education: [
      {
        degree: "",
        institution: "",
        location: "",
        period: ""
      }
    ],
    skills: [""],
    certifications: [""]
  });

  const steps = [
    {
      title: "Personal Information",
      icon: <User className="w-6 h-6" />
    },
    {
      title: "Professional Experience",
      icon: <Briefcase className="w-6 h-6" />
    },
    {
      title: "Education",
      icon: <GraduationCap className="w-6 h-6" />
    },
    {
      title: "Skills & Certifications",
      icon: <Award className="w-6 h-6" />
    }
  ];

  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [name]: value
      }
    }));
  };

  const handleExperienceChange = (index, field, value) => {
    setFormData(prev => {
      const newExperience = [...prev.experience];
      newExperience[index] = {
        ...newExperience[index],
        [field]: value
      };
      return { ...prev, experience: newExperience };
    });
  };

  const handleEducationChange = (index, field, value) => {
    setFormData(prev => {
      const newEducation = [...prev.education];
      newEducation[index] = {
        ...newEducation[index],
        [field]: value
      };
      return { ...prev, education: newEducation };
    });
  };

  const handleArrayChange = (field, index, value) => {
    setFormData(prev => {
      const newArray = [...prev[field]];
      newArray[index] = value;
      return { ...prev, [field]: newArray };
    });
  };

  const addArrayItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]:
        field === 'experience'
          ? [
              ...prev.experience,
              {
                title: "",
                company: "",
                location: "",
                period: "",
                responsibilities: [""]
              }
            ]
          : field === 'education'
          ? [
              ...prev.education,
              {
                degree: "",
                institution: "",
                location: "",
                period: ""
              }
            ]
          : [...prev[field], ""]
    }));
  };

  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
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
            />
            <Input
              placeholder="Email"
              name="email"
              type="email"
              value={formData.personalInfo.email}
              onChange={handlePersonalInfoChange}
            />
            <Input
              placeholder="Phone"
              name="phone"
              value={formData.personalInfo.phone}
              onChange={handlePersonalInfoChange}
            />
            <Input
              placeholder="Location"
              name="location"
              value={formData.personalInfo.location}
              onChange={handlePersonalInfoChange}
            />
            <Textarea
              placeholder="Professional Summary"
              name="summary"
              value={formData.personalInfo.summary}
              onChange={handlePersonalInfoChange}
            />
          </div>
        );

      case 1:
        return (
          <div className="space-y-9">
            {formData.experience.map((exp, index) => (
              <div key={index} className="space-y-6 border-b pb-6 last:border-b-0">
                <div className="flex justify-end">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeArrayItem('experience', index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <Input
                  placeholder="Job Title"
                  value={exp.title}
                  onChange={(e) => handleExperienceChange(index, 'title', e.target.value)}
                />
                <Input
                  placeholder="Company"
                  value={exp.company}
                  onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                />
                <Input
                  placeholder="Location"
                  value={exp.location}
                  onChange={(e) => handleExperienceChange(index, 'location', e.target.value)}
                />
                <Input
                  placeholder="Period (e.g., 2020 - Present)"
                  value={exp.period}
                  onChange={(e) => handleExperienceChange(index, 'period', e.target.value)}
                />
              </div>
            ))}
            <Button
              variant="outline"
              onClick={() => addArrayItem('experience')}
            >
              <Plus className="w-4 h-4 mr-2" /> Add Experience
            </Button>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            {formData.education.map((edu, index) => (
              <div key={index} className="space-y-4 border-b pb-6 last:border-b-0">
                <div className="flex justify-end">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeArrayItem('education', index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <Input
                  placeholder="Degree"
                  value={edu.degree}
                  onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                />
                <Input
                  placeholder="Institution"
                  value={edu.institution}
                  onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                />
                <Input
                  placeholder="Location"
                  value={edu.location}
                  onChange={(e) => handleEducationChange(index, 'location', e.target.value)}
                />
                <Input
                  placeholder="Period (e.g., 2016 - 2020)"
                  value={edu.period}
                  onChange={(e) => handleEducationChange(index, 'period', e.target.value)}
                />
              </div>
            ))}
            <Button
              variant="outline"
              onClick={() => addArrayItem('education')}
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
                    onChange={(e) => handleArrayChange('skills', index, e.target.value)}
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeArrayItem('skills', index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() => addArrayItem('skills')}
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
                    onChange={(e) => handleArrayChange('certifications', index, e.target.value)}
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeArrayItem('certifications', index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() => addArrayItem('certifications')}
              >
                <Plus className="w-4 h-4 mr-2" /> Add Certification
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

  const handleSubmit = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('Please log in to upload your CV');
            return;
        }

        const formDataToSend = new FormData();
        formDataToSend.append('cv', formData.cv);

        // Optional: Show loading state
        toast.loading('Uploading CV...');

        const response = await fetch('http://localhost:5000/api/upload-cv', {
            method: 'POST',
            body: formDataToSend,
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to upload CV');
        }

        const data = await response.json();
        toast.success('CV uploaded successfully!');
        console.log('Upload response:', data);
        
      
        
    } catch (error) {
        console.error('Error uploading CV:', error);
        toast.error(error.message || 'Failed to upload CV');
    }
};
  return (
    <div className="max-w-2xl  p-auto">
      {/* Progress Steps */}
      <div className="flex justify-between mb-8">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`flex flex-col items-center ${
              index <= currentStep ? 'text-blue-600' : 'text-gray-400'
            }`}
          >
            <div
              className={`rounded-full p-2 mb-2 ${
                index <= currentStep ? 'bg-blue-100' : 'bg-gray-100'
              }`}
            >
              {step.icon}
            </div>
            <span className="text-sm font-medium">{step.title}</span>
          </div>
        ))}
      </div>

      {/* Form Content */}
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            {steps[currentStep].icon}
            {steps[currentStep].title}
          </h2>
        </CardHeader>
        <CardContent>{renderStepContent()}</CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 0}
        >
          Previous
        </Button>
        {currentStep === steps.length - 1 ? (
          <Button onClick={handleSubmit}>Submit</Button>
        ) : (
          <Button onClick={handleNext}>Next</Button>
        )}
      </div>
    </div>
  );
};

export default CV;
