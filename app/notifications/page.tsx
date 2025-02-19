"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
} from "lucide-react"
import { useAuth } from "../context/AuthContext"
import { motion } from "framer-motion"
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
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { format } from "date-fns"
import { assignInitiativeList } from "@/services/apiAction/initiative"
import { useQuery } from "@tanstack/react-query"

export default function NotificationsPage() {
  const { user, markNotificationAsRead, cancelSignUp, updateInitiative, deleteInitiative } = useAuth()
  const [editingEvent, setEditingEvent] = useState(null)
  const {
    data: notification,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["assignInitiative"],
    queryFn: () => assignInitiativeList({}),
  });
  const getIcon = (type: string) => {
    switch (type) {
      case "initiative_signup":
        return <Calendar className="h-5 w-5 text-blue-500" />
      case "achievement_unlocked":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "friend_request":
        return <UserPlus className="h-5 w-5 text-purple-500" />
      case "team_invite":
        return <Users className="h-5 w-5 text-yellow-500" />
      case "initiative_reminder":
        return <Clock className="h-5 w-5 text-orange-500" />
      case "signup_request":
        return <UserPlus className="h-5 w-5 text-blue-500" />
      case "signup_accepted":
        return <ThumbsUp className="h-5 w-5 text-green-500" />
      case "signup_declined":
        return <ThumbsDown className="h-5 w-5 text-red-500" />
      case "initiative_posted":
        return <Calendar className="h-5 w-5 text-purple-500" />
      case "initiative_tomorrow":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  const handleEditEvent = (event:any) => {
    setEditingEvent(event)
  }

  const handleUpdateEvent = async (updatedEvent:any) => {
    try {
      await updateInitiative(updatedEvent.id, updatedEvent)
      setEditingEvent(null)
      // Refresh the events list or update the local state
    } catch (error) {
      console.error("Failed to update event:", error)
    }
  }

  const handleDeleteEvent = async (eventId:any) => {
    try {
      await deleteInitiative(eventId)
      // Refresh the events list or update the local state
    } catch (error) {
      console.error("Failed to delete event:", error)
    }
  }

  const handleViewEventDetails = (event:any) => {
    // Implement your event details viewing logic here
    console.log("Viewing details for event:", event)
  }

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
          <h1 className="text-3xl font-bold mb-4 dark:text-gray-200">Log in to view your notifications</h1>
          <p className="text-muted-foreground dark:text-gray-400 mb-8">
            Stay updated with your volunteering journey and new opportunities!
          </p>
          <Button asChild>
            <a href="/login">Log In</a>
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 pt-20">
      <h1 className="text-4xl font-bold mb-8 text-vollie-blue dark:text-vollie-blue">Notifications</h1>

      <Card className="mb-8 dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="dark:text-gray-200">Your Recent Notifications</CardTitle>
          <CardDescription className="dark:text-gray-400">Stay updated with your volunteering journey</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {user.notifications?.length > 0 ? (
              user.notifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-start space-x-4 p-4 bg-white dark:bg-gray-700 rounded-lg shadow"
                >
                  <div className="flex-shrink-0">{getIcon(notification.type)}</div>
                  <div className="flex-grow">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold dark:text-gray-200">{notification.title}</h3>
                      {!notification.read && <Badge variant="secondary">New</Badge>}
                    </div>
                    <p className="text-muted-foreground dark:text-gray-300">{notification.message}</p>
                    <p className="text-sm text-muted-foreground dark:text-gray-400 mt-1">
                      {format(new Date(notification.date), "PPP")}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    {!notification.read && (
                      <Button variant="ghost" onClick={() => markNotificationAsRead(notification.id)}>
                        Mark as read
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="text-center text-muted-foreground dark:text-gray-400">
                You don't have any notifications yet. Start volunteering to see updates here!
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {user.userType === 2 && (
        <>
          <Card className="mb-8 dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="dark:text-gray-200">Pending Requests</CardTitle>
              <CardDescription className="dark:text-gray-400">Initiatives you've requested to join</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {user.pendingRequests && user.pendingRequests.length > 0 ? (
                  user.pendingRequests.map((request) => (
                    <motion.div
                      key={request.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-start space-x-4 p-4 bg-white dark:bg-gray-700 rounded-lg shadow"
                    >
                      <div className="flex-shrink-0">
                        <Calendar className="h-5 w-5 text-blue-500" />
                      </div>
                      <div className="flex-grow">
                        <h3 className="text-lg font-semibold dark:text-gray-200">{request.title}</h3>
                        <p className="text-muted-foreground dark:text-gray-300">{request.organization}</p>
                        <p className="text-sm text-muted-foreground dark:text-gray-400 mt-1">
                          Requested on: {format(new Date(request.requestDate), "PPP")}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              <X className="h-4 w-4 mr-2" />
                              Cancel Request
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will cancel your request to join this initiative.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => cancelSignUp(request.id)}>Confirm</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground dark:text-gray-400">
                    You don't have any pending requests. Explore initiatives to get involved!
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8 dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="dark:text-gray-200">Upcoming Events</CardTitle>
              <CardDescription className="dark:text-gray-400">Initiatives you're participating in</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {user.upcomingEvents && user.upcomingEvents?.length > 0 ? (
                  user.upcomingEvents.map((event) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-start space-x-4 p-4 bg-white dark:bg-gray-700 rounded-lg shadow"
                    >
                      <div className="flex-shrink-0">
                        <Calendar className="h-5 w-5 text-green-500" />
                      </div>
                      <div className="flex-grow">
                        <h3 className="text-lg font-semibold dark:text-gray-200">{event.title}</h3>
                        <p className="text-muted-foreground dark:text-gray-300">{event.organization}</p>
                        <p className="text-sm text-muted-foreground dark:text-gray-400 mt-1">
                          Date: {format(new Date(event.date), "PPP")}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleViewEventDetails(event)}>
                          View Details
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              <X className="h-4 w-4 mr-2" />
                              Cancel Participation
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will cancel your participation in this event.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => cancelSignUp(event.id)}>Confirm</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground dark:text-gray-400">
                    You don't have any upcoming events. Join some initiatives to get involved!
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {user.userType === 1 && (
        <Card className="mb-8 dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="dark:text-gray-200">Upcoming Events</CardTitle>
            <CardDescription className="dark:text-gray-400">Manage your organization's initiatives</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {user.createdEvents && user.createdEvents?.length > 0 ? (
                user.createdEvents.map((event) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-start space-x-4 p-4 bg-white dark:bg-gray-700 rounded-lg shadow"
                  >
                    <div className="flex-shrink-0">
                      <Calendar className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-lg font-semibold dark:text-gray-200">{event.title}</h3>
                      <p className="text-muted-foreground dark:text-gray-300">{event.description}</p>
                      <p className="text-sm text-muted-foreground dark:text-gray-400 mt-1">
                        Date: {format(new Date(event.date), "PPP")}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditEvent(event)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            <X className="h-4 w-4 mr-2" />
                            Remove
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete this event and notify all
                              participants.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteEvent(event.id)}>Confirm</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </motion.div>
                ))
              ) : (
                <p className="text-center text-muted-foreground dark:text-gray-400">
                  You haven't created any events yet. Start by adding a new initiative!
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Dialog open={!!editingEvent} onOpenChange={() => setEditingEvent(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
            <DialogDescription>Make changes to your event here. Click save when you're done.</DialogDescription>
          </DialogHeader>
          {editingEvent && (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleUpdateEvent(editingEvent)
              }}
            >
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    Title
                  </Label>
                  <Input
                    id="title"
                    value={editingEvent.title}
                    onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={editingEvent.description}
                    onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="date" className="text-right">
                    Date
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={editingEvent.date}
                    onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

