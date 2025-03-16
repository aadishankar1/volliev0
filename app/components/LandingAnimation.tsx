"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { X } from 'lucide-react'

// Floating particle component
const Particle = ({ delay = 0, size = 8, x = 0, y = 0, duration = 10 }) => (
  <motion.div
    className="absolute rounded-full bg-vollie-blue/20"
    style={{ 
      width: size, 
      height: size,
      left: `calc(50% + ${x}px)`,
      top: `calc(50% + ${y}px)`,
    }}
    initial={{ opacity: 0, scale: 0 }}
    animate={{ 
      opacity: [0, 0.5, 0.2, 0.7, 0],
      scale: [0, 1, 1.5, 1, 0],
      y: [0, -20, -40, -60, -80],
      x: [0, x/4, x/2, x*0.75, x]
    }}
    transition={{ 
      delay,
      duration, 
      repeat: Infinity,
      repeatType: "loop",
      ease: "easeInOut",
      times: [0, 0.2, 0.5, 0.8, 1]
    }}
  />
)

export default function LandingAnimation() {
  const [showButtons, setShowButtons] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Show buttons after the main animation completes
    const timer = setTimeout(() => {
      setShowButtons(true)
    }, 3000)

    // Check if we're on a mobile device
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    // Initial check
    checkMobile()
    
    // Add resize listener
    window.addEventListener('resize', checkMobile)
    
    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  // Generate random particles - fewer on mobile
  const particleCount = isMobile ? 8 : 15
  const particles = Array.from({ length: particleCount }).map((_, i) => ({
    id: i,
    delay: Math.random() * 5,
    size: Math.random() * (isMobile ? 8 : 10) + 5,
    x: (Math.random() - 0.5) * (isMobile ? 300 : 500),
    y: (Math.random() - 0.5) * (isMobile ? 200 : 300),
    duration: Math.random() * 10 + 8
  }))

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-background to-background/95 overflow-hidden">
      {/* Skip button */}
      <motion.div 
        className="absolute top-4 right-4 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-muted-foreground hover:text-foreground"
          onClick={() => router.push('/explore')}
        >
          <X className="h-4 w-4 mr-1" />
          Skip
        </Button>
      </motion.div>

      <div className="container max-w-5xl mx-auto px-4 flex flex-col items-center relative">
        {/* Background particles */}
        {particles.map((particle) => (
          <Particle 
            key={particle.id}
            delay={particle.delay}
            size={particle.size}
            x={particle.x}
            y={particle.y}
            duration={particle.duration}
          />
        ))}

        <AnimatePresence>
          {/* Logo Animation */}
          <motion.div
            className="relative mb-8 md:mb-12"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              duration: 1.2,
              ease: [0.22, 1, 0.36, 1]
            }}
          >
            {/* Pulsing glow effect */}
            <motion.div
              className="absolute inset-0 rounded-full bg-vollie-blue/20 blur-3xl"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.4, 0.6, 0.4]
              }}
              transition={{ 
                delay: 0.3, 
                duration: 4,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
            
            {/* Rotating ring */}
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-vollie-blue/30"
              style={{ 
                width: isMobile ? 130 : 170, 
                height: isMobile ? 130 : 170, 
                left: "50%", 
                top: "50%",
                marginLeft: isMobile ? -65 : -85,
                marginTop: isMobile ? -65 : -85
              }}
              initial={{ opacity: 0, rotate: 0 }}
              animate={{ 
                opacity: [0, 0.7, 0],
                rotate: 360,
                scale: [0.8, 1.1, 1.3]
              }}
              transition={{ 
                delay: 1.5,
                duration: 8,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Copy_of_Volunteen_Logo-removebg-preview-RiE6TyzfOc1innz0Iud7ZxghahIAY0.png"
              alt="Vollie Logo"
              width={isMobile ? 120 : 150}
              height={isMobile ? 120 : 150}
              className="relative z-10"
            />
          </motion.div>

          {/* Text Animation */}
          <motion.div 
            className="text-center space-y-4 md:space-y-6 max-w-2xl px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <motion.h1 
              className="text-3xl md:text-4xl lg:text-6xl font-bold text-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0, duration: 0.8 }}
            >
              Welcome to <span className="text-vollie-blue">Vollie</span>
            </motion.h1>
            
            <motion.p 
              className="text-base md:text-lg lg:text-xl text-muted-foreground px-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4, duration: 0.8 }}
            >
              Connecting volunteers with meaningful opportunities to make a difference
            </motion.p>

            {/* Animated underline */}
            <motion.div 
              className="h-1 bg-vollie-blue/80 rounded-full mx-auto"
              initial={{ width: 0 }}
              animate={{ width: isMobile ? "60%" : "40%" }}
              transition={{ delay: 1.8, duration: 1 }}
            />
            
            {/* Animated tagline */}
            <motion.div
              className="pt-2 md:pt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.2, duration: 0.8 }}
            >
              <motion.span
                className="inline-block text-xs md:text-sm lg:text-base text-vollie-blue/80 font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0.5, 1] }}
                transition={{ 
                  delay: 2.4, 
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse",
                  times: [0, 0.3, 0.6, 1]
                }}
              >
                Discover • Connect • Volunteer • Impact
              </motion.span>
            </motion.div>
          </motion.div>

          {/* Buttons */}
          {showButtons && (
            <motion.div 
              className="flex flex-col sm:flex-row gap-3 md:gap-4 mt-8 md:mt-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Button 
                size={isMobile ? "default" : "lg"}
                className="bg-vollie-blue hover:bg-vollie-blue/90 text-white px-6 md:px-8"
                onClick={() => router.push('/login')}
              >
                <motion.span
                  initial={{ opacity: 1 }}
                  whileHover={{ opacity: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  Login
                </motion.span>
              </Button>
              <Button 
                variant="outline" 
                size={isMobile ? "default" : "lg"}
                className="border-vollie-blue text-vollie-blue hover:bg-vollie-blue/10 px-6 md:px-8"
                onClick={() => router.push('/signup/volunteer')}
              >
                <motion.span
                  initial={{ opacity: 1 }}
                  whileHover={{ opacity: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  Sign Up
                </motion.span>
              </Button>
              <Button 
                variant="ghost" 
                size={isMobile ? "default" : "lg"}
                className="text-muted-foreground hover:text-foreground px-6 md:px-8"
                onClick={() => router.push('/explore')}
              >
                <motion.span
                  initial={{ opacity: 1 }}
                  whileHover={{ opacity: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  Explore
                </motion.span>
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
} 