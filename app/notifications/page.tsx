"use client";

import { useCallback, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  CheckCircle,
  Calendar,
  LogIn,
  UserPlus,
  Users,
  Clock,
  AlertTriangle,
  ThumbsUp,
  ThumbsDown,
  X,
  Edit,
  UserCheck,
  UserX,
  CheckCircle2,
  XCircle,
  MapPin,
  ChevronRight,
  Upload,
  Trash2,
  Linkedin,
  Building2,
  Share2
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import {
  acceptInitiative,
  assignInitiativeList,
} from "@/services/apiAction/initiative";
import {
  useQuery,
  useInfiniteQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { uploadMedia } from "@/services/uploadMedia";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Volunteer {
  id: string;
  name: string;
  email: string;
  status: string;
  attended?: boolean;
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
  img?: string;
  organization: string;
}

// Add new interface for User Profile
interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  linkedIn?: string;
  interests: string[];
  stats: {
    totalHours: number;
    initiativesCount: number;
    organizationsCount: number;
  };
}

// Mock data - replace with actual API calls
const mockNotifications = [
  {
    id: "1",
    type: "signup_request",
    initiativeId: "init1",
    initiativeTitle: "Tech Literacy Workshop",
    volunteerName: "John Doe",
    volunteerEmail: "john@berkeley.edu",
    timestamp: new Date().toISOString(),
    status: "pending"
  },
  {
    id: "2",
    type: "signup_request",
    initiativeId: "init2",
    initiativeTitle: "Community Garden Project",
    volunteerName: "Jane Smith",
    volunteerEmail: "jane@berkeley.edu",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    status: "approved"
  },
  {
    id: "3",
    type: "signup_request",
    initiativeId: "init3",
    initiativeTitle: "Food Bank Distribution",
    volunteerName: "Mike Johnson",
    volunteerEmail: "mike@berkeley.edu",
    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    status: "declined"
  }
];

// Mock data for organization's initiatives
const mockInitiatives = [
  {
    id: "1",
    title: "Community Garden Project",
    description: "Join us in creating and maintaining a sustainable community garden that will provide fresh produce for local food banks and teach sustainable gardening practices to the community.",
    date: "March 14th, 2024",
    timeCommitment: "4 hours per week",
    location: "Berkeley Community Center",
    volunteersNeeded: 25,
    currentVolunteers: 8,
    status: "active",
    volunteers: [
      { id: "v1", name: "John Doe", email: "john@berkeley.edu", status: "pending" },
      { id: "v2", name: "Jane Smith", email: "jane@berkeley.edu", status: "confirmed" },
    ]
  },
  // ... other initiatives
];

// Add mock user data (replace with API call in production)
const mockUserProfile: UserProfile = {
  id: "u1",
  name: "John Doe",
  email: "john@berkeley.edu",
  avatar: "/placeholder-avatar.png",
  bio: "Passionate about community service and making a difference in education and sustainability.",
  linkedIn: "https://linkedin.com/in/johndoe",
  interests: ["Education", "Environment", "Community Development"],
  stats: {
    totalHours: 45,
    initiativesCount: 8,
    organizationsCount: 3
  }
};

export default function NotificationsPage() {
  const {
    user,
    markNotificationAsRead,
    cancelSignUp,
    updateInitiative,
    deleteInitiative,
    getUserfromToken,
  } = useAuth();
  const [editingEvent, setEditingEvent] = useState(null);
  const loggedInUser: any = getUserfromToken();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isFetching,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["assignInitiative"],
    queryFn: assignInitiativeList,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
  });
  const [actionLoading, setActionLoading] = useState(false);
  const notification: any = data?.pages;
  const queryClient = useQueryClient();
  const status = ["Pending", "Accepted", "Rejected"];
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
  const getIcon = (type: string) => {
    switch (type) {
      case "initiative_signup":
        return <Calendar className="h-5 w-5 text-blue-500" />;
      case "achievement_unlocked":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "friend_request":
        return <UserPlus className="h-5 w-5 text-purple-500" />;
      case "team_invite":
        return <Users className="h-5 w-5 text-yellow-500" />;
      case "initiative_reminder":
        return <Clock className="h-5 w-5 text-orange-500" />;
      case "signup_request":
        return <UserPlus className="h-5 w-5 text-blue-500" />;
      case "signup_accepted":
        return <ThumbsUp className="h-5 w-5 text-green-500" />;
      case "signup_declined":
        return <ThumbsDown className="h-5 w-5 text-red-500" />;
      case "initiative_posted":
        return <Calendar className="h-5 w-5 text-purple-500" />;
      case "initiative_tomorrow":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };
  const initiativeAction = async (data: any, status: number) => {
    setActionLoading(true);
    await acceptInitiative({ ...data, status });
    queryClient.setQueryData(["assignInitiative"], (oldData: any) => {
      if (!oldData) return oldData;
      const itrateData: any = Array.isArray(oldData.pages)
        ? oldData.pages
        : oldData;
      const updatedData = itrateData.map((itrArr: any) =>
        itrArr.map((oldNotifData: any) => {
          if (oldNotifData._id == data._id) {
            return { ...oldNotifData, status };
          } else return oldNotifData;
        })
      );
      return { ...oldData, pages: updatedData };
    });
    setActionLoading(false);
  };
  const handleEditEvent = (event: any) => {
    setEditingEvent(event);
  };

  const handleUpdateEvent = async (updatedEvent: any) => {
    try {
      await updateInitiative(updatedEvent.id, updatedEvent);
      setEditingEvent(null);
      // Refresh the events list or update the local state
    } catch (error) {
      console.error("Failed to update event:", error);
    }
  };

  const handleDeleteEvent = async (eventId: any) => {
    try {
      await deleteInitiative(eventId);
      // Refresh the events list or update the local state
    } catch (error) {
      console.error("Failed to delete event:", error);
    }
  };

  const handleViewEventDetails = (event: any) => {
    // Implement your event details viewing logic here
    console.log("Viewing details for event:", event);
  };

  const markAllAsRead = () => {
    // Implement the logic to mark all notifications as read
    console.log("Marking all notifications as read");
  };

  const [notifications, setNotifications] = useState(mockNotifications);

  const handleAction = (notificationId: string, action: 'approve' | 'decline' | 'pending') => {
    setNotifications(notifications.map(notif => 
      notif.id === notificationId 
        ? { ...notif, status: action }
        : notif
    ));
    // Here you would also make an API call to update the status
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case 'approved':
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        );
      case 'declined':
        return (
          <Badge variant="secondary" className="bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            Declined
          </Badge>
        );
      default:
        return null;
    }
  };

  const [selectedInitiative, setSelectedInitiative] = useState<Initiative | null>(null);
  const [editMode, setEditMode] = useState(false);

  const handleInitiativeClick = (initiative: Initiative) => {
    setSelectedInitiative(initiative);
    setEditMode(false);
  };

  const handleEditSave = (updatedData: Partial<Initiative>) => {
    if (!selectedInitiative) return;
    
    setSelectedInitiative({
      ...selectedInitiative,
      ...updatedData
    });
    setEditMode(false);
  };

  const handleAttendanceUpdate = (volunteerId: string, attended: boolean) => {
    // Update volunteer attendance status
    setSelectedInitiative((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        volunteers: prev.volunteers.map((v) => 
          v.id === volunteerId ? { ...v, attended } : v
        )
      };
    });
  };

  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);

  // Add function to handle user profile click
  const handleUserClick = (userId: string) => {
    // In production, fetch user data from API
    setSelectedUser(mockUserProfile);
  };

  // Function to render the initiative details dialog
  const InitiativeDetailsDialog = ({ initiative }: { initiative: Initiative }) => (
    <DialogContent className="max-w-4xl overflow-hidden bg-background p-0">
      <button
        onClick={() => setSelectedInitiative(null)}
        className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground z-50"
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </button>

      <div className="relative h-80">
        <Image
          src={initiative.img || "/placeholder.svg"}
          alt={initiative.title}
          layout="fill"
          objectFit="cover"
          className="brightness-[0.85]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h2 className="text-3xl font-bold mb-2">{initiative.title}</h2>
          <p className="text-lg opacity-90">{initiative.organization}</p>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-vollie-blue mb-1">
              <Calendar className="h-5 w-5" />
              <span className="font-medium">Date</span>
            </div>
            <p className="text-sm text-muted-foreground">{initiative.date}</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-vollie-blue mb-1">
              <Clock className="h-5 w-5" />
              <span className="font-medium">Time Commitment</span>
            </div>
            <p className="text-sm text-muted-foreground">{initiative.timeCommitment}</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-vollie-blue mb-1">
              <MapPin className="h-5 w-5" />
              <span className="font-medium">Location</span>
            </div>
            <p className="text-sm text-muted-foreground">{initiative.location}</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-vollie-blue mb-1">
              <Users className="h-5 w-5" />
              <span className="font-medium">Volunteers</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {initiative.currentVolunteers} / {initiative.volunteersNeeded} needed
            </p>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">About this Initiative</h3>
          <p className="text-muted-foreground leading-relaxed">{initiative.description}</p>
        </div>

        <div className="flex gap-4">
          <Button
            variant="outline"
            className="px-6"
            onClick={() => {
              navigator.share({
                title: initiative.title,
                text: `Check out this volunteer opportunity: ${initiative.title}`,
                url: window.location.href,
              }).catch(() => {
                // Fallback for browsers that don't support share
                navigator.clipboard.writeText(window.location.href);
              });
            }}
          >
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </DialogContent>
  );

  if (!user) {
    return (
      <div className="container mx-auto py-8 pt-20 flex flex-col items-center justify-center min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <LogIn className="h-24 w-24 text-primary mb-4 mx-auto" />
          <h1 className="text-3xl font-bold mb-4 dark:text-gray-200">
            Log in to view your notifications
          </h1>
          <p className="text-muted-foreground dark:text-gray-400 mb-8">
            Stay updated with your volunteering journey and new opportunities!
          </p>
          <Button asChild>
            <a href="/login">Log In</a>
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 pt-20">
      <Tabs defaultValue="notifications" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          {user?.userType === 2 && (
            <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Stay updated on your volunteer activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {user?.userType === 1 ? (
                  // Organization view - Update volunteer name to be clickable
                  notifications.map((notification) => (
                    <Card key={notification.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h3 
                            className="font-semibold hover:text-vollie-blue cursor-pointer transition-colors"
                            onClick={() => handleUserClick(notification.id)}
                          >
                            {notification.volunteerName}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Requested to join "{notification.initiativeTitle}"
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {notification.volunteerEmail}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            {getStatusBadge(notification.status)}
                          </div>
                        </div>
                        {notification.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-green-600 hover:text-green-700 hover:bg-green-50"
                              onClick={() => handleAction(notification.id, 'approve')}
                            >
                              <UserCheck className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleAction(notification.id, 'decline')}
                            >
                              <UserX className="w-4 h-4 mr-1" />
                              Decline
                            </Button>
                          </div>
                        )}
                        {(notification.status === 'approved' || notification.status === 'declined') && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-vollie-blue hover:bg-vollie-blue/10"
                            onClick={() => handleAction(notification.id, 'pending')}
                          >
                            Change Decision
                          </Button>
                        )}
                      </div>
                    </Card>
                  ))
                ) : (
                  // Volunteer view - Regular notifications
                  notifications.map((notification) => (
                    <Card key={notification.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">
                            Your request to join "{notification.initiativeTitle}" has been {notification.status}.
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            {getStatusBadge(notification.status)}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {user?.userType === 2 && (
          <TabsContent value="upcoming">
            <Card>
              <CardHeader>
                <CardTitle>Your Upcoming Events</CardTitle>
                <CardDescription>View details of initiatives you've signed up for</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mockInitiatives.map((initiative) => (
                    <Card
                      key={initiative.id}
                      className="cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => setSelectedInitiative(initiative)}
                    >
                      <div className="relative h-48">
                        <Image
                          src={initiative.img || "/placeholder.svg"}
                          alt={initiative.title}
                          layout="fill"
                          objectFit="cover"
                          className="rounded-t-lg"
                        />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="text-xl font-semibold mb-2 text-vollie-blue">
                          {initiative.title}
                        </h3>
                        
                        <div className="flex items-center text-sm text-muted-foreground mb-2">
                          <MapPin className="h-4 w-4 mr-1 text-vollie-green" />
                          {initiative.location}
                        </div>
                        
                        <div className="flex items-center text-sm text-muted-foreground mb-2">
                          <Calendar className="h-4 w-4 mr-1 text-vollie-green" />
                          {initiative.date}
                        </div>
                        
                        <div className="flex items-center text-sm text-muted-foreground mb-2">
                          <Clock className="h-4 w-4 mr-1 text-vollie-green" />
                          {initiative.timeCommitment}
                        </div>

                        <Badge
                          variant="secondary"
                          className="bg-vollie-blue/10 text-vollie-blue"
                        >
                          {initiative.status === "active" ? "Upcoming" : initiative.status}
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>

      {/* Initiative Details Dialog */}
      <Dialog open={!!selectedInitiative} onOpenChange={(open) => !open && setSelectedInitiative(null)}>
        {selectedInitiative && <InitiativeDetailsDialog initiative={selectedInitiative} />}
      </Dialog>

      {/* User Profile Dialog */}
      <Dialog open={selectedUser !== null} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Volunteer Profile</DialogTitle>
          </DialogHeader>
          
          <ScrollArea className="max-h-[calc(90vh-8rem)]">
            <div className="space-y-6 p-4">
              {/* Profile Section */}
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="relative w-32 h-32 rounded-full overflow-hidden bg-muted border-2 border-muted">
                  {selectedUser?.avatar ? (
                    <img
                      src={selectedUser.avatar}
                      alt={selectedUser.name}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center text-4xl font-semibold text-muted-foreground">
                      {selectedUser?.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <h1 className="text-2xl font-bold">{selectedUser?.name}</h1>
                  <div className="text-muted-foreground">{selectedUser?.email}</div>
                  {selectedUser?.linkedIn && (
                    <a 
                      href={selectedUser.linkedIn}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-vollie-blue transition-colors"
                    >
                      <Linkedin className="h-4 w-4" />
                      LinkedIn
                    </a>
                  )}
                </div>
              </div>

              {/* About Section */}
              {selectedUser?.bio && (
                <div className="space-y-2">
                  <h2 className="text-lg font-semibold text-vollie-blue">About</h2>
                  <p className="text-muted-foreground">{selectedUser.bio}</p>
                </div>
              )}

              {/* Interests Section */}
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-vollie-blue">Interests</h2>
                <div className="flex flex-wrap gap-2">
                  {selectedUser?.interests.map((interest, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-vollie-blue/10 text-vollie-blue"
                    >
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Impact Overview */}
              <Card className="p-6">
                <h2 className="text-lg font-semibold text-vollie-blue mb-4">Impact Overview</h2>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <Clock className="h-5 w-5 mx-auto mb-2 text-vollie-blue" />
                    <div className="text-2xl font-bold">{selectedUser?.stats.totalHours}</div>
                    <div className="text-sm text-muted-foreground">Volunteer Hours</div>
                  </div>
                  <div>
                    <Calendar className="h-5 w-5 mx-auto mb-2 text-vollie-blue" />
                    <div className="text-2xl font-bold">{selectedUser?.stats.initiativesCount}</div>
                    <div className="text-sm text-muted-foreground">Initiatives</div>
                  </div>
                  <div>
                    <Building2 className="h-5 w-5 mx-auto mb-2 text-vollie-blue" />
                    <div className="text-2xl font-bold">{selectedUser?.stats.organizationsCount}</div>
                    <div className="text-sm text-muted-foreground">Organizations</div>
                  </div>
                </div>
              </Card>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
