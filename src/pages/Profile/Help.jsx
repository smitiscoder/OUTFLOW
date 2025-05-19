import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Book, Users } from 'lucide-react';
import { ROUTES } from '../../utils/constants';

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
      title: "About Us",
      description: "Learn about our mission and team",
      icon: <Users size={20} className="text-[#DFDFDF]" />,
      route: ROUTES.ABOUT_US,
    }
  ];

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white p-4">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-[#1A1A1A] mr-2"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold">Help Center</h1>
      </div>

      {/* Help Options */}
      <div className="space-y-3 max-w-2xl mx-auto">
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
  );
};

export default HelpPage;
