"use client";

import { useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Globe, Linkedin, Building2, Clock, Users } from "lucide-react";

// Mock organization data (replace with API call in production)
const organizationData = {
  id: "org123",
  name: "Meals on Wheels",
  bio: "Hi!",
  logo: "/placeholder-avatar.png",
  email: "berkeley@berkeley.edu",
  website: "www.mealsonwheels.org",
  linkedIn: "https://linkedin.com/company/mealsonwheels",
  interests: ["After-School Programs", "Healthcare Access", "Clean Energy"],
  stats: {
    initiatives: 0,
    volunteerHours: 0,
    volunteers: 0
  },
  level: {
    current: 1,
    xp: 0,
    nextLevel: 100
  }
};

export default function OrganizationProfile({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        {/* Profile Section */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-32 h-32 relative rounded-full overflow-hidden border-2 border-muted bg-background flex items-center justify-center">
            <Image
              src={organizationData.logo}
              alt={organizationData.name}
              width={112}
              height={112}
              className="object-contain p-2"
              priority
            />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">{organizationData.name}</h1>
            <div className="text-muted-foreground">{organizationData.email}</div>
            <div className="flex items-center justify-center gap-4">
              {organizationData.website && (
                <a 
                  href={`https://${organizationData.website}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-vollie-blue transition-colors"
                >
                  <Globe className="h-4 w-4" />
                  Website
                </a>
              )}
              {organizationData.linkedIn && (
                <a 
                  href={organizationData.linkedIn}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-vollie-blue transition-colors"
                >
                  <Linkedin className="h-4 w-4" />
                  LinkedIn
                </a>
              )}
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-vollie-blue">About</h2>
          <p className="text-muted-foreground">{organizationData.bio}</p>
        </div>

        {/* Interests Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-vollie-blue">Interests</h2>
          <div className="flex flex-wrap gap-2">
            {organizationData.interests.map((interest, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="bg-vollie-blue/10 text-vollie-blue"
              >
                {interest}
              </Badge>
            ))}
          </div>
        </div>

        {/* Organization Stats */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-vollie-blue mb-4">Impact Overview</h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <Building2 className="h-5 w-5 mx-auto mb-2 text-vollie-blue" />
              <div className="text-2xl font-bold">{organizationData.stats.initiatives}</div>
              <div className="text-sm text-muted-foreground">Active Initiatives</div>
            </div>
            <div>
              <Clock className="h-5 w-5 mx-auto mb-2 text-vollie-blue" />
              <div className="text-2xl font-bold">{organizationData.stats.volunteerHours}</div>
              <div className="text-sm text-muted-foreground">Total Hours</div>
            </div>
            <div>
              <Users className="h-5 w-5 mx-auto mb-2 text-vollie-blue" />
              <div className="text-2xl font-bold">{organizationData.stats.volunteers}</div>
              <div className="text-sm text-muted-foreground">Active Volunteers</div>
            </div>
          </div>
        </Card>

        {/* Level Progress */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-vollie-blue">Organization Level</h2>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold">Level {organizationData.level.current}</span>
              <span className="text-sm text-muted-foreground">{organizationData.level.xp} XP total</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-vollie-blue"
                style={{ width: `${(organizationData.level.xp / organizationData.level.nextLevel) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{organizationData.level.xp} XP</span>
              <span>{organizationData.level.nextLevel} XP to next level</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 