"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ExploreFilters } from "../components/explore-filters";
import { CampusOpportunities } from "../components/CampusOpportunities";
import {
  Search,
  MapPin,
  Calendar,
  Clock,
  Users,
  Share2,
  Plus,
  X,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { format, isWithinInterval, parseISO } from "date-fns";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { toast } from "react-toastify";
import {
  initiativeList,
  signupInitiative,
} from "@/services/apiAction/initiative";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import Loader from "../components/Loader";
import NoOpportunitiesCard from "./NoOpportunityCard";
import useDebounce from "@/hooks/debounce";
import { Filters } from "../components/explore-filters";
import { InitiativeFilters } from "@/services/apiAction/initiative/types";

interface Initiative {
  _id: string;
  title: string;
  organization: string;
  description: string;
  img: string;
  orgIntrests: string[];
  address: string;
  timeCommitment: string;
  volunteersNeeded: number;
  currentVolunteers: number;
  startDate: string;
  endDate: string;
  userId: string;
  status: string;
}

// Mock data with real images
const opportunitiesData: Initiative[] = [
  {
    _id: "1",
    title: "Community Garden Project",
    organization: "Green Earth Initiative",
    description: "Join us in creating and maintaining a sustainable community garden that will provide fresh produce for local food banks and teach sustainable gardening practices to the community.",
    img: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735",
    orgIntrests: ["Environment", "Food Security", "Education"],
    address: "Berkeley Community Center",
    timeCommitment: "4 hours per week",
    volunteersNeeded: 25,
    currentVolunteers: 8,
    startDate: "2024-03-15",
    endDate: "2024-06-15",
    userId: "org123",
    status: "Open"
  }
];

// Add this to your mock data
const campusOpportunitiesData = [
  {
    id: "1",
    title: "Cal Day Volunteer",
    organization: "UC Berkeley Visitor Services",
    location: "UC Berkeley Campus",
    date: "April 15, 2024",
    duration: "4 hours",
    image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f",
    tags: ["Campus Event", "Tour Guide"],
  },
  {
    id: "2",
    title: "Library Book Drive",
    organization: "UC Berkeley Libraries",
    location: "Doe Library",
    date: "March 1-31, 2024",
    duration: "Flexible",
    image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66",
    tags: ["Education", "Library"],
  },
  {
    id: "3",
    title: "Big Game Week Setup",
    organization: "Cal Athletics",
    location: "Various Campus Locations",
    date: "November 15-22, 2024",
    duration: "2-4 hours per shift",
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018",
    tags: ["Sports", "Event Planning"],
  },
];

export default function ExplorePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<Filters>({
    date: undefined,
    radius: 10,
    isVirtual: false,
    isCampus: false,
    isMultiDay: false,
    interests: [],
  });
  const [opportunities, setOpportunities] = useState<
    typeof filteredOpportunities
  >([]);
  const { user, addNotification, signUpForInitiative, fetchInitiatives } =
    useAuth();
  // const { toast } = useToast();
  const [selectedOpportunity, setSelectedOpportunity] = useState<
    (typeof filteredOpportunities)[0] | null
  >(null);
  const router = useRouter();
  const debouncedFilters = useDebounce(filters, 500);
  const {
    data: apiData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isLoading
  } = useInfiniteQuery({
    queryKey: ["initiativeList", filters as InitiativeFilters],
    queryFn: ({ pageParam = 0 }) => initiativeList({
      pageParam,
      queryKey: ["initiativeList", filters as InitiativeFilters]
    }),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
  });
  useEffect(() => {
    refetch();
  }, [debouncedFilters]);
  const filteredOpportunities: any = apiData?.pages;
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastItemRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isFetchingNextPage || !hasNextPage) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) fetchNextPage();
      });

      if (node) observerRef.current.observe(node);
    },
    [isFetchingNextPage, hasNextPage, fetchNextPage]
  );
  const handleSignUp = useCallback(
    async (opportunity: any) => {
      if (user?.userType !== 2) {
        toast.error(
          "Organizations cannot sign up for volunteer opportunities."
        );
        return;
      }
      try {
        await signupInitiative({
          initiativeId: opportunity._id,
          orgId: opportunity.userId,
        });
        toast.success(
          `Your request to join "${opportunity.title}" has been sent to ${opportunity.organization}.`
        );
        setSelectedOpportunity(null);
      } catch (error) {
        console.error("Failed to sign up for initiative:", error);
        toast.error(
          "Failed to sign up for the initiative. Please try again later."
        );
      }
    },
    [user]
  );

  const handleShare = useCallback(
    async (opportunity: any) => {
      try {
        await navigator.share({
          title: opportunity.title,
          text: `Check out this volunteer opportunity: ${opportunity.title} with ${opportunity.organization}`,
          url: window.location.href,
        });
      } catch (err) {
        toast.success(
          "The opportunity link has been copied to your clipboard."
        );
      }
    },
    [toast]
  );

  // const filteredOpportunities = opportunities.filter((opp) => {
  //   const matchesSearch =
  //     opp.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     opp.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     opp.tags?.some((tag) =>
  //       tag.toLowerCase().includes(searchTerm.toLowerCase())
  //     ) ||
  //     false;

  //   const matchesVirtual =
  //     !filters.isVirtual || opp.location?.toLowerCase().includes("virtual");
  //   const matchesCampus =
  //     !filters.isCampus || opp.location?.toLowerCase().includes("uc berkeley");
  //   const matchesRadius =
  //     filters.radius >=
  //     calculateDistance(opp.latitude, opp.longitude, 37.8719, -122.2585); // UC Berkeley coordinates

  //   const matchesDate =
  //     !filters.date ||
  //     isWithinInterval(parseISO(opp.startDate), {
  //       start: filters.date,
  //       end: new Date(filters.date.getTime() + 24 * 60 * 60 * 1000), // Next day
  //     });

  //   const matchesMultiDay =
  //     !filters.isMultiDay || (opp.endDate && opp.endDate !== opp.startDate);

  //   return (
  //     matchesSearch &&
  //     matchesVirtual &&
  //     matchesCampus &&
  //     matchesRadius &&
  //     matchesDate &&
  //     matchesMultiDay
  //   );
  // });

  const OpportunityCard = useCallback(
    ({
      opportunity,
      isLast,
    }: {
      opportunity: (typeof filteredOpportunities)[0];
      isLast: boolean;
    }) => (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <Card
          ref={isLast ? lastItemRef : null}
          className="cursor-pointer hover:shadow-lg transition-shadow border-vollie-light-blue"
          onClick={() => setSelectedOpportunity(opportunity)}
        >
          <div className="relative h-48 w-full">
            <Image
              src={opportunity.img || "/placeholder.svg"}
              alt={opportunity.title || "Volunteer Opportunity"}
              layout="fill"
              objectFit="cover"
              className="rounded-t-lg"
            />
          </div>
          <CardContent className="p-4">
            <h3 className="text-xl font-semibold mb-2 text-vollie-blue">
              {opportunity.title || "Untitled Opportunity"}
            </h3>
            <p className="text-sm text-muted-foreground mb-2">
              {opportunity.organization || "Unknown Organization"}
            </p>
            <div className="flex items-center text-sm text-muted-foreground mb-2">
              <MapPin className="h-4 w-4 mr-1 text-vollie-green" />
              {opportunity.address || "Location not specified"}
            </div>
            <div className="flex items-center text-sm text-muted-foreground mb-2">
              <Calendar className="h-4 w-4 mr-1 text-vollie-green" />
              {opportunity.startDate
                ? format(new Date(opportunity.startDate), "PPP")
                : "Date not specified"}
              {opportunity.endDate &&
                opportunity.endDate !== opportunity.startDate && (
                  <> - {format(new Date(opportunity.endDate), "PPP")}</>
                )}
            </div>
            <div className="flex items-center text-sm text-muted-foreground mb-2">
              <Clock className="h-4 w-4 mr-1 text-vollie-green" />
              {opportunity.timeCommitment || "Time commitment not specified"}
            </div>
            <div className="flex items-center text-sm text-muted-foreground mb-2">
              <Users className="h-4 w-4 mr-1 text-vollie-green" />
              {opportunity.currentVolunteers || 0} /{" "}
              {opportunity.volunteersNeeded} volunteers
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {(opportunity?.orgIntrests || []).map(
                (tag: string, index: number) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-vollie-light-blue text-vollie-blue"
                  >
                    {tag}
                  </Badge>
                )
              ) || <Badge variant="secondary">No tags</Badge>}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    ),
    []
  );

  const handleViewMoreCampusOpportunities = async () => {
    // This is a placeholder function that simulates an API call
    // In the future, this should be replaced with an actual API call
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        // When backend is implemented, update this to fetch and add new opportunities
        resolve();
      }, 1000); // Simulate a 1-second delay
    });
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col space-y-8">
          {/* Header and Search */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-vollie-blue">
                Welcome to Vollie
              </h1>
              <p className="mt-2 text-muted-foreground">
                Volunteering for the Modern Era
              </p>
            </div>
            {true && (
              <Button
                onClick={() => {
                  toast(
                    <div className="flex flex-col gap-2">
                      <h3 className="text-lg font-semibold text-vollie-blue">Coming Soon!</h3>
                      <p className="text-sm text-muted-foreground">
                        Users cannot create opportunities... Yet! Check back soon for new features to democratize volunteering!
                      </p>
                    </div>,
                    {
                      position: "bottom-right",
                      autoClose: 5000,
                      hideProgressBar: true,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      className: "bg-card border border-border shadow-lg !text-foreground !bg-background"
                    }
                  );
                }}
                className="bg-vollie-blue hover:bg-vollie-blue/90 text-white"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Initiative
              </Button>
            )}
          </div>

          {/* Main Content Area with Filters and Opportunities */}
          <div className="flex flex-col md:flex-row gap-8">
            {/* Filters Section */}
            <div className="w-full md:w-80 flex-shrink-0">
              <div className="sticky top-24">
                <div className="space-y-6">
                  <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search opportunities..."
                      className="pl-10 w-full"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <ExploreFilters
                    filters={filters}
                    setFilters={setFilters}
                  />
                </div>
              </div>
            </div>

            {/* Opportunities Section */}
            <div className="flex-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key="opportunities"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Campus Opportunities Section */}
                  {filters.isCampus && (
                    <CampusOpportunities
                      opportunities={campusOpportunitiesData}
                      onViewMore={handleViewMoreCampusOpportunities}
                    />
                  )}

                  {/* Non-campus Opportunities Grid/List */}
                  {isLoading && <Loader />}
                  {!isLoading && !filters.isCampus && (!apiData?.pages[0]?.initiatives || apiData.pages[0].initiatives.length === 0) && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                      {opportunitiesData.map((opportunity, index) => (
                        <OpportunityCard
                          key={opportunity._id}
                          opportunity={opportunity}
                          isLast={false}
                        />
                      ))}
                    </div>
                  )}
                  {!filters.isCampus && apiData?.pages?.[0]?.initiatives && apiData.pages[0].initiatives.length > 0 && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                      {apiData?.pages?.map((page, pageIndex) =>
                        page?.initiatives?.map((opportunity, index) => {
                          const isLast =
                            pageIndex === (apiData?.pages?.length ?? 0) - 1 &&
                            index === page?.initiatives?.length - 1;
                          return (
                            <OpportunityCard
                              key={opportunity._id}
                              opportunity={opportunity}
                              isLast={isLast}
                            />
                          );
                        })
                      )}
                    </div>
                  )}
                  {isFetchingNextPage && (
                    <div className="flex justify-center items-center mt-8">
                      <p className="text-muted-foreground">Loading more...</p>
                    </div>
                  )}
                  {!hasNextPage && apiData?.pages?.[0]?.initiatives && apiData.pages[0].initiatives.length > 0 && (
                    <div className="flex justify-center items-center mt-8">
                      <p className="text-muted-foreground">No more opportunities to load</p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Opportunity Details Dialog */}
          <Dialog
            open={!!selectedOpportunity}
            onOpenChange={(open) => !open && setSelectedOpportunity(null)}
          >
            <DialogContent className="max-w-4xl overflow-hidden bg-background p-0">
              <button
                onClick={() => setSelectedOpportunity(null)}
                className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground z-50"
              >
                <X className="h-4 w-4 text-white" />
                <span className="sr-only">Close</span>
              </button>
              {selectedOpportunity && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative h-80">
                    <Image
                      src={selectedOpportunity.img || "/placeholder.svg"}
                      alt={selectedOpportunity.title}
                      layout="fill"
                      objectFit="cover"
                      className="brightness-[0.85]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h2 className="text-3xl font-bold mb-2">{selectedOpportunity.title}</h2>
                      <p className="text-lg opacity-90">{selectedOpportunity.organization}</p>
                    </div>
                  </div>

                  <div className="p-6">
                    <div 
                      className="flex items-center gap-4 mb-8 p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors cursor-pointer"
                      onClick={() => {
                        setSelectedOpportunity(null);
                        router.push(`/organizations/${selectedOpportunity.userId}`);
                      }}
                    >
                      <div className="h-12 w-12 rounded-lg overflow-hidden">
                        <Image
                          src={selectedOpportunity.img || "/placeholder.svg"}
                          alt={selectedOpportunity.organization}
                          width={48}
                          height={48}
                          className="object-cover"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-foreground hover:text-vollie-blue">
                          {selectedOpportunity.organization}
                        </h3>
                        <span className="text-muted-foreground">
                          <ChevronRight className="h-5 w-5" />
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                      <div className="bg-muted/50 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-vollie-blue mb-1">
                          <Calendar className="h-5 w-5" />
                          <span className="font-medium">Date</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {selectedOpportunity.startDate
                            ? format(new Date(selectedOpportunity.startDate), "PPP")
                            : "Not specified"}
                          {selectedOpportunity.endDate &&
                            selectedOpportunity.endDate !== selectedOpportunity.startDate && (
                              <> - {format(new Date(selectedOpportunity.endDate), "PPP")}</>
                            )}
                        </p>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-vollie-blue mb-1">
                          <Clock className="h-5 w-5" />
                          <span className="font-medium">Time Commitment</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {selectedOpportunity.timeCommitment}
                        </p>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-vollie-blue mb-1">
                          <MapPin className="h-5 w-5" />
                          <span className="font-medium">Location</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {selectedOpportunity.address}
                        </p>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-vollie-blue mb-1">
                          <Users className="h-5 w-5" />
                          <span className="font-medium">Volunteers</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {selectedOpportunity.currentVolunteers} / {selectedOpportunity.volunteersNeeded} needed
                        </p>
                      </div>
                    </div>

                    <div className="mb-8">
                      <h3 className="text-xl font-semibold mb-4">About this Initiative</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {selectedOpportunity.description}
                      </p>
                    </div>

                    <div className="mb-8">
                      <h3 className="text-xl font-semibold mb-4">Categories</h3>
                      <div className="flex flex-wrap gap-2">
                        {(selectedOpportunity.orgIntrests || []).map((tag: string, index: number) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="bg-vollie-blue/10 text-vollie-blue px-3 py-1 text-sm"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="mb-8">
                      <div className="flex justify-between text-sm text-muted-foreground mb-2">
                        <span>Volunteer Progress</span>
                        <span>{selectedOpportunity.currentVolunteers} of {selectedOpportunity.volunteersNeeded} spots filled</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-vollie-blue h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${(selectedOpportunity.currentVolunteers / selectedOpportunity.volunteersNeeded) * 100}%`
                          }}
                        />
                      </div>
                    </div>

                    <div className="flex gap-4">
                      {user ? (
                        user.userType === 2 ? (
                          <Button
                            className="flex-1 bg-vollie-blue hover:bg-vollie-blue/90 text-white py-6 text-lg"
                            onClick={() => {
                              handleSignUp(selectedOpportunity);
                              toast(
                                <div className="flex items-start gap-3">
                                  <div className="h-8 w-8 rounded-full bg-vollie-blue/10 flex items-center justify-center">
                                    <Users className="h-4 w-4 text-vollie-blue" />
                                  </div>
                                  <div>
                                    <h3 className="font-medium">Sign-up Request Sent!</h3>
                                    <p className="text-sm text-muted-foreground mt-1">
                                      Your request has been sent to {selectedOpportunity.organization}. Check your notifications for updates.
                                    </p>
                                  </div>
                                </div>,
                                {
                                  position: "bottom-right",
                                  autoClose: 5000,
                                  hideProgressBar: true,
                                  closeOnClick: true,
                                  pauseOnHover: true,
                                  draggable: true,
                                  className: "bg-card border border-border shadow-lg !text-foreground !bg-background"
                                }
                              );
                              addNotification?.({
                                type: "signup_request",
                                title: `Sign-up Request: ${selectedOpportunity.title}`,
                                message: `Your request to join "${selectedOpportunity.title}" is pending approval from ${selectedOpportunity.organization}.`
                              });
                            }}
                          >
                            Sign Up Now
                          </Button>
                        ) : (
                          <Button className="flex-1 py-6 text-lg" disabled>
                            Organizations cannot sign up
                          </Button>
                        )
                      ) : (
                        <Button
                          className="flex-1 bg-vollie-blue hover:bg-vollie-blue/90 text-white py-6 text-lg"
                          onClick={() => router.push("/login")}
                        >
                          Log in to join initiatives
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        className="px-6"
                        onClick={() => handleShare(selectedOpportunity)}
                      >
                        <Share2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}

function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}
