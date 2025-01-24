"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { ExploreFilters, type Filters } from "../components/explore-filters"
import { Search, MapPin, Calendar, Clock, Users, Share2, Plus, Sparkles } from "lucide-react"
import Image from "next/image"
import { useAuth } from "../context/AuthContext"
import Link from "next/link"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AddInitiativeForm } from "../components/AddInitiativeForm"
import { motion, AnimatePresence } from "framer-motion"

// Mock data with real images
const opportunitiesData = [
  {
    id: 1,
    title: "Youth Tutoring Program",
    organization: "Education First",
    description: "Help underprivileged students with their studies. Subjects include Math, Science, and English.",
    image: "https://images.unsplash.com/photo-1577896851231-70ef18881754",
    tags: ["Education", "Youth", "Teaching"],
    location: "Local Community Center, Miami",
    timeCommitment: "2 hours per week",
    volunteersNeeded: 15,
    currentVolunteers: 8,
    startDate: "2024-02-01",
    organizationDescription:
      "Education First is dedicated to providing equal educational opportunities to all students.",
    latitude: 25.7617,
    longitude: -80.1918,
    status: "Open",
  },
  {
    id: 2,
    title: "Food Bank Distribution",
    organization: "Community Pantry",
    description: "Support our local food bank in sorting and distributing food to families in need.",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97",
    tags: ["Community", "Food Security", "Poverty"],
    location: "Downtown Food Bank, Miami",
    timeCommitment: "3 hours per shift",
    volunteersNeeded: 20,
    currentVolunteers: 12,
    startDate: "2024-02-03",
    organizationDescription: "Community Pantry works to eliminate hunger in our local community.",
    latitude: 25.775,
    longitude: -80.1918,
    status: "Open",
  },
  {
    id: 3,
    title: "Senior Tech Support",
    organization: "Digital Bridge",
    description: "Help seniors learn to use modern technology and stay connected with their loved ones.",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    tags: ["Technology", "Elderly Care", "Education"],
    location: "Senior Center, Miami",
    timeCommitment: "2 hours per week",
    volunteersNeeded: 10,
    currentVolunteers: 4,
    startDate: "2024-02-05",
    organizationDescription: "Digital Bridge aims to close the digital divide for seniors.",
    latitude: 25.7617,
    longitude: -80.1918,
    status: "Open",
  },
  {
    id: 4,
    title: "Community Garden Project",
    organization: "Green Spaces",
    description: "Help maintain and grow our community garden that provides fresh produce to local food banks.",
    image: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131",
    tags: ["Environment", "Gardening", "Food Security"],
    location: "Community Garden, Miami",
    timeCommitment: "4 hours per week",
    volunteersNeeded: 12,
    currentVolunteers: 6,
    startDate: "2024-02-07",
    organizationDescription: "Green Spaces creates sustainable community gardens for food security.",
    latitude: 25.7617,
    longitude: -80.1918,
    status: "Open",
  },
  {
    id: 5,
    title: "Animal Shelter Care",
    organization: "Paws & Care",
    description: "Spend time with shelter animals, help with feeding, cleaning, and socialization.",
    image: "https://images.unsplash.com/photo-1518020387441-85e7a2c078be",
    tags: ["Animals", "Care", "Community"],
    location: "City Animal Shelter, Miami",
    timeCommitment: "3 hours per shift",
    volunteersNeeded: 8,
    currentVolunteers: 3,
    startDate: "2024-02-10",
    organizationDescription: "Paws & Care provides shelter and care for abandoned animals.",
    latitude: 25.7617,
    longitude: -80.1918,
    status: "Open",
  },
  {
    id: 6,
    title: "Library Reading Program",
    organization: "City Library",
    description: "Read stories to children and help with after-school library programs.",
    image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36",
    tags: ["Education", "Youth", "Reading"],
    location: "Public Library, Miami",
    timeCommitment: "2 hours per week",
    volunteersNeeded: 6,
    currentVolunteers: 2,
    startDate: "2024-02-12",
    organizationDescription: "City Library promotes literacy and learning in our community.",
    latitude: 25.7617,
    longitude: -80.1918,
    status: "Open",
  },
]

