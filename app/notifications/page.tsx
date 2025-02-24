<<<<<<< HEAD
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
    <div className="container mx-auto px-4 py-8 pt-20">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-vollie-blue">Notifications</h1>
          <Button
            variant="outline"
            className="border-vollie-blue text-vollie-blue hover:bg-vollie-blue/10"
            onClick={() => markAllAsRead()}
          >
            Mark all as read
          </Button>
        </div>

        <div className="grid gap-4">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="p-4">
                <div className="flex items-start space-x-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/5" />
                  </div>
                </div>
              </Card>
            ))
          ) : notification && notification.length > 0 ? (
            notification.map((notificationPage: any, pageIndex: number) =>
              notificationPage.map((notification: any, index: number) => {
                const isLast =
                  pageIndex === notification.length - 1 &&
                  index === notificationPage.length - 1;

                return (
                  <motion.div
                    key={notification._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    ref={isLast ? lastItemRef : null}
                  >
                    <Card className="group hover:shadow-md transition-all duration-200">
                      <div className="flex items-start space-x-4 p-4">
                        <div className="flex-shrink-0">
                          <div className="p-2 rounded-full bg-vollie-blue/10 group-hover:bg-vollie-blue/20 transition-colors">
                            {getIcon(notification.type)}
                          </div>
                        </div>
                        <div className="flex-grow space-y-1">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-vollie-blue">
                              {notification.intiativesTitle}
                            </h3>
                            {loggedInUser.userType == 2 && (
                              <Badge 
                                variant="secondary"
                                className="bg-vollie-blue/10 text-vollie-blue"
                              >
                                own
                              </Badge>
                            )}
                          </div>
                          <p className="text-muted-foreground">
                            {notification?.initiativeDesc}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            {format(new Date(notification.intiativesStartDate), "PPP")}
                          </div>
                          <div className="flex items-center justify-between pt-2">
                            <Badge 
                              variant="default"
                              className="bg-vollie-blue text-white"
                            >
                              {status[notification.status]}
                            </Badge>
                            {loggedInUser.userType == 1 && notification.status == 0 && (
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => initiativeAction(notification, 2)}
                                  disabled={actionLoading}
                                  className="border-red-500 text-red-500 hover:bg-red-50"
                                >
                                  <ThumbsDown className="h-4 w-4 mr-1" />
                                  Reject
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => initiativeAction(notification, 1)}
                                  disabled={actionLoading}
                                  className="border-vollie-blue text-vollie-blue hover:bg-vollie-blue/10"
                                >
                                  <ThumbsUp className="h-4 w-4 mr-1" />
                                  Accept
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })
            )
          ) : (
            <Card className="p-8 text-center">
              <Bell className="h-12 w-12 text-vollie-blue/40 mx-auto mb-3" />
              <p className="text-lg font-medium text-vollie-blue">No notifications yet</p>
              <p className="text-muted-foreground">
                Start volunteering to see updates here!
              </p>
            </Card>
          )}
          {isFetchingNextPage && (
            <Card className="p-4">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vollie-blue"></div>
              </div>
            </Card>
          )}
          {!hasNextPage && notification && notification.length > 0 && (
            <Card className="p-4 text-center text-muted-foreground">
              You've reached the end of your notifications
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
=======
'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, CheckCircle, AlertCircle, Calendar, Sparkles } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

// This is mock data. In a real application, you'd fetch this from an API
const mockNotifications = [
  { id: 1, type: 'new_opportunity', title: 'New Volunteer Opportunity', message: 'Beach Cleanup this Saturday!', date: '2023-07-10', read: false },
  { id: 2, type: 'reminder', title: 'Upcoming Event Reminder', message: 'Don\'t forget about the Food Bank volunteering tomorrow.', date: '2023-07-09', read: true },
  { id: 3, type: 'achievement', title: 'New Achievement Unlocked', message: 'Congratulations! You\'ve volunteered for 50 hours.', date: '2023-07-08', read: false },
  { id: 4, type: 'application_update', title: 'Application Status Update', message: 'Your application for "Tree Planting Initiative" has been accepted!', date: '2023-07-07', read: false },
]

const mockOpportunities = [
  { id: 1, title: "Youth Tutoring Program", organization: "Education First", tags: ["Education", "Youth"] },
  { id: 2, title: "Community Garden Project", organization: "Green Spaces", tags: ["Environment", "Gardening"] },
  { id: 3, title: "Senior Tech Support", organization: "Digital Bridge", tags: ["Technology", "Elderly Care"] },
]

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications)
  const [recommendedOpportunities, setRecommendedOpportunities] = useState<typeof mockOpportunities>([])
  const { user, getPersonalizedRecommendations } = useAuth()

  const memoizedGetPersonalizedRecommendations = useCallback(getPersonalizedRecommendations, [getPersonalizedRecommendations])

  useEffect(() => {
    if (user) {
      const recommendations = memoizedGetPersonalizedRecommendations(mockOpportunities)
      setRecommendedOpportunities(recommendations)
    }
  }, [user, memoizedGetPersonalizedRecommendations])

  const markAsRead = useCallback((id: number) => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    )
  }, [])

  const getIcon = useCallback((type: string) => {
    switch(type) {
      case 'new_opportunity':
        return <Calendar className="h-5 w-5 text-blue-500" />
      case 'reminder':
        return <Bell className="h-5 w-5 text-yellow-500" />
      case 'achievement':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'application_update':
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }, [])

  return (
    <div className="container mx-auto py-8 pt-20">
      <h1 className="text-4xl font-bold mb-8">Notifications</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Your Recent Notifications</CardTitle>
          <CardDescription>Stay updated with your volunteering journey</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div key={notification.id} className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow">
                <div className="flex-shrink-0">
                  {getIcon(notification.type)}
                </div>
                <div className="flex-grow">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{notification.title}</h3>
                    {!notification.read && (
                      <Badge variant="secondary">New</Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground">{notification.message}</p>
                  <p className="text-sm text-muted-foreground mt-1">{notification.date}</p>
                </div>
                {!notification.read && (
                  <Button variant="ghost" onClick={() => markAsRead(notification.id)}>
                    Mark as read
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {recommendedOpportunities.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Sparkles className="mr-2 h-5 w-5 text-yellow-500" />
              Recommended Opportunities
            </CardTitle>
            <CardDescription>Based on your interests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recommendedOpportunities.map((opportunity) => (
                <div key={opportunity.id} className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow">
                  <div className="flex-shrink-0">
                    <Calendar className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold">{opportunity.title}</h3>
                    <p className="text-muted-foreground">{opportunity.organization}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {opportunity.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                  <Button variant="outline">View Details</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

>>>>>>> c1a5115ad8324999f9a144066399c5b279dc5111
