// src/components/RoommateMatching.tsx
import { useState } from "react";
import { RoommateCard } from "./RoommateCard";
import { Card, CardContent } from "./ui/card";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Slider } from "./ui/slider";
import { SlidersHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom"; // <-- Import hook

// ... (Mock data and other logic)
const mockRoommates = [
    // ...
];

export function RoommateMatching() {
  const navigate = useNavigate(); // <-- Use hook
  const [budgetRange, setBudgetRange] = useState([1000, 3000]);
  const [selectedGender, setSelectedGender] = useState<string>("any");
  const [selectedUniversity, setSelectedUniversity] = useState<string>("any");

  // ... (Filter logic)
  const filteredRoommates = mockRoommates.filter(
    // ...
  );

  return (
    <div className="min-h-screen bg-secondary">
      <div className="container mx-auto px-4 py-8">
        {/* ... (Header) ... */}
        
        <div className="flex gap-6">
          {/* ... (Filter Sidebar) ... */}

          {/* Roommate Cards */}
          <div className="flex-1">
            <div className="mb-6">
              <p className="text-muted-foreground text-sm">
                {filteredRoommates.length} potential roommates found
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {filteredRoommates.map((roommate) => (
                <RoommateCard
                  key={roommate.id}
                  {...roommate}
                  onMessage={() => navigate("/messages")} // <-- Use navigate
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}