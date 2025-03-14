"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Trash2,
  Pencil,
  FileQuestion,
  User,
  Plus,
  Search,
  UserCheck,
  Check,
  X,
  UserPlus,
  UserMinus,
  Filter,
} from "lucide-react";
import Image from "next/image";
import { Switch } from "@/components/ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "react-toastify";
import { INTEREST_CATEGORIES } from "@/lib/constants/interests";
import {
  Calendar as CalendarIcon,
} from "@/components/ui/calendar";
import { ShareInitiative } from "../components/ShareInitiative";
import { InitiativeReminder } from "../components/InitiativeReminder";

// Define interfaces
interface Volunteer {
  id: string;
  name: string;
  email: string;
  status: string;
  attended: boolean | null;
  bio?: string;
  interests?: string[];
  stats?: {
    totalHours: number;
    initiativesCount: number;
    organizationsCount: number;
  };
}

interface Initiative {
  id: string;
  title: string;
  description: string;
  date: string;
  timeCommitment: string;
  location: string;
  volunteersNeeded: number;
  currentVolunteers: number;
  status: string;
  volunteers: Volunteer[];
  startDate?: string;
  endDate?: string;
  interests?: string[];
  img?: string;
  isOnCampus?: boolean;
  isOpenInvite?: boolean;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  bio: string;
  interests: string[];
  linkedIn?: string;
  stats: {
    totalHours: number;
    initiativesCount: number;
    organizationsCount: number;
  };
}

// Mock data
const mockInitiatives: Initiative[] = [
  {
    id: "1",
    title: "Community Garden Project",
    description: "Help us create a sustainable community garden in the heart of the city. We need volunteers to help with planting, maintenance, and education programs.",
    date: "2023-11-15",
    startDate: "2023-11-15T09:00:00Z",
    endDate: undefined,
    timeCommitment: "3 hours per week",
    location: "City Park",
    volunteersNeeded: 15,
    currentVolunteers: 8,
    status: "active",
    interests: ["Environment", "Community", "Education"],
    isOpenInvite: true,
    volunteers: [
      { id: "v1", name: "Jane Smith", email: "jane@example.com", status: "approved", attended: null },
      { id: "v2", name: "Bob Johnson", email: "bob@example.com", status: "pending", attended: null },
      { id: "v3", name: "Alice Williams", email: "alice@example.com", status: "approved", attended: null },
    ]
  },
  {
    id: "2",
    title: "Tech Literacy Workshop",
    description: "Teach basic computer skills to seniors in our community center.",
    date: "July 10, 2023",
    timeCommitment: "3 hours",
    location: "Community Center",
    volunteersNeeded: 10,
    currentVolunteers: 5,
    status: "active",
    isOpenInvite: false,
    volunteers: [
      { id: "v4", name: "David Brown", email: "david@example.com", status: "approved", attended: true },
      { id: "v5", name: "Sarah Miller", email: "sarah@example.com", status: "approved", attended: false },
    ]
  },
  {
    id: "3",
    title: "Food Bank Distribution",
    description: "Help sort and distribute food to families in need at our local food bank.",
    date: "August 5, 2023",
    timeCommitment: "5 hours",
    location: "Food Bank Warehouse",
    volunteersNeeded: 20,
    currentVolunteers: 12,
    status: "completed",
    isOpenInvite: false,
    volunteers: [
      { id: "v6", name: "Michael Davis", email: "michael@example.com", status: "approved", attended: true },
      { id: "v7", name: "Emily Wilson", email: "emily@example.com", status: "approved", attended: true },
      { id: "v8", name: "James Taylor", email: "james@example.com", status: "approved", attended: false },
    ]
  }
];

const mockUserProfile: UserProfile = {
  id: "v1",
  name: "Jane Smith",
  email: "jane@example.com",
  bio: "I'm passionate about community service and environmental conservation. I've been volunteering for various causes for over 5 years.",
  linkedIn: "linkedin.com/in/janesmith",
  interests: ["Environment", "Education", "Food Security", "Community Development"],
  stats: {
    totalHours: 120,
    initiativesCount: 15,
    organizationsCount: 5
  }
};