const volunteersData = [
  {
    id: 1,
    name: "Alice Johnson",
    avatar: "https://i.pravatar.cc/150?img=1",
    skills: ["Teaching", "Mentoring", "Event Planning"],
    interests: ["Education", "Youth", "Community Development"],
    location: "Miami, FL",
    availability: "Weekends",
    experience: "3 years",
  },
  {
    id: 2,
    name: "Bob Smith",
    avatar: "https://i.pravatar.cc/150?img=2",
    skills: ["Web Development", "Graphic Design", "Social Media Management"],
    interests: ["Technology", "Arts", "Environmental Conservation"],
    location: "Miami, FL",
    availability: "Evenings",
    experience: "5 years",
  },
  {
    id: 3,
    name: "Carol Martinez",
    avatar: "https://i.pravatar.cc/150?img=3",
    skills: ["First Aid", "Elderly Care", "Fundraising"],
    interests: ["Healthcare", "Senior Support", "Animal Welfare"],
    location: "Miami Beach, FL",
    availability: "Flexible",
    experience: "2 years",
  },
  {
    id: 4,
    name: "David Lee",
    avatar: "https://i.pravatar.cc/150?img=4",
    skills: ["Project Management", "Public Speaking", "Grant Writing"],
    interests: ["Poverty Alleviation", "Education", "Disaster Relief"],
    location: "Coral Gables, FL",
    availability: "Weekdays",
    experience: "7 years",
  },
  {
    id: 5,
    name: "Emma Wilson",
    avatar: "https://i.pravatar.cc/150?img=5",
    skills: ["Language Translation", "Cultural Awareness", "Event Coordination"],
    interests: ["International Aid", "Cultural Exchange", "Refugee Support"],
    location: "Miami, FL",
    availability: "Weekends and Evenings",
    experience: "4 years",
  },
]

export interface Filters {
  date: Date | undefined
  radius: number
  isVirtual: boolean
}

