"use client"

import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Star, Trophy, Award, Target, Flame, Lock, Eye, Plus } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { AchievementUnlockAnimation } from "../components/AchievementUnlockAnimation"
import Link from "next/link"

const volunteerAchievements = [
  {
    id: "v1",
    name: "First Steps",
    description: "Sign-up for your first initiative",
    xp: 100,
    unlocked: false,
    level: "common",
  },
  {
    id: "v2",
    name: "Impact Initiate",
    description: "Complete your first initiative",
    xp: 200,
    unlocked: false,
    level: "common",
  },
  {
    id: "v3",
    name: "Helping Hand",
    description: "Complete five initiatives",
    xp: 500,
    unlocked: false,
    level: "rare",
  },
  {
    id: "v4",
    name: "Versatile Volunteer",
    description: "Join volunteering initiatives in five different impact areas",
    xp: 500,
    unlocked: false,
    level: "rare",
  },
  {
    id: "v5",
    name: "Century Contributor",
    description: "Complete one-hundred hours of volunteer work",
    xp: 2000,
    unlocked: false,
    level: "mythic",
  },
  {
    id: "v6",
    name: "Half-Century Hero",
    description: "Complete fifty hours of volunteer work",
    xp: 1000,
    unlocked: false,
    level: "legendary",
  },
  {
    id: "v7",
    name: "Time Donor",
    description: "Complete ten hours of volunteer work",
    xp: 500,
    unlocked: false,
    level: "rare",
  },
  {
    id: "v8",
    name: "Dedicated Doer",
    description: "Complete ten initiatives",
    xp: 1000,
    unlocked: false,
    level: "legendary",
  },
  {
    id: "v9",
    name: "Volunteer Virtuoso",
    description: "Complete fifty initiatives",
    xp: 2000,
    unlocked: false,
    level: "mythic",
  },
  {
    id: "v10",
    name: "Community Connector",
    description: "Invite a friend to volunteer on an initiative with you",
    xp: 500,
    unlocked: false,
    level: "rare",
  },
  {
    id: "v11",
    name: "Network Nurturer",
    description: "Invite three friends to volunteer on initiatives with you",
    xp: 1000,
    unlocked: false,
    level: "legendary",
  },
  {
    id: "v12",
    name: "Weekly Warrior",
    description: "Maintain a one-week streak on Vollie",
    xp: 1000,
    unlocked: false,
    level: "legendary",
  },
  {
    id: "v13",
    name: "Monthly Maven",
    description: "Maintain a one-month streak on Vollie",
    xp: 1000,
    unlocked: false,
    level: "legendary",
  },
]

