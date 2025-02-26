import { request } from "@/services/api";
import { endpoints } from "@/services/endpoints";

interface OrgResponse {
  res: {
    _id: string;
    token: string;
  };
}

const sampleInitiatives = [
  {
    title: "Tech Literacy Workshop Series",
    description: "Join our weekly workshop series to teach digital literacy skills to seniors in the community. Volunteers will guide participants through basic computer skills, internet safety, and using common applications. This is a great opportunity for tech-savvy individuals who enjoy teaching and have patience working with elderly learners.",
    img: "https://images.unsplash.com/photo-1594729095022-e2f6d2eece9c?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    timeCommitment: "2 hours per week, for a month",
    address: "Berkeley Community Center",
    volunteersNeeded: 8,
    isOnCampus: false,
    startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
    interests: ["Digital Literacy", "Tech Education", "Senior Services"],
    status: 0, // Open
  },
  {
    title: "Campus Clean-up Drive",
    description: "Help keep our campus beautiful by participating in our monthly clean-up drive.",
    timeCommitment: "3 hours",
    address: "UC Berkeley Campus",
    volunteersNeeded: 10,
    isOnCampus: true,
    startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week from now
    interests: ["Environmental Conservation", "Community Development"],
    status: 0, // Open
  },
  {
    title: "Math Tutoring Program",
    description: "Provide math tutoring to local high school students.",
    timeCommitment: "2 hours per week",
    address: "Berkeley Public Library",
    volunteersNeeded: 5,
    isOnCampus: false,
    startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
    interests: ["Academic Tutoring", "Education & Youth"],
    status: 0,
  },
  {
    title: "Food Bank Distribution",
    description: "Help distribute food to families in need.",
    timeCommitment: "4 hours",
    address: "Berkeley Food Bank",
    volunteersNeeded: 15,
    isOnCampus: false,
    startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 weeks from now
    interests: ["Food Security", "Community Development"],
    status: 0,
  }
];

const sampleAchievements = [
  {
    name: "First Steps",
    description: "Complete your first volunteer initiative",
    xp: 100,
    level: "common"
  },
  {
    name: "Helping Hand",
    description: "Volunteer for 10 hours",
    xp: 250,
    level: "common"
  },
  {
    name: "Community Pillar",
    description: "Help 5 different organizations",
    xp: 500,
    level: "rare"
  }
];

export async function seedDevData() {
  try {
    // Create a test organization
    const orgData = {
      email: "testorg@berkeley.edu",
      pass: "testpass123",
      name: "Test Organization",
      userType: 1,
      bio: "A test organization for development",
      address: "UC Berkeley",
      lat: 37.8719,
      lng: -122.2585,
      intrests: ["Education & Youth", "Community Development"]
    };

    console.log("Creating test organization...");
    const org = await request<OrgResponse>(endpoints.user, "POST", orgData);

    // Create initiatives
    console.log("Creating sample initiatives...");
    for (const initiative of sampleInitiatives) {
      await request(endpoints.initiative, "POST", {
        ...initiative,
        organizationId: org.res._id
      });
    }

    // Create achievements
    console.log("Creating sample achievements...");
    for (const achievement of sampleAchievements) {
      await request("/achievements", "POST", achievement);
    }

    console.log("Development data seeded successfully!");
    return true;
  } catch (error) {
    console.error("Error seeding development data:", error);
    return false;
  }
}

export async function cleanupDevData() {
  try {
    // Add cleanup logic here
    console.log("Cleaning up development data...");
    return true;
  } catch (error) {
    console.error("Error cleaning up development data:", error);
    return false;
  }
} 