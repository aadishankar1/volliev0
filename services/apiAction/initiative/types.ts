export interface Initiative {
  _id: string;
  title: string;
  description: string;
  img?: string;
  startDate: string;
  endDate?: string;
  timeCommitment: string;
  address: string;
  lat?: number;
  lng?: number;
  volunteersNeeded: number;
  currentVolunteers?: number;
  status: number; // 0: Open, 1: In Progress, 2: Completed, 3: Cancelled
  isOnCampus: boolean;
  interests: string[];
  organization: {
    _id: string;
    name: string;
    description?: string;
    avatar?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface InitiativeResponse {
  res: {
    token?: string;
    list?: Initiative[];
    nextPage?: number;
    total?: number;
  };
}

export interface InitiativeFilters {
  page?: number;
  limit?: number;
  search?: string;
  startDate?: string;
  endDate?: string;
  isOnCampus?: boolean;
  isVirtual?: boolean;
  isMultiDay?: boolean;
  radius?: number;
  lat?: number;
  lng?: number;
  interests?: string[];
  status?: number;
}

export interface CreateInitiativeData {
  title: string;
  description: string;
  img?: string;
  startDate: string;
  endDate?: string;
  timeCommitment: string;
  address: string;
  lat?: number;
  lng?: number;
  volunteersNeeded: number;
  status: number;
  isOnCampus: boolean;
  interests: string[];
} 