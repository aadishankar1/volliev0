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
  Linkedin,
  MapPin,
  Mail,
  Calendar,
  Users,
  Trophy,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { ImageCropper } from "../components/ImageCropper";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FormError } from "../components/FormError";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { OptimizedImage } from "../components/OptimizedImage";
import { InfiniteScroll } from "../components/InfiniteScroll";
import { motion } from "framer-motion";

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

interface Activity {
  id: string;
  type: 'initiative' | 'achievement';
  title: string;
  description: string;
  date: string;
}

interface UserActivity {
  activity?: Activity[];
}

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  bio: z.string().max(500, "Bio must be less than 500 characters"),
  linkedIn: z.string().url("Please enter a valid LinkedIn URL").or(z.string().length(0)),
});

// Define proper types for form errors and user data
type FormErrorType = {
  name?: string;
  bio?: string;
  linkedIn?: string;
  [key: string]: string | undefined;
};

type EditedUserType = {
  name: string;
  bio: string;
  avatar: string;
  linkedIn: string;
  intrests: string[];
};

export default function ProfilePage() {
  const { user, updateProfile, loading } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<EditedUserType>({
    name: "",
    bio: "",
    avatar: "",
    linkedIn: "",
    intrests: []
  });
  const [newProfileImage, setNewProfileImage] = useState<File | null>(null);
  const { toast } = useToast();
  const [cropperOpen, setCropperOpen] = useState(false);
  const [tempImage, setTempImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<FormErrorType>({});
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    if (user) {
      setEditedUser({
        name: user.name ?? "",
        bio: user.bio ?? "",
        avatar: user.avatar ?? "",
        linkedIn: user.linkedIn ?? "",
        intrests: user.intrests ?? []
      });
    }
  }, [user]);

  if (loading || !user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vollie-blue"></div>
      </div>
    );
  }

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedUser({
      name: user.name ?? "",
      bio: user.bio ?? "",
      avatar: user.avatar ?? "",
      linkedIn: user.linkedIn ?? "",
      intrests: user.intrests ?? []
    });
    setNewProfileImage(null);
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setUploadError("Image size should be less than 5MB");
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setUploadError("Please upload an image file");
        return;
      }

      setUploadError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempImage(reader.result as string);
        setCropperOpen(true);
      };
      reader.onerror = () => {
        setUploadError("Error reading file");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (croppedImage: string) => {
    setEditedUser({ ...editedUser, avatar: croppedImage });
    setTempImage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    const errors: FormErrorType = {};
    if (!editedUser.name) {
      errors.name = "Name is required";
    }
    if (!editedUser.bio) {
      errors.bio = "Bio is required";
    }
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const updatedProfile = {
        ...editedUser,
        name: editedUser.name,
        bio: editedUser.bio,
        linkedIn: editedUser.linkedIn
      };
      await updateProfile(updatedProfile);
      setIsEditing(false);
      setFormErrors({});
    } catch (error) {
      console.error("Error updating profile:", error);
      setFormErrors({ submit: "Failed to update profile" });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({ ...prev, [name]: value || "" }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleInterestChange = (interest: string) => {
    const updatedInterests = editedUser.intrests.includes(interest)
      ? editedUser.intrests.filter((i: string) => i !== interest)
      : [...editedUser.intrests, interest];
    setEditedUser({ ...editedUser, intrests: updatedInterests });
  };

  const currentLevelXP = user.xp - 100 * (user.level - 1) ** 2;
  const nextLevelXP = 100 * user.level ** 2;
  const xpProgress =
    (currentLevelXP / (nextLevelXP - 100 * (user.level - 1) ** 2)) * 100;

  const getAchievementIcon = (level: string) => {
    switch (level) {
      case "1":
        return <Star className="h-5 w-5 text-vollie-blue" />;
      case "2":
        return <Star className="h-5 w-5 text-vollie-blue" />;
      case "3":
        return <Star className="h-5 w-5 text-vollie-blue" />;
      case "4":
        return <Star className="h-5 w-5 text-vollie-blue" />;
      default:
        return <Star className="h-5 w-5 text-vollie-blue" />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "1":
        return "bg-vollie-blue text-white";
      case "2":
        return "bg-vollie-blue text-white";
      case "3":
        return "bg-vollie-blue text-white";
      case "4":
        return "bg-vollie-blue text-white";
      default:
        return "bg-vollie-blue text-white";
    }
  };

  const loadMoreActivities = async () => {
    if (!user || isLoadingMore) return;

    setIsLoadingMore(true);
    try {
      const moreActivities = await fetch(`/api/activities?page=${page}&userId=${user.id}`);
      const data = await moreActivities.json();

      if (data.activities.length === 0) {
        setHasMore(false);
      } else {
        updateProfile({
          ...user,
          recentActivity: [...(user.recentActivity || []), ...data.activities]
        });
        setPage(page + 1);
      }
    } catch (error) {
      console.error('Error loading more activities:', error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 pt-20">
      <div className="grid gap-6 md:grid-cols-12">
        {/* Left Column - Profile Info */}
        <div className="md:col-span-4 space-y-6">
          {/* Profile Card */}
          <Card className="relative border-vollie-light-blue shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex flex-col items-center text-center space-y-4">
                <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name || "User"} />
                  <AvatarFallback className="bg-vollie-blue text-white text-2xl">
                    {user.name?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-2xl font-bold text-vollie-blue">{user.name}</CardTitle>
                  <CardDescription className="flex items-center justify-center gap-2 mt-1">
                    <Mail className="h-4 w-4" />
                    {user.email}
                  </CardDescription>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditing(!isEditing)}
                className="absolute top-4 right-4 hover:bg-vollie-blue/10"
              >
                <Pencil className="h-4 w-4 text-vollie-blue" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium text-vollie-blue">Name</Label>
                    <Input
                      id="name"
                      value={editedUser.name}
                      onChange={handleChange}
                      className={cn(
                        "mt-1 border-vollie-light-blue focus:ring-vollie-blue",
                        formErrors.name && "border-red-500"
                      )}
                    />
                    <FormError message={formErrors.name || ""} />
                  </div>
                  <div>
                    <Label htmlFor="bio" className="text-sm font-medium text-vollie-blue">Bio</Label>
                    <Textarea
                      id="bio"
                      value={editedUser.bio}
                      onChange={handleChange}
                      rows={4}
                      className={cn(
                        "mt-1 border-vollie-light-blue focus:ring-vollie-blue",
                        formErrors.bio && "border-red-500"
                      )}
                      placeholder="Tell us about yourself..."
                    />
                    <div className="flex justify-between mt-1">
                      <FormError message={formErrors.bio||""} />
                      <span className="text-sm text-muted-foreground">
                        {editedUser.bio?.length || 0}/500
                      </span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <Label htmlFor="avatar" className="text-sm font-medium text-vollie-blue">Profile Photo</Label>
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Avatar className="h-20 w-20 border-2 border-vollie-light-blue">
                          <AvatarImage src={editedUser.avatar} />
                          <AvatarFallback className="bg-vollie-blue text-white">
                            {editedUser.name?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        {isUploading && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                            <LoadingSpinner size="sm" className="text-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 space-y-2">
                        <Input
                          id="avatar"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="border-vollie-light-blue focus:ring-vollie-blue"
                          disabled={isUploading}
                        />
                        <p className="text-sm text-muted-foreground">
                          Recommended: Square image, at least 500x500px (max 5MB)
                        </p>
                      </div>
                    </div>
                    {uploadError && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{uploadError}</AlertDescription>
                      </Alert>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="linkedin" className="text-sm font-medium text-vollie-blue">LinkedIn Profile</Label>
                    <Input
                      id="linkedin"
                      type="url"
                      value={editedUser.linkedIn}
                      onChange={handleChange}
                      className={cn(
                        "mt-1 border-vollie-light-blue focus:ring-vollie-blue",
                        formErrors.linkedIn && "border-red-500"
                      )}
                      placeholder={user?.userType === 1 ? "https://linkedin.com/company/yourorganization" : "https://linkedin.com/in/yourprofile"}
                    />
                    <FormError message={formErrors.linkedIn||""} />
                  </div>
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                      className="border-vollie-blue text-vollie-blue hover:bg-vollie-blue/10"
                    >
                      <X className="mr-2 h-4 w-4" />
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleSubmit}
                      className="bg-vollie-blue hover:bg-vollie-blue/90 text-white"
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-medium text-vollie-blue">About</h3>
                      <p className="text-muted-foreground">
                        {user?.bio || "No bio provided yet"}
                      </p>
                    </div>
                    {user?.linkedIn && (
                      <a
                        href={user.linkedIn}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-vollie-blue hover:text-vollie-blue/90 transition-colors group"
                      >
                        <div className="p-2 rounded-full bg-vollie-blue/10 group-hover:bg-vollie-blue/20 transition-colors">
                          <Linkedin className="h-5 w-5" />
                        </div>
                        <span className="underline underline-offset-4">
                          {user.userType === 1 ? 'View Company Page' : 'View LinkedIn Profile'}
                        </span>
                      </a>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-vollie-blue mb-3">Interests</h3>
                    <div className="flex flex-wrap gap-2">
                      {user.intrests?.map((interest: string) => (
                        <Badge 
                          key={interest}
                          className="bg-vollie-blue/10 text-vollie-blue hover:bg-vollie-blue/20"
                        >
                          {interest}
                        </Badge>
                      )) || <p className="text-muted-foreground">No interests selected</p>}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Stats Card */}
          <Card className="border-vollie-light-blue shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-vollie-blue">
                {user.userType === 2 ? "Volunteering Stats" : "Organization Stats"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-6">
                {user.userType === 2 ? (
                  <>
                    <div className="space-y-2 text-center">
                      <div className="p-3 rounded-full bg-vollie-blue/10 w-fit mx-auto">
                        <Clock className="h-6 w-6 text-vollie-blue" />
                      </div>
                      <div className="text-2xl font-bold text-vollie-blue">
                        {user.stats?.hoursVolunteered || 0}
                      </div>
                      <div className="text-sm text-muted-foreground">Hours</div>
                    </div>
                    <div className="space-y-2 text-center">
                      <div className="p-3 rounded-full bg-vollie-blue/10 w-fit mx-auto">
                        <Briefcase className="h-6 w-6 text-vollie-blue" />
                      </div>
                      <div className="text-2xl font-bold text-vollie-blue">
                        {user.stats?.initiativesCompleted || 0}
                      </div>
                      <div className="text-sm text-muted-foreground">Initiatives</div>
                    </div>
                    <div className="space-y-2 text-center">
                      <div className="p-3 rounded-full bg-vollie-blue/10 w-fit mx-auto">
                        <Users className="h-6 w-6 text-vollie-blue" />
                      </div>
                      <div className="text-2xl font-bold text-vollie-blue">
                        {user.stats?.organizationsHelped || 0}
                      </div>
                      <div className="text-sm text-muted-foreground">Organizations</div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-2 text-center">
                      <div className="p-3 rounded-full bg-vollie-blue/10 w-fit mx-auto">
                        <Briefcase className="h-6 w-6 text-vollie-blue" />
                      </div>
                      <div className="text-2xl font-bold text-vollie-blue">
                        {user.stats?.initiativesCreated || 0}
                      </div>
                      <div className="text-sm text-muted-foreground">Initiatives</div>
                    </div>
                    <div className="space-y-2 text-center">
                      <div className="p-3 rounded-full bg-vollie-blue/10 w-fit mx-auto">
                        <Clock className="h-6 w-6 text-vollie-blue" />
                      </div>
                      <div className="text-2xl font-bold text-vollie-blue">
                        {user.stats?.totalVolunteerHours || 0}
                      </div>
                      <div className="text-sm text-muted-foreground">Volunteer Hours</div>
                    </div>
                    <div className="space-y-2 text-center">
                      <div className="p-3 rounded-full bg-vollie-blue/10 w-fit mx-auto">
                        <Users className="h-6 w-6 text-vollie-blue" />
                      </div>
                      <div className="text-2xl font-bold text-vollie-blue">
                        {user.stats?.volunteersEngaged || 0}
                      </div>
                      <div className="text-sm text-muted-foreground">Volunteers</div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Achievements and Activity */}
        <div className="md:col-span-8 space-y-6">
          {/* Level Progress Card */}
          <Card className="border-vollie-light-blue shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-vollie-blue">Level Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-3 rounded-full bg-vollie-blue/10">
                  <Star className="h-6 w-6 text-vollie-blue" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-vollie-blue">Level {user.level || 1}</div>
                  <div className="text-sm text-muted-foreground">{user.xp || 0} XP total</div>
                </div>
              </div>
              <Progress 
                value={((user.xp || 0) % 100) || 0} 
                className="h-2 mb-2 [&>div]:bg-vollie-blue bg-vollie-blue/20"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{user.xp || 0} XP</span>
                <span>{100 - ((user.xp || 0) % 100)} XP to next level</span>
              </div>
            </CardContent>
          </Card>

          {/* Recent Achievements */}
          <Card className="border-vollie-light-blue shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-vollie-blue dark:text-vollie-light-blue">Recent Achievements</CardTitle>
              <CardDescription>Track your volunteering milestones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {(user.stats?.achievements || [])
                  .filter(achievement => achievement.unlocked)
                  .slice(0, 4)
                  .map((achievement) => (
                    <div
                      key={achievement.id}
                      className={`group relative overflow-hidden rounded-lg border transition-all ${
                        achievement.unlocked
                          ? "border-vollie-light-blue bg-white dark:bg-gray-800"
                          : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
                      }`}
                    >
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="font-semibold text-vollie-blue dark:text-vollie-light-blue flex items-center gap-2">
                              {getAchievementIcon(achievement.level)}
                              {achievement.name}
                            </h3>
                            <p className="mt-1 text-sm text-muted-foreground">
                              {achievement.description}
                            </p>
                          </div>
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                          <Badge
                            variant="secondary"
                            className={`${getLevelColor(achievement.level)} text-white dark:text-gray-100`}
                          >
                            {achievement.level.charAt(0).toUpperCase() + achievement.level.slice(1)}
                          </Badge>
                          <span className="text-sm font-medium text-vollie-blue dark:text-vollie-light-blue">
                            {achievement.xp} XP
                          </span>
                        </div>
                        <div className="absolute inset-0 bg-vollie-blue/5 dark:bg-vollie-light-blue/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  ))}
                {(!user.stats?.achievements || user.stats.achievements.filter(a => a.unlocked).length === 0) && (
                  <div className="col-span-2 text-center py-8">
                    <Trophy className="h-12 w-12 text-vollie-blue/40 dark:text-vollie-light-blue/40 mx-auto mb-3" />
                    <p className="text-muted-foreground">No achievements unlocked yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="border-vollie-light-blue shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-vollie-blue">Recent Activity</CardTitle>
              <CardDescription>Your latest volunteering activities</CardDescription>
            </CardHeader>
            <CardContent>
              <InfiniteScroll
                loadMore={loadMoreActivities}
                hasMore={hasMore}
                isLoading={isLoadingMore}
                className="space-y-4"
              >
                {(user?.recentActivity || []).map((activity: Activity, index: number) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-start space-x-4 p-4 rounded-lg border border-vollie-light-blue hover:bg-vollie-blue/5 transition-colors"
                  >
                    <div className="flex-shrink-0">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-vollie-blue/10">
                        {activity.type === 'initiative' ? (
                          <Briefcase className="h-5 w-5 text-vollie-blue" />
                        ) : (
                          <Award className="h-5 w-5 text-vollie-blue" />
                        )}
                      </span>
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium text-vollie-blue">{activity.title}</p>
                      <p className="text-sm text-muted-foreground">{activity.description}</p>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">
                          {new Date(activity.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </InfiniteScroll>
            </CardContent>
          </Card>
        </div>
      </div>
      {tempImage && (
        <ImageCropper
          image={tempImage}
          onCropComplete={handleCropComplete}
          isOpen={cropperOpen}
          onClose={() => {
            setCropperOpen(false);
            setTempImage(null);
          }}
        />
      )}
    </div>
  );
}
