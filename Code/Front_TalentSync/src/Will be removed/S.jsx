import React, { useState } from 'react';
import { 
  Layout, 
  Server, 
  Globe, 
  Terminal,
  ArrowLeft,
  Share2
} from 'lucide-react';

const JobBoard = () => {
  const [selectedJob, setSelectedJob] = useState(null);
  const [filters, setFilters] = useState({
    fullTime: false,
    partTime: false,
    salary50_100: false,
    salary100_150: false
  });

  const allJobs = [
    {
      id: 1,
      company: 'Medium Inc.',
      role: 'Engineering Manager Developer Experience',
      location: 'Remote',
      salary: '$200k - $250k',
      type: 'Full Time',
      logo: <Layout className="h-8 w-8 text-purple-500" />,
      postedDate: '26 August 2023',
      description: `In the world of AI, infrastructure predictions are exciting the change to better machine learning...`,
      // ... rest of the job details
    },
    {
      id: 2,
      company: 'GitHub',
      role: 'Remote Shopify Website Tester',
      location: 'Remote',
      salary: '$90k - $120k',
      type: 'Part Time',
      logo: <Globe className="h-8 w-8" />
    },
    {
      id: 3,
      company: 'Vercel',
      role: 'Software Engineer Backend',
      location: 'Remote',
      salary: '$150k - $200k',
      type: 'Full Time',
      logo: <Terminal className="h-8 w-8" />
    }
  ];

  const handleFilterChange = (filterName) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
    }));
  };

  const filteredJobs = allJobs.filter(job => {
    // If no filters are selected, show all jobs
    const noJobTypeFilters = !filters.fullTime && !filters.partTime;
    const noSalaryFilters = !filters.salary50_100 && !filters.salary100_150;
    
    if (noJobTypeFilters && noSalaryFilters) return true;

    // Check job type filters
    const matchesJobType = 
      (filters.fullTime && job.type === 'Full Time') ||
      (filters.partTime && job.type === 'Part Time') ||
      (!filters.fullTime && !filters.partTime);

    // Parse salary range
    const salaryString = job.salary.replace(/[^0-9-]/g, '');
    const [minSalary] = salaryString.split('-').map(Number);
    
    // Check salary filters
    const matchesSalary =
      (filters.salary50_100 && minSalary >= 50 && minSalary <= 100) ||
      (filters.salary100_150 && minSalary >= 100 && minSalary <= 150) ||
      (!filters.salary50_100 && !filters.salary100_150);

    return matchesJobType && matchesSalary;
  });

  if (selectedJob) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <button 
          onClick={() => setSelectedJob(null)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          All Jobs
        </button>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{selectedJob.role}</h1>
            <div className="flex items-center gap-4">
              <span className="text-gray-600">{selectedJob.company}</span>
              <span className="text-gray-600">•</span>
              <span className="text-gray-600">{selectedJob.location}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-md">
              Apply Now
            </button>
            <button className="border border-gray-300 p-2 rounded-md hover:bg-gray-50">
              <Share2 className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">The Role</h2>
              <p className="text-gray-600 whitespace-pre-line mb-6">{selectedJob.description}</p>
              
              <h2 className="text-xl font-semibold mb-4">About You</h2>
              <p className="text-gray-600 whitespace-pre-line mb-6">{selectedJob.aboutYou}</p>
              
              <h2 className="text-xl font-semibold mb-4">Things You Might Do</h2>
              <ul className="list-disc list-inside text-gray-600 space-y-3">
                {selectedJob.requirements?.map((req, index) => (
                  <li key={index} className="ml-4">{req}</li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gray-100 rounded-lg">
                  {selectedJob.logo}
                </div>
                <div>
                  <h3 className="font-semibold">{selectedJob.company}</h3>
                  <p className="text-sm text-gray-500">Posted {selectedJob.postedDate}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm text-gray-500">Location</h4>
                  <p className="font-medium">{selectedJob.location}</p>
                </div>
                <div>
                  <h4 className="text-sm text-gray-500">Salary Range</h4>
                  <p className="font-medium">{selectedJob.salary}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 text-gray-200">
          Join the best tech startups in the <span className="text-purple-500">industry</span>
        </h1>
        <p className="text-gray-400 mb-4">
          Our matching uses template works on all devices, so you only have to set it up
          once, and get beautiful results forever.
        </p>
        <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md">
          Post a job - $299
        </button>
      </div>

      <div className="flex gap-8">
        <div className="w-3/4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold">Latest jobs</h2>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                {filteredJobs.map((job) => (
                  <div 
                    key={job.id} 
                    className="flex items-center p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedJob(job)}
                  >
                    <div className="mr-4 p-2 bg-gray-100 rounded-lg">
                      {job.logo}
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-medium">{job.company}</h3>
                      <p className="text-lg font-semibold">{job.role}</p>
                      <div className="flex gap-2 text-sm text-gray-500">
                        <span>{job.location}</span>
                        <span>•</span>
                        <span>{job.salary}</span>
                        <span>•</span>
                        <span>{job.type}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="w-1/4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4">
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Job Type</h3>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        checked={filters.fullTime}
                        onChange={() => handleFilterChange('fullTime')}
                        className="form-checkbox h-4 w-4 text-purple-600" 
                      />
                      <span className="ml-2">Full Time</span>
                    </label>
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        checked={filters.partTime}
                        onChange={() => handleFilterChange('partTime')}
                        className="form-checkbox h-4 w-4 text-purple-600" 
                      />
                      <span className="ml-2">Part Time</span>
                    </label>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Salary Range</h3>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        checked={filters.salary50_100}
                        onChange={() => handleFilterChange('salary50_100')}
                        className="form-checkbox h-4 w-4 text-purple-600" 
                      />
                      <span className="ml-2">$50k - $100k</span>
                    </label>
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        checked={filters.salary100_150}
                        onChange={() => handleFilterChange('salary100_150')}
                        className="form-checkbox h-4 w-4 text-purple-600" 
                      />
                      <span className="ml-2">$100k - $150k</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobBoard;