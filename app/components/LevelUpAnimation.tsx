"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { X, Star, Award, TrendingUp, Zap } from 'lucide-react'
import confetti from 'canvas-confetti'

interface LevelUpAnimationProps {
  isVisible: boolean
  onClose: () => void
  level: number
  userType: 'volunteer' | 'organization'
  xpGained: number
  totalXp: number
}

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

// Helper function to get the next level's XP requirement
const getNextLevelXp = (level: number): number => {
  if (level >= levelThresholds.length - 1) {
    return levelThresholds[levelThresholds.length - 1]
  }
  return levelThresholds[level + 1]
}

export function LevelUpAnimation({
  isVisible,
  onClose,
  level,
  userType,
  xpGained,
  totalXp
}: LevelUpAnimationProps) {
  const [showConfetti, setShowConfetti] = useState(false)

  // Trigger confetti when the animation becomes visible
  useEffect(() => {
    if (isVisible) {
      setShowConfetti(true)
      
      // Create a more elaborate confetti effect
      const duration = 3000
      const animationEnd = Date.now() + duration
      const colors = ['#3B82F6', '#93C5FD', '#10B981', '#FBBF24']

      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min
      }

      // Launch multiple confetti bursts
      const launchConfetti = () => {
        const timeLeft = animationEnd - Date.now()
        const particleCount = 50 * (timeLeft / duration)
        
        // Random confetti burst
        confetti({
          particleCount: Math.floor(randomInRange(20, 40)),
          angle: randomInRange(55, 125),
          spread: randomInRange(50, 70),
          origin: { x: randomInRange(0.2, 0.8), y: randomInRange(0.2, 0.4) },
          colors: colors,
          shapes: ['circle', 'square'],
          scalar: randomInRange(0.8, 1.2),
          drift: randomInRange(-0.5, 0.5),
          ticks: 300
        })
        
        // Continue animation if time remains
        if (timeLeft > 0) {
          requestAnimationFrame(launchConfetti)
        }
      }
      
      launchConfetti()
      
      // Clean up after animation
      const timer = setTimeout(() => {
        setShowConfetti(false)
      }, duration)
      
      return () => clearTimeout(timer)
    }
  }, [isVisible])

  // Get the next level's XP requirement
  const nextLevelXp = getNextLevelXp(level)
  
  // Calculate progress to next level
  const progressToNextLevel = level >= levelThresholds.length - 1 
    ? 100 
    : Math.floor(((totalXp - levelThresholds[level]) / (nextLevelXp - levelThresholds[level])) * 100)

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="relative max-w-md w-full mx-4 bg-background rounded-xl overflow-hidden shadow-xl"
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ 
              scale: 1, 
              opacity: 1, 
              y: 0,
              transition: { 
                type: "spring", 
                stiffness: 300, 
                damping: 20,
                delay: 0.1 
              } 
            }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 z-10 rounded-full bg-background/80 p-1 text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
            
            {/* Top decoration - glowing effect */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -inset-[10px] bg-gradient-to-r from-vollie-blue via-vollie-light-blue to-vollie-green opacity-20 blur-xl" />
            </div>
            
            {/* Content */}
            <div className="relative p-6 pt-10 flex flex-col items-center">
              {/* Level up badge */}
              <motion.div
                className="w-24 h-24 rounded-full bg-gradient-to-r from-vollie-blue to-vollie-green flex items-center justify-center mb-4"
                initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
                animate={{ 
                  scale: 1, 
                  opacity: 1, 
                  rotate: 0,
                  transition: { 
                    type: "spring", 
                    stiffness: 300, 
                    damping: 15,
                    delay: 0.3 
                  } 
                }}
              >
                <div className="w-20 h-20 rounded-full bg-background flex items-center justify-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ 
                      scale: [0, 1.2, 1],
                      transition: { 
                        times: [0, 0.6, 1],
                        duration: 0.8,
                        delay: 0.5 
                      } 
                    }}
                  >
                    <Star className="h-10 w-10 text-vollie-blue" />
                  </motion.div>
                </div>
              </motion.div>
              
              {/* Level up text */}
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  transition: { 
                    delay: 0.6,
                    duration: 0.5 
                  } 
                }}
              >
                <h2 className="text-3xl font-bold text-vollie-blue mb-1">Level Up!</h2>
                <p className="text-lg text-muted-foreground mb-4">
                  You've reached <span className="font-semibold text-foreground">Level {level}</span>
                </p>
              </motion.div>
              
              {/* XP gained */}
              <motion.div
                className="flex items-center gap-2 mb-6"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  transition: { 
                    delay: 0.8,
                    duration: 0.5 
                  } 
                }}
              >
                <Zap className="h-5 w-5 text-yellow-500" />
                <span className="text-lg font-medium">+{xpGained} XP</span>
              </motion.div>
              
              {/* Progress to next level */}
              <motion.div
                className="w-full space-y-2 mb-6"
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: 1,
                  transition: { 
                    delay: 1,
                    duration: 0.5 
                  } 
                }}
              >
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progress to Level {level + 1}</span>
                  <span className="font-medium">{progressToNextLevel}%</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-vollie-blue to-vollie-green"
                    initial={{ width: "0%" }}
                    animate={{ 
                      width: `${progressToNextLevel}%`,
                      transition: { 
                        delay: 1.2,
                        duration: 1.5,
                        ease: "easeOut"
                      } 
                    }}
                  />
                </div>
              </motion.div>
              
              {/* Rewards section */}
              <motion.div
                className="w-full bg-muted/50 rounded-lg p-4 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  transition: { 
                    delay: 1.4,
                    duration: 0.5 
                  } 
                }}
              >
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <Award className="h-5 w-5 text-vollie-blue" />
                  <span>Level {level} Rewards</span>
                </h3>
                <ul className="space-y-2 text-sm">
                  {userType === 'volunteer' ? (
                    <>
                      <li className="flex items-start gap-2">
                        <TrendingUp className="h-4 w-4 text-vollie-green mt-0.5" />
                        <span>Increased visibility to organizations</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Star className="h-4 w-4 text-vollie-green mt-0.5" />
                        <span>New profile badge: Level {level} Volunteer</span>
                      </li>
                      {level >= 3 && (
                        <li className="flex items-start gap-2">
                          <Zap className="h-4 w-4 text-vollie-green mt-0.5" />
                          <span>Unlocked priority application for popular initiatives</span>
                        </li>
                      )}
                    </>
                  ) : (
                    <>
                      <li className="flex items-start gap-2">
                        <TrendingUp className="h-4 w-4 text-vollie-green mt-0.5" />
                        <span>Increased visibility in search results</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Star className="h-4 w-4 text-vollie-green mt-0.5" />
                        <span>New profile badge: Level {level} Organization</span>
                      </li>
                      {level >= 3 && (
                        <li className="flex items-start gap-2">
                          <Zap className="h-4 w-4 text-vollie-green mt-0.5" />
                          <span>Unlocked featured placement on the explore page</span>
                        </li>
                      )}
                    </>
                  )}
                </ul>
              </motion.div>
              
              {/* Continue button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  transition: { 
                    delay: 1.6,
                    duration: 0.5 
                  } 
                }}
              >
                <Button 
                  onClick={onClose}
                  className="bg-vollie-blue hover:bg-vollie-blue/90 text-white px-8"
                >
                  Continue
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 