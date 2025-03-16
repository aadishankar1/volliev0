"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LevelUpAnimation } from '../components/LevelUpAnimation'
import { useAuth } from '../context/AuthContext'
import { Zap, Star, TrendingUp, Award } from 'lucide-react'

// XP thresholds for each level
const levelThresholds = [
  0,      // Level 0 (not used)
  100,    // Level 1
  300,    // Level 2
  500,    // Level 3
  1000,   // Level 4
  2000,   // Level 5
  5000,   // Level 6
  7000,   // Level 7
  10000,  // Level 8
]

export default function LevelUpDemoPage() {
  const { user, addXp } = useAuth()
  const [showDemo, setShowDemo] = useState(false)
  const [demoLevel, setDemoLevel] = useState(1)
  const [demoXpGained, setDemoXpGained] = useState(100)
  const [demoTotalXp, setDemoTotalXp] = useState(100)
  
  // Calculate current level based on XP
  const calculateLevel = (xp: number): number => {
    return Math.floor(Math.sqrt(xp / 100)) + 1
  }
  
  // Get XP needed for next level
  const getXpForNextLevel = (currentLevel: number): number => {
    return levelThresholds[currentLevel + 1] - levelThresholds[currentLevel]
  }
  
  // Handle adding XP through the Auth context
  const handleAddXp = (amount: number) => {
    if (addXp) {
      addXp(amount)
    }
  }
  
  // Show demo animation with specific level
  const showDemoAnimation = (level: number) => {
    setDemoLevel(level)
    setDemoXpGained(level * 100)
    setDemoTotalXp(levelThresholds[level])
    setShowDemo(true)
  }
  
  return (
    <div className="container mx-auto py-8 pt-20">
      <h1 className="text-3xl font-bold text-vollie-blue mb-6">Level Up Animation Demo</h1>
      
      {user && (
        <Card className="mb-8 border-vollie-light-blue">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-6 w-6 text-vollie-blue" />
              Your Current Stats
            </CardTitle>
            <CardDescription>
              Your current level and XP in the Vollie platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="bg-muted/30 p-4 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Current Level</div>
                <div className="text-2xl font-bold text-vollie-blue">{user.level || 1}</div>
              </div>
              <div className="bg-muted/30 p-4 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Total XP</div>
                <div className="text-2xl font-bold text-vollie-blue">{user.xp || 0}</div>
              </div>
              <div className="bg-muted/30 p-4 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Next Level</div>
                <div className="text-2xl font-bold text-vollie-blue">
                  {getXpForNextLevel(user.level || 1)} XP needed
                </div>
              </div>
            </div>
            
            <div className="mt-6 space-y-4">
              <h3 className="text-lg font-medium">Add XP</h3>
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant="outline" 
                  className="border-vollie-blue text-vollie-blue hover:bg-vollie-blue/10"
                  onClick={() => handleAddXp(50)}
                >
                  <Zap className="mr-2 h-4 w-4" />
                  Add 50 XP
                </Button>
                <Button 
                  variant="outline" 
                  className="border-vollie-blue text-vollie-blue hover:bg-vollie-blue/10"
                  onClick={() => handleAddXp(100)}
                >
                  <Zap className="mr-2 h-4 w-4" />
                  Add 100 XP
                </Button>
                <Button 
                  variant="outline" 
                  className="border-vollie-blue text-vollie-blue hover:bg-vollie-blue/10"
                  onClick={() => handleAddXp(200)}
                >
                  <Zap className="mr-2 h-4 w-4" />
                  Add 200 XP
                </Button>
                <Button 
                  variant="outline" 
                  className="border-vollie-blue text-vollie-blue hover:bg-vollie-blue/10"
                  onClick={() => handleAddXp(500)}
                >
                  <Zap className="mr-2 h-4 w-4" />
                  Add 500 XP
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-6 w-6 text-vollie-blue" />
            Demo Animations
          </CardTitle>
          <CardDescription>
            Preview the level-up animation for different levels
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((level) => (
              <Button 
                key={level}
                variant="outline" 
                className="border-vollie-blue text-vollie-blue hover:bg-vollie-blue/10 h-auto py-4 flex flex-col gap-2"
                onClick={() => showDemoAnimation(level)}
              >
                <TrendingUp className="h-6 w-6" />
                <span className="text-lg font-medium">Level {level}</span>
                <span className="text-xs text-muted-foreground">{levelThresholds[level]} XP</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Level Up Animation Demo */}
      <LevelUpAnimation
        isVisible={showDemo}
        onClose={() => setShowDemo(false)}
        level={demoLevel}
        userType={user?.userType === 2 ? 'volunteer' : 'organization'}
        xpGained={demoXpGained}
        totalXp={demoTotalXp}
      />
    </div>
  )
} 