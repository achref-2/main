import { useState } from 'react';
import { 
  Clock, 
  XCircle, 
  CheckCircle, 
  User, 
  Briefcase, 
  MessageSquare,
  AlertCircle
} from 'lucide-react';

const StatusBadge = ({ status, size = "default", animate = true, isDarkMode = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Normalize status for consistent handling
  const normalizedStatus = status?.toLowerCase() || 'unknown';
  
  // Configuration object for status variations
  const statusConfig = {
    pending: {
      icon: <Clock className="h-3.5 w-3.5" />,
      label: "Pending",
      lightColors: "bg-yellow-50 text-yellow-800 border-yellow-200 ring-yellow-500/30",
      darkColors: "dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800 dark:ring-yellow-500/20",
      hoverColors: "hover:bg-yellow-100 dark:hover:bg-yellow-900/30",
      tooltip: "Application is awaiting review"
    },
    rejected: {
      icon: <XCircle className="h-3.5 w-3.5" />,
      label: "Rejected",
      lightColors: "bg-red-50 text-red-800 border-red-200 ring-red-500/30",
      darkColors: "dark:bg-red-900/20 dark:text-red-300 dark:border-red-800 dark:ring-red-500/20",
      hoverColors: "hover:bg-red-100 dark:hover:bg-red-900/30",
      tooltip: "Application was not approved"
    },
    approved: {
      icon: <CheckCircle className="h-3.5 w-3.5" />,
      label: "Approved",
      lightColors: "bg-green-50 text-green-800 border-green-200 ring-green-500/30",
      darkColors: "dark:bg-green-900/20 dark:text-green-300 dark:border-green-800 dark:ring-green-500/20",
      hoverColors: "hover:bg-green-100 dark:hover:bg-green-900/30",
      tooltip: "Application has been approved"
    },
    shortlisted: {
      icon: <User className="h-3.5 w-3.5" />,
      label: "Shortlisted",
      lightColors: "bg-emerald-50 text-emerald-800 border-emerald-200 ring-emerald-500/30",
      darkColors: "dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800 dark:ring-emerald-500/20",
      hoverColors: "hover:bg-emerald-100 dark:hover:bg-emerald-900/30",
      tooltip: "Candidate has been shortlisted"
    },
    hired: {
      icon: <Briefcase className="h-3.5 w-3.5" />,
      label: "Hired",
      lightColors: "bg-blue-50 text-blue-800 border-blue-200 ring-blue-500/30",
      darkColors: "dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800 dark:ring-blue-500/20",
      hoverColors: "hover:bg-blue-100 dark:hover:bg-blue-900/30",
      tooltip: "Candidate has been hired"
    },
    interviewing: {
      icon: <MessageSquare className="h-3.5 w-3.5" />,
      label: "Interviewing",
      lightColors: "bg-purple-50 text-purple-800 border-purple-200 ring-purple-500/30",
      darkColors: "dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800 dark:ring-purple-500/20",
      hoverColors: "hover:bg-purple-100 dark:hover:bg-purple-900/30",
      tooltip: "Interview process is in progress"
    }
  };

  // Default config for unknown status
  const defaultConfig = {
    icon: <AlertCircle className="h-3.5 w-3.5" />,
    label: status || "Unknown",
    lightColors: "bg-gray-50 text-gray-800 border-gray-200 ring-gray-400/30",
    darkColors: "dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:ring-gray-400/20",
    hoverColors: "hover:bg-gray-100 dark:hover:bg-gray-700/50",
    tooltip: "Status information unavailable"
  };

  // Get the appropriate config based on status
  const config = statusConfig[normalizedStatus] || defaultConfig;
  
  // Display the original status text with proper capitalization
  const displayLabel = status ? 
    (config !== defaultConfig ? config.label : status) : 
    defaultConfig.label;
  
  // Configure size classes
  const sizeClasses = {
    small: "text-xs px-1.5 py-0.5 gap-1",
    default: "text-sm px-2.5 py-1 gap-1.5",
    large: "text-base px-3 py-1.5 gap-2"
  };
  
  // Animation classes for the badge
  const pulseAnimation = animate && normalizedStatus === 'pending' ? 
    "animate-pulse" : "";
  
  // Interactive pulse effect on icon when hovering over pending status
  const iconAnimation = isHovered && normalizedStatus === 'pending' ? 
    "animate-pulse" : "";
  
  // Ring effect on hover for better interaction feedback
  const hoverRingEffect = "hover:ring-2 hover:ring-offset-1";
  
  return (
    <div
      className={`
        inline-flex items-center rounded-md border transition-all duration-200
        font-medium whitespace-nowrap select-none
        ${sizeClasses[size] || sizeClasses.default}
        ${config.lightColors} ${config.darkColors} 
        ${config.hoverColors} ${hoverRingEffect}
        ${pulseAnimation}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title={config.tooltip}
      role="status"
      aria-label={`Status: ${displayLabel}`}
    >
      <span className={`${iconAnimation}`}>
        {config.icon}
      </span>
      {displayLabel}
    </div>
  );
};

// Example usage with candidate object
const CandidateStatusExample = ({ candidate, isDarkMode }) => {
  return (
    <StatusBadge 
      status={candidate.status} 
      isDarkMode={isDarkMode}
    />
  );
};

// Alternative usage with direct status string
const DirectStatusExample = () => {
  return (
    <div className="flex flex-wrap gap-3">
      <StatusBadge status="pending" />
      <StatusBadge status="rejected" />
      <StatusBadge status="approved" />
      <StatusBadge status="shortlisted" />
      <StatusBadge status="hired" />
      <StatusBadge status="interviewing" />
      <StatusBadge status="unknown" />
    </div>
  );
};

export { StatusBadge, CandidateStatusExample, DirectStatusExample };