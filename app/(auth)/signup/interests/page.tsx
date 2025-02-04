'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from '../../../context/AuthContext'
import { Badge } from "@/components/ui/badge"

const INTERESTS = [
  "Education", "Environment", "Health", "Animals", "Arts & Culture",
  "Community Development", "Disaster Relief", "Human Rights", "Poverty Alleviation",
  "Technology", "Youth Empowerment", "Elderly Care", "Sports", "Mental Health"
]

export default function InterestsPage() {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [bio, setBio] = useState('')
  const router = useRouter()
  const { toast } = useToast()
  const { user, updateProfile } = useAuth()

  const handleInterestToggle = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest))
    } else if (selectedInterests.length < 5) {
      setSelectedInterests([...selectedInterests, interest])
    } else {
      toast({
        title: "Maximum interests selected",
        description: "You can select up to 5 interests.",
        variant: "destructive",
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedInterests.length === 0) {
      toast({
        title: "Select interests",
        description: "Please select at least one interest.",
        variant: "destructive",
      })
      return
    }
    if (bio.length > 500) {
      toast({
        title: "Bio too long",
        description: "Please keep your bio under 500 characters.",
        variant: "destructive",
      })
      return
    }
    try {
      await updateProfile({ interests: selectedInterests, bio })
      toast({
        title: "Profile updated",
        description: "Your interests and bio have been saved.",
      })
      router.push('/profile')
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error updating your profile. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (!user) {
    router.push('/login')
    return null
  }

  return (
    <div className="container mx-auto py-8 pt-20">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Select Your Interests</CardTitle>
          <CardDescription>Choose up to 5 interests and write a short bio</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Interests ({selectedInterests.length}/5)</h3>
              <div className="flex flex-wrap gap-2">
                {INTERESTS.map((interest) => (
                  <Badge
                    key={interest}
                    variant={selectedInterests.includes(interest) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => handleInterestToggle(interest)}
                  >
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Bio</h3>
              <Textarea
                placeholder="Write a short bio (max 500 characters)"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={500}
                rows={4}
              />
              <p className="text-sm text-muted-foreground">{bio.length}/500 characters</p>
            </div>
            <Button type="submit" className="w-full">Complete Profile</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

