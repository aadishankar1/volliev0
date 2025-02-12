"use client"

import { useAuth } from "../context/AuthContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Star } from "lucide-react"

const volunteerAchievements = [
  {
    id: "1",
    name: "First Steps",
    description: "Complete your first volunteer initiative",
    xp: 100,
    unlocked: false,
    level: "common",
  },
  {
    id: "2",
    name: "Helping Hand",
    description: "Volunteer for 10 hours",
    xp: 250,
    unlocked: false,
    level: "rare",
  },
  {
    id: "3",
    name: "Community Pillar",
    description: "Help 5 different organizations",
    xp: 500,
    unlocked: false,
    level: "epic",
  },
  {
    id: "4",
    name: "Dedication",
    description: "Complete 10 volunteer initiatives",
    xp: 1000,
    unlocked: false,
    level: "legendary",
  },
  {
    id: "5",
    name: "Time Well Spent",
    description: "Volunteer for 100 hours",
    xp: 2000,
    unlocked: false,
    level: "mythic",
  },
  {
    id: "6",
    name: "Jack of All Trades",
    description: "Volunteer in 5 different interest areas",
    xp: 500,
    unlocked: false,
    level: "epic",
  },
  {
    id: "7",
    name: "Team Player",
    description: "Join 3 different volunteer teams",
    xp: 300,
    unlocked: false,
    level: "rare",
  },
  {
    id: "8",
    name: "Social Butterfly",
    description: "Make 10 friends on the platform",
    xp: 250,
    unlocked: false,
    level: "rare",
  },
]

const organizationAchievements = [
  {
    id: "1",
    name: "First Initiative",
    description: "Create your first volunteer initiative",
    xp: 100,
    unlocked: false,
    level: "common",
  },
  {
    id: "2",
    name: "Volunteer Magnet",
    description: "Attract 50 volunteers to your initiatives",
    xp: 250,
    unlocked: false,
    level: "rare",
  },
  {
    id: "3",
    name: "Community Builder",
    description: "Successfully complete 5 initiatives",
    xp: 500,
    unlocked: false,
    level: "epic",
  },
  {
    id: "4",
    name: "Impact Maker",
    description: "Accumulate 1000 volunteer hours across all initiatives",
    xp: 1000,
    unlocked: false,
    level: "legendary",
  },
  {
    id: "5",
    name: "Diversity Champion",
    description: "Create initiatives in 5 different interest areas",
    xp: 500,
    unlocked: false,
    level: "epic",
  },
  {
    id: "6",
    name: "Engagement Expert",
    description: "Have 100 unique volunteers participate in your initiatives",
    xp: 750,
    unlocked: false,
    level: "legendary",
  },
  {
    id: "7",
    name: "Initiative Maestro",
    description: "Create 20 volunteer initiatives",
    xp: 1000,
    unlocked: false,
    level: "mythic",
  },
  {
    id: "8",
    name: "Full House",
    description: "Have an initiative reach its maximum volunteer capacity",
    xp: 300,
    unlocked: false,
    level: "rare",
  },
]

export default function AchievementsPage() {
  const { user } = useAuth()

  if (!user) {
    return <div>Loading...</div>
  }

  const achievements = user.type === "volunteer" ? volunteerAchievements : organizationAchievements

  // Calculate XP and level
  const userXP = user.xp
  const userLevel = user.level
  const currentLevelXP = userXP - 100 * (userLevel - 1) ** 2
  const nextLevelXP = 100 * userLevel ** 2 - userXP

  return (
    <div className="container mx-auto px-4 py-8 pt-20">
      <div className="space-y-8">
        {/* Level Progress Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Level Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 mb-4">
              <Star className="h-8 w-8 text-yellow-500" />
              <div>
                <div className="text-2xl font-bold">Level {userLevel}</div>
                <div className="text-sm text-muted-foreground">{userXP} XP total</div>
              </div>
            </div>
            <Progress value={(currentLevelXP / (nextLevelXP + currentLevelXP)) * 100} className="h-2 mb-2" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{currentLevelXP} XP</span>
              <span>{nextLevelXP} XP to next level</span>
            </div>
          </CardContent>
        </Card>

        {/* Achievements Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Achievements</CardTitle>
            <CardDescription>
              {user.type === "organization"
                ? "Track your organization's impact milestones"
                : "Track your volunteering milestones"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.map((achievement) => (
                <Card key={achievement.id} className="bg-muted/50">
                  <CardHeader>
                    <CardTitle>{achievement.name}</CardTitle>
                    <CardDescription>{achievement.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <Badge variant={achievement.unlocked ? "default" : "secondary"}>
                        {achievement.unlocked ? "Unlocked" : "Locked"}
                      </Badge>
                      <span className="text-sm font-medium">{achievement.xp} XP</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

