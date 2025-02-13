"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "../../context/AuthContext"
import { Badge } from "@/components/ui/badge"

const CATEGORIES = [
  "Education",
  "Environment",
  "Health",
  "Animals",
  "Arts & Culture",
  "Community Development",
  "Disaster Relief",
  "Human Rights",
  "Poverty Alleviation",
  "Technology",
  "Youth Empowerment",
  "Elderly Care",
  "Sports",
  "Mental Health",
]

export default function InterestsPage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [description, setDescription] = useState("")
  const router = useRouter()
  const { toast } = useToast()
  const { user, updateProfile } = useAuth()

  const handleCategoryToggle = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((i) => i !== category))
    } else if (selectedCategories.length < 5) {
      setSelectedCategories([...selectedCategories, category])
    } else {
      toast({
        title: "Maximum categories selected",
        description: "You can select up to 5 categories.",
        variant: "destructive",
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedCategories.length === 0) {
      toast({
        title: "Select categories",
        description: "Please select at least one category.",
        variant: "destructive",
      })
      return
    }
    if (description.length > 500) {
      toast({
        title: "Description too long",
        description: "Please keep your description under 500 characters.",
        variant: "destructive",
      })
      return
    }
    try {
      await updateProfile({ interests: selectedCategories, description })
      toast({
        title: "Profile updated",
        description: "Your categories and description have been saved.",
      })
      router.push("/profile")
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error updating your profile. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (!user) {
    router.push("/login")
    return null
  }

  return (
    <div className="container mx-auto py-8 pt-20">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>
            {user.type === "organization" ? "Select Your Organization's Categories" : "Select Your Interests"}
          </CardTitle>
          <CardDescription>
            {user.type === "organization"
              ? "Choose up to 5 categories that your organization caters to and provide a brief description"
              : "Choose up to 5 interests and write a short bio"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">
                {user.type === "organization" ? "Categories" : "Interests"} ({selectedCategories.length}/5)
              </h3>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((category) => (
                  <Badge
                    key={category}
                    variant={selectedCategories.includes(category) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => handleCategoryToggle(category)}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium">
                {user.type === "organization" ? "Organization Description" : "Bio"}
              </h3>
              <Textarea
                placeholder={
                  user.type === "organization"
                    ? "Describe your organization's mission and activities (max 500 characters)"
                    : "Write a short bio (max 500 characters)"
                }
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={500}
                rows={4}
              />
              <p className="text-sm text-muted-foreground">{description.length}/500 characters</p>
            </div>
            <Button type="submit" className="w-full">
              Complete Profile
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