export default function OpportunityManagementPage() {
  const { user, updateInitiative, deleteInitiative } = useAuth();
  const [initiatives, setInitiatives] = useState<Initiative[]>(mockInitiatives);
  const [selectedInitiative, setSelectedInitiative] = useState<Initiative | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editData, setEditData] = useState<Partial<Initiative>>({});
  const [isMultiDay, setIsMultiDay] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [isOnCampus, setIsOnCampus] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);

  // Filter initiatives based on search term
  const filteredInitiatives = initiatives.filter(initiative => 
    initiative.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    initiative.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    initiative.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle initiative click
  const handleInitiativeClick = (initiative: Initiative) => {
    setSelectedInitiative(initiative);
    setEditMode(false);
    setEditData({});
  };

  // Handle edit click
  const handleEditClick = () => {
    if (!selectedInitiative) return;
    setEditData({...selectedInitiative});
    setIsMultiDay(selectedInitiative.endDate ? true : false);
    // Convert date strings to Date objects for the form
    try {
      if (selectedInitiative.startDate) {
        setStartDate(new Date(selectedInitiative.startDate));
      }
      if (selectedInitiative.endDate) {
        setEndDate(new Date(selectedInitiative.endDate));
      }
    } catch (error) {
      console.error("Error parsing dates:", error);
    }
    setIsOnCampus(selectedInitiative.location === "On Campus");
    setSelectedInterests(selectedInitiative.interests || []);
    setEditMode(true);
  };

  // Handle edit cancel
  const handleEditCancel = () => {
    setEditMode(false);
  };

  // Handle edit save
  const handleEditSave = () => {
    if (!selectedInitiative) return;
    
    // Update the initiative with the edited data
    const updatedInitiatives = initiatives.map(initiative => 
      initiative.id === selectedInitiative.id 
      ? { 
          ...initiative, 
          ...editData,
          startDate: startDate?.toISOString(),
          endDate: isMultiDay ? endDate?.toISOString() : undefined,
          location: isOnCampus ? "On Campus" : editData.location,
          interests: selectedInterests,
          isOpenInvite: editData.isOpenInvite
        } as Initiative 
      : initiative
    );
    
    setInitiatives(updatedInitiatives);
    setSelectedInitiative({
      ...selectedInitiative, 
      ...editData,
      startDate: startDate?.toISOString(),
      endDate: isMultiDay ? endDate?.toISOString() : undefined,
      location: isOnCampus ? "On Campus" : editData.location,
      interests: selectedInterests,
      isOpenInvite: editData.isOpenInvite
    } as Initiative);
    setEditMode(false);
    
    // In a real app, you would save to the backend here
    toast.success("Initiative updated successfully");
  };

  // Handle delete initiative
  const handleDeleteInitiative = () => {
    if (!selectedInitiative) return;
    
    // Remove the initiative from the local state
    const updatedInitiatives = initiatives.filter(
      initiative => initiative.id !== selectedInitiative.id
    );
    
    setInitiatives(updatedInitiatives);
    setSelectedInitiative(null);
    setShowDeleteConfirm(false);
    
    // Here you would also make an API call to delete the initiative
    if (deleteInitiative) {
      deleteInitiative(selectedInitiative.id);
    }
  };

  // Handle attendance update
  const handleAttendanceUpdate = (volunteerId: string, attended: boolean | null) => {
    if (!selectedInitiative) return;
    
    // Update volunteer attendance status in the local state
    const updatedInitiative = {
      ...selectedInitiative,
      volunteers: selectedInitiative.volunteers.map(v => 
        v.id === volunteerId ? { ...v, attended } : v
      )
    } as Initiative;
    
    // Update the initiative in the initiatives array
    const updatedInitiatives = initiatives.map(initiative => 
      initiative.id === selectedInitiative.id ? updatedInitiative : initiative
    );
    
    setInitiatives(updatedInitiatives);
    setSelectedInitiative(updatedInitiative);
    
    // Here you would also make an API call to update the volunteer attendance
  };

  // Handle volunteer status update
  const handleVolunteerStatusUpdate = (volunteerId: string, status: string) => {
    if (!selectedInitiative) return;
    
    // Update volunteer status in the local state
    const updatedInitiative = {
      ...selectedInitiative,
      volunteers: selectedInitiative.volunteers.map(v => 
        v.id === volunteerId ? { ...v, status } : v
      )
    } as Initiative;
    
    // Update the initiative in the initiatives array
    const updatedInitiatives = initiatives.map(initiative => 
      initiative.id === selectedInitiative.id ? updatedInitiative : initiative
    );
    
    setInitiatives(updatedInitiatives);
    setSelectedInitiative(updatedInitiative);
    
    // Here you would also make an API call to update the volunteer status
  };

  // Handle hours logged
  const handleHoursLogged = (volunteerId: string, hours: number) => {
    // In a real implementation, you would store the hours logged for each volunteer
    console.log(`Logged ${hours} hours for volunteer ${volunteerId}`);
    
    // Here you would make an API call to log the hours
  };

  // Handle user profile click
  const handleUserClick = (userId: string) => {
    // In production, fetch user data from API
    setSelectedUser(mockUserProfile);
  };

  // Handle interest toggle
  const handleInterestToggle = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else if (selectedInterests.length < 3) {
      setSelectedInterests([...selectedInterests, interest]);
    } else {
      toast.error("You can select up to 3 interests for an initiative.");
    }
  };

  // Check if user is authenticated and is an organization
  if (!user || user.userType !== 1) {
    return (
      <div className="container mx-auto p-6 pt-20 flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
        <p className="text-muted-foreground">
          This page is only accessible to organization accounts.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 pt-20">
      <h1 className="text-3xl font-bold mb-6">Opportunity Management</h1>
      
      {/* Search bar */}
      <div className="mb-6">
        <Input
          type="text"
          placeholder="Search opportunities..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>
      
      {/* Main content area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Initiatives list */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <div className="p-4 border-b">
              <h2 className="text-xl font-semibold">Your Initiatives</h2>
            </div>
            <ScrollArea className="h-[calc(100vh-250px)]">
              <div className="p-4 space-y-4">
                {filteredInitiatives.length > 0 ? (
                  filteredInitiatives.map((initiative) => (
                    <Card 
                      key={initiative.id} 
                      className={`cursor-pointer hover:bg-accent transition-colors ${
                        selectedInitiative?.id === initiative.id ? 'border-primary' : ''
                      }`}
                      onClick={() => handleInitiativeClick(initiative)}
                    >
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium">{initiative.title}</h3>
                          <div className="flex items-center gap-2">
                            {initiative.isOpenInvite && (
                              <Badge variant="outline" className="border-green-500 text-green-500 text-xs">
                                <UserCheck className="h-3 w-3 mr-1" />
                                Open Invite
                              </Badge>
                            )}
                            <Badge variant={
                              initiative.status === 'active' ? 'default' :
                              initiative.status === 'completed' ? 'secondary' : 'outline'
                            }>
                              {initiative.status.charAt(0).toUpperCase() + initiative.status.slice(1)}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground mb-2 line-clamp-2">
                          {initiative.description}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span className="mr-3">{initiative.date}</span>
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{initiative.location}</span>
                        </div>
                        <div className="mt-2 flex items-center text-sm">
                          <Users className="h-4 w-4 mr-1" />
                          <span>{initiative.currentVolunteers}/{initiative.volunteersNeeded} volunteers</span>
                        </div>
                      </div>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No initiatives found
                  </div>
                )}
              </div>
            </ScrollArea>
            <div className="p-4 border-t">
              <Button className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Create New Initiative
              </Button>
            </div>
          </Card>
        </div>
        
        {/* Initiative details and volunteer management */}
        <div className="lg:col-span-2">
          {selectedInitiative ? (
            <Card className="h-full">
              {/* Initiative details header */}
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="text-xl font-semibold">Initiative Details</h2>
                <div className="flex space-x-2">
                  {!editMode && (
                    <>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleEditClick}
                        className="border-vollie-blue text-vollie-blue hover:bg-vollie-blue/10"
                      >
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setShowDeleteConfirm(true)}
                        className="border-destructive text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </>
                  )}
                </div>
              </div>
              
              {/* Initiative details content */}
              <div className="p-6">
                {editMode ? (
                  /* Edit mode form */
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={editData.title || ''}
                        onChange={(e) => setEditData({...editData, title: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="image">Initiative Image</Label>
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            // In a real app, you would upload the image to a server
                            // For now, we'll just update the editData with a string URL
                            const imageUrl = URL.createObjectURL(e.target.files[0]);
                            setEditData({...editData, img: imageUrl as any});
                          }
                        }}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Initiative Details</Label>
                      <Textarea
                        id="description"
                        value={editData.description || ''}
                        onChange={(e) => setEditData({...editData, description: e.target.value})}
                        rows={4}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="multi-day"
                          checked={isMultiDay}
                          onCheckedChange={setIsMultiDay}
                        />
                        <Label htmlFor="multi-day">Multi-day Initiative</Label>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="startDate">Start Date</Label>
                          <Input
                            id="startDate"
                            type="date"
                            value={startDate ? format(startDate, "yyyy-MM-dd") : ''}
                            onChange={(e) => {
                              if (e.target.value) {
                                setStartDate(new Date(e.target.value));
                              } else {
                                setStartDate(undefined);
                              }
                            }}
                          />
                        </div>
                        {isMultiDay && (
                          <div className="space-y-2">
                            <Label htmlFor="endDate">End Date</Label>
                            <Input
                              id="endDate"
                              type="date"
                              value={endDate ? format(endDate, "yyyy-MM-dd") : ''}
                              onChange={(e) => {
                                if (e.target.value) {
                                  setEndDate(new Date(e.target.value));
                                } else {
                                  setEndDate(undefined);
                                }
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="timeCommitment">Estimated Time Commitment</Label>
                      <Input
                        id="timeCommitment"
                        value={editData.timeCommitment || ''}
                        onChange={(e) => setEditData({...editData, timeCommitment: e.target.value})}
                        placeholder="e.g., 2 hours per day, 10 hours total"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="on-campus"
                          checked={isOnCampus}
                          onCheckedChange={setIsOnCampus}
                        />
                        <Label htmlFor="on-campus">On Campus</Label>
                      </div>
                      {!isOnCampus && (
                        <Input
                          id="location"
                          value={editData.location || ''}
                          onChange={(e) => setEditData({...editData, location: e.target.value})}
                          placeholder="Enter address"
                        />
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="volunteersNeeded">Volunteers Needed</Label>
                      <Input
                        id="volunteersNeeded"
                        type="number"
                        value={editData.volunteersNeeded || ''}
                        onChange={(e) => setEditData({...editData, volunteersNeeded: parseInt(e.target.value)})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <select
                        id="status"
                        className="w-full p-2 border rounded-md"
                        value={editData.status || ''}
                        onChange={(e) => setEditData({...editData, status: e.target.value})}
                      >
                        <option value="upcoming">Upcoming</option>
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2 p-4 border rounded-md bg-muted/30 mb-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <div className="flex items-center">
                            <UserCheck className="h-4 w-4 mr-2 text-vollie-blue" />
                            <Label htmlFor="open-invite" className="font-medium">Open Invite</Label>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Automatically approve all volunteer applications
                          </p>
                        </div>
                        <Switch
                          id="open-invite"
                          checked={editData.isOpenInvite || false}
                          onCheckedChange={(checked) => setEditData({...editData, isOpenInvite: checked})}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <Label>Initiative Categories</Label>
                      <p className="text-sm text-muted-foreground mb-2">
                        Select up to 3 categories that best describe this initiative
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {selectedInterests.map((interest) => (
                          <Badge
                            key={interest}
                            variant="default"
                            className="cursor-pointer bg-vollie-blue hover:bg-vollie-blue/90"
                            onClick={() => handleInterestToggle(interest)}
                          >
                            {interest} ×
                          </Badge>
                        ))}
                      </div>
                      <ScrollArea className="h-[200px] rounded-md border p-4">
                        <Accordion type="multiple" className="w-full">
                          {INTEREST_CATEGORIES.map((category) => (
                            <AccordionItem key={category.name} value={category.name}>
                              <AccordionTrigger className="text-sm font-medium">
                                {category.name}
                              </AccordionTrigger>
                              <AccordionContent>
                                <div className="flex flex-wrap gap-2 pt-2">
                                  {category.interests.map((interest) => (
                                    <Badge
                                      key={interest}
                                      variant={selectedInterests.includes(interest) ? "default" : "outline"}
                                      className={`cursor-pointer ${
                                        selectedInterests.includes(interest)
                                          ? "bg-vollie-blue hover:bg-vollie-blue/90"
                                          : "hover:bg-vollie-blue/10"
                                      }`}
                                      onClick={() => handleInterestToggle(interest)}
                                    >
                                      {interest}
                                    </Badge>
                                  ))}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </ScrollArea>
                    </div>
                    
                    <div className="flex justify-end space-x-2 pt-4">
                      <Button variant="outline" onClick={handleEditCancel}>Cancel</Button>
                      <Button 
                        onClick={handleEditSave}
                        className="bg-vollie-blue hover:bg-vollie-blue/90 text-white"
                        disabled={selectedInterests.length === 0}
                      >
                        Save Changes
                      </Button>
                    </div>
                  </div>
                ) : (
                  /* View mode */
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <div className="aspect-video rounded-lg overflow-hidden bg-muted mb-4">
                          {selectedInitiative.img ? (
                            <img 
                              src={selectedInitiative.img} 
                              alt={selectedInitiative.title} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                              No image available
                            </div>
                          )}
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {selectedInitiative.interests?.map((interest, index) => (
                            <Badge key={index} variant="secondary">
                              {interest}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Badge variant={selectedInitiative.isOnCampus ? "default" : "outline"}>
                              {selectedInitiative.isOnCampus ? "On Campus" : "Off Campus"}
                            </Badge>
                            {selectedInitiative.isOpenInvite && (
                              <Badge variant="outline" className="border-green-500 text-green-500">
                                Open Invite
                              </Badge>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <InitiativeReminder 
                              initiative={{
                                id: selectedInitiative.id,
                                title: selectedInitiative.title,
                                description: selectedInitiative.description || "",
                                startDate: selectedInitiative.startDate || new Date().toISOString(),
                                endDate: selectedInitiative.endDate,
                                location: selectedInitiative.location
                              }}
                            />
                            <ShareInitiative 
                              initiative={{
                                id: selectedInitiative.id,
                                title: selectedInitiative.title,
                                description: selectedInitiative.description || ""
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h2 className="text-2xl font-bold mb-2">{selectedInitiative.title}</h2>
                        <p className="text-muted-foreground mb-4">{selectedInitiative.description}</p>
                        
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center">
                            <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
                            <div>
                              <div className="text-sm font-medium">Date</div>
                              <div className="text-sm text-muted-foreground">
                                {selectedInitiative.startDate ? format(new Date(selectedInitiative.startDate), "PPP") : "Not set"}
                                {selectedInitiative.endDate && selectedInitiative.endDate !== selectedInitiative.startDate && 
                                  ` - ${format(new Date(selectedInitiative.endDate), "PPP")}`
                                }
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
                            <div>
                              <div className="text-sm font-medium">Time Commitment</div>
                              <div className="text-sm text-muted-foreground">{selectedInitiative.timeCommitment || "Not specified"}</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            <MapPin className="h-5 w-5 mr-2 text-muted-foreground" />
                            <div>
                              <div className="text-sm font-medium">Location</div>
                              <div className="text-sm text-muted-foreground">{selectedInitiative.location || "Not specified"}</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            <Users className="h-5 w-5 mr-2 text-muted-foreground" />
                            <div>
                              <div className="text-sm font-medium">Volunteers</div>
                              <div className="text-sm text-muted-foreground">
                                {selectedInitiative.volunteers?.length || 0} / {selectedInitiative.volunteersNeeded || 0}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <Separator className="my-6" />
                    
                    {/* Volunteer management section */}
                    <div>
                      <h3 className="text-lg font-medium mb-4">Volunteer Management</h3>
                      
                      {selectedInitiative.volunteers.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left py-2 px-4">Name</th>
                                <th className="text-left py-2 px-4">Email</th>
                                <th className="text-left py-2 px-4">Status</th>
                                <th className="text-left py-2 px-4">Attendance</th>
                                <th className="text-left py-2 px-4">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {selectedInitiative.volunteers.map((volunteer) => (
                                <tr key={volunteer.id} className="border-b hover:bg-accent/50">
                                  <td className="py-2 px-4">
                                    <button 
                                      className="text-primary hover:underline"
                                      onClick={() => handleUserClick(volunteer.id)}
                                    >
                                      {volunteer.name}
                                    </button>
                                  </td>
                                  <td className="py-2 px-4">{volunteer.email}</td>
                                  <td className="py-2 px-4">
                                    <select
                                      value={volunteer.status}
                                      onChange={(e) => handleVolunteerStatusUpdate(volunteer.id, e.target.value)}
                                      className="p-1 border rounded text-sm"
                                    >
                                      <option value="pending">Pending</option>
                                      <option value="approved">Approved</option>
                                      <option value="declined">Declined</option>
                                    </select>
                                  </td>
                                  <td className="py-2 px-4">
                                    <select
                                      value={volunteer.attended === null ? '' : volunteer.attended ? 'yes' : 'no'}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        handleAttendanceUpdate(
                                          volunteer.id, 
                                          value === '' ? null : value === 'yes'
                                        );
                                      }}
                                      className="p-1 border rounded text-sm"
                                    >
                                      <option value="">Not recorded</option>
                                      <option value="yes">Attended</option>
                                      <option value="no">No-show</option>
                                    </select>
                                  </td>
                                  <td className="py-2 px-4">
                                    <Button variant="outline" size="sm">
                                      <Clock className="h-3 w-3 mr-1" />
                                      Log Hours
                                    </Button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          No volunteers have signed up yet
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center p-6">
              <div className="text-center">
                <FileQuestion className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Initiative Selected</h3>
                <p className="text-muted-foreground mb-4">
                  Select an initiative from the list to view details and manage volunteers
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
      
      {/* Delete confirmation dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the initiative
              and remove all associated volunteer data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteInitiative} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* User profile dialog */}
      <Dialog open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Volunteer Profile</DialogTitle>
            <DialogDescription>
              View detailed information about this volunteer
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">{selectedUser.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="text-sm font-medium mb-2">Bio</h4>
                <p className="text-sm text-muted-foreground">{selectedUser.bio}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Interests</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedUser.interests.map((interest, index) => (
                    <Badge key={index} variant="secondary">{interest}</Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Statistics</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-2 bg-accent rounded-md">
                    <div className="text-2xl font-bold">{selectedUser.stats.totalHours}</div>
                    <div className="text-xs text-muted-foreground">Hours</div>
                  </div>
                  <div className="text-center p-2 bg-accent rounded-md">
                    <div className="text-2xl font-bold">{selectedUser.stats.initiativesCount}</div>
                    <div className="text-xs text-muted-foreground">Initiatives</div>
                  </div>
                  <div className="text-center p-2 bg-accent rounded-md">
                    <div className="text-2xl font-bold">{selectedUser.stats.organizationsCount}</div>
                    <div className="text-xs text-muted-foreground">Organizations</div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setSelectedUser(null)}>Close</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
