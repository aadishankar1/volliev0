"use client"

import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Award, Clock, Users, UserPlus, UserMinus, Star, Building } from "lucide-react"
import { motion } from "framer-motion"
import { TeamDashboard } from "../components/TeamDashboard"

// Mock data for the leaderboard
const leaderboardData = {
  volunteers: [
    {
      id: 1,
      name: "John Doe",
      hours: 120,
      impact: 95,
      initiatives: 15,
      avatar: "/placeholder.svg?height=40&width=40",
      achievements: 8,
    },
    {
      id: 2,
      name: "Jane Smith",
      hours: 100,
      impact: 88,
      initiatives: 12,
      avatar: "/placeholder.svg?height=40&width=40",
      achievements: 6,
    },
    {
      id: 3,
      name: "Alice Johnson",
      hours: 95,
      impact: 92,
      initiatives: 14,
      avatar: "/placeholder.svg?height=40&width=40",
      achievements: 7,
    },
    {
      id: 4,
      name: "Bob Williams",
      hours: 85,
      impact: 80,
      initiatives: 10,
      avatar: "/placeholder.svg?height=40&width=40",
      achievements: 5,
    },
    {
      id: 5,
      name: "Emma Brown",
      hours: 75,
      impact: 85,
      initiatives: 11,
      avatar: "/placeholder.svg?height=40&width=40",
      achievements: 6,
    },
  ],
  organizations: [
    {
      id: 1,
      name: "Green Earth",
      volunteers: 500,
      hours: 10000,
      initiatives: 50,
      logo: "/placeholder.svg?height=40&width=40",
      rating: 4.9,
    },
    {
      id: 2,
      name: "Community Helpers",
      volunteers: 300,
      hours: 7500,
      initiatives: 40,
      logo: "/placeholder.svg?height=40&width=40",
      rating: 4.8,
    },
    {
      id: 3,
      name: "Tech for Good",
      volunteers: 250,
      hours: 6000,
      initiatives: 35,
      logo: "/placeholder.svg?height=40&width=40",
      rating: 4.7,
    },
    {
      id: 4,
      name: "Education First",
      volunteers: 200,
      hours: 5000,
      initiatives: 30,
      logo: "/placeholder.svg?height=40&width=40",
      rating: 4.6,
    },
    {
      id: 5,
      name: "Health Matters",
      volunteers: 150,
      hours: 4000,
      initiatives: 25,
      logo: "/placeholder.svg?height=40&width=40",
      rating: 4.5,
    },
  ],
}

// Mock data for team dashboards
const teamDashboardData = {
  ASUC: {
    totalHours: 1250,
    totalVolunteers: 150,
    upcomingEvents: 5,
    topMembers: [
      { name: "Alex Johnson", hours: 45 },
      { name: "Sam Lee", hours: 40 },
      { name: "Jamie Chen", hours: 35 },
    ],
    recentActivity: [
      { user: "Alex K.", action: "Logged 5 hours for Beach Cleanup", time: "2 hours ago" },
      { user: "Jamie L.", action: "Created new event: Campus Sustainability Week", time: "5 hours ago" },
      { user: "Sam T.", action: "Completed Volunteer Training", time: "1 day ago" },
    ],
  },
  "Environmental Club": {
    totalHours: 800,
    totalVolunteers: 75,
    upcomingEvents: 3,
    topMembers: [
      { name: "Taylor Swift", hours: 30 },
      { name: "Emma Watson", hours: 28 },
      { name: "Chris Hemsworth", hours: 25 },
    ],
    recentActivity: [
      { user: "Taylor S.", action: "Organized tree planting event", time: "1 day ago" },
      { user: "Emma W.", action: "Led recycling workshop", time: "3 days ago" },
      { user: "Chris H.", action: "Completed beach cleanup", time: "1 week ago" },
    ],
  },
  // Add more team data as needed
  team1: {
    name: "Team Alpha",
    members: ["John Doe", "Jane Smith"],
    projects: ["Project A", "Project B"],
  },
  team2: {
    name: "Team Beta",
    members: ["Alice Johnson", "Bob Williams"],
    projects: ["Project C", "Project D"],
  },
}

