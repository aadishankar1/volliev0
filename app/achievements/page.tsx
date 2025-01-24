'use client'

import { useAuth } from '../context/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Award, Lock, Star, Zap, Trophy, Crown } from 'lucide-react'
import { motion } from 'framer-motion'

type AchievementLevel = 'common' | 'rare' | 'epic' | 'legendary' | 'mythic'

const levelConfig: Record<AchievementLevel, { 
  color: string, 
  icon: React.ReactNode,
  gradient: string,
  textColor: string
}> = {
  common: { 
    color: 'from-green-400 to-green-600', 
    icon: <Award className="h-6 w-6" />,
    gradient: 'bg-gradient-to-br from-green-400 to-green-600',
    textColor: 'text-green-700'
  },
  rare: { 
    color: 'from-blue-400 to-blue-600', 
    icon: <Star className="h-6 w-6" />,
    gradient: 'bg-gradient-to-br from-blue-400 to-blue-600',
    textColor: 'text-blue-700'
  },
  epic: { 
    color: 'from-purple-400 to-purple-600', 
    icon: <Zap className="h-6 w-6" />,
    gradient: 'bg-gradient-to-br from-purple-400 to-purple-600',
    textColor: 'text-purple-700'
  },
  legendary: { 
    color: 'from-yellow-400 to-yellow-600', 
    icon: <Trophy className="h-6 w-6" />,
    gradient: 'bg-gradient-to-br from-yellow-400 to-yellow-600',
    textColor: 'text-yellow-700'
  },
  mythic: { 
    color: 'from-red-400 to-red-600', 
    icon: <Crown className="h-6 w-6" />,
    gradient: 'bg-gradient-to-br from-red-400 to-red-600',
    textColor: 'text-red-700'
  },
}

export default function AchievementsPage() {
  const { user } = useAuth()

  if (!user || user.type !== 'volunteer' || !user.stats) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto py-8 pt-20">
      <h1 className="text-4xl font-bold mb-8">Your Achievements</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {user.stats.achievements.map((achievement) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className={`overflow-hidden transform transition-all duration-300 hover:scale-105 ${
              achievement.unlocked 
                ? `shadow-lg ${levelConfig[achievement.level].gradient}`
                : 'bg-gray-100 shadow'
            }`}>
              <CardHeader className="relative pb-0">
                <div className={`absolute top-0 right-0 m-4 p-2 rounded-full ${
                  achievement.unlocked 
                    ? levelConfig[achievement.level].gradient
                    : 'bg-gray-300'
                }`}>
                  {achievement.unlocked 
                    ? levelConfig[achievement.level].icon 
                    : <Lock className="h-6 w-6 text-white" />
                  }
                </div>
                <CardTitle className={`flex items-center gap-2 text-xl ${
                  achievement.unlocked ? 'text-white' : 'text-gray-700'
                }`}>
                  {achievement.name}
                </CardTitle>
                <CardDescription className={
                  achievement.unlocked ? 'text-white/80' : 'text-gray-500'
                }>
                  {achievement.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex justify-between items-center">
                  <Badge variant={achievement.unlocked ? "secondary" : "outline"} 
                    className={`text-sm ${
                      achievement.unlocked 
                        ? 'bg-white/20 text-white' 
                        : 'bg-gray-200 text-gray-700'
                    }`}>
                    {achievement.unlocked ? "Unlocked" : "Locked"}
                  </Badge>
                  <span className={`text-sm font-medium ${
                    achievement.unlocked ? 'text-white' : 'text-gray-600'
                  }`}>
                    {achievement.xp} XP
                  </span>
                </div>
                {achievement.unlocked && achievement.unlockedAt && (
                  <p className={`text-sm mt-2 ${
                    achievement.unlocked ? 'text-white/80' : 'text-gray-500'
                  }`}>
                    Unlocked on: {new Date(achievement.unlockedAt).toLocaleDateString()}
                  </p>
                )}
                <div className="mt-4">
                  <Badge variant="outline" className={`text-sm ${
                    achievement.unlocked 
                      ? 'bg-white/20 text-white border-white/40' 
                      : 'bg-gray-200 text-gray-700 border-gray-300'
                  }`}>
                    {achievement.level.charAt(0).toUpperCase() + achievement.level.slice(1)}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

