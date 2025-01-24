'use client'

import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Award, Clock, Users, UserPlus, UserMinus, Star, Building } from 'lucide-react'
import { ThumbsUp, MessageCircle, Share2 } from 'lucide-react'

// Mock data for the leaderboard
const leaderboardData = {
  volunteers: [
    { id: 1, name: "John Doe", hours: 120, impact: 95, initiatives: 15, avatar: "/placeholder.svg?height=40&width=40", achievements: 8 },
    { id: 2, name: "Jane Smith", hours: 100, impact: 88, initiatives: 12, avatar: "/placeholder.svg?height=40&width=40", achievements: 6 },
    { id: 3, name: "Alice Johnson", hours: 95, impact: 92, initiatives: 14, avatar: "/placeholder.svg?height=40&width=40", achievements: 7 },
    { id: 4, name: "Bob Williams", hours: 85, impact: 80, initiatives: 10, avatar: "/placeholder.svg?height=40&width=40", achievements: 5 },
    { id: 5, name: "Emma Brown", hours: 75, impact: 85, initiatives: 11, avatar: "/placeholder.svg?height=40&width=40", achievements: 6 },
  ],
  organizations: [
    { id: 1, name: "Green Earth", volunteers: 500, hours: 10000, initiatives: 50, logo: "/placeholder.svg?height=40&width=40", rating: 4.9 },
    { id: 2, name: "Community Helpers", volunteers: 300, hours: 7500, initiatives: 40, logo: "/placeholder.svg?height=40&width=40", rating: 4.8 },
    { id: 3, name: "Tech for Good", volunteers: 250, hours: 6000, initiatives: 35, logo: "/placeholder.svg?height=40&width=40", rating: 4.7 },
    { id: 4, name: "Education First", volunteers: 200, hours: 5000, initiatives: 30, logo: "/placeholder.svg?height=40&width=40", rating: 4.6 },
    { id: 5, name: "Health Matters", volunteers: 150, hours: 4000, initiatives: 25, logo: "/placeholder.svg?height=40&width=40", rating: 4.5 },
  ]
}

