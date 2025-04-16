import { Code, Briefcase, Lightbulb, Heart, ShoppingCart, Camera, ChefHat, Server } from "lucide-react";

export const JobCategoryIcon = ({ category, logo, size = "md" }) => {
  // Size classes for the container
  const sizeClasses = {
    sm: "w-10 h-10 text-xl",
    md: "w-14 h-14 text-2xl",
    lg: "w-20 h-20 text-3xl",
  };

  // Function to determine which icon to display
  const getCategoryIcon = () => {
    if (logo) return logo; // Custom logo has priority if provided
    
    // Map categories to their respective icons
    switch (category) {
      case "Engineering":
        return <Code className="w-6 h-6" />;
      case "Software":
        return <Server className="w-6 h-6" />;
      case "Marketing":
        return <ShoppingCart className="w-6 h-6" />;
      case "Design":
        return <Camera className="w-6 h-6" />;
      case "Healthcare":
        return <Heart className="w-6 h-6" />;
      case "Culinary":
        return <ChefHat className="w-6 h-6" />;
      case "Creative":
        return <Lightbulb className="w-6 h-6" />;
      default:
        return <Briefcase className="w-6 h-6" />;
    }
  };

  // Get appropriate background color based on category
  const getBgColor = () => {
    switch (category) {
      case "Engineering":
        return "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-200";
      case "Software":
        return "bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-200";
      case "Marketing":
        return "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-200";
      case "Design":
        return "bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-200";
      case "Healthcare":
        return "bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-200";
      case "Culinary":
        return "bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-200";
      case "Creative":
        return "bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-200";
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-200";
    }
  };

  return (
    <div className={`mr-4 p-3 rounded-lg flex items-center justify-center ${sizeClasses[size]} ${getBgColor()} transition-all hover:shadow-md`}>
      {getCategoryIcon()}
    </div>
  );
};