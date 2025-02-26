export interface InterestCategory {
  name: string;
  interests: string[];
}

export const INTEREST_CATEGORIES: InterestCategory[] = [
  {
    name: "Education & Youth",
    interests: [
      "Academic Tutoring",
      "Early Childhood Education",
      "STEM Education",
      "Literacy Programs",
      "Special Education",
      "After-School Programs",
      "College Mentorship",
      "Educational Technology",
    ]
  },
  {
    name: "Health & Wellness",
    interests: [
      "Mental Health Support",
      "Healthcare Access",
      "Public Health",
      "Senior Care",
      "Disability Support",
      "Sports & Recreation",
      "Nutrition Education",
      "Crisis Counseling",
    ]
  },
  {
    name: "Environment & Sustainability",
    interests: [
      "Environmental Conservation",
      "Climate Action",
      "Sustainable Agriculture",
      "Waste Management",
      "Clean Energy",
      "Wildlife Protection",
      "Urban Gardening",
      "Environmental Education",
    ]
  },
  {
    name: "Social Justice & Advocacy",
    interests: [
      "Civil Rights",
      "LGBTQ+ Rights",
      "Racial Justice",
      "Gender Equality",
      "Immigration Support",
      "Housing Rights",
      "Food Security",
      "Legal Aid",
    ]
  },
  {
    name: "Community Development",
    interests: [
      "Neighborhood Improvement",
      "Homeless Services",
      "Poverty Alleviation",
      "Youth Development",
      "Senior Services",
      "Cultural Programs",
      "Community Arts",
      "Local Business Support",
    ]
  },
  {
    name: "Technology & Innovation",
    interests: [
      "Digital Literacy",
      "Tech Education",
      "Nonprofit Technology",
      "Web Development",
      "Data Analysis",
      "Cybersecurity",
      "AI Ethics",
      "Digital Accessibility",
    ]
  },
  {
    name: "Crisis Response",
    interests: [
      "Disaster Relief",
      "Emergency Services",
      "Crisis Hotlines",
      "Food Banks",
      "Refugee Support",
      "Medical Response",
      "Mental Health Crisis",
      "Community Resilience",
    ]
  },
];

export const ALL_INTERESTS = INTEREST_CATEGORIES.reduce<string[]>((acc, category) => {
  return [...acc, ...category.interests];
}, []); 