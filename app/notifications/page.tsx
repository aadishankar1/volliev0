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

