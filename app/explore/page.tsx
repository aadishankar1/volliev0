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
// Mock data with real images
// const opportunitiesData = [
//   {
//     id: 1,
//     title: "Cal Day Volunteer",
//     organization: "UC Berkeley Visitor Services",
//     description:
//       "Help welcome prospective students and their families during Cal Day, UC Berkeley's annual open house.",
//     image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f",
//     tags: ["Campus Event", "Tour Guide", "Customer Service"],
//     location: "UC Berkeley Campus",
//     timeCommitment: "6 hours",
//     volunteersNeeded: 50,
//     currentVolunteers: 30,
//     startDate: "2024-04-20",
//     endDate: "2024-04-20",
//     organizationDescription:
//       "UC Berkeley Visitor Services provides campus tours and information to visitors.",
//     latitude: 37.8719,
//     longitude: -122.2585,
//     status: "Open",
//   },
//   {
//     id: 2,
//     title: "Berkeley Food Pantry Assistant",
//     organization: "Berkeley Student Food Collective",
//     description:
//       "Help sort and distribute food to students in need at the UC Berkeley Food Pantry.",
//     image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c",
//     tags: ["Food Security", "Community Service", "Student Support"],
//     location: "UC Berkeley Food Pantry",
//     timeCommitment: "3 hours per week",
//     volunteersNeeded: 20,
//     currentVolunteers: 15,
//     startDate: "2024-03-01",
//     organizationDescription:
//       "The Berkeley Student Food Collective works to provide food security for all UC Berkeley students.",
//     latitude: 37.8686,
//     longitude: -122.258,
//     status: "Open",
//   },
//   {
//     id: 3,
//     title: "Big Game Week Setup",
//     organization: "Cal Athletics",
//     description:
//       "Help set up for various events during Big Game Week, leading up to the annual football game against Stanford.",
//     image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018",
//     tags: ["Sports", "Event Planning", "School Spirit"],
//     location: "Various Campus Locations",
//     timeCommitment: "4 hours per day",
//     volunteersNeeded: 40,
//     currentVolunteers: 25,
//     startDate: "2024-11-15",
//     organizationDescription:
//       "Cal Athletics oversees all intercollegiate sports at UC Berkeley.",
//     latitude: 37.8702,
//     longitude: -122.2528,
//     status: "Open",
//   },
//   {
//     id: 4,
//     title: "Library Book Drive",
//     organization: "UC Berkeley Libraries",
//     description:
//       "Assist in collecting and sorting book donations for the annual UC Berkeley Library book drive.",
//     image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66",
//     tags: ["Education", "Library", "Book Drive"],
//     location: "Doe Library",
//     timeCommitment: "Flexible, 2-4 hours per shift",
//     volunteersNeeded: 30,
//     currentVolunteers: 10,
//     startDate: "2024-03-01",
//     organizationDescription:
//       "UC Berkeley Libraries provide resources and services to support research, teaching, and learning.",
//     latitude: 37.8723,
//     longitude: -122.2596,
//     status: "Open",
//   },
//   {
//     id: 5,
//     title: "Campus Sustainability Initiative",
//     organization: "Berkeley Office of Sustainability",
//     description:
//       "Participate in various sustainability projects around campus, including waste reduction and energy conservation efforts.",
//     image: "https://images.unsplash.com/photo-1536856136534-bb679c52a9aa",
//     tags: ["Environment", "Sustainability", "Campus Improvement"],
//     location: "UC Berkeley Campus",
//     timeCommitment: "5 hours per week",
//     volunteersNeeded: 25,
//     currentVolunteers: 18,
//     startDate: "2024-04-01",
//     organizationDescription:
//       "The Berkeley Office of Sustainability leads efforts to reduce the campus's environmental footprint.",
//     latitude: 37.8715,
//     longitude: -122.2596,
//     status: "Open",
//   },
// ];

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
    queryKey: ["initiativeList", debouncedFilters],
    queryFn: initiativeList,
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
      } catch (error:any) {
        console.log("Failed to sign up for initiative:", error);
        toast.error(
          `${error}`
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
                  {!isLoading  && apiData?.pages[0]?.length === 0 && (
                    <div className="flex justify-center items-center min-h-[400px]">
                      <NoOpportunitiesCard />
                    </div>
                  )}
                  { apiData && apiData.pages?.[0]?.length > 0 && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                      {apiData?.pages?.map((page, pageIndex) =>
                        page.map((opportunity:any, index:number) => {
                          const isLast =
                            pageIndex === (apiData?.pages?.length ?? 0) - 1 &&
                            index === page.length - 1;
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
                  {!hasNextPage && apiData?.pages[0]?.length > 0 && (
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
            <DialogContent
              className="max-w-3xl"
              aria-describedby="opportunity-description"
            >
              {selectedOpportunity && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <DialogHeader>
                    <DialogTitle>{selectedOpportunity.title}</DialogTitle>
                    <DialogDescription id="opportunity-description">
                      Volunteer opportunity details for{" "}
                      {selectedOpportunity.organization}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="relative h-64 w-full mb-6">
                    <Image
                      src={selectedOpportunity.image || "/placeholder.svg"}
                      alt={selectedOpportunity.title}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-lg"
                    />
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        About the Organization
                      </h3>
                      <p className="text-muted-foreground">
                        {selectedOpportunity.organizationDescription}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        Initiative Details
                      </h3>
                      <p className="text-muted-foreground">
                        {selectedOpportunity.description}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <h4 className="font-medium">Date</h4>
                          <p className="text-muted-foreground">
                            {selectedOpportunity.startDate
                              ? format(
                                  new Date(selectedOpportunity.startDate),
                                  "PPP"
                                )
                              : "Not specified"}
                            {selectedOpportunity.endDate &&
                              selectedOpportunity.endDate !==
                                selectedOpportunity.startDate && (
                                <>
                                  {" "}
                                  -{" "}
                                  {format(
                                    new Date(selectedOpportunity.endDate),
                                    "PPP"
                                  )}
                                </>
                              )}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <h4 className="font-medium">Time Commitment</h4>
                          <p className="text-muted-foreground">
                            {selectedOpportunity.timeCommitment}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <h4 className="font-medium">Location</h4>
                          <p className="text-muted-foreground">
                            {selectedOpportunity.address}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <h4 className="font-medium">Volunteers</h4>
                          <p className="text-muted-foreground">
                            {selectedOpportunity.currentVolunteers} /{" "}
                            {selectedOpportunity.volunteersNeeded} needed
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(selectedOpportunity.tags || []).map(
                        (tag: string, index: number) => (
                          <Badge key={index} variant="secondary">
                            {tag}
                          </Badge>
                        )
                      )}
                    </div>
                  </div>
                  <div className="flex gap-4 mt-6">
                    {user ? (
                      user.userType === 2 ? (
                        <Button
                          className="flex-1"
                          onClick={() => handleSignUp(selectedOpportunity)}
                        >
                          Sign Up Now
                        </Button>
                      ) : (
                        <Button className="flex-1" disabled>
                          Organizations cannot sign up
                        </Button>
                      )
                    ) : (
                      <Button
                        className="flex-1"
                        onClick={() => router.push("/login")}
                      >
                        Log in to join initiatives
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      onClick={() => handleShare(selectedOpportunity)}
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
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