const organizationAchievements = [
  {
    id: "o1",
    name: "Initiative Innovator",
    description: "Post your first initiative",
    xp: 100,
    unlocked: false,
    level: "common",
  },
  {
    id: "o2",
    name: "Mission Accomplished",
    description: "Complete your first initiative",
    xp: 200,
    unlocked: false,
    level: "common",
  },
  {
    id: "o3",
    name: "Impact Multiplier",
    description: "Complete five initiatives",
    xp: 500,
    unlocked: false,
    level: "rare",
  },
  {
    id: "o4",
    name: "Volunteer Magnet",
    description: "Recruit fifty volunteers to your initiatives",
    xp: 1000,
    unlocked: false,
    level: "legendary",
  },
  {
    id: "o5",
    name: "Full House",
    description: "Have five initiatives reach maximum volunteer capacity",
    xp: 500,
    unlocked: false,
    level: "rare",
  },
  {
    id: "o6",
    name: "Change Champion",
    description: "Complete ten initiatives",
    xp: 1000,
    unlocked: false,
    level: "legendary",
  },
  {
    id: "o7",
    name: "Impact Titan",
    description: "Complete fifty initiatives",
    xp: 2000,
    unlocked: false,
    level: "mythic",
  },
  {
    id: "o8",
    name: "Community Catalyst",
    description: "Recruit one-hundred volunteers to your initiatives",
    xp: 1000,
    unlocked: false,
    level: "legendary",
  },
  {
    id: "o9",
    name: "Weekly Changemaker",
    description: "Maintain a one-week streak on Vollie",
    xp: 1000,
    unlocked: false,
    level: "legendary",
  },
  {
    id: "o10",
    name: "Monthly Mobilizer",
    description: "Maintain a one-month streak on Vollie",
    xp: 1000,
    unlocked: false,
    level: "legendary",
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

// Helper function to calculate achievement progress
const calculateProgress = (achievement: any, userStats: any) => {
  if (achievement.unlocked) return 100;
  if (achievement.progress !== undefined && achievement.total !== undefined) {
    return Math.min(100, (achievement.progress / achievement.total) * 100);
  }
  
  // Default progress calculations based on achievement ID
  if (userStats) {
    const { 
      initiativesCompleted = 0, 
      hoursVolunteered = 0, 
      impactAreas = 0, 
      friendsInvited = 0,
      dailyStreak = 0,
      volunteersEngaged = 0,
      fullCapacityInitiatives = 0
    } = userStats;
    
    // Volunteer achievements
    if (achievement.id === "v3") return Math.min(100, (initiativesCompleted / 5) * 100);
    if (achievement.id === "v4") return Math.min(100, (impactAreas / 5) * 100);
    if (achievement.id === "v5") return Math.min(100, (hoursVolunteered / 100) * 100);
    if (achievement.id === "v6") return Math.min(100, (hoursVolunteered / 50) * 100);
    if (achievement.id === "v7") return Math.min(100, (hoursVolunteered / 10) * 100);
    if (achievement.id === "v8") return Math.min(100, (initiativesCompleted / 10) * 100);
    if (achievement.id === "v9") return Math.min(100, (initiativesCompleted / 50) * 100);
    if (achievement.id === "v11") return Math.min(100, (friendsInvited / 3) * 100);
    if (achievement.id === "v12") return Math.min(100, (dailyStreak / 7) * 100);
    if (achievement.id === "v13") return Math.min(100, (dailyStreak / 30) * 100);
    
    // Organization achievements
    if (achievement.id === "o3") return Math.min(100, (initiativesCompleted / 5) * 100);
    if (achievement.id === "o4") return Math.min(100, (volunteersEngaged / 50) * 100);
    if (achievement.id === "o5") return Math.min(100, (fullCapacityInitiatives / 5) * 100);
    if (achievement.id === "o6") return Math.min(100, (initiativesCompleted / 10) * 100);
    if (achievement.id === "o7") return Math.min(100, (initiativesCompleted / 50) * 100);
    if (achievement.id === "o8") return Math.min(100, (volunteersEngaged / 100) * 100);
    if (achievement.id === "o9") return Math.min(100, (dailyStreak / 7) * 100);
    if (achievement.id === "o10") return Math.min(100, (dailyStreak / 30) * 100);
  }
  
  return 0;
}

export default function AchievementsPage() {
  const { user, trackAchievementProgress, loading } = useAuth()
  const [testAchievement, setTestAchievement] = useState<any>(null)
  const [showTestControls, setShowTestControls] = useState(false)
  const [simulatedProgress, setSimulatedProgress] = useState<Record<string, number>>({})

  // Show loading state while user data is being fetched
  if (loading) {
    return (
      <div className="container mx-auto py-8 pt-20">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vollie-blue mb-4"></div>
          <p className="text-muted-foreground">Loading achievements...</p>
        </div>
      </div>
    )
  }

  // If user is not logged in or there's an error
  if (!user) {
    return (
      <div className="container mx-auto py-8 pt-20">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="p-4 rounded-full bg-red-100 mb-4">
            <Trophy className="h-12 w-12 text-vollie-blue" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Unable to load achievements</h2>
          <p className="text-muted-foreground mb-4">Please try logging in again</p>
          <Button asChild>
            <Link href="/login">Log In</Link>
          </Button>
        </div>
      </div>
    )
  }

  // Ensure user has stats and achievements initialized
  if (!user.stats || !user.stats.achievements) {
    // Create default achievements based on user type
    const achievements = user.userType === 2 ? volunteerAchievements : organizationAchievements;
    
    return (
      <div className="container mx-auto py-8 pt-20">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Achievements</CardTitle>
            <CardDescription>Track your progress and unlock rewards</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {achievements.map((achievement) => (
                <div 
                  key={achievement.id}
                  className="border rounded-lg p-4 bg-muted/20"
                >
                  <h3 className="font-semibold">{achievement.name}</h3>
                  <p className="text-sm text-muted-foreground">{achievement.description}</p>
                  <div className="mt-2">
                    <Progress value={0} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
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

  // Function to simulate unlocking an achievement for testing
  const simulateAchievementUnlock = (achievementType: 'initiative_signup' | 'initiative_complete' | 'volunteer_hours' | 'impact_areas' | 'invite_friend' | 'streak' | 'volunteer_capacity') => {
    trackAchievementProgress(achievementType);
  }

  // Function to show test achievement animation
  const showTestAchievement = (achievement: any) => {
    setTestAchievement({
      ...achievement,
      level: achievement.level || "common"
    });
  }

  // Toggle test controls visibility
  const toggleTestControls = () => {
    setShowTestControls(!showTestControls);
  }

  // Function to simulate progress for an achievement
  const simulateProgress = (achievementId: string, increment: number = 20) => {
    setSimulatedProgress(prev => {
      const currentProgress = prev[achievementId] || 0;
      const newProgress = Math.min(100, currentProgress + increment);
      
      // If we reach 100%, show the unlock animation
      if (newProgress >= 100) {
        const achievement = achievements.find(a => a.id === achievementId);
        if (achievement) {
          showTestAchievement(achievement);
        }
      }
      
      return {
        ...prev,
        [achievementId]: newProgress
      };
    });
  }

  // Enhanced progress calculation that takes into account simulated progress
  const getAchievementProgress = (achievement: any) => {
    // If we have simulated progress for this achievement, use that
    if (simulatedProgress[achievement.id] !== undefined) {
      return simulatedProgress[achievement.id];
    }
    
    // Otherwise use the real progress
    return calculateProgress(achievement, user.stats);
  }

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

        {/* Test Controls Toggle */}
        <div className="flex justify-end">
          <Button 
            variant="outline" 
            onClick={toggleTestControls}
            className="text-vollie-blue border-vollie-blue hover:bg-vollie-blue/10"
          >
            {showTestControls ? "Hide Test Controls" : "Show Test Controls"}
          </Button>
        </div>

        {/* Test Controls (for development) */}
        {showTestControls && (
          <Card className="border-vollie-light-blue shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-vollie-blue">Test Achievement Animations</CardTitle>
              <CardDescription>
                Use these buttons to test achievement unlocks and animations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => simulateAchievementUnlock('initiative_signup')}
                >
                  Simulate Initiative Signup
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => simulateAchievementUnlock('initiative_complete')}
                >
                  Simulate Initiative Complete
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => simulateAchievementUnlock('volunteer_hours')}
                >
                  Simulate Volunteer Hours
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => showTestAchievement({
                    id: "test1",
                    name: "Test Achievement",
                    description: "This is a test achievement with a cool animation!",
                    xp: 500,
                    level: "legendary"
                  })}
                >
                  Show Test Animation
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

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
                {achievements.map((achievement) => {
                  // Calculate progress for this achievement
                  const progress = getAchievementProgress(achievement);
                  
                  return (
                    <motion.div
                      key={achievement.id}
                      whileHover={{ scale: 1.02 }}
                      className={`group relative overflow-hidden rounded-lg border transition-all ${
                        achievement.unlocked || progress >= 100
                          ? "border-vollie-light-blue bg-white dark:bg-gray-800"
                          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
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
                          
                          {/* Action buttons */}
                          <div className="flex gap-1">
                            {/* Preview button */}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 rounded-full"
                              onClick={() => showTestAchievement(achievement)}
                              title="Preview animation"
                            >
                              <motion.div
                                whileHover={{ rotate: 15 }}
                                transition={{ type: "spring", stiffness: 300 }}
                              >
                                <Eye className="h-4 w-4 text-muted-foreground" />
                              </motion.div>
                            </Button>
                            
                            {/* Progress button (only for non-unlocked achievements) */}
                            {!achievement.unlocked && progress < 100 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 rounded-full"
                                onClick={() => simulateProgress(achievement.id)}
                                title="Simulate progress"
                              >
                                <motion.div
                                  whileHover={{ rotate: 90 }}
                                  transition={{ type: "spring", stiffness: 300 }}
                                >
                                  <Plus className="h-4 w-4 text-muted-foreground" />
                                </motion.div>
                              </Button>
                            )}
                          </div>
                        </div>
                        
                        {/* Progress bar */}
                        <div className="mt-4">
                          <div className="flex justify-between text-xs text-muted-foreground mb-1">
                            <span>{achievement.unlocked || progress >= 100 ? 'Completed' : `${Math.round(progress)}%`}</span>
                            {!achievement.unlocked && progress < 100 && (
                              <span className="text-vollie-blue font-medium">
                                {achievement.xp} XP
                              </span>
                            )}
                          </div>
                          <Progress 
                            value={progress} 
                            className={`h-2 ${
                              achievement.unlocked || progress >= 100
                                ? "[&>div]:bg-green-500 bg-green-100 dark:bg-green-900/20" 
                                : `[&>div]:${getLevelColor(achievement.level).replace('bg-', '[&>div]:bg-')} bg-gray-100 dark:bg-gray-700`
                            }`}
                          />
                        </div>
                        
                        <div className="mt-4 flex items-center justify-between">
                          <Badge
                            variant="secondary"
                            className={`${getLevelColor(achievement.level)} text-white dark:text-gray-100`}
                          >
                            {achievement.level.charAt(0).toUpperCase() + achievement.level.slice(1)}
                          </Badge>
                          {(achievement.unlocked || progress >= 100) && (
                            <span className="text-sm font-medium text-green-500 dark:text-green-400 flex items-center gap-1">
                              <Trophy className="h-4 w-4" />
                              Unlocked
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Achievement unlock animation */}
      {testAchievement && (
        <AchievementUnlockAnimation
          achievement={testAchievement}
          isVisible={true}
          onClose={() => setTestAchievement(null)}
        />
      )}
    </div>
  )
}

