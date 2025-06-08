import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Book,
  Users,
  FileText,
  Shield,
  Share2,
  Star,
  Bug,
} from "lucide-react";
import { ROUTES } from "../../utils/constants";

const HelpPage = () => {
  const navigate = useNavigate();

  const helpOptions = [
    {
      title: "User Manual",
      description: "Learn how to use the app features",
      icon: <Book size={20} className="text-[#DFDFDF]" />,
      route: ROUTES.USER_MANUAL,
    },
    {
      title: "Report a Bug",
      description: "Let us know about any issues",
      icon: <Bug size={20} className="text-[#DFDFDF]" />,
      route: ROUTES.REPORTBUG,
    },
    {
      title: "Add Review",
      description: "Share your thoughts about the app",
      icon: <Star size={20} className="text-[#DFDFDF]" />,
      route: ROUTES.ADD_REVIEW,
    },
    {
      title: "Share OutFlow",
      description: "Tell your friends about us!",
      icon: <Share2 size={20} className="text-[#DFDFDF]" />,
      route: ROUTES.SHARE,
    },
    {
      title: "About Us",
      description: "Learn about our mission and team",
      icon: <Users size={20} className="text-[#DFDFDF]" />,
      route: ROUTES.ABOUT_US,
    },
    {
      title: "Terms of Service",
      description: "Read our terms and conditions",
      icon: <FileText size={20} className="text-[#DFDFDF]" />,
      route: ROUTES.TERMS,
    },
    {
      title: "Privacy Policy",
      description: "Understand how we handle your data",
      icon: <Shield size={20} className="text-[#DFDFDF]" />,
      route: ROUTES.PRIVACY,
    },
  ];

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#DFDFDF]">
      {/* Fixed Header with Back Button */}
      <div className="fixed top-0 left-0 right-0 bg-[#0D0D0D]/95 backdrop-blur-sm z-50 border-b border-[#1A1A1A]">
        <div className="max-w-full sm:max-w-[640px] md:max-w-[768px] lg:max-w-[1024px] mx-auto px-4 sm:px-6 md:px-8">
          <div className="h-16 sm:h-20 flex items-center">
            <button
              onClick={() => navigate('/profile')}
              className="p-2 rounded-full hover:bg-[#1A1A1A] transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft size={20} className="sm:w-6 sm:h-6" />
            </button>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold ml-2">Help</h1>
          </div>
        </div>
      </div>

      {/* Main Content with proper spacing for fixed header */}
      <div className="pt-16 sm:pt-20 px-4 sm:px-6 md:px-8 pb-20">
        <div className="max-w-full sm:max-w-[640px] md:max-w-[768px] lg:max-w-[1024px] mx-auto">
          {/* Help Options */}
          <div className="space-y-3 max-w-2xl mx-auto w-full">
            {helpOptions.map((option, index) => (
              <div
                key={index}
                onClick={() => navigate(option.route)}
                className="flex items-center justify-between bg-[#1A1A1A] rounded-lg p-4 cursor-pointer hover:bg-[#252525] transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-[#252525] p-2 rounded-full">
                    {option.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">{option.title}</h3>
                    <p className="text-xs text-[#A0A0A0]">{option.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;
