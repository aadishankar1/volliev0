"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Star, Award, Medal, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";
import { cn } from "@/lib/utils";

interface AchievementUnlockAnimationProps {
  achievement: {
    id: string;
    name: string;
    description: string;
    xp: number;
    level: "common" | "rare" | "epic" | "legendary" | "mythic";
  };
  isVisible: boolean;
  onClose: () => void;
}

export function AchievementUnlockAnimation({
  achievement,
  isVisible,
  onClose
}: AchievementUnlockAnimationProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [playSound, setPlaySound] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio element for achievement sound
    audioRef.current = new Audio("/sounds/achievement-unlock.mp3");
    
    // Add error handling for the audio
    if (audioRef.current) {
      audioRef.current.addEventListener('error', (e) => {
        console.log("Audio error:", e);
        // Continue without sound
        setPlaySound(false);
      });
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener('error', () => {});
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (isVisible) {
      // Trigger confetti effect when achievement is shown
      setShowConfetti(true);
      
      // Play sound effect (with a slight delay for dramatic effect)
      setTimeout(() => {
        setPlaySound(true);
        if (audioRef.current) {
          audioRef.current.volume = 0.5; // Set volume to 50%
          audioRef.current.play().catch(e => console.log("Audio play failed:", e));
        }
      }, 300);
      
      // Create confetti effect
      const duration = 4000;
      const animationEnd = Date.now() + duration;
      
      // Get colors based on achievement level
      const colors = getLevelConfettiColors(achievement.level);
      
      const confettiInterval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();
        
        if (timeLeft <= 0) {
          clearInterval(confettiInterval);
          return;
        }
        
        // Randomize the confetti
        const particleCount = 3 + Math.random() * 4;
        
        // Launch confetti from both sides
        confetti({
          particleCount: Math.floor(particleCount),
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors,
          shapes: ['circle', 'square'],
          scalar: 1.2
        });
        
        confetti({
          particleCount: Math.floor(particleCount),
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors,
          shapes: ['circle', 'square'],
          scalar: 1.2
        });
        
        // Sometimes add confetti from the top
        if (Math.random() > 0.7) {
          confetti({
            particleCount: Math.floor(particleCount),
            angle: 90,
            spread: 100,
            origin: { y: 0, x: 0.5 },
            colors: colors,
            shapes: ['circle', 'square'],
            scalar: 1.2
          });
        }
      }, 150);
      
      // Auto-close after animation
      const timer = setTimeout(() => {
        setShowConfetti(false);
        setPlaySound(false);
        setTimeout(onClose, 500);
      }, 6000);
      
      return () => {
        clearInterval(confettiInterval);
        clearTimeout(timer);
        if (audioRef.current) {
          audioRef.current.pause();
        }
      };
    }
  }, [isVisible, onClose, achievement.level]);

  const getLevelConfettiColors = (level: string) => {
    switch (level) {
      case "common":
        return ['#9CA3AF', '#D1D5DB', '#E5E7EB', '#F3F4F6'];
      case "rare":
        return ['#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE'];
      case "epic":
        return ['#8B5CF6', '#A78BFA', '#C4B5FD', '#DDD6FE'];
      case "legendary":
        return ['#F59E0B', '#FBBF24', '#FCD34D', '#FDE68A'];
      case "mythic":
        return ['#EF4444', '#8B5CF6', '#3B82F6', '#EC4899', '#F97316'];
      default:
        return ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "common":
        return "bg-gray-400 dark:bg-gray-500 border-gray-300";
      case "rare":
        return "bg-blue-500 dark:bg-blue-400 border-blue-300";
      case "epic":
        return "bg-purple-500 dark:bg-purple-400 border-purple-300";
      case "legendary":
        return "bg-yellow-500 dark:bg-yellow-400 border-yellow-300";
      case "mythic":
        return "bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 border-pink-300";
      default:
        return "bg-gray-400 dark:bg-gray-500 border-gray-300";
    }
  };

  const getIcon = (level: string) => {
    switch (level) {
      case "common":
        return <Trophy className="h-12 w-12 text-white" />;
      case "rare":
        return <Award className="h-12 w-12 text-white" />;
      case "epic":
        return <Medal className="h-12 w-12 text-white" />;
      case "legendary":
        return <Star className="h-12 w-12 text-white" />;
      case "mythic":
        return <Sparkles className="h-12 w-12 text-white" />;
      default:
        return <Trophy className="h-12 w-12 text-white" />;
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.5, y: 100, opacity: 0 }}
            animate={{ 
              scale: 1, 
              y: 0, 
              opacity: 1,
              transition: { 
                type: "spring", 
                damping: 15, 
                stiffness: 200,
                delay: 0.2
              } 
            }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className={cn(
              "rounded-xl overflow-hidden shadow-2xl max-w-md w-full border-4",
              getLevelColor(achievement.level)
            )}>
              <div className={cn(
                "p-8 text-white text-center",
                getLevelColor(achievement.level)
              )}>
                <motion.div
                  initial={{ scale: 0.5, opacity: 0, y: 20 }}
                  animate={{ 
                    scale: 1, 
                    opacity: 1, 
                    y: 0,
                    transition: { delay: 0.5, duration: 0.5 }
                  }}
                  className="mb-4 flex justify-center"
                >
                  <motion.div 
                    className="p-4 rounded-full bg-white/20 inline-block"
                    animate={{ 
                      rotate: [0, -10, 10, -10, 10, 0],
                      scale: [1, 1.1, 1, 1.1, 1]
                    }}
                    transition={{ 
                      duration: 1.5, 
                      delay: 1,
                      repeat: 0
                    }}
                  >
                    {getIcon(achievement.level)}
                  </motion.div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ 
                    opacity: 1, 
                    scale: [1, 1.1, 1],
                    transition: { delay: 0.7, duration: 0.8 }
                  }}
                  className="mb-2"
                >
                  <motion.div
                    className="text-3xl font-bold relative inline-block"
                    animate={{ 
                      y: [0, -5, 0],
                    }}
                    transition={{ 
                      duration: 0.5, 
                      delay: 1.2,
                    }}
                  >
                    Achievement Unlocked!
                    
                    {/* Sparkle effects */}
                    <motion.div 
                      className="absolute -top-2 -left-2 text-yellow-300"
                      animate={{ 
                        rotate: 360,
                        scale: [1, 1.2, 0.8, 1],
                        opacity: [0, 1, 0]
                      }}
                      transition={{ 
                        duration: 2, 
                        delay: 1.5,
                        repeat: 1
                      }}
                    >
                      ✨
                    </motion.div>
                    <motion.div 
                      className="absolute -top-2 -right-2 text-yellow-300"
                      animate={{ 
                        rotate: 360,
                        scale: [1, 1.2, 0.8, 1],
                        opacity: [0, 1, 0]
                      }}
                      transition={{ 
                        duration: 2, 
                        delay: 1.7,
                        repeat: 1
                      }}
                    >
                      ✨
                    </motion.div>
                  </motion.div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    transition: { delay: 0.9, duration: 0.5 }
                  }}
                >
                  <h3 className="text-2xl font-semibold mb-2">{achievement.name}</h3>
                  <p className="text-white/80 mb-4">{achievement.description}</p>
                  
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: 1,
                      transition: { delay: 1.3, duration: 0.7 }
                    }}
                    className="inline-block bg-white/20 px-4 py-2 rounded-full font-bold"
                  >
                    +{achievement.xp} XP
                  </motion.div>
                </motion.div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-6 text-center">
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    transition: { delay: 1.1, duration: 0.5 }
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="px-6 py-2 bg-vollie-blue text-white rounded-full font-medium hover:bg-vollie-blue/90 transition-colors"
                >
                  Continue
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 