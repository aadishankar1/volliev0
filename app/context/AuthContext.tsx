
"use client";
import type React from "react";
import { createContext, useState, useContext, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { signIn, signUp } from "@/services/auth";
import { addDocument } from "@/services/firestore";
import Cookie from 'js-cookie';

type Achievement = {
  id: string;
  name: string;
  description: string;
  xp: number;
  unlocked: boolean;
  unlockedAt?: Date;
  level: "common" | "rare" | "epic" | "legendary" | "mythic";
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
  achievements?: Achievement[];
  dailyStreak: number;
  lastVolunteerDate: string | null;
  challenges?: Challenge[] | undefined;
  quests: Quest[];
};

type User = {
  id: string;
  name: string;
  email: string;
  type: "volunteer" | "organization";
  bio?: string;
  interests?: string[];
  description?: string;
  avatar?: string;
  stats: UserStats;
  darkMode?: boolean;
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  xp: number;
  level: number;
  friends: Friend[];
  teams: string[];
  posts: string[];
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

type AuthContextType = {
  user: User;
  login: (
    email: string,
    password: string,
    name?: string,
    type?: "volunteer" | "organization"
  ) => Promise<void>;
  createUser: (data: any) => void;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  loading: boolean;
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
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const defaultAchievements: Achievement[] = [
  {
    id: "1",
    name: "First Steps",
    description: "Complete your first volunteer initiative",
    xp: 100,
    unlocked: false,
    level: "common",
  },
  {
    id: "2",
    name: "Helping Hand",
    description: "Volunteer for 10 hours",
    xp: 250,
    unlocked: false,
    level: "rare",
  },
  {
    id: "3",
    name: "Community Pillar",
    description: "Help 5 different organizations",
    xp: 500,
    unlocked: false,
    level: "epic",
  },
  {
    id: "4",
    name: "Dedication",
    description: "Complete 10 volunteer initiatives",
    xp: 1000,
    unlocked: false,
    level: "legendary",
  },
  {
    id: "5",
    name: "Time Well Spent",
    description: "Volunteer for 100 hours",
    xp: 2000,
    unlocked: false,
    level: "mythic",
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
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  useEffect(() => {
    const savedUser = Cookie.get("user");
    const unsubscribe = onAuthStateChanged(auth, (user: any) => {
      setUser(user);
    });
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
    return () => unsubscribe();
  }, []);

  const login = async (
    email: string,
    password: string,
    name?: string,
    type: "volunteer" | "organization" = "volunteer"
  ) => {
    try {
      const login = await signIn(email, password);
      Cookie.set("user",JSON.stringify(user))

    } catch (err) {
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    Cookie.remove("user");
  };

  const calculateLevel = (xp: number): number => {
    return Math.floor(Math.sqrt(xp / 100)) + 1;
  };

  const updateProfile = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      if (data?.xp !== undefined) {
        updatedUser.level = calculateLevel(updatedUser.xp);
      }
      setUser(updatedUser);
      Cookie.set("user", JSON.stringify(updatedUser));
    }
  };

  const getPersonalizedRecommendations = (
    opportunities: Opportunity[]
  ): Opportunity[] => {
    if (!user || !user.interests) return opportunities;

    return opportunities.filter((opportunity) =>
      opportunity.tags.some((tag) =>
        user.interests!.some(
          (interest: String) => interest.toLowerCase() === tag.toLowerCase()
        )
      )
    );
  };

  const unlockAchievement = (achievementId: string) => {
    if (user && user.type === "volunteer" && user.stats?.achievements) {
      const updatedAchievements = user.stats.achievements.map(
        (achievement: Achievement) => {
          if (achievement.id === achievementId && !achievement.unlocked) {
            return { ...achievement, unlocked: true, unlockedAt: new Date() };
          }
          return achievement;
        }
      );

      const unlockedAchievement = updatedAchievements.find(
        (a: Achievement) => a.id === achievementId
      );

      if (unlockedAchievement && !unlockedAchievement.unlocked) {
        const newXP = user.xp + unlockedAchievement.xp;
        const newLevel = calculateLevel(newXP);

        updateProfile({
          stats: {
            ...user.stats,
            achievements: updatedAchievements,
          },
          xp: newXP,
          level: newLevel,
        });

        toast({
          title: "Achievement Unlocked!",
          description: `You've unlocked "${unlockedAchievement.name}" and gained ${unlockedAchievement.xp} XP!`,
        });
      }
    }
  };

  const updateDailyStreak = () => {
    if (user && user.type === "volunteer") {
      const today = new Date().toISOString().split("T")[0];
      const lastVolunteerDate = user.stats?.lastVolunteerDate;

      if (lastVolunteerDate === today) return;

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayString = yesterday.toISOString().split("T")[0];

      let newStreak = 1;
      if (lastVolunteerDate === yesterdayString) {
        newStreak = (user.stats?.dailyStreak || 0) + 1;
      }

      updateProfile({
        stats: {
          ...user.stats,
          dailyStreak: newStreak,
          lastVolunteerDate: today,
        },
      });

      if (newStreak > 1) {
        toast({
          title: "Daily Streak!",
          description: `You're on a ${newStreak}-day volunteering streak! Keep it up!`,
        });
      }
    }
  };

  const completeChallenge = (challengeId: string) => {
    if (user && user.type === "volunteer" && user.stats?.challenges) {
      const updatedChallenges = user.stats.challenges.map(
        (challenge: Challenge) =>
          challenge.id === challengeId
            ? { ...challenge, completed: true }
            : challenge
      );

      const completedChallenge = updatedChallenges.find(
        (c: Challenge) => c.id === challengeId
      );

      if (completedChallenge && !completedChallenge.completed) {
        const newXP = user.xp + completedChallenge.xp;
        const newLevel = calculateLevel(newXP);

        updateProfile({
          stats: {
            ...user.stats,
            challenges: updatedChallenges,
          },
          xp: newXP,
          level: newLevel,
        });

        toast({
          title: "Challenge Completed!",
          description: `You've completed "${completedChallenge.name}" and earned ${completedChallenge.xp} XP!`,
        });
      }
    }
  };

  const updateQuestProgress = (questId: string, progress: number) => {
    if (user && user.type === "volunteer" && user.stats?.quests) {
      const updatedQuests = user.stats.quests.map((quest: Quest) => {
        if (quest.id === questId) {
          const newProgress = Math.min(quest.total, quest.progress + progress);
          const completed = newProgress === quest.total;
          return { ...quest, progress: newProgress, completed };
        }
        return quest;
      });

      const completedQuest = updatedQuests.find(
        (q: Quest) => q.id === questId && q.completed
      );

      updateProfile({
        stats: {
          ...user.stats,
          quests: updatedQuests,
        },
      });

      if (completedQuest) {
        const newXP = user.xp + completedQuest.xp;
        const newLevel = calculateLevel(newXP);

        updateProfile({
          xp: newXP,
          level: newLevel,
        });

        toast({
          title: "Quest Completed!",
          description: `You've completed "${completedQuest.name}" and earned ${completedQuest.xp} XP!`,
        });
      }
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
      toast({
        title: "Friend Added",
        description: `You are now friends with ${newFriend.name}.`,
      });
    }
  };

  const removeFriend = (friendId: string) => {
    if (user) {
      const updatedFriends = user.friends.filter(
        (friend: Friend) => friend.id !== friendId
      );
      updateProfile({ friends: updatedFriends });
      toast({
        title: "Friend Removed",
        description: "The friend has been removed from your list.",
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
      toast({
        title: "Team Created",
        description: `Your team "${name}" has been successfully created.`,
      });
    }
  };

  const joinTeam = (teamId: string) => {
    if (user) {
      updateProfile({
        teams: [...user.teams, teamId],
      });
      toast({
        title: "Team Joined",
        description: "You have successfully joined the team.",
      });
    }
  };

  const leaveTeam = (teamId: string) => {
    if (user) {
      const updatedTeams = user.teams.filter((id: String) => id !== teamId);
      updateProfile({ teams: updatedTeams });
      toast({
        title: "Team Left",
        description: "You have left the team.",
      });
    }
  };
  const createUser = async (data: any) => {
    try {
      const user = await signUp(data.email, data.password);
      const createUser = await addDocument("users", data);
      return createUser;
    } catch (err) {
      throw err;
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
      }}
    >
      {children}
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
