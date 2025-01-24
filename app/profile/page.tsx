"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Pencil, Award, Clock, Briefcase, Check, Star } from "lucide-react"
import { useAuth } from "../context/AuthContext"
import { useToast } from "@/components/ui/use-toast"
import { GamificationPanel } from "../components/GamificationPanel"

export default function ProfilePage() {
  const { user, updateProfile, loading, calculateLevel } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [editedUser, setEditedUser] = useState(user)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    } else if (user) {
      setEditedUser(user)
    }
  }, [user, loading, router])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return null
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = () => {
    updateProfile(editedUser)
    setIsEditing(false)
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditedUser({ ...editedUser, [e.target.name]: e.target.value })
  }

  const currentLevelXP = user.xp - 100 * (user.level - 1) ** 2
  const nextLevelXP = 100 * user.level ** 2
  const xpProgress = (currentLevelXP / (nextLevelXP - 100 * (user.level - 1) ** 2)) * 100

  return (
    <div className="container mx-auto py-8 pt-20">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Your Profile</h1>
        <Button onClick={isEditing ? handleSave : handleEdit}>
          {isEditing ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Save
            </>
          ) : (
            <>
              <Pencil className="mr-2 h-4 w-4" />
              Edit Profile
            </>
          )}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  {isEditing ? (
                    <Input name="name" value={editedUser.name} onChange={handleChange} className="font-bold text-2xl" />
                  ) : (
                    <>
                      <h2 className="text-2xl font-bold">{user.name}</h2>
                      <p className="text-muted-foreground">{user.email}</p>
                    </>
                  )}
                </div>
              </div>
              <div>
                <Label htmlFor="bio">Bio</Label>
                {isEditing ? (
                  <Textarea
                    id="bio"
                    name="bio"
                    value={editedUser.bio || ""}
                    onChange={handleChange}
                    rows={4}
                    maxLength={500}
                  />
                ) : (
                  <p>{user.bio || "No bio provided"}</p>
                )}
                {isEditing && (
                  <p className="text-sm text-muted-foreground mt-1">{editedUser.bio?.length || 0}/500 characters</p>
                )}
              </div>
              {user.type === "volunteer" && (
                <div>
                  <Label htmlFor="interests">Interests</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {user.interests?.map((interest, index) => (
                      <Badge key={index} variant="secondary">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {user.type === "organization" && (
                <div>
                  <Label htmlFor="description">Organization Description</Label>
                  {isEditing ? (
                    <Textarea
                      id="description"
                      name="description"
                      value={editedUser.description || ""}
                      onChange={handleChange}
                      rows={4}
                    />
                  ) : (
                    <p>{user.description || "No description provided"}</p>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{user.type === "volunteer" ? "Volunteering Stats" : "Organization Stats"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              {user.type === "volunteer" ? (
                <>
                  <div>
                    <Clock className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <div className="text-2xl font-bold">{user.stats?.hoursVolunteered || 0}</div>
                    <div className="text-sm text-muted-foreground">Hours</div>
                  </div>
                  <div>
                    <Briefcase className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <div className="text-2xl font-bold">{user.stats?.initiativesCompleted || 0}</div>
                    <div className="text-sm text-muted-foreground">Initiatives</div>
                  </div>
                  <div>
                    <Award className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <div className="text-2xl font-bold">{user.stats?.organizationsHelped || 0}</div>
                    <div className="text-sm text-muted-foreground">Organizations</div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <Briefcase className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <div className="text-2xl font-bold">{user.stats?.initiativesCreated || 0}</div>
                    <div className="text-sm text-muted-foreground">Initiatives</div>
                  </div>
                  <div>
                    <Clock className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <div className="text-2xl font-bold">{user.stats?.totalVolunteerHours || 0}</div>
                    <div className="text-sm text-muted-foreground">Volunteer Hours</div>
                  </div>
                  <div>
                    <Award className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <div className="text-2xl font-bold">{user.stats?.volunteersEngaged || 0}</div>
                    <div className="text-sm text-muted-foreground">Volunteers</div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {user.type === "volunteer" && (
        <div className="mt-6">
          <GamificationPanel />
        </div>
      )}

      {user.type === "volunteer" && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Level Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 mb-4">
              <Star className="h-8 w-8 text-yellow-500" />
              <div>
                <div className="text-2xl font-bold">Level {user.level}</div>
                <div className="text-sm text-muted-foreground">{user.xp} XP total</div>
              </div>
            </div>
            <Progress value={xpProgress} className="w-full h-2 mb-2" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{currentLevelXP} XP</span>
              <span>{nextLevelXP - currentLevelXP} XP to next level</span>
            </div>
          </CardContent>
        </Card>
      )}

      {user.type === "volunteer" && user.stats?.achievements && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Achievements</CardTitle>
            <CardDescription>Track your volunteering milestones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {user.stats.achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`p-4 border rounded-lg ${achievement.unlocked ? "bg-primary/10" : "bg-gray-100"}`}
                >
                  <h3 className="font-semibold mb-2">{achievement.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
                  <div className="flex justify-between items-center">
                    <Badge variant={achievement.unlocked ? "default" : "secondary"}>
                      {achievement.unlocked ? "Unlocked" : "Locked"}
                    </Badge>
                    <span className="text-sm font-medium">{achievement.xp} XP</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

