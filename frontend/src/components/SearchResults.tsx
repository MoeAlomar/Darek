// src/components/SearchResults.tsx
import { useState, useEffect } from "react";
import { PropertyCard } from "./PropertyCard";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { Card, CardContent } from "./ui/card";
import { SlidersHorizontal, Grid3x3, List, MapIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { apiService } from "../api/apiService";
import { Skeleton } from "./ui/skeleton";

// Define the shape of a Listing based on your Django model
interface Listing {
  id: string;
  owner_username: string;
  title: string;
  description: string;
  price: number;
  type: string;
  female_only: boolean;
  roommates_allowed: boolean;
  student_discount: boolean;
  status: string;
  address: string;
  latitude: number;
  longitude: number;
  location_link: string;
  created_at: string;
  modified_at: string;
  image?: string; // Add a placeholder for image, as it's not in the model
}

export function SearchResults() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [showMap, setShowMap] = useState(false);

  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch real data when the component loads
  useEffect(() => {
    const fetchListings = async () => {
      setIsLoading(true);
      try {
        // This is the public endpoint for available listings
        const response = await apiService.get('/listings/');
        setListings(response.data);
      } catch (error) {
        console.error("Failed to fetch listings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchListings();
  }, []); // The empty array [] means this runs once when the component mounts

  return (
    <div className="min-h-screen bg-secondary">
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-6">
          {/* Filter Sidebar */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <SlidersHorizontal className="w-5 h-5 text-primary" />
                  <h3 className="text-foreground">Filters</h3>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <Label className="mb-3 block">
                    Price Range: {priceRange[0]} - {priceRange[1]} SAR
                  </Label>
                  <Slider
                    min={0}
                    max={5000}
                    step={100}
                    value={priceRange}
                    onValueChange={setPriceRange}
                    className="mb-2"
                  />
                </div>

                {/* Property Type */}
                <div className="mb-6">
                  <Label className="mb-3 block">Property Type</Label>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Checkbox id="studio" />
                      <label htmlFor="studio" className="text-sm cursor-pointer">
                        Studio
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="shared" />
                      <label htmlFor="shared" className="text-sm cursor-pointer">
                        Shared Room
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="apartment" />
                      <label htmlFor="apartment" className="text-sm cursor-pointer">
                        Apartment
                      </label>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="mb-6">
                  <Label className="mb-3 block">Features</Label>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Checkbox id="verified" defaultChecked />
                      <label htmlFor="verified" className="text-sm cursor-pointer">
                        Verified Only
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="female" />
                      <label htmlFor="female" className="text-sm cursor-pointer">
                        Female Only
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="discount" />
                      <label htmlFor="discount" className="text-sm cursor-pointer">
                        Student Discount
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="furnished" />
                      <label htmlFor="furnished" className="text-sm cursor-pointer">
                        Furnished
                      </label>
                    </div>
                  </div>
                </div>

                {/* Distance */}
                <div className="mb-6">
                  <Label className="mb-3 block">Distance from Campus</Label>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Checkbox id="1km" />
                      <label htmlFor="1km" className="text-sm cursor-pointer">
                        Within 1 km
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="3km" />
                      <label htmlFor="3km" className="text-sm cursor-pointer">
                        Within 3 km
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="5km" />
                      <label htmlFor="5km" className="text-sm cursor-pointer">
                        Within 5 km
                      </label>
                    </div>
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  Reset Filters
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Results Area */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-foreground mb-1">
                  Student Housing in Riyadh
                </h2>
                <p className="text-muted-foreground text-sm">
                  {isLoading ? "Searching..." : `${listings.length} properties found`}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowMap(!showMap)}
                >
                  <MapIcon className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3x3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Map Preview */}
            {showMap && (
              <Card className="mb-6 overflow-hidden">
                <div className="h-64 bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <MapIcon className="w-12 h-12 mx-auto mb-2" />
                    <p>Map View</p>
                    <p className="text-sm">Google Maps integration would display here</p>
                  </div>
                </div>
              </Card>
            )}

            {/* Property Grid / List */}
            {isLoading ? (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-64 w-full lg:hidden" />
              </div>
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid md:grid-cols-2 xl:grid-cols-3 gap-6"
                    : "space-y-4"
                }
              >
                {listings.map((property) => (
                  <PropertyCard
                    key={property.id}
                    id={property.id}
                    // Using a placeholder image since the model doesn't have one
                    image={property.image || "https://images.unsplash.com/photo-1515263487990-61b07816b324?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBidWlsZGluZ3xlbnwxfHx8fDE3NjAzNjMxMTl8MA&ixlib=rb-4.1.0&q=80&w=1080"}
                    price={property.price}
                    title={property.title}
                    location={property.address}
                    distance="" // This field is not in your model
                    verified={false} // This field is not in your model
                    femaleOnly={property.female_only}
                    studentDiscount={property.student_discount}
                    onClick={() => navigate(`/listing/${property.id}`)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}