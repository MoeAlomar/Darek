// src/components/ListingDetails.tsx
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import {
  MapPin, Bed, Bath, Square, Wifi, Car, AirVent,
  ChevronLeft, ChevronRight, Star, MessageSquare, Share2, Heart,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useNavigate, useParams } from "react-router-dom";
import { apiService } from "../api/apiService";
import { Skeleton } from "./ui/skeleton";

// Define the shape of a Listing based on your model
interface Listing {
  id: string;
  owner: { username: string }; // Assuming owner_details is provided
  title: string;
  description: string;
  price: number;
  type: string;
  female_only: boolean;
  roommates_allowed: boolean;
  student_discount: boolean;
  status: string;
  address: string;
  location_link: string;
  // ... add other fields like images when available
}

const propertyImages = [
  "https://images.unsplash.com/photo-1515263487990-61b07816b324?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBidWlsZGluZ3xlbnwxfHx8fDE3NjAzNjMxMTl8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1555662328-4c2c27e7e4c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwZG9ybWl0b3J5JTIwcm9vbXxlbnwxfHx8fDE3NjAzNDE0MDB8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1649429710616-dad56ce9a076?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwYXBhcnRtZW50JTIwaW50ZXJpb3J8ZW58MXx8fHwxNzYwMzcyNzczfDA&ixlib=rb-4.1.0&q=80&w=1080",
];

export function ListingDetails() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); // Get ID from URL

  const [listing, setListing] = useState<Listing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchListing = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const response = await apiService.get(`/listings/${id}/`);
        setListing(response.data);
      } catch (error) {
        console.error("Failed to fetch listing:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  const nextImage = () => { /* ... */ };
  const prevImage = () => { /* ... */ };

  if (isLoading) {
    return (
        <div className="container mx-auto p-8">
            <Skeleton className="h-12 w-32 mb-4" />
            <Skeleton className="h-96 w-full mb-6" />
            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-64 w-full" />
                </div>
                <div>
                    <Skeleton className="h-48 w-full" />
                </div>
            </div>
        </div>
    );
  }

  if (!listing) {
    return <div className="container mx-auto p-8 text-center">Listing not found.</div>;
  }

  return (
    <div className="min-h-screen bg-secondary">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => navigate("/search")}
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Results
        </Button>

        {/* ... (Image Carousel) ... */}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex gap-2 mb-3">
                      {/* {listing.verified && <Badge className="bg-green-600 hover:bg-green-700">Verified</Badge>} */}
                      {listing.female_only && <Badge className="bg-purple-600 hover:bg-purple-700">Female Only</Badge>}
                      {listing.student_discount && <Badge className="bg-blue-600 hover:bg-blue-700">Student Discount</Badge>}
                    </div>
                    <h1 className="mb-2 text-foreground">{listing.title}</h1>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{listing.address}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl text-primary mb-1">{listing.price} SAR</div>
                    <div className="text-sm text-muted-foreground">per month</div>
                  </div>
                </div>
                {/* ... (rest of card, e.g., Bed, Bath, etc.) ... */}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <Tabs defaultValue="overview">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="rules">Rules</TabsTrigger>
                    <TabsTrigger value="amenities">Amenities</TabsTrigger>
                    <TabsTrigger value="reviews">Reviews</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="mt-6">
                    <h3 className="mb-3 text-foreground">About this property</h3>
                    <p className="text-muted-foreground mb-4">{listing.description}</p>
                  </TabsContent>
                  {/* ... (Other tabs) ... */}
                </Tabs>
              </CardContent>
            </Card>

            {/* ... (Map) ... */}
          </div>

          {/* Sidebar */}
          <div>
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h3 className="mb-4 text-foreground">Property Owner</h3>
                {/* ... (Owner details) ... */}
                <Button
                  className="w-full mb-3"
                  onClick={() => setShowContactDialog(true)}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Contact Landlord
                </Button>
                {/* ... (Schedule Viewing Button) ... */}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Contact Dialog */}
      <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contact Landlord</DialogTitle>
          </DialogHeader>
          {/* ... (Dialog content) ... */}
            <div className="flex gap-3">
              <Button variant="outline" /*...*/ >Cancel</Button>
              <Button
                className="flex-1"
                onClick={() => {
                  setShowContactDialog(false);
                  navigate("/messages"); // <-- Use navigate
                }}
              >
                Send Message
              </Button>
            </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}