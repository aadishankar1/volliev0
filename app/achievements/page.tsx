"use client"

import { useAuth } from "../context/AuthContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Star, Trophy, Award, Target, Flame, Lock } from "lucide-react"
import { motion } from "framer-motion"

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
    level: "common",
  },
  {
    id: "3",
    name: "Community Pillar",
    description: "Help 5 different organizations",
    xp: 500,
    unlocked: false,
    level: "rare",
  },
  {
    id: "4",
    name: "Dedication",
    description: "Complete 10 volunteer initiatives",
    xp: 750,
    unlocked: false,
    level: "rare",
  },
  {
    id: "5",
    name: "Time Well Spent",
    description: "Volunteer for 100 hours",
    xp: 1500,
    unlocked: false,
    level: "epic",
  },
  {
    id: "6",
    name: "Jack of All Trades",
    description: "Volunteer in 5 different interest areas",
    xp: 500,
    unlocked: false,
    level: "rare",
  },
  {
    id: "7",
    name: "Team Player",
    description: "Join 3 different volunteer teams",
    xp: 300,
    unlocked: false,
    level: "common",
  },
  {
    id: "8",
    name: "Social Butterfly",
    description: "Make 10 friends on the platform",
    xp: 250,
    unlocked: false,
    level: "common",
  },
  {
    id: "9",
    name: "Streak Master",
    description: "Maintain a 30-day login streak",
    xp: 1000,
    unlocked: false,
    level: "epic",
  },
  {
    id: "10",
    name: "Local Hero",
    description: "Complete 20 initiatives within your local community",
    xp: 2000,
    unlocked: false,
    level: "legendary",
  },
  {
    id: "11",
    name: "Environmental Champion",
    description: "Complete 10 environmental initiatives",
    xp: 1000,
    unlocked: false,
    level: "epic",
  },
  {
    id: "12",
    name: "Education Advocate",
    description: "Volunteer 50 hours in educational initiatives",
    xp: 1500,
    unlocked: false,
    level: "epic",
  },
  {
    id: "13",
    name: "Healthcare Helper",
    description: "Complete 15 health-related volunteer activities",
    xp: 1500,
    unlocked: false,
    level: "epic",
  },
  {
    id: "14",
    name: "Weekend Warrior",
    description: "Complete 20 weekend volunteer activities",
    xp: 1000,
    unlocked: false,
    level: "epic",
  },
  {
    id: "15",
    name: "Volunteer Veteran",
    description: "Accumulate 500 hours of volunteer work",
    xp: 3000,
    unlocked: false,
    level: "mythic",
  },
  {
    id: "16",
    name: "Community Legend",
    description: "Help 50 different organizations",
    xp: 3000,
    unlocked: false,
    level: "mythic",
  },
  {
    id: "17",
    name: "Perfect Attendance",
    description: "Never miss a scheduled volunteer activity",
    xp: 2000,
    unlocked: false,
    level: "legendary",
  },
  {
    id: "18",
    name: "Skill Sharer",
    description: "Mentor 5 new volunteers",
    xp: 1500,
    unlocked: false,
    level: "epic",
  },
  {
    id: "19",
    name: "Crisis Responder",
    description: "Participate in 5 emergency response initiatives",
    xp: 2000,
    unlocked: false,
    level: "legendary",
  },
  {
    id: "20",
    name: "Volunteer Elite",
    description: "Complete all other volunteer achievements",
    xp: 5000,
    unlocked: false,
    level: "mythic",
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
    xp: 500,
    unlocked: false,
    level: "rare",
  },
  {
    id: "3",
    name: "Community Builder",
    description: "Successfully complete 5 initiatives",
    xp: 250,
    unlocked: false,
    level: "common",
  },
  {
    id: "4",
    name: "Impact Maker",
    description: "Accumulate 1000 volunteer hours across all initiatives",
    xp: 1500,
    unlocked: false,
    level: "epic",
  },
  {
    id: "5",
    name: "Diversity Champion",
    description: "Create initiatives in 5 different interest areas",
    xp: 750,
    unlocked: false,
    level: "rare",
  },
  {
    id: "6",
    name: "Engagement Expert",
    description: "Have 100 unique volunteers participate in your initiatives",
    xp: 1000,
    unlocked: false,
    level: "epic",
  },
  {
    id: "7",
    name: "Initiative Maestro",
    description: "Create 20 volunteer initiatives",
    xp: 2000,
    unlocked: false,
    level: "legendary",
  },
  {
    id: "8",
    name: "Full House",
    description: "Have 5 initiatives reach maximum volunteer capacity",
    xp: 500,
    unlocked: false,
    level: "rare",
  },
  {
    id: "9",
    name: "Quick Response",
    description: "Respond to all volunteer applications within 24 hours for a month",
    xp: 1000,
    unlocked: false,
    level: "epic",
  },
  {
    id: "10",
    name: "Event Planning Pro",
    description: "Successfully organize 10 multi-day initiatives",
    xp: 1500,
    unlocked: false,
    level: "epic",
  },
  {
    id: "11",
    name: "Local Impact",
    description: "Engage 500 local volunteers in your initiatives",
    xp: 2000,
    unlocked: false,
    level: "legendary",
  },
  {
    id: "12",
    name: "Feedback Champion",
    description: "Maintain a 4.5+ star rating across 50 reviews",
    xp: 1500,
    unlocked: false,
    level: "epic",
  },
  {
    id: "13",
    name: "Team Builder",
    description: "Create 5 successful volunteer teams",
    xp: 1000,
    unlocked: false,
    level: "epic",
  },
  {
    id: "14",
    name: "Skill Developer",
    description: "Provide training to 100 volunteers",
    xp: 1500,
    unlocked: false,
    level: "epic",
  },
  {
    id: "15",
    name: "Community Legend",
    description: "Complete 100 successful initiatives",
    xp: 3000,
    unlocked: false,
    level: "mythic",
  },
  {
    id: "16",
    name: "Hour Millionaire",
    description: "Accumulate 10,000 volunteer hours across all initiatives",
    xp: 3000,
    unlocked: false,
    level: "mythic",
  },
  {
    id: "17",
    name: "Perfect Organizer",
    description: "Complete 20 initiatives with 100% volunteer satisfaction",
    xp: 2000,
    unlocked: false,
    level: "legendary",
  },
  {
    id: "18",
    name: "Crisis Management",
    description: "Successfully organize 10 emergency response initiatives",
    xp: 2000,
    unlocked: false,
    level: "legendary",
  },
  {
    id: "19",
    name: "Volunteer Network",
    description: "Build a network of 1000 active volunteers",
    xp: 3000,
    unlocked: false,
    level: "mythic",
  },
  {
    id: "20",
    name: "Organization Elite",
    description: "Complete all other organization achievements",
    xp: 5000,
    unlocked: false,
    level: "mythic",
  },
]

