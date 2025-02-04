import { createContext, useContext, useState, ReactNode } from 'react';
export interface VolunteerInitiative {
    id: string;
    title: string;
    description: string;
    organizationId: string;
    organizationName: string;
    organization?: {
      name: string;
      avatar: string;
    };
    image: string;
    tags: string[];
    distance: number;
    date: string;
    status?: 'active' | 'completed';
    volunteers?: {
      registered: number;
      needed: number;
      acceptingVolunteers: boolean;
    };
    location: string;
    schedule: string;
    timeCommitment: string;
    skillsGained: string[];
    duties: string;
    address?: string;
    timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'flexible';
    type: 'virtual' | 'in-person';
    recurring: boolean;
    startDate?: Date;
    endDate?: Date;
  }
interface Achievement {
  id: string;
  title: string;
  description: string;
  progress: number;
  total: number;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';
  completed: boolean;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  progress: number;
  total: number;
  icon: string;
  endDate: Date;
  reward: {
    xp: number;
    badge?: string;
  };
}

interface Streak {
  current: number;
  longest: number;
  lastVolunteerDate: Date | null;
}

interface User {
  id: string;
  name: string;
  email: string;
  bio?: string;
  avatar?: string;
  location?: string;
  website?: string;
  phone?: string;
  interests: string[];
  userType: 'volunteer' | 'organization';
  level: {
    current: number;
    xp: number;
    nextLevelXp: number;
  };
  streak: Streak;
  stats: {
    totalHours: number;
    initiativesCompleted: number;
    peopleImpacted: number;
    achievements: number;
  };
  achievements: Achievement[];
  activeChallenges: Challenge[];
  completedInitiatives: any[]; // Simplified for now
  orgStats?: {
    totalInitiatives: number;
    activeInitiatives: number;
    totalVolunteers: number;
    totalHoursContributed: number;
  };
  initiatives?: VolunteerInitiative[];
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  updateUserProfile: (updates: Partial<User>) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const STORAGE_KEY = 'volunteen_user';

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem(STORAGE_KEY);
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const updateUserProfile = (updates: Partial<User>) => {
    setUser(curr => {
      if (!curr) return null;
      const updated = { ...curr, ...updates };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  const value = {
    user,
    setUser,
    updateUserProfile,
    logout
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
} 