export default function SocialPage() {
  const { user, addFriend, removeFriend, createTeam, joinTeam, leaveTeam, createPost, likePost } = useAuth()
  const [activeTab, setActiveTab] = useState("leaderboard")
  const [newFriendId, setNewFriendId] = useState("")
  const [newTeamName, setNewTeamName] = useState("")
  const [newTeamDescription, setNewTeamDescription] = useState("")
  const [joinTeamId, setJoinTeamId] = useState("")
  const [newPostContent, setNewPostContent] = useState("")
  const [leaderboardView, setLeaderboardView] = useState<"volunteers" | "organizations">("volunteers")

  if (!user) {
    return (
      <div className="container mx-auto py-8 pt-20 flex flex-col items-center justify-center min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <Users className="h-24 w-24 text-primary mb-4 mx-auto" />
          <h1 className="text-3xl font-bold mb-4 dark:text-gray-200">Log in to access social features</h1>
          <p className="text-muted-foreground dark:text-gray-400 mb-8">
            Connect with other volunteers, join teams, and see the leaderboard!
          </p>
          <Button asChild>
            <a href="/login">Log In</a>
          </Button>
        </motion.div>
      </div>
    )
  }

  const handleAddFriend = () => {
    if (newFriendId.trim()) {
      addFriend(newFriendId.trim())
      setNewFriendId("")
    }
  }

  const handleCreateTeam = () => {
    if (newTeamName.trim() && newTeamDescription.trim()) {
      createTeam(newTeamName.trim(), newTeamDescription.trim())
      setNewTeamName("")
      setNewTeamDescription("")
    }
  }

  const handleJoinTeam = () => {
    if (joinTeamId.trim()) {
      joinTeam(joinTeamId.trim())
      setJoinTeamId("")
    }
  }

  const handleCreatePost = () => {
    if (newPostContent.trim()) {
      createPost(newPostContent.trim())
      setNewPostContent("")
    }
  }

  return (
    <div className="container mx-auto py-8 pt-20">
      <h1 className="text-4xl font-bold mb-8 text-vollie-blue dark:text-vollie-blue">Social</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="friends">Friends</TabsTrigger>
          <TabsTrigger value="teams">Teams</TabsTrigger>
        </TabsList>

        <TabsContent value="leaderboard" className="mt-6">
          <Card className="dark:bg-gray-800">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="dark:text-gray-200">Leaderboard</CardTitle>
                <div className="flex space-x-2">
                  <Button
                    variant={leaderboardView === "volunteers" ? "default" : "outline"}
                    onClick={() => setLeaderboardView("volunteers")}
                  >
                    Volunteers
                  </Button>
                  <Button
                    variant={leaderboardView === "organizations" ? "default" : "outline"}
                    onClick={() => setLeaderboardView("organizations")}
                  >
                    Organizations
                  </Button>
                </div>
              </div>
              <CardDescription className="dark:text-gray-300">
                {leaderboardView === "volunteers"
                  ? "Recognizing our most dedicated volunteers"
                  : "Celebrating impactful organizations"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                {leaderboardView === "volunteers"
                  ? leaderboardData.volunteers.map((volunteer, index) => (
                      <motion.div
                        key={volunteer.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="flex items-center space-x-4 bg-white dark:bg-gray-700 p-4 rounded-lg shadow-sm"
                      >
                        <div className="flex items-center justify-center w-8">
                          <span className="text-2xl font-bold text-gray-400 dark:text-gray-500">#{index + 1}</span>
                        </div>
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={volunteer.avatar} alt={volunteer.name} />
                          <AvatarFallback>{volunteer.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-grow">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold dark:text-gray-200">{volunteer.name}</span>
                            {index < 3 && (
                              <Trophy
                                className={`h-5 w-5 ${
                                  index === 0 ? "text-yellow-500" : index === 1 ? "text-gray-400" : "text-amber-600"
                                }`}
                              />
                            )}
                          </div>
                          <div className="grid grid-cols-3 gap-4 mt-2">
                            <div>
                              <div className="text-sm font-medium flex items-center gap-1 dark:text-gray-300">
                                <Clock className="h-4 w-4" />
                                Hours
                              </div>
                              <Progress value={(volunteer.hours / 120) * 100} className="h-2" />
                              <div className="text-sm text-gray-600 dark:text-gray-400">{volunteer.hours}</div>
                            </div>
                            <div>
                              <div className="text-sm font-medium flex items-center gap-1 dark:text-gray-300">
                                <Users className="h-4 w-4" />
                                Impact
                              </div>
                              <Progress value={(volunteer.impact / 100) * 100} className="h-2" />
                              <div className="text-sm text-gray-600 dark:text-gray-400">{volunteer.impact}</div>
                            </div>
                            <div>
                              <div className="text-sm font-medium flex items-center gap-1 dark:text-gray-300">
                                <Award className="h-4 w-4" />
                                Initiatives
                              </div>
                              <Progress value={(volunteer.initiatives / 15) * 100} className="h-2" />
                              <div className="text-sm text-gray-600 dark:text-gray-400">{volunteer.initiatives}</div>
                            </div>
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-medium dark:text-gray-300">Achievements</div>
                          <div className="text-2xl font-bold text-primary">{volunteer.achievements}</div>
                        </div>
                      </motion.div>
                    ))
                  : leaderboardData.organizations.map((org, index) => (
                      <motion.div
                        key={org.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="flex items-center space-x-4 bg-white dark:bg-gray-700 p-4 rounded-lg shadow-sm"
                      >
                        <div className="flex items-center justify-center w-8">
                          <span className="text-2xl font-bold text-gray-400 dark:text-gray-500">#{index + 1}</span>
                        </div>
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={org.logo} alt={org.name} />
                          <AvatarFallback>{org.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-grow">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold dark:text-gray-200">{org.name}</span>
                            {index < 3 && (
                              <Trophy
                                className={`h-5 w-5 ${
                                  index === 0 ? "text-yellow-500" : index === 1 ? "text-gray-400" : "text-amber-600"
                                }`}
                              />
                            )}
                          </div>
                          <div className="grid grid-cols-3 gap-4 mt-2">
                            <div>
                              <div className="text-sm font-medium flex items-center gap-1 dark:text-gray-300">
                                <Users className="h-4 w-4" />
                                Volunteers
                              </div>
                              <Progress value={(org.volunteers / 500) * 100} className="h-2" />
                              <div className="text-sm text-gray-600 dark:text-gray-400">{org.volunteers}</div>
                            </div>
                            <div>
                              <div className="text-sm font-medium flex items-center gap-1 dark:text-gray-300">
                                <Clock className="h-4 w-4" />
                                Hours
                              </div>
                              <Progress value={(org.hours / 10000) * 100} className="h-2" />
                              <div className="text-sm text-gray-600 dark:text-gray-400">{org.hours}</div>
                            </div>
                            <div>
                              <div className="text-sm font-medium flex items-center gap-1 dark:text-gray-300">
                                <Building className="h-4 w-4" />
                                Initiatives
                              </div>
                              <Progress value={(org.initiatives / 50) * 100} className="h-2" />
                              <div className="text-sm text-gray-600 dark:text-gray-400">{org.initiatives}</div>
                            </div>
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-medium dark:text-gray-300">Rating</div>
                          <div className="text-2xl font-bold text-primary flex items-center">
                            {org.rating} <Star className="h-4 w-4 ml-1 text-yellow-500" />
                          </div>
                        </div>
                      </motion.div>
                    ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="friends" className="mt-6">
          <Card className="mb-8 dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="dark:text-gray-200">Add a Friend</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center space-x-4">
              <Input
                placeholder="Enter friend's ID"
                value={newFriendId}
                onChange={(e) => setNewFriendId(e.target.value)}
                className="dark:bg-gray-700 dark:text-gray-200"
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
                <motion.div
                  key={friend.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="dark:bg-gray-800">
                    <CardContent className="flex items-center justify-between p-6">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src={friend.avatar} alt={friend.name} />
                          <AvatarFallback>{friend.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold dark:text-gray-200">{friend.name}</h3>
                          <p className="text-sm text-muted-foreground dark:text-gray-400">Friend ID: {friend.id}</p>
                        </div>
                      </div>
                      <Button variant="ghost" onClick={() => removeFriend(friend.id)}>
                        <UserMinus className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : (
              <p className="dark:text-gray-200">You haven't added any friends yet.</p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="teams" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 mb-8">
            <Card className="dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="dark:text-gray-200">Create a Team</CardTitle>
                <CardDescription className="dark:text-gray-300">Start a new volunteer team</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Team Name"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  className="dark:bg-gray-700 dark:text-gray-200"
                />
                <Textarea
                  placeholder="Team Description"
                  value={newTeamDescription}
                  onChange={(e) => setNewTeamDescription(e.target.value)}
                  className="dark:bg-gray-700 dark:text-gray-200"
                />
                <Button onClick={handleCreateTeam}>
                  <Users className="mr-2 h-4 w-4" />
                  Create Team
                </Button>
              </CardContent>
            </Card>

            <Card className="dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="dark:text-gray-200">Join a Team</CardTitle>
                <CardDescription className="dark:text-gray-300">Enter a team ID to join</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center space-x-4">
                <Input
                  placeholder="Team ID"
                  value={joinTeamId}
                  onChange={(e) => setJoinTeamId(e.target.value)}
                  className="dark:bg-gray-700 dark:text-gray-200"
                />
                <Button onClick={handleJoinTeam}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Join Team
                </Button>
              </CardContent>
            </Card>
          </div>

          <h2 className="text-2xl font-semibold mb-4 dark:text-gray-200">Your Teams</h2>
          <div className="grid gap-6">
            {user.teams && user.teams.length > 0 ? (
              user.teams.map((teamId) => (
                <motion.div
                  key={teamId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="dark:bg-gray-800">
                    <CardContent className="p-6">
                      <h3 className="font-semibold dark:text-gray-200 text-xl mb-4">Team {teamId}</h3>
                      <TeamDashboard
                        teamName={teamId}
                        teamData={teamDashboardData[teamId] || teamDashboardData["ASUC"]}
                      />
                      <div className="mt-4 flex justify-end">
                        <Button variant="ghost" onClick={() => leaveTeam(teamId)}>
                          <UserMinus className="h-4 w-4 mr-2" />
                          Leave Team
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : (
              <p className="dark:text-gray-200">You haven't joined any teams yet.</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

