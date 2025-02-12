"use client"

import type React from "react"
import { createContext, useState, useContext, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"

type Achievement = {
  id: string
  name: string
  description: string
  xp: number
  unlocked: boolean
  unlockedAt?: Date
  level: "common" | "rare" | "epic" | "legendary" | "mythic"
}

type Challenge = {
  id: string
  name: string
  description: string
  xp: number
  completed: boolean
}

type Quest = {
  id: string
  name: string
  description: string
  xp: number
  progress: number
  total: number
}

type UserStats = {
  hoursVolunteered?: number
  initiativesCompleted?: number
  organizationsHelped?: number
  initiativesCreated?: number
  totalVolunteerHours?: number
  volunteersEngaged?: number
  achievements?: Achievement[]
  dailyStreak: number
  lastVolunteerDate: string | null
  challenges: Challenge[]
  quests: Quest[]
}

type User = {
  id: string
  name: string
  email: string
  type: "volunteer" | "organization"
  bio?: string
  interests?: string[]
  description?: string
  avatar?: string
  stats?: UserStats
  darkMode?: boolean
  emailNotifications?: boolean
  pushNotifications?: boolean
  xp: number
  level: number
  friends: Friend[]
  teams: string[]
  posts: string[]
  notifications: Notification[]
  location: string
  pendingRequests?: PendingRequest[]
} | null

type Opportunity = {
  id: string
  title: string
  organization: string
  description: string
  tags: string[]
  // Add other relevant fields
}

type Friend = {
  id: string
  name: string
  avatar: string
}

type Team = {
  id: string
  name: string
  description: string
  members: string[]
  createdBy: string
}

type Notification = {
  id: string
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
    | "initiative_canceled"
  title: string
  message: string
  date: Date
  read: boolean
  initiativeId?: string
  userId?: string
}

type PendingRequest = {
  id: string
  title: string
  organization: string
  requestDate: string
}

type AuthContextType = {
  user: User
  login: (
    email: string,
    password: string,
    name?: string,
    type?: "volunteer" | "organization",
    location?: string,
  ) => Promise<void>
  logout: () => void
  updateProfile: (data: Partial<User>) => void
  loading: boolean
  getPersonalizedRecommendations: (opportunities: Opportunity[]) => Opportunity[]
  calculateLevel: (xp: number) => number
  unlockAchievement: (achievementId: string) => void
  updateDailyStreak: () => void
  completeChallenge: (challengeId: string) => void
  updateQuestProgress: (questId: string, progress: number) => void
  addFriend: (friendId: string) => void
  removeFriend: (friendId: string) => void
  createTeam: (name: string, description: string) => void
  joinTeam: (teamId: string) => void
  leaveTeam: (teamId: string) => void
  addNotification: (notification: Omit<Notification, "id" | "date" | "read">) => void
  markNotificationAsRead: (notificationId: string) => void
  signUpForInitiative: (initiativeId: string, initiativeTitle: string, organizationName: string) => void
  acceptSignUpRequest: (initiativeId: string, userId: string) => void
  declineSignUpRequest: (initiativeId: string, userId: string) => void
  fetchInitiatives: () => Promise<void>
  createInitiative: (initiativeData: any) => Promise<void>
  updateInitiative: (initiativeId: string, initiativeData: any) => Promise<void>
  deleteInitiative: (initiativeId: string) => Promise<void>
  searchInitiatives: (query: string, filters: any) => Promise<void>
  uploadFile: (file: File) => Promise<string>
  cancelSignUp: (initiativeId: string) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const defaultVolunteerAchievements: Achievement[] = [
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
  {
    id: "6",
    name: "Jack of All Trades",
    description: "Volunteer in 5 different interest areas",
    xp: 500,
    unlocked: false,
    level: "epic",
  },
  {
    id: "7",
    name: "Team Player",
    description: "Join 3 different volunteer teams",
    xp: 300,
    unlocked: false,
    level: "rare",
  },
  {
    id: "8",
    name: "Social Butterfly",
    description: "Make 10 friends on the platform",
    xp: 250,
    unlocked: false,
    level: "rare",
  },
]

const defaultOrganizationAchievements: Achievement[] = [
  {
    id: "1",
    name: "First Initiative",
    description: "Create your first volunteer initiative",
    xp: 100,
    unlocked: false,
    level: "common",
  },
  {
    id: "2",
    name: "Volunteer Magnet",
    description: "Attract 50 volunteers to your initiatives",
    xp: 250,
    unlocked: false,
    level: "rare",
  },
  {
    id: "3",
    name: "Community Builder",
    description: "Successfully complete 5 initiatives",
    xp: 500,
    unlocked: false,
    level: "epic",
  },
  {
    id: "4",
    name: "Impact Maker",
    description: "Accumulate 1000 volunteer hours across all initiatives",
    xp: 1000,
    unlocked: false,
    level: "legendary",
  },
  {
    id: "5",
    name: "Diversity Champion",
    description: "Create initiatives in 5 different interest areas",
    xp: 500,
    unlocked: false,
    level: "epic",
  },
  {
    id: "6",
    name: "Engagement Expert",
    description: "Have 100 unique volunteers participate in your initiatives",
    xp: 750,
    unlocked: false,
    level: "legendary",
  },
  {
    id: "7",
    name: "Initiative Maestro",
    description: "Create 20 volunteer initiatives",
    xp: 1000,
    unlocked: false,
    level: "mythic",
  },
  {
    id: "8",
    name: "Full House",
    description: "Have an initiative reach its maximum volunteer capacity",
    xp: 300,
    unlocked: false,
    level: "rare",
  },
]

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
]

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
]

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    // Check for saved user data in localStorage
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = async (
    email: string,
    password: string,
    name?: string,
    type: "volunteer" | "organization" = "volunteer",
    location?: string,
  ) => {
    // This is a mock login. In a real app, you'd call your API here.
    const mockUser = {
      id: "1",
      name: name || "User",
      email: email,
      type: type,
      bio: "",
      interests: type === "volunteer" ? ["Education", "Environment"] : [],
      avatar: "/placeholder.svg",
      stats:
        type === "volunteer"
          ? {
              hoursVolunteered: 0,
              initiativesCompleted: 0,
              organizationsHelped: 0,
              achievements: defaultVolunteerAchievements,
              dailyStreak: 0,
              lastVolunteerDate: null,
              challenges: defaultChallenges,
              quests: defaultQuests,
            }
          : {
              initiativesCreated: 0,
              totalVolunteerHours: 0,
              volunteersEngaged: 0,
              achievements: defaultOrganizationAchievements,
              dailyStreak: 0,
              lastVolunteerDate: null,
              challenges: [],
              quests: [],
            },
      darkMode: false,
      emailNotifications: true,
      pushNotifications: true,
      xp: 0,
      level: 1,
      friends: [],
      teams: [],
      posts: [],
      notifications: [],
      location: location || "",
    }
    setUser(mockUser)
    localStorage.setItem("user", JSON.stringify(mockUser))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  const calculateLevel = (xp: number): number => {
    return Math.floor(Math.sqrt(xp / 100)) + 1
  }

  const updateProfile = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data }
      if (data.xp !== undefined) {
        updatedUser.level = calculateLevel(updatedUser.xp)
      }
      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))
    }
  }

  const getPersonalizedRecommendations = (opportunities: Opportunity[]): Opportunity[] => {
    if (!user || !user.interests) return opportunities

    return opportunities.filter((opportunity) => opportunity.tags.some((tag) => user.interests!.includes(tag)))
  }

  const unlockAchievement = (achievementId: string) => {
    if (user && user.stats?.achievements) {
      const updatedAchievements = user.stats.achievements.map((achievement) => {
        if (achievement.id === achievementId && !achievement.unlocked) {
          return { ...achievement, unlocked: true, unlockedAt: new Date() }
        }
        return achievement
      })

      const unlockedAchievement = updatedAchievements.find((a) => a.id === achievementId)

      if (unlockedAchievement && !unlockedAchievement.unlocked) {
        const newXP = user.xp + unlockedAchievement.xp
        const newLevel = calculateLevel(newXP)

        updateProfile({
          stats: {
            ...user.stats,
            achievements: updatedAchievements,
          },
          xp: newXP,
          level: newLevel,
        })

        addNotification({
          type: "achievement_unlocked",
          title: "Achievement Unlocked!",
          message: `You've unlocked "${unlockedAchievement.name}" and gained ${unlockedAchievement.xp} XP!`,
        })
      }
    }
  }

  const updateDailyStreak = () => {
    if (user) {
      const today = new Date().toISOString().split("T")[0]
      const lastVolunteerDate = user.stats?.lastVolunteerDate

      if (lastVolunteerDate === today) return

      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayString = yesterday.toISOString().split("T")[0]

      let newStreak = 1
      if (lastVolunteerDate === yesterdayString) {
        newStreak = (user.stats?.dailyStreak || 0) + 1
      }

      updateProfile({
        stats: {
          ...user.stats,
          dailyStreak: newStreak,
          lastVolunteerDate: today,
        },
      })

      if (newStreak > 1) {
        addNotification({
          type: "initiative_reminder",
          title: "Daily Streak!",
          message: `You're on a ${newStreak}-day volunteering streak! Keep it up!`,
        })
      }
    }
  }

  const completeChallenge = (challengeId: string) => {
    if (user && user.stats?.challenges) {
      const updatedChallenges = user.stats.challenges.map((challenge) =>
        challenge.id === challengeId ? { ...challenge, completed: true } : challenge,
      )

      const completedChallenge = updatedChallenges.find((c) => c.id === challengeId)

      if (completedChallenge && !completedChallenge.completed) {
        const newXP = user.xp + completedChallenge.xp
        const newLevel = calculateLevel(newXP)

        updateProfile({
          stats: {
            ...user.stats,
            challenges: updatedChallenges,
          },
          xp: newXP,
          level: newLevel,
        })

        addNotification({
          type: "achievement_unlocked",
          title: "Challenge Completed!",
          message: `You've completed "${completedChallenge.name}" and earned ${completedChallenge.xp} XP!`,
        })
      }
    }
  }

  const updateQuestProgress = (questId: string, progress: number) => {
    if (user && user.stats?.quests) {
      const updatedQuests = user.stats.quests.map((quest) => {
        if (quest.id === questId) {
          const newProgress = Math.min(quest.total, quest.progress + progress)
          const completed = newProgress === quest.total
          return { ...quest, progress: newProgress, completed }
        }
        return quest
      })

      const completedQuest = updatedQuests.find((q) => q.id === questId && q.completed)

      updateProfile({
        stats: {
          ...user.stats,
          quests: updatedQuests,
        },
      })

      if (completedQuest) {
        const newXP = user.xp + completedQuest.xp
        const newLevel = calculateLevel(newXP)

        updateProfile({
          xp: newXP,
          level: newLevel,
        })

        addNotification({
          type: "achievement_unlocked",
          title: "Quest Completed!",
          message: `You've completed "${completedQuest.name}" and earned ${completedQuest.xp} XP!`,
        })
      }
    }
  }

  const addFriend = (friendId: string) => {
    if (user) {
      // In a real app, you'd fetch the friend's data from the server
      const newFriend: Friend = {
        id: friendId,
        name: `Friend ${friendId}`,
        avatar: "/placeholder.svg",
      }
      updateProfile({
        friends: [...user.friends, newFriend],
      })
      addNotification({
        type: "friend_request",
        title: "New Friend Added",
        message: `You are now friends with ${newFriend.name}.`,
      })
    }
  }

  const removeFriend = (friendId: string) => {
    if (user) {
      const updatedFriends = user.friends.filter((friend) => friend.id !== friendId)
      updateProfile({ friends: updatedFriends })
      addNotification({
        type: "friend_request",
        title: "Friend Removed",
        message: "The friend has been removed from your list.",
      })
    }
  }

  const createTeam = (name: string, description: string) => {
    if (user) {
      const newTeam: Team = {
        id: Date.now().toString(),
        name,
        description,
        members: [user.id],
        createdBy: user.id,
      }
      // In a real app, you'd store this team data on the server
      updateProfile({
        teams: [...user.teams, newTeam.id],
      })
      addNotification({
        type: "team_invite",
        title: "Team Created",
        message: `Your team "${name}" has been successfully created.`,
      })
    }
  }

  const joinTeam = (teamId: string) => {
    if (user) {
      updateProfile({
        teams: [...user.teams, teamId],
      })
      addNotification({
        type: "team_invite",
        title: "Team Joined",
        message: "You have successfully joined the team.",
      })
    }
  }

  const leaveTeam = (teamId: string) => {
    if (user) {
      const updatedTeams = user.teams.filter((id) => id !== teamId)
      updateProfile({ teams: updatedTeams })
      addNotification({
        type: "team_invite",
        title: "Team Left",
        message: "You have left the team.",
      })
    }
  }

  const addNotification = (notification: Omit<Notification, "id" | "date" | "read">) => {
    if (user) {
      const newNotification: Notification = {
        ...notification,
        id: Date.now().toString(),
        date: new Date(),
        read: false,
      }
      updateProfile({
        notifications: [newNotification, ...user.notifications],
      })
    }
  }

  const markNotificationAsRead = (notificationId: string) => {
    if (user) {
      const updatedNotifications = user.notifications.map((notification) =>
        notification.id === notificationId ? { ...notification, read: true } : notification,
      )
      updateProfile({
        notifications: updatedNotifications,
      })
    }
  }

  const signUpForInitiative = (initiativeId: string, initiativeTitle: string, organizationName: string) => {
    if (user && user.type === "volunteer") {
      const newRequest: PendingRequest = {
        id: initiativeId,
        title: initiativeTitle,
        organization: organizationName,
        requestDate: new Date().toISOString(),
      }

      updateProfile({
        pendingRequests: [...(user.pendingRequests || []), newRequest],
      })

      addNotification({
        type: "signup_request",
        title: "Initiative Sign-up Request Sent",
        message: `Your request to join "${initiativeTitle}" has been sent to ${organizationName}.`,
        initiativeId,
      })
    }
  }

  const acceptSignUpRequest = (initiativeId: string, userId: string) => {
    if (user && user.type === "organization") {
      // In a real app, you'd update the initiative's participants on the server
      addNotification({
        type: "signup_accepted",
        title: "Sign-up Request Accepted",
        message: `You've accepted the sign-up request for initiative ${initiativeId} from user ${userId}.`,
        initiativeId,
        userId,
      })
      // Notify the volunteer that their request was accepted
    }
  }

  const declineSignUpRequest = (initiativeId: string, userId: string) => {
    if (user && user.type === "organization") {
      addNotification({
        type: "signup_declined",
        title: "Sign-up Request Declined",
        message: `You've declined the sign-up request for initiative ${initiativeId} from user ${userId}.`,
        initiativeId,
        userId,
      })
      // Notify the volunteer that their request was declined
    }
  }

  const fetchInitiatives = async () => {
    // TODO: Implement API call to fetch initiatives
  }

  const createInitiative = async (initiativeData: any) => {
    // TODO: Implement API call to create an initiative
  }

  const updateInitiative = async (initiativeId: string, initiativeData: any) => {
    // TODO: Implement API call to update an initiative
  }

  const deleteInitiative = async (initiativeId: string) => {
    // TODO: Implement API call to delete an initiative
  }

  const searchInitiatives = async (query: string, filters: any) => {
    // TODO: Implement API call to search initiatives
  }

  const uploadFile = async (file: File) => {
    // TODO: Implement API call to upload a file
    return "https://example.com/uploaded-file.jpg" // Placeholder return
  }

  const cancelSignUp = (initiativeId: string) => {
    if (user) {
      const updatedPendingRequests = user.pendingRequests?.filter((request) => request.id !== initiativeId)

      const updatedNotifications = user.notifications.filter(
        (notification) => !(notification.type === "signup_request" && notification.initiativeId === initiativeId),
      )

      updateProfile({
        pendingRequests: updatedPendingRequests,
        notifications: updatedNotifications,
      })

      addNotification({
        type: "initiative_canceled",
        title: "Sign-up Request Canceled",
        message: `You have canceled your sign-up request for initiative ${initiativeId}.`,
        initiativeId,
      })
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
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
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

