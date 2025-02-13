"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Pencil,
  Check,
  X,
  Upload,
  Clock,
  Briefcase,
  Award,
  Star,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "@/components/ui/use-toast";

const INTERESTS = [
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
];

const organizationAchievements = [
  {
    id: 1,
    name: "First Initiative",
    description: "Create your first volunteer initiative",
    xp: 100,
    unlocked: false,
  },
  {
    id: 2,
    name: "Volunteer Magnet",
    description: "Attract 50 volunteers to your initiatives",
    xp: 250,
    unlocked: false,
  },
  {
    id: 3,
    name: "Community Builder",
    description: "Successfully complete 5 community events",
    xp: 500,
    unlocked: false,
  },
  {
    id: 4,
    name: "Impact Maker",
    description: "Accumulate 1000 volunteer hours across all initiatives",
    xp: 1000,
    unlocked: false,
  },
];

export default function ProfilePage() {
  const { user, updateProfile, loading } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);
  const [newProfileImage, setNewProfileImage] = useState<File | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    } else if (user) {
      setEditedUser(user);
    }
  }, [user, loading, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedUser(user);
    setNewProfileImage(null);
  };

  const handleSave = async () => {
    let imageUrl = user.avatar;

    if (newProfileImage) {
      // In a real application, you would upload the image to a server and get a URL back
      // For this example, we'll just create a local object URL
      imageUrl = URL.createObjectURL(newProfileImage);
    }

    const updatedUser = {
      ...editedUser,
      avatar: imageUrl,
    };

    await updateProfile(updatedUser);
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    editedUser &&
      setEditedUser({ ...editedUser, [e.target.name]: e.target.value });
  };

  const handleInterestChange = (interest: string) => {
    const updatedInterests = editedUser?.intrests?.includes(interest)
      ? editedUser.intrests.filter((i) => i !== interest)
      : [...(editedUser?.intrests || []), interest];
    editedUser && setEditedUser({ ...editedUser, intrests: updatedInterests });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewProfileImage(e.target.files[0]);
    }
  };

  const currentLevelXP = user.xp - 100 * (user.level - 1) ** 2;
  const nextLevelXP = 100 * user.level ** 2;
  const xpProgress =
    (currentLevelXP / (nextLevelXP - 100 * (user.level - 1) ** 2)) * 100;

  return (
    <div className="container mx-auto py-8 pt-20 dark:text-gray-200">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-vollie-blue dark:text-vollie-blue">
          Your Profile
        </h1>
        {isEditing ? (
          <div className="space-x-2">
            <Button
              onClick={handleSave}
              className="bg-green-500 hover:bg-green-600"
            >
              <Check className="mr-2 h-4 w-4" />
              Save
            </Button>
            <Button onClick={handleCancel} variant="outline">
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
          </div>
        ) : (
          <Button onClick={handleEdit}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="dark:bg-gray-800">
          <CardHeader>
            <CardTitle>
              {user.userType === 1
                ? "Organization Information"
                : "Personal Information"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Avatar className="h-20 w-20">
                    <AvatarImage
                      src={
                        newProfileImage
                          ? URL.createObjectURL(newProfileImage)
                          : user.avatar || "/placeholder.svg"
                      }
                      alt={user.name}
                    />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <div className="absolute bottom-0 right-0">
                      <Label htmlFor="profile-image" className="cursor-pointer">
                        <div className="bg-primary text-primary-foreground rounded-full p-1">
                          <Upload className="h-4 w-4" />
                        </div>
                      </Label>
                      <Input
                        id="profile-image"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </div>
                  )}
                </div>
                <div>
                  {isEditing ? (
                    <Input
                      name="name"
                      value={editedUser?.name}
                      onChange={handleChange}
                      className="font-bold text-2xl dark:text-gray-200"
                    />
                  ) : (
                    <>
                      <h2 className="text-2xl font-bold dark:text-gray-200">
                        {user.name}
                      </h2>
                      <p className="text-muted-foreground dark:text-gray-200">
                        {user.email}
                      </p>
                    </>
                  )}
                </div>
              </div>
              {user.userType !== 1 && (
                <div>
                  <Label htmlFor="bio" className="dark:text-gray-200">
                    Bio
                  </Label>
                  {isEditing ? (
                    <Textarea
                      id="bio"
                      name="bio"
                      value={editedUser?.bio || ""}
                      onChange={handleChange}
                      rows={4}
                      maxLength={500}
                      className="dark:text-gray-200"
                    />
                  ) : (
                    <p className="dark:text-gray-200">
                      {user.bio || "No bio provided"}
                    </p>
                  )}
                  {isEditing && (
                    <p className="text-sm text-muted-foreground dark:text-gray-200 mt-1">
                      {editedUser?.bio?.length || 0}/500 characters
                    </p>
                  )}
                </div>
              )}
              {user.userType === 1 && (
                <div>
                  <Label htmlFor="description" className="dark:text-gray-200">
                    Organization Description
                  </Label>
                  {isEditing ? (
                    <Textarea
                      id="description"
                      name="description"
                      value={editedUser?.description || ""}
                      onChange={handleChange}
                      rows={4}
                      maxLength={500}
                      className="dark:text-gray-200"
                    />
                  ) : (
                    <p className="dark:text-gray-200">
                      {user.description || "No description provided"}
                    </p>
                  )}
                  {isEditing && (
                    <p className="text-sm text-muted-foreground dark:text-gray-200 mt-1">
                      {editedUser?.description?.length || 0}/500 characters
                    </p>
                  )}
                </div>
              )}
              <div>
                <Label htmlFor="interests" className="dark:text-gray-200">
                  Interests
                </Label>
                {isEditing ? (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {INTERESTS.map((interest) => (
                      <Badge
                        key={interest}
                        variant={
                          editedUser?.intrests?.includes(interest)
                            ? "default"
                            : "outline"
                        }
                        className="cursor-pointer"
                        onClick={() => handleInterestChange(interest)}
                      >
                        {interest}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {user.intrests?.map((interest, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="dark:text-gray-200"
                      >
                        {interest}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800">
          <CardHeader>
            <CardTitle>
              {user.userType === 2
                ? "Volunteering Stats"
                : "Organization Stats"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              {user.userType === 2 ? (
                <>
                  <div>
                    <Clock className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <div className="text-2xl font-bold dark:text-gray-200">
                      {user.stats?.hoursVolunteered || 0}
                    </div>
                    <div className="text-sm text-muted-foreground dark:text-gray-200">
                      Hours
                    </div>
                  </div>
                  <div>
                    <Briefcase className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <div className="text-2xl font-bold dark:text-gray-200">
                      {user.stats?.initiativesCompleted || 0}
                    </div>
                    <div className="text-sm text-muted-foreground dark:text-gray-200">
                      Initiatives
                    </div>
                  </div>
                  <div>
                    <Award className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <div className="text-2xl font-bold dark:text-gray-200">
                      {user.stats?.organizationsHelped || 0}
                    </div>
                    <div className="text-sm text-muted-foreground dark:text-gray-200">
                      Organizations
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <Briefcase className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <div className="text-2xl font-bold dark:text-gray-200">
                      {user.stats?.initiativesCreated || 0}
                    </div>
                    <div className="text-sm text-muted-foreground dark:text-gray-200">
                      Initiatives
                    </div>
                  </div>
                  <div>
                    <Clock className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <div className="text-2xl font-bold dark:text-gray-200">
                      {user.stats?.totalVolunteerHours || 0}
                    </div>
                    <div className="text-sm text-muted-foreground dark:text-gray-200">
                      Volunteer Hours
                    </div>
                  </div>
                  <div>
                    <Award className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <div className="text-2xl font-bold dark:text-gray-200">
                      {user.stats?.volunteersEngaged || 0}
                    </div>
                    <div className="text-sm text-muted-foreground dark:text-gray-200">
                      Volunteers
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {user.userType === 1 && (
        <Card className="mt-6 dark:bg-gray-800">
          <CardHeader>
            <CardTitle>Level Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 mb-4">
              <Star className="h-8 w-8 text-yellow-500" />
              <div>
                <div className="text-2xl font-bold dark:text-gray-200">
                  Level {user.level}
                </div>
                <div className="text-sm text-muted-foreground dark:text-gray-200">
                  {user.xp} XP total
                </div>
              </div>
            </div>
            <Progress
              value={xpProgress}
              className="w-full h-2 mb-2 dark:bg-gray-600"
            />
            <div className="flex justify-between text-sm text-muted-foreground dark:text-gray-200">
              <span>{currentLevelXP} XP</span>
              <span>{nextLevelXP - currentLevelXP} XP to next level</span>
            </div>
          </CardContent>
        </Card>
      )}

      {user.userType === 2 && user.stats?.achievements && (
        <Card className="mt-6 dark:bg-gray-800">
          <CardHeader>
            <CardTitle>Achievements</CardTitle>
            <CardDescription>
              Track your volunteering milestones
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {user.stats.achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`p-4 border rounded-lg ${
                    achievement.unlocked
                      ? "bg-primary/10 dark:bg-primary/30"
                      : "bg-gray-100 dark:bg-gray-700"
                  }`}
                >
                  <h3 className="font-semibold mb-2 dark:text-gray-200">
                    {achievement.name}
                  </h3>
                  <p className="text-sm text-muted-foreground dark:text-gray-200 mb-2">
                    {achievement.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <Badge
                      variant={achievement.unlocked ? "default" : "secondary"}
                      className="dark:text-gray-200"
                    >
                      {achievement.unlocked ? "Unlocked" : "Locked"}
                    </Badge>
                    <span className="text-sm font-medium dark:text-gray-200">
                      {achievement.xp} XP
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {user.userType === 1 && (
        <Card className="mt-6 dark:bg-gray-800">
          <CardHeader>
            <CardTitle>Recent Achievements</CardTitle>
            <CardDescription>
              Track your organization's impact milestones
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {user.stats?.achievements?.slice(0, 4).map((achievement) => (
                <Card key={achievement.id} className="bg-muted/50">
                  <CardHeader>
                    <CardTitle>{achievement.name}</CardTitle>
                    <CardDescription>{achievement.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <Badge
                        variant={achievement.unlocked ? "default" : "secondary"}
                      >
                        {achievement.unlocked ? "Unlocked" : "Locked"}
                      </Badge>
                      <span className="text-sm font-medium">
                        {achievement.xp} XP
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Button
                onClick={() => router.push("/achievements")}
                variant="outline"
              >
                View All Achievements
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
