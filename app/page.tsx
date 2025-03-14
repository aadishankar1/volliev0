"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from './context/AuthContext'
import LandingAnimation from './components/LandingAnimation'

export default function Home() {
  const [showAnimation, setShowAnimation] = useState(true)
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    // Wait for auth to load before making decisions
    if (loading) return;

    // If user is already logged in, redirect to explore
    if (user) {
      setShowAnimation(false)
      router.push('/explore')
    }
    // If user is not logged in, always show the animation
    // No localStorage check anymore - we always show it for non-logged-in users
  }, [router, user, loading])

  // If we're not showing the animation, return null while redirecting
  if (!showAnimation) {
    return null
  }

  // Show the landing animation
  return <LandingAnimation />
}