export default function SocialPage() {
  const { user, addFriend, removeFriend, createTeam, joinTeam, leaveTeam, createPost, likePost } = useAuth()
  const [activeTab, setActiveTab] = useState("leaderboard")
  const [newFriendId, setNewFriendId] = useState('')
  const [newTeamName, setNewTeamName] = useState('')
  const [newTeamDescription, setNewTeamDescription] = useState('')
  const [joinTeamId, setJoinTeamId] = useState('')
  const [newPostContent, setNewPostContent] = useState('')
  const [leaderboardView, setLeaderboardView] = useState<'volunteers' | 'organizations'>('volunteers')

  if (!user) {
    return <div className="container mx-auto py-8 pt-20">Please log in to view the social features.</div>
  }

  const handleAddFriend = () => {
    if (newFriendId.trim()) {
      addFriend(newFriendId.trim())
      setNewFriendId('')
    }
  }

  const handleCreateTeam = () => {
    if (newTeamName.trim() && newTeamDescription.trim()) {
      createTeam(newTeamName.trim(), newTeamDescription.trim())
      setNewTeamName('')
      setNewTeamDescription('')
    }
  }

  const handleJoinTeam = () => {
    if (joinTeamId.trim()) {
      joinTeam(joinTeamId.trim())
      setJoinTeamId('')
    }
  }

  const handleCreatePost = () => {
    if (newPostContent.trim()) {
      createPost(newPostContent.trim())
      setNewPostContent('')
    }
  }

  return (
    <div className="container mx-auto py-8 pt-20">
      <h1 className="text-4xl font-bold mb-8">Social</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="friends">Friends</TabsTrigger>
          <TabsTrigger value="teams">Teams</TabsTrigger>
        </TabsList>

        <TabsContent value="leaderboard" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Leaderboard</CardTitle>
                <div className="flex space-x-2">
                  <Button 
                    variant={leaderboardView === 'volunteers' ? 'default' : 'outline'} 
                    onClick={() => setLeaderboardView('volunteers')}
                  >
                    Volunteers
                  </Button>
                  <Button 
                    variant={leaderboardView === 'organizations' ? 'default' : 'outline'} 
                    onClick={() => setLeaderboardView('organizations')}
                  >
                    Organizations
                  </Button>
                </div>
              </div>
              <CardDescription>
                {leaderboardView === 'volunteers' 
                  ? "Recognizing our most dedicated volunteers" 
                  : "Celebrating impactful organizations"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                {leaderboardView === 'volunteers' ? (
                  leaderboardData.volunteers.map((volunteer, index) => (
                    <div key={volunteer.id} className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-sm">
                      <div className="flex items-center justify-center w-8">
                        <span className="text-2xl font-bold text-gray-400">#{index + 1}</span>
                      </div>
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={volunteer.avatar} alt={volunteer.name} />
                        <AvatarFallback>{volunteer.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-grow">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{volunteer.name}</span>
                          {index < 3 && (
                            <Trophy className={`h-5 w-5 ${
                              index === 0 ? 'text-yellow-500' :
                              index === 1 ? 'text-gray-400' :
                              'text-amber-600'
                            }`} />
                          )}
                        </div>
                        <div className="grid grid-cols-3 gap-4 mt-2">
                          <div>
                            <div className="text-sm font-medium flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              Hours
                            </div>
                            <Progress value={(volunteer.hours / 120) * 100} className="h-2" />
                            <div className="text-sm text-gray-600">{volunteer.hours}</div>
                          </div>
                          <div>
                            <div className="text-sm font-medium flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              Impact
                            </div>
                            <Progress value={(volunteer.impact / 100) * 100} className="h-2" />
                            <div className="text-sm text-gray-600">{volunteer.impact}</div>
                          </div>
                          <div>
                            <div className="text-sm font-medium flex items-center gap-1">
                              <Award className="h-4 w-4" />
                              Initiatives
                            </div>
                            <Progress value={(volunteer.initiatives / 15) * 100} className="h-2" />
                            <div className="text-sm text-gray-600">{volunteer.initiatives}</div>
                          </div>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium">Achievements</div>
                        <div className="text-2xl font-bold text-primary">{volunteer.achievements}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  leaderboardData.organizations.map((org, index) => (
                    <div key={org.id} className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-sm">
                      <div className="flex items-center justify-center w-8">
                        <span className="text-2xl font-bold text-gray-400">#{index + 1}</span>
                      </div>
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={org.logo} alt={org.name} />
                        <AvatarFallback>{org.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-grow">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{org.name}</span>
                          {index < 3 && (
                            <Trophy className={`h-5 w-5 ${
                              index === 0 ? 'text-yellow-500' :
                              index === 1 ? 'text-gray-400' :
                              'text-amber-600'
                            }`} />
                          )}
                        </div>
                        <div className="grid grid-cols-3 gap-4 mt-2">
                          <div>
                            <div className="text-sm font-medium flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              Volunteers
                            </div>
                            <Progress value={(org.volunteers / 500) * 100} className="h-2" />
                            <div className="text-sm text-gray-600">{org.volunteers}</div>
                          </div>
                          <div>
                            <div className="text-sm font-medium flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              Hours
                            </div>
                            <Progress value={(org.hours / 10000) * 100} className="h-2" />
                            <div className="text-sm text-gray-600">{org.hours}</div>
                          </div>
                          <div>
                            <div className="text-sm font-medium flex items-center gap-1">
                              <Building className="h-4 w-4" />
                              Initiatives
                            </div>
                            <Progress value={(org.initiatives / 50) * 100} className="h-2" />
                            <div className="text-sm text-gray-600">{org.initiatives}</div>
                          </div>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium">Rating</div>
                        <div className="text-2xl font-bold text-primary flex items-center">
                          {org.rating} <Star className="h-4 w-4 ml-1 text-yellow-500" />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="friends" className="mt-6">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Add a Friend</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center space-x-4">
              <Input
                placeholder="Enter friend's ID"
                value={newFriendId}
                onChange={(e) => setNewFriendId(e.target.value)}
              />
              <Button onClick={handleAddFriend}>
                <UserPlus className="mr-2 h-4 w-4" />
                Add Friend
              </Button>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {user.friends && user.friends.length > 0 ? (
              user.friends.map((friend) => (
                <Card key={friend.id}>
                  <CardContent className="flex items-center justify-between p-6">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src={friend.avatar} alt={friend.name} />
                        <AvatarFallback>{friend.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{friend.name}</h3>
                        <p className="text-sm text-muted-foreground">Friend ID: {friend.id}</p>
                      </div>
                    </div>
                    <Button variant="ghost" onClick={() => removeFriend(friend.id)}>
                      <UserMinus className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p>You haven't added any friends yet.</p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="teams" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Create a Team</CardTitle>
                <CardDescription>Start a new volunteer team</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Team Name"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                />
                <Textarea
                  placeholder="Team Description"
                  value={newTeamDescription}
                  onChange={(e) => setNewTeamDescription(e.target.value)}
                />
                <Button onClick={handleCreateTeam}>
                  <Users className="mr-2 h-4 w-4" />
                  Create Team
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Join a Team</CardTitle>
                <CardDescription>Enter a team ID to join</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center space-x-4">
                <Input
                  placeholder="Team ID"
                  value={joinTeamId}
                  onChange={(e) => setJoinTeamId(e.target.value)}
                />
                <Button onClick={handleJoinTeam}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Join Team
                </Button>
              </CardContent>
            </Card>
          </div>

          <h2 className="text-2xl font-semibold mb-4">Your Teams</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {user.teams && user.teams.length > 0 ? (
              user.teams.map((teamId) => (
                <Card key={teamId}>
                  <CardContent className="flex items-center justify-between p-6">
                    <div>
                      <h3 className="font-semibold">Team {teamId}</h3>
                      <p className="text-sm text-muted-foreground">Team ID: {teamId}</p>
                    </div>
                    <Button variant="ghost" onClick={() => leaveTeam(teamId)}>
                      <UserMinus className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p>You haven't joined any teams yet.</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