export default function ExplorePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState<Filters>({
    date: undefined,
    radius: 10,
    isVirtual: false,
  })
  const [opportunities, setOpportunities] = useState<typeof opportunitiesData>([])
  const [volunteers, setVolunteers] = useState<typeof volunteersData>([])
  const { toast } = useToast()
  const { user, getPersonalizedRecommendations } = useAuth()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [recommendedOpportunities, setRecommendedOpportunities] = useState<typeof opportunitiesData>([])
  const [selectedOpportunity, setSelectedOpportunity] = useState<(typeof opportunitiesData)[0] | null>(null)
  const [activeTab, setActiveTab] = useState<"opportunities" | "volunteers">("opportunities")

  const memoizedGetPersonalizedRecommendations = useCallback(getPersonalizedRecommendations, [
    getPersonalizedRecommendations,
  ])

  useEffect(() => {
    // In a real application, you would fetch this data from an API
    setOpportunities(opportunitiesData)
    setVolunteers(volunteersData)
  }, [])

  useEffect(() => {
    if (user && opportunities) {
      const recommendations = memoizedGetPersonalizedRecommendations(opportunities)
      setRecommendedOpportunities(recommendations)
    }
  }, [user, memoizedGetPersonalizedRecommendations, opportunities])

  const handleSignUp = useCallback(
    (opportunity: any) => {
      toast({
        title: "Request Sent! 🎉",
        description: `Your request to join "${opportunity.title}" has been sent to ${opportunity.organization}.`,
      })
      setSelectedOpportunity(null)
    },
    [toast],
  )

  const handleShare = useCallback(
    async (opportunity: any) => {
      try {
        await navigator.share({
          title: opportunity.title,
          text: `Check out this volunteer opportunity: ${opportunity.title} with ${opportunity.organization}`,
          url: window.location.href,
        })
      } catch (err) {
        toast({
          title: "Link Copied! 🔗",
          description: "The opportunity link has been copied to your clipboard.",
        })
      }
    },
    [toast],
  )

  const filteredOpportunities = opportunities.filter((opp) => {
    const matchesSearch =
      opp.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      false ||
      opp.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      false ||
      opp.tags?.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
      false

    const matchesVirtual = !filters.isVirtual || opp.location?.toLowerCase().includes("virtual") || false

    return matchesSearch && matchesVirtual
  })

  const filteredVolunteers = volunteers.filter((vol) => {
    const matchesSearch =
      vol.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      false ||
      vol.skills?.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
      false ||
      vol.interests?.some((interest) => interest.toLowerCase().includes(searchTerm.toLowerCase())) ||
      false

    return matchesSearch
  })

  const OpportunityCard = useCallback(
    ({ opportunity }: { opportunity: (typeof opportunitiesData)[0] }) => (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <Card
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => setSelectedOpportunity(opportunity)}
        >
          <div className="relative h-48 w-full">
            <Image
              src={opportunity.image || "/placeholder.svg"}
              alt={opportunity.title || "Volunteer Opportunity"}
              layout="fill"
              objectFit="cover"
              className="rounded-t-lg"
              priority={false}
              loading="lazy"
            />
            <div className="absolute top-2 right-2">
              <Badge variant={opportunity.status === "Open" ? "default" : "secondary"}>
                {opportunity.status || "Unknown"}
              </Badge>
            </div>
          </div>
          <CardContent className="p-4">
            <h3 className="text-xl font-semibold mb-2">{opportunity.title || "Untitled Opportunity"}</h3>
            <p className="text-sm text-muted-foreground mb-2">{opportunity.organization || "Unknown Organization"}</p>
            <div className="flex items-center text-sm text-muted-foreground mb-2">
              <MapPin className="h-4 w-4 mr-1" />
              {opportunity.location || "Location not specified"}
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {opportunity.tags?.map((tag, index) => (
                <Badge key={index} variant="secondary">
                  {tag}
                </Badge>
              )) || <Badge variant="secondary">No tags</Badge>}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    ),
    [setSelectedOpportunity],
  )

  const VolunteerCard = useCallback(
    ({ volunteer }: { volunteer: (typeof volunteersData)[0] }) => (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <Image
                src={volunteer.avatar || "/placeholder.svg"}
                alt={volunteer.name || "Volunteer"}
                width={64}
                height={64}
                className="rounded-full"
              />
              <div>
                <h3 className="text-xl font-semibold">{volunteer.name || "Anonymous Volunteer"}</h3>
                <p className="text-sm text-muted-foreground">{volunteer.location || "Location not specified"}</p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold">Experience:</span> {volunteer.experience || "Not specified"}
              </p>
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold">Availability:</span> {volunteer.availability || "Not specified"}
              </p>
            </div>
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Skills:</h4>
              <div className="flex flex-wrap gap-2">
                {volunteer.skills?.map((skill, index) => (
                  <Badge key={index} variant="secondary">
                    {skill}
                  </Badge>
                )) || <Badge variant="secondary">No skills specified</Badge>}
              </div>
            </div>
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Interests:</h4>
              <div className="flex flex-wrap gap-2">
                {volunteer.interests?.map((interest, index) => (
                  <Badge key={index} variant="outline">
                    {interest}
                  </Badge>
                )) || <Badge variant="outline">No interests specified</Badge>}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    ),
    [],
  )

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col space-y-8">
          {/* Header and Search */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Welcome to Volunteen</h1>
              <p className="mt-2 text-muted-foreground">
                Discover and connect with volunteers and opportunities in your community.
              </p>
            </div>
            {user && user.type === "organization" && (
              <Button onClick={() => setIsModalOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Initiative
              </Button>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder={`Search ${activeTab === "opportunities" ? "opportunities" : "volunteers"}...`}
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <ExploreFilters onFilterChange={setFilters} />

          <div className="mb-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 lg:max-w-[400px]">
                <TabsTrigger value="opportunities">Find Opportunities</TabsTrigger>
                {user && user.type === "organization" ? (
                  <TabsTrigger value="volunteers">Find Volunteers</TabsTrigger>
                ) : (
                  <TabsTrigger value="volunteers" disabled>
                    Find Volunteers
                  </TabsTrigger>
                )}
              </TabsList>
              {/*rest of Tabs component*/}
            </Tabs>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "opportunities" && (
              <motion.div
                key="opportunities"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* AI Recommendations */}
                {recommendedOpportunities.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 flex items-center">
                      <Sparkles className="mr-2 h-5 w-5 text-yellow-500" />
                      Recommended for You
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {recommendedOpportunities.map((opportunity) => (
                        <OpportunityCard key={opportunity.id} opportunity={opportunity} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Opportunities Grid/List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredOpportunities.map((opportunity) => (
                    <OpportunityCard key={opportunity.id} opportunity={opportunity} />
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === "volunteers" && user && user.type === "organization" && (
              <motion.div
                key="volunteers"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredVolunteers.map((volunteer) => (
                    <VolunteerCard key={volunteer.id} volunteer={volunteer} />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <Button
            className="fixed bottom-4 right-4 rounded-full p-0 w-16 h-16 bg-primary hover:bg-primary/90"
            onClick={() => setIsModalOpen(true)}
            aria-label="Add Initiative"
          >
            <Plus className="h-6 w-6" />
          </Button>

          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="max-w-4xl">
              <AddInitiativeForm onClose={() => setIsModalOpen(false)} />
            </DialogContent>
          </Dialog>

          {/* Opportunity Details Dialog */}
          <Dialog open={!!selectedOpportunity} onOpenChange={(open) => !open && setSelectedOpportunity(null)}>
            <DialogContent className="max-w-3xl">
              {selectedOpportunity && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-2xl font-bold mb-4">{selectedOpportunity.title}</h2>
                  <p className="text-muted-foreground mb-4">{selectedOpportunity.organization}</p>
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
                      <h3 className="text-lg font-semibold mb-2">About the Organization</h3>
                      <p className="text-muted-foreground">{selectedOpportunity.organizationDescription}</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Initiative Details</h3>
                      <p className="text-muted-foreground">{selectedOpportunity.description}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <h4 className="font-medium">Start Date</h4>
                          <p className="text-muted-foreground">{selectedOpportunity.startDate}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <h4 className="font-medium">Time Commitment</h4>
                          <p className="text-muted-foreground">{selectedOpportunity.timeCommitment}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <h4 className="font-medium">Location</h4>
                          <p className="text-muted-foreground">{selectedOpportunity.location}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <h4 className="font-medium">Volunteers</h4>
                          <p className="text-muted-foreground">
                            {selectedOpportunity.currentVolunteers} / {selectedOpportunity.volunteersNeeded} needed
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedOpportunity.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-4 mt-6">
                    <Button className="flex-1" onClick={() => handleSignUp(selectedOpportunity)}>
                      Sign Up Now
                    </Button>
                    <Button variant="outline" onClick={() => handleShare(selectedOpportunity)}>
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
  )
}

