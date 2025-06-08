import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#DFDFDF]">
      <div className="container mx-auto px-4 pb-20">
        <header className="py-4 flex items-center justify-between mt-6">
          <h1 className="text-2xl font-bold">Profile</h1>
        </header>
        {/* ... keep existing content ... */}
      </div>
    </div>
  );
} 