const getLevelColor = (level: string) => {
  switch (level) {
    case "common":
      return "bg-gray-400 dark:bg-gray-500"
    case "rare":
      return "bg-blue-500 dark:bg-blue-400"
    case "epic":
      return "bg-purple-500 dark:bg-purple-400"
    case "legendary":
      return "bg-yellow-500 dark:bg-yellow-400"
    case "mythic":
      return "bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 dark:from-red-400 dark:via-purple-400 dark:to-blue-400"
    default:
      return "bg-gray-400 dark:bg-gray-500"
  }
}

const getAchievementIcon = (level: string) => {
  switch (level) {
    case "common":
      return <Trophy className="h-5 w-5 text-gray-400 dark:text-gray-500" />
    case "rare":
      return <Trophy className="h-5 w-5 text-blue-500 dark:text-blue-400" />
    case "epic":
      return <Trophy className="h-5 w-5 text-purple-500 dark:text-purple-400" />
    case "legendary":
      return <Trophy className="h-5 w-5 text-yellow-500 dark:text-yellow-400" />
    case "mythic":
      return <Trophy className="h-5 w-5 text-red-500 dark:text-red-400" />
    default:
      return <Trophy className="h-5 w-5 text-gray-400 dark:text-gray-500" />
  }
}

export default function AchievementsPage() {
  const { user } = useAuth()

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vollie-blue"></div>
      </div>
    )
  }

  const achievements = user.userType === 2 ? volunteerAchievements : organizationAchievements

  // Calculate XP and level
  const userXP = user.xp || 0
  const userLevel = user.level || 1
  const currentLevelXP = userXP - 100 * (userLevel - 1) ** 2
  const nextLevelXP = 100 * userLevel ** 2 - userXP
  const xpProgress = (currentLevelXP / (nextLevelXP + currentLevelXP)) * 100

  return (
    <div className="container mx-auto px-4 py-8 pt-20">
      <div className="space-y-8">
        {/* Level Progress Section */}
        <Card className="border-vollie-light-blue shadow-md hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-full bg-vollie-blue/10">
                  <Star className="h-8 w-8 text-vollie-blue" />
                </div>
                <div>
                  <CardTitle className="text-3xl font-bold text-vollie-blue">Level {userLevel}</CardTitle>
                  <CardDescription className="text-lg">{userXP} XP total</CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="px-3 py-1 bg-vollie-blue/10 text-vollie-blue">
                  {nextLevelXP} XP to next level
                </Badge>
              </div>
            </div>
            <div className="mt-6">
              <Progress 
                value={xpProgress} 
                className="h-3 [&>div]:bg-vollie-blue bg-vollie-blue/20"
              />
              <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                <span>Current: {currentLevelXP} XP</span>
                <span>Next Level: {nextLevelXP} XP</span>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Stats Overview */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="border-vollie-light-blue shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-vollie-blue/10">
                  <Flame className="h-6 w-6 text-vollie-blue" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Daily Streak</p>
                  <p className="text-2xl font-bold text-vollie-blue">{user.stats?.dailyStreak || 0} days</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-vollie-light-blue shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-vollie-blue/10">
                  <Award className="h-6 w-6 text-vollie-blue" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Achievements</p>
                  <p className="text-2xl font-bold text-vollie-blue">
                    {achievements.filter(a => a.unlocked).length} / {achievements.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-vollie-light-blue shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-vollie-blue/10">
                  <Target className="h-6 w-6 text-vollie-blue" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total XP</p>
                  <p className="text-2xl font-bold text-vollie-blue">{userXP}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Achievements Section */}
        <Card className="border-vollie-light-blue shadow-md hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-vollie-blue">Achievements</CardTitle>
            <CardDescription>
              Track your progress and unlock new achievements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              {/* Rarity Legend */}
              <div className="flex flex-wrap gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gray-400 dark:bg-gray-500" />
                  <span className="text-sm text-muted-foreground">Common</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500 dark:bg-blue-400" />
                  <span className="text-sm text-muted-foreground">Rare</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500 dark:bg-purple-400" />
                  <span className="text-sm text-muted-foreground">Epic</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500 dark:bg-yellow-400" />
                  <span className="text-sm text-muted-foreground">Legendary</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 dark:from-red-400 dark:via-purple-400 dark:to-blue-400" />
                  <span className="text-sm text-muted-foreground">Mythic</span>
                </div>
              </div>

              {/* Achievements Grid */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`group relative overflow-hidden rounded-lg border transition-all ${
                      achievement.unlocked
                        ? "border-vollie-light-blue bg-white dark:bg-gray-800"
                        : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
                    }`}
                  >
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-vollie-blue dark:text-vollie-light-blue flex items-center gap-2">
                            {getAchievementIcon(achievement.level)}
                            {achievement.name}
                          </h3>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {achievement.description}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <Badge
                          variant="secondary"
                          className={`${getLevelColor(achievement.level)} text-white dark:text-gray-100`}
                        >
                          {achievement.level.charAt(0).toUpperCase() + achievement.level.slice(1)}
                        </Badge>
                        <span className="text-sm font-medium text-vollie-blue dark:text-vollie-light-blue">
                          {achievement.xp} XP
                        </span>
                      </div>
                      {achievement.unlocked && (
                        <div className="absolute inset-0 bg-vollie-blue/5 dark:bg-vollie-light-blue/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                      {!achievement.unlocked && (
                        <div className="absolute inset-0 bg-gray-900/60 dark:bg-gray-950/60 flex items-center justify-center">
                          <Lock className="h-6 w-6 text-white dark:text-gray-200" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

