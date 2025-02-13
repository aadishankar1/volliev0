import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-toastify";

import { Badge } from "@/components/ui/badge";

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
interface InterestsProps {
  selectedInterests: string[];
  setSelectedInterests: (interests: string[]) => void;
  bio: string;
  setBio: (bio: string) => void;
}

export default function Intrests({
  selectedInterests,
  setSelectedInterests,
  bio,
  setBio,
}: InterestsProps) {
  const handleInterestToggle = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else if (selectedInterests.length < 5) {
      setSelectedInterests([...selectedInterests, interest]);
    } else {
      toast.error("You can select up to 5 interests.");
    }
  };

  return (
    <div className="container mx-auto py-8 pt-20">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Select Your Interests</CardTitle>
          <CardDescription>
            Choose up to 5 interests and write a short bio
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <h3 className="text-lg font-medium mb-2">
              Interests ({selectedInterests.length}/5)
            </h3>
            <div className="flex flex-wrap gap-2">
              {INTERESTS.map((interest) => (
                <Badge
                  key={interest}
                  variant={
                    selectedInterests.includes(interest) ? "default" : "outline"
                  }
                  className="cursor-pointer"
                  onClick={() => handleInterestToggle(interest)}
                >
                  {interest}
                </Badge>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Bio</h3>
            <Textarea
              placeholder="Write a short bio (max 500 characters)"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={500}
              rows={4}
            />
            <p className="text-sm text-muted-foreground">
              {bio.length}/500 characters
            </p>
          </div>
          <Button type="submit" className="w-full">
            Complete Profile
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
