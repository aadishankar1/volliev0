"use client";

import type React from "react";
import { createContext, useState, useContext, useEffect } from "react";
import Cookie from "js-cookie";
import { getUser, userLogin, userSignup } from "@/services/apiAction/user";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { AnimatedNotification } from "../components/AnimatedNotification";
import { AchievementUnlockAnimation } from "../components/AchievementUnlockAnimation";
import { cache, CACHE_KEYS } from "../lib/cache";
import { request } from "@/services/api";
import { endpoints } from "@/services/endpoints";

type Achievement = {
  id: string;
  name: string;
  description: string;
  xp: number;
  unlocked: boolean;
  unlockedAt?: Date;
  level: "common" | "rare" | "epic" | "legendary" | "mythic";
  progress?: number;
  total?: number;
};

type Challenge = {
  id: string;
  name: string;
  description: string;
  xp: number;
  completed: boolean;
};

type Quest = {
  id: string;
  name: string;
  description: string;
  xp: number;
  progress: number;
  total: number;
  completed?: boolean;
};

type UserStats = {
  hoursVolunteered?: number;
  initiativesCompleted?: number;
  organizationsHelped?: number;
  initiativesCreated?: number;
  totalVolunteerHours?: number;
  volunteersEngaged?: number;
  fullCapacityInitiatives?: number;
  impactAreas?: number;
  friendsInvited?: number;
  achievements?: Achievement[];
  dailyStreak: number;
  lastVolunteerDate: string | null;
  challenges?: Challenge[];
  quests?: Quest[];
};

type Activity = {
  id: string;
  type: 'initiative' | 'achievement';
  title: string;
  description: string;
  date: string;
};

type User = {
  id: string;
  name: string;
  email: string;
  userType: 2 | 1;
  bio?: string;
  intrests?: string[];
  description?: string;
  avatar?: string;
  linkedIn?: string;
  stats?: UserStats;
  darkMode?: boolean;
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  xp: number;
  level: number;
  friends: Friend[];
  teams: string[];
  posts: string[];
  notifications: Notification[];
  location: string;
  pendingRequests?: PendingRequest[];
  recentActivity?: Activity[];
} | null;

type Opportunity = {
  id: string;
  title: string;
  organization: string;
  description: string;
  tags: string[];
  // Add other relevant fields
};

type Friend = {
  id: string;
  name: string;
  avatar: string;
};

type Team = {
  id: string;
  name: string;
  description: string;
  members: string[];
  createdBy: string;
};

type Notification = {
  id: string;
  type:
    | "initiative_signup"
    | "achievement_unlocked"
    | "friend_request"
    | "team_invite"
    | "initiative_reminder"
    | "signup_request"
    | "signup_accepted"
    | "signup_declined"
    | "initiative_posted"
    | "initiative_tomorrow"
    | "initiative_canceled";
  title: string;
  message: string;
  date: Date;
  read: boolean;
  initiativeId?: string;
  userId?: string;
};

type PendingRequest = {
  id: string;
  title: string;
  organization: string;
  requestDate: string;
};

type NotificationType = {
  type: "achievement" | "levelUp" | "quest";
  title: string;
  description: string;
  xp?: number;
  achievement?: Achievement;
};

type AuthContextType = {
  user: User;
  login: (data: {
    email: string;
    pass: string;
    name?: string;
    userType?: 1 | 2;
    location?: string;
  }) => Promise<void>;
  createUser: (data: any) => Promise<void>;
  getUserfromToken: () => string | null;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  loading: boolean;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  trackAchievementProgress: (
    achievementType: 'initiative_signup' | 'initiative_complete' | 'volunteer_hours' | 
    'impact_areas' | 'invite_friend' | 'streak' | 'volunteer_capacity'
  ) => void;
  getPersonalizedRecommendations: (
    opportunities: Opportunity[]
  ) => Opportunity[];
  calculateLevel: (xp: number) => number;
  unlockAchievement: (achievementId: string) => void;
  updateDailyStreak: () => void;
  completeChallenge: (challengeId: string) => void;
  updateQuestProgress: (questId: string, progress: number) => void;
  addFriend: (friendId: string) => void;
  removeFriend: (friendId: string) => void;
  createTeam: (name: string, description: string) => void;
  joinTeam: (teamId: string) => void;
  leaveTeam: (teamId: string) => void;
  addNotification: (
    notification: Omit<Notification, "id" | "date" | "read">
  ) => void;
  markNotificationAsRead: (notificationId: string) => void;
  signUpForInitiative: (
    initiativeId: string,
    initiativeTitle: string,
    organizationName: string
  ) => void;
  acceptSignUpRequest: (initiativeId: string, userId: string) => void;
  declineSignUpRequest: (initiativeId: string, userId: string) => void;
  fetchInitiatives: () => Promise<void>;
  createInitiative: (initiativeData: any) => Promise<void>;
  updateInitiative: (
    initiativeId: string,
    initiativeData: any
  ) => Promise<void>;
  deleteInitiative: (initiativeId: string) => Promise<void>;
  searchInitiatives: (query: string, filters: any) => Promise<void>;
  uploadFile: (file: File) => Promise<string>;
  cancelSignUp: (initiativeId: string) => void;
  logActivity: (activity: Activity) => void;
  showNotification: (notification: NotificationType) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const defaultVolunteerAchievements: Achievement[] = [
  {
    id: "v1",
    name: "First Steps",
    description: "Sign-up for your first initiative",
    xp: 100,
    unlocked: false,
    level: "common",
  },
  {
    id: "v2",
    name: "Impact Initiate",
    description: "Complete your first initiative",
    xp: 200,
    unlocked: false,
    level: "common",
  },
  {
    id: "v3",
    name: "Helping Hand",
    description: "Complete five initiatives",
    xp: 500,
    unlocked: false,
    level: "rare",
  },
  {
    id: "v4",
    name: "Versatile Volunteer",
    description: "Join volunteering initiatives in five different impact areas",
    xp: 500,
    unlocked: false,
    level: "rare",
  },
  {
    id: "v5",
    name: "Century Contributor",
    description: "Complete one-hundred hours of volunteer work",
    xp: 2000,
    unlocked: false,
    level: "mythic",
  },
  {
    id: "v6",
    name: "Half-Century Hero",
    description: "Complete fifty hours of volunteer work",
    xp: 1000,
    unlocked: false,
    level: "legendary",
  },
  {
    id: "v7",
    name: "Time Donor",
    description: "Complete ten hours of volunteer work",
    xp: 500,
    unlocked: false,
    level: "rare",
  },
  {
    id: "v8",
    name: "Dedicated Doer",
    description: "Complete ten initiatives",
    xp: 1000,
    unlocked: false,
    level: "legendary",
  },
  {
    id: "v9",
    name: "Volunteer Virtuoso",
    description: "Complete fifty initiatives",
    xp: 2000,
    unlocked: false,
    level: "mythic",
  },
  {
    id: "v10",
    name: "Community Connector",
    description: "Invite a friend to volunteer on an initiative with you",
    xp: 500,
    unlocked: false,
    level: "rare",
  },
  {
    id: "v11",
    name: "Network Nurturer",
    description: "Invite three friends to volunteer on initiatives with you",
    xp: 1000,
    unlocked: false,
    level: "legendary",
  },
  {
    id: "v12",
    name: "Weekly Warrior",
    description: "Maintain a one-week streak on Vollie",
    xp: 1000,
    unlocked: false,
    level: "legendary",
  },
  {
    id: "v13",
    name: "Monthly Maven",
    description: "Maintain a one-month streak on Vollie",
    xp: 1000,
    unlocked: false,
    level: "legendary",
  },
];

const defaultOrganizationAchievements: Achievement[] = [
  {
    id: "o1",
    name: "Initiative Innovator",
    description: "Post your first initiative",
    xp: 100,
    unlocked: false,
    level: "common",
  },
  {
    id: "o2",
    name: "Mission Accomplished",
    description: "Complete your first initiative",
    xp: 200,
    unlocked: false,
    level: "common",
  },
  {
    id: "o3",
    name: "Impact Multiplier",
    description: "Complete five initiatives",
    xp: 500,
    unlocked: false,
    level: "rare",
  },
  {
    id: "o4",
    name: "Volunteer Magnet",
    description: "Recruit fifty volunteers to your initiatives",
    xp: 1000,
    unlocked: false,
    level: "legendary",
  },
  {
    id: "o5",
    name: "Full House",
    description: "Have five initiatives reach maximum volunteer capacity",
    xp: 500,
    unlocked: false,
    level: "rare",
  },
  {
    id: "o6",
    name: "Change Champion",
    description: "Complete ten initiatives",
    xp: 1000,
    unlocked: false,
    level: "legendary",
  },
  {
    id: "o7",
    name: "Impact Titan",
    description: "Complete fifty initiatives",
    xp: 2000,
    unlocked: false,
    level: "mythic",
  },
  {
    id: "o8",
    name: "Community Catalyst",
    description: "Recruit one-hundred volunteers to your initiatives",
    xp: 1000,
    unlocked: false,
    level: "legendary",
  },
  {
    id: "o9",
    name: "Weekly Changemaker",
    description: "Maintain a one-week streak on Vollie",
    xp: 1000,
    unlocked: false,
    level: "legendary",
  },
  {
    id: "o10",
    name: "Monthly Mobilizer",
    description: "Maintain a one-month streak on Vollie",
    xp: 1000,
    unlocked: false,
    level: "legendary",
  },
];

const defaultChallenges: Challenge[] = [
  {
    id: "1",
    name: "Early Bird",
    description: "Complete a volunteer activity before 9 AM",
    xp: 50,
    completed: false,
  },
  {
    id: "2",
    name: "Weekend Warrior",
    description: "Volunteer for 4 hours on a weekend",
    xp: 100,
    completed: false,
  },
  {
    id: "3",
    name: "Diverse Helper",
    description: "Volunteer for 3 different types of activities",
    xp: 150,
    completed: false,
  },
];

const defaultQuests: Quest[] = [
  {
    id: "1",
    name: "Community Champion",
    description: "Complete 10 volunteer activities",
    xp: 500,
    progress: 0,
    total: 10,
  },
  {
    id: "2",
    name: "Time Dedication",
    description: "Volunteer for a total of 50 hours",
    xp: 1000,
    progress: 0,
    total: 50,
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<NotificationType | null>(null);
  const [unlockedAchievement, setUnlockedAchievement] = useState<Achievement | null>(null);
  const router = useRouter();

  useEffect(() => {
    const accessToken = Cookie.get("accessToken");
    if (!accessToken) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    getUser()
      .then((user: any) => {
        // Initialize user stats and achievements based on user type if they don't exist
        if (user.res && !user.res.stats) {
          const achievements = user.res.userType === 1 
            ? defaultOrganizationAchievements 
            : defaultVolunteerAchievements;
            
          user.res.stats = {
            dailyStreak: 0,
            lastVolunteerDate: null as string | null,
            achievements: achievements,
            challenges: defaultChallenges,
            quests: defaultQuests
          };
        }
        
        setUser(user.res);
      })
      .catch((err) => {
        console.error("Error fetching user data:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const login = async (data: any) => {
    try {
      const login = await userLogin(data);
      if (login.res) Cookie.set("accessToken", login?.res?.token);
      const userData: User = jwtDecode(login.res?.token);
      
      // Initialize user stats and achievements based on user type if they don't exist
      if (userData && !userData.stats) {
        const achievements = userData.userType === 1 
          ? defaultOrganizationAchievements 
          : defaultVolunteerAchievements;
          
        userData.stats = {
          dailyStreak: 0,
          lastVolunteerDate: null,
          achievements: achievements,
          challenges: defaultChallenges,
          quests: defaultQuests
        };
      }
      
      setUser(userData);
      router.push("/profile");
    } catch (err) {
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    Cookie.remove("accessToken");
    router.push("/login");
  };

  const calculateLevel = (xp: number): number => {
    return Math.floor(Math.sqrt(xp / 100)) + 1;
  };

  const updateProfile = async (data: Partial<User>): Promise<void> => {
    if (!user) return;

    try {
      // Make API call to update user profile in the database
      const endpoint = `${endpoints.user}/${user.id}`;
      await request(endpoint, "PUT", data);

      // Update local state if API call is successful
      const updatedUser: User = {
        ...user,
        ...data,
        stats: {
          ...user.stats,
          ...(data.stats || {}),
          dailyStreak: data.stats?.dailyStreak ?? user.stats?.dailyStreak ?? 0
        }
      };

      if (data?.xp !== undefined) {
        updatedUser.level = calculateLevel(updatedUser.xp);
      }
      
      setUser(updatedUser);

      // Update local storage
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  };

  const getPersonalizedRecommendations = (
    opportunities: Opportunity[]
  ): Opportunity[] => {
    if (!user || !user.intrests) return opportunities;

    return opportunities.filter((opportunity) =>
      opportunity.tags.some((tag) => user.intrests!.includes(tag))
    );
  };

  const showNotification = (notification: NotificationType) => {
    setNotification(notification);
    setTimeout(() => setNotification(null), 5000); // Hide after 5 seconds
  };

  const getUserAchievements = (userId: string) => {
    // Try to get from cache first
    const cached = cache.get<Achievement[]>(CACHE_KEYS.USER_ACHIEVEMENTS(userId));
    if (cached) return cached;

    // If not in cache, get from user stats
    const achievements = user?.stats?.achievements || [];
    
    // Cache the result
    cache.set(CACHE_KEYS.USER_ACHIEVEMENTS(userId), achievements);
    
    return achievements;
  };

  const getUserActivities = (userId: string) => {
    // Try to get from cache first
    const cached = cache.get<Activity[]>(CACHE_KEYS.USER_ACTIVITIES(userId));
    if (cached) return cached;

    // If not in cache, get from user
    const activities = user?.recentActivity || [];
    
    // Cache the result
    cache.set(CACHE_KEYS.USER_ACTIVITIES(userId), activities);
    
    return activities;
  };

  const updateUserStats = async (userId: string, statsUpdate: Partial<UserStats>) => {
    try {
      // In a real implementation, this would call your API
      // const data = await request(`/user/${userId}/stats`, "PATCH", statsUpdate);
      
      // For now, we'll simulate a successful API call
      console.log(`Updated stats for user ${userId}:`, statsUpdate);
      
      // Update the user state with the new stats
      if (user) {
        const updatedUser = {
          ...user,
          stats: {
            ...user.stats,
            ...statsUpdate
          },
          xp: statsUpdate.xp !== undefined ? statsUpdate.xp : (user.xp || 0)
        };
        
        setUser(updatedUser);
      }
    } catch (error) {
      console.error("Error updating user stats:", error);
    }
  };

  const unlockAchievement = (achievementId: string) => {
    if (user?.stats?.achievements) {
      const achievements = getUserAchievements(user.id);
      const achievement = achievements.find((a: Achievement) => a.id === achievementId);
      
      if (achievement && !achievement.unlocked) {
        const updatedAchievements = achievements.map((a: Achievement) =>
          a.id === achievementId
            ? { ...a, unlocked: true, unlockedAt: new Date() }
            : a
        );

        // Update cache and state
        cache.set(CACHE_KEYS.USER_ACHIEVEMENTS(user.id), updatedAchievements);
        updateUserStats(user.id, {
          achievements: updatedAchievements,
          xp: (user.xp || 0) + achievement.xp,
        });

        // Show notification
        showNotification({
          type: "achievement",
          title: "Achievement Unlocked!",
          description: achievement.name,
          xp: achievement.xp,
        });

        // Log activity
        logActivity({
          id: Date.now().toString(),
          type: 'achievement',
          title: achievement.name,
          description: achievement.description,
          date: new Date().toISOString(),
        });
      }
    }
  };

  const updateDailyStreak = () => {
    if (!user?.stats) return;

    const today = new Date();
    const lastVolunteerDate = user.stats.lastVolunteerDate 
      ? new Date(user.stats.lastVolunteerDate)
      : null;

    if (!lastVolunteerDate) {
      setUser(prev => ({
        ...prev!,
        stats: {
          ...prev!.stats!,
          dailyStreak: 1,
          lastVolunteerDate: today.toISOString()
        }
      }));
      return;
    }

    const daysSinceLastVolunteer = Math.floor(
      (today.getTime() - lastVolunteerDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceLastVolunteer === 0) {
      // Already logged today
      return;
    } else if (daysSinceLastVolunteer === 1) {
      // Consecutive day
      setUser(prev => ({
        ...prev!,
        stats: {
          ...prev!.stats!,
          dailyStreak: (prev!.stats!.dailyStreak || 0) + 1,
          lastVolunteerDate: today.toISOString()
        }
      }));
    } else {
      // Streak broken
      setUser(prev => ({
        ...prev!,
        stats: {
          ...prev!.stats!,
          dailyStreak: 1,
          lastVolunteerDate: today.toISOString()
        }
      }));
    }

    // Save to backend
    updateProfile({
      stats: {
        ...user.stats,
        dailyStreak: user.stats.dailyStreak,
        lastVolunteerDate: today.toISOString()
      }
    });
  };

  const completeChallenge = (challengeId: string) => {
    if (!user?.stats?.challenges) return;

    const challenge = user.stats.challenges.find(c => c.id === challengeId);
    if (!challenge || challenge.completed) return;

    setUser(prev => ({
      ...prev!,
      xp: prev!.xp + challenge.xp,
      stats: {
        ...prev!.stats!,
        challenges: prev!.stats!.challenges!.map(c =>
          c.id === challengeId ? { ...c, completed: true } : c
        )
      }
    }));

    // Save to backend
    updateProfile({
      xp: user.xp + challenge.xp,
      stats: {
        ...user.stats,
        challenges: user.stats.challenges.map(c =>
          c.id === challengeId ? { ...c, completed: true } : c
        )
      }
    });

    // Add notification
    addNotification({
      type: "achievement_unlocked",
      title: "Challenge Completed!",
      message: `You completed the "${challenge.name}" challenge and earned ${challenge.xp} XP!`
    });

    // Log the activity
    logActivity({
      id: Date.now().toString(),
      type: 'initiative',
      title: challenge.name,
      description: challenge.description,
      date: new Date().toISOString()
    });
  };

  const updateQuestProgress = (questId: string, progress: number) => {
    if (!user?.stats?.quests) return;

    const quest = user.stats.quests.find(q => q.id === questId);
    if (!quest || quest.completed) return;

    const updatedProgress = Math.min(progress, quest.total);
    const wasCompleted = updatedProgress >= quest.total;

    setUser(prev => ({
      ...prev!,
      xp: wasCompleted ? prev!.xp + quest.xp : prev!.xp,
      stats: {
        ...prev!.stats!,
        quests: prev!.stats!.quests!.map(q =>
          q.id === questId
            ? {
                ...q,
                progress: updatedProgress,
                completed: wasCompleted
              }
            : q
        )
      }
    }));

    // Save to backend
    updateProfile({
      xp: wasCompleted ? user.xp + quest.xp : user.xp,
      stats: {
        ...user.stats,
        quests: user.stats.quests.map(q =>
          q.id === questId
            ? {
                ...q,
                progress: updatedProgress,
                completed: wasCompleted
              }
            : q
        )
      }
    });

    if (wasCompleted) {
      addNotification({
        type: "achievement_unlocked",
        title: "Quest Completed!",
        message: `You completed the "${quest.name}" quest and earned ${quest.xp} XP!`
      });

      // Log the activity
      logActivity({
        id: Date.now().toString(),
        type: 'initiative',
        title: quest.name,
        description: quest.description,
        date: new Date().toISOString()
      });

      showNotification({
        type: "quest",
        title: "Quest Completed!",
        description: quest.name,
        xp: quest.xp
      });
    }
  };

  const addFriend = (friendId: string) => {
    if (user) {
      // In a real app, you'd fetch the friend's data from the server
      const newFriend: Friend = {
        id: friendId,
        name: `Friend ${friendId}`,
        avatar: "/placeholder.svg",
      };
      updateProfile({
        friends: [...user.friends, newFriend],
      });
      addNotification({
        type: "friend_request",
        title: "New Friend Added",
        message: `You are now friends with ${newFriend.name}.`,
      });
    }
  };

  const removeFriend = (friendId: string) => {
    if (user) {
      const updatedFriends = user.friends.filter(
        (friend) => friend.id !== friendId
      );
      updateProfile({ friends: updatedFriends });
      addNotification({
        type: "friend_request",
        title: "Friend Removed",
        message: "The friend has been removed from your list.",
      });
    }
  };

  const createTeam = (name: string, description: string) => {
    if (user) {
      const newTeam: Team = {
        id: Date.now().toString(),
        name,
        description,
        members: [user.id],
        createdBy: user.id,
      };
      // In a real app, you'd store this team data on the server
      updateProfile({
        teams: [...user.teams, newTeam.id],
      });
      addNotification({
        type: "team_invite",
        title: "Team Created",
        message: `Your team "${name}" has been successfully created.`,
      });
    }
  };

  const joinTeam = (teamId: string) => {
    if (user) {
      updateProfile({
        teams: [...user.teams, teamId],
      });
      addNotification({
        type: "team_invite",
        title: "Team Joined",
        message: "You have successfully joined the team.",
      });
    }
  };

  const leaveTeam = (teamId: string) => {
    if (user) {
      const updatedTeams = user.teams.filter((id) => id !== teamId);
      updateProfile({ teams: updatedTeams });
      addNotification({
        type: "team_invite",
        title: "Team Left",
        message: "You have left the team.",
      });
    }
  };

  const addNotification = (
    notification: Omit<Notification, "id" | "date" | "read">
  ) => {
    if (user) {
      const newNotification: Notification = {
        ...notification,
        id: Date.now().toString(),
        date: new Date(),
        read: false,
      };
      updateProfile({
        notifications: [newNotification, ...user.notifications],
      });
    }
  };

  const markNotificationAsRead = (notificationId: string) => {
    if (user) {
      const updatedNotifications = user.notifications.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      );
      updateProfile({
        notifications: updatedNotifications,
      });
    }
  };

  const signUpForInitiative = (
    initiativeId: string,
    initiativeTitle: string,
    organizationName: string
  ) => {
    if (user && user.userType === 2) {
      const newRequest: PendingRequest = {
        id: initiativeId,
        title: initiativeTitle,
        organization: organizationName,
        requestDate: new Date().toISOString(),
      };

      updateProfile({
        pendingRequests: [...(user.pendingRequests || []), newRequest],
      });

      addNotification({
        type: "signup_request",
        title: "Initiative Sign-up Request Sent",
        message: `Your request to join "${initiativeTitle}" has been sent to ${organizationName}.`,
        initiativeId,
      });
    }
  };

  const acceptSignUpRequest = (initiativeId: string, userId: string) => {
    if (user && user.userType === 1) {
      // In a real app, you'd update the initiative's participants on the server
      addNotification({
        type: "signup_accepted",
        title: "Sign-up Request Accepted",
        message: `You've accepted the sign-up request for initiative ${initiativeId} from user ${userId}.`,
        initiativeId,
        userId,
      });
      // Notify the volunteer that their request was accepted
    }
  };

  const declineSignUpRequest = (initiativeId: string, userId: string) => {
    if (user && user.userType === 1) {
      addNotification({
        type: "signup_declined",
        title: "Sign-up Request Declined",
        message: `You've declined the sign-up request for initiative ${initiativeId} from user ${userId}.`,
        initiativeId,
        userId,
      });
      // Notify the volunteer that their request was declined
    }
  };

  const fetchInitiatives = async () => {
    // TODO: Implement API call to fetch initiatives
  };

  const createInitiative = async (initiativeData: any) => {
    // TODO: Implement API call to create an initiative
  };

  const updateInitiative = async (
    initiativeId: string,
    initiativeData: any
  ) => {
    // TODO: Implement API call to update an initiative
  };

  const deleteInitiative = async (initiativeId: string) => {
    // TODO: Implement API call to delete an initiative
  };

  const searchInitiatives = async (query: string, filters: any) => {
    // TODO: Implement API call to search initiatives
  };

  const uploadFile = async (file: File) => {
    // TODO: Implement API call to upload a file
    return "https://example.com/uploaded-file.jpg"; // Placeholder return
  };

  const cancelSignUp = (initiativeId: string) => {
    if (user) {
      const updatedPendingRequests = user.pendingRequests?.filter(
        (request) => request.id !== initiativeId
      );

      const updatedNotifications = user.notifications.filter(
        (notification) =>
          !(
            notification.type === "signup_request" &&
            notification.initiativeId === initiativeId
          )
      );

      updateProfile({
        pendingRequests: updatedPendingRequests,
        notifications: updatedNotifications,
      });

      addNotification({
        type: "initiative_canceled",
        title: "Sign-up Request Canceled",
        message: `You have canceled your sign-up request for initiative ${initiativeId}.`,
        initiativeId,
      });
    }
  };

  const createUser = async (data: any): Promise<void> => {
    try {
      const userResponse = await userSignup(data);
      if (userResponse.res) Cookie.set("accessToken", userResponse?.res?.token);
      const createdUser: User = jwtDecode(userResponse.res?.token);
      
      // Initialize user stats and achievements based on user type
      if (createdUser) {
        const achievements = createdUser.userType === 1 
          ? defaultOrganizationAchievements 
          : defaultVolunteerAchievements;
          
        createdUser.stats = {
          dailyStreak: 0,
          lastVolunteerDate: null,
          achievements: achievements,
          challenges: defaultChallenges,
          quests: defaultQuests
        };
        
        setUser(createdUser);
      }
    } catch (err) {
      throw err;
    }
  };

  const getUserfromToken = () => {
    const token = Cookie.get("accessToken");
    if (token) {
      const user:any= jwtDecode(token);
      return user
    }
    return null;
  };

  const logActivity = (activity: Activity) => {
    if (user) {
      const updatedActivities = [activity, ...(user.recentActivity || [])].slice(0, 10);
      updateProfile({ ...user, recentActivity: updatedActivities });
    }
  };

  const forgotPassword = async (email: string): Promise<void> => {
    try {
      // In a real implementation, this would call your API
      // await request("/user/forgot-password", "POST", { email });
      
      // For now, we'll simulate a successful API call
      console.log(`Password reset email sent to ${email}`);
      
      // Show success notification
      showNotification({
        type: "achievement",
        title: "Email Sent",
        description: "If an account exists with this email, you will receive password reset instructions."
      });
    } catch (error) {
      console.error("Error sending reset email:", error);
      throw error;
    }
  };

  const resetPassword = async (token: string, password: string): Promise<void> => {
    try {
      // In a real implementation, this would call your API
      // await request("/user/reset-password", "POST", { token, password });
      
      // For now, we'll simulate a successful API call
      console.log(`Password reset for token ${token}`);
      
      // Show success notification
      showNotification({
        type: "achievement",
        title: "Password Reset",
        description: "Your password has been reset successfully."
      });
    } catch (error) {
      console.error("Error resetting password:", error);
      throw error;
    }
  };

  // Track achievement progress and unlock achievements when criteria are met
  const trackAchievementProgress = (
    achievementType: 'initiative_signup' | 'initiative_complete' | 'volunteer_hours' | 
    'impact_areas' | 'invite_friend' | 'streak' | 'volunteer_capacity'
  ) => {
    if (!user || !user.stats?.achievements) return;
    
    const achievements = [...user.stats.achievements];
    let achievementsUnlocked = false;
    let xpGained = 0;
    
    // Helper function to unlock an achievement if it's not already unlocked
    const unlockAchievement = (achievementId: string) => {
      const achievement = achievements.find(a => a.id === achievementId);
      if (achievement && !achievement.unlocked) {
        achievement.unlocked = true;
        achievement.unlockedAt = new Date();
        achievementsUnlocked = true;
        xpGained += achievement.xp;
        
        // Show achievement unlock animation
        setUnlockedAchievement(achievement);
        
        // Log activity
        logActivity({
          id: Date.now().toString(),
          type: 'achievement',
          title: achievement.name,
          description: achievement.description,
          date: new Date().toISOString(),
        });
      }
    };
    
    // Update progress for an achievement
    const updateProgress = (achievementId: string, currentValue: number, totalValue: number) => {
      const achievement = achievements.find(a => a.id === achievementId);
      if (achievement && !achievement.unlocked) {
        achievement.progress = currentValue;
        achievement.total = totalValue;
        
        // If progress meets or exceeds the total, unlock the achievement
        if (currentValue >= totalValue) {
          unlockAchievement(achievementId);
        }
      }
    };
    
    // Check for achievements based on type
    if (user.userType === 1) { // Organization achievements
      switch (achievementType) {
        case 'initiative_signup':
          unlockAchievement('o1'); // Initiative Innovator - Post your first initiative
          break;
        case 'initiative_complete':
          unlockAchievement('o2'); // Mission Accomplished - Complete your first initiative
          
          // Check for multiple initiatives completed
          const completedInitiatives = user.stats.initiativesCompleted || 0;
          
          // Update progress for multi-initiative achievements
          updateProgress('o3', completedInitiatives, 5); // Impact Multiplier - Complete five initiatives
          updateProgress('o6', completedInitiatives, 10); // Change Champion - Complete ten initiatives
          updateProgress('o7', completedInitiatives, 50); // Impact Titan - Complete fifty initiatives
          break;
        case 'volunteer_capacity':
          // Full House - Have five initiatives reach maximum volunteer capacity
          const fullCapacityInitiatives = user.stats.fullCapacityInitiatives || 0;
          updateProgress('o5', fullCapacityInitiatives, 5);
          break;
        case 'invite_friend':
          // Volunteer Magnet - Recruit fifty volunteers to your initiatives
          const volunteersRecruited = user.stats.volunteersEngaged || 0;
          updateProgress('o4', volunteersRecruited, 50); // Volunteer Magnet - Recruit fifty volunteers
          updateProgress('o8', volunteersRecruited, 100); // Community Catalyst - Recruit one-hundred volunteers
          break;
        case 'streak':
          // Check streak achievements
          const streak = user.stats.dailyStreak || 0;
          updateProgress('o9', streak, 7); // Weekly Changemaker - Maintain a one-week streak
          updateProgress('o10', streak, 30); // Monthly Mobilizer - Maintain a one-month streak
          break;
      }
    } else { // Volunteer achievements
      switch (achievementType) {
        case 'initiative_signup':
          unlockAchievement('v1'); // First Steps - Sign-up for your first initiative
          break;
        case 'initiative_complete':
          unlockAchievement('v2'); // Impact Initiate - Complete your first initiative
          
          // Check for multiple initiatives completed
          const completedInitiatives = user.stats.initiativesCompleted || 0;
          
          // Update progress for multi-initiative achievements
          updateProgress('v3', completedInitiatives, 5); // Helping Hand - Complete five initiatives
          updateProgress('v8', completedInitiatives, 10); // Dedicated Doer - Complete ten initiatives
          updateProgress('v9', completedInitiatives, 50); // Volunteer Virtuoso - Complete fifty initiatives
          break;
        case 'volunteer_hours':
          // Check volunteer hours achievements
          const hours = user.stats.hoursVolunteered || 0;
          updateProgress('v7', hours, 10); // Time Donor - Complete ten hours
          updateProgress('v6', hours, 50); // Half-Century Hero - Complete fifty hours
          updateProgress('v5', hours, 100); // Century Contributor - Complete one-hundred hours
          break;
        case 'impact_areas':
          // Versatile Volunteer - Join volunteering initiatives in five different impact areas
          const impactAreas = user.stats.impactAreas || 0;
          updateProgress('v4', impactAreas, 5);
          break;
        case 'invite_friend':
          // Community Connector - Invite a friend to volunteer
          unlockAchievement('v10');
          
          // Network Nurturer - Invite three friends
          const friendsInvited = user.stats.friendsInvited || 0;
          updateProgress('v11', friendsInvited, 3);
          break;
        case 'streak':
          // Check streak achievements
          const streak = user.stats.dailyStreak || 0;
          updateProgress('v12', streak, 7); // Weekly Warrior - Maintain a one-week streak
          updateProgress('v13', streak, 30); // Monthly Maven - Maintain a one-month streak
          break;
      }
    }
    
    // Update user stats if achievements were unlocked or progress was updated
    if (achievementsUnlocked) {
      if (user && user.id) {
        updateUserStats(user.id, {
          achievements,
          xp: (user.xp || 0) + xpGained
        });
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        createUser,
        updateProfile,
        loading,
        getUserfromToken,
        getPersonalizedRecommendations,
        calculateLevel,
        unlockAchievement,
        updateDailyStreak,
        completeChallenge,
        updateQuestProgress,
        addFriend,
        removeFriend,
        createTeam,
        joinTeam,
        leaveTeam,
        addNotification,
        markNotificationAsRead,
        signUpForInitiative,
        acceptSignUpRequest,
        declineSignUpRequest,
        fetchInitiatives,
        createInitiative,
        updateInitiative,
        deleteInitiative,
        searchInitiatives,
        uploadFile,
        cancelSignUp,
        logActivity,
        showNotification,
        forgotPassword,
        resetPassword,
        trackAchievementProgress,
      }}
    >
      {children}
      {notification && (
        <AnimatedNotification
          {...notification}
          isVisible={true}
          onClose={() => setNotification(null)}
        />
      )}
      {unlockedAchievement && (
        <AchievementUnlockAnimation
          achievement={unlockedAchievement}
          isVisible={true}
          onClose={() => setUnlockedAchievement(null)}
        />
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
