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
import { INTEREST_CATEGORIES } from "@/lib/constants/interests";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface InterestsProps {
  selectedInterests: string[];
  setSelectedInterests: (interests: string[]) => void;
  bio: string;
  setBio: (bio: string) => void;
  isLoading?:boolean|null
}

export default function Interests({
  selectedInterests,
  setSelectedInterests,
  bio,
  setBio,
  isLoading
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
          <CardTitle className="text-2xl font-bold text-center">Select Your Interests</CardTitle>
          <CardDescription className="text-center">
            Choose up to 5 interests that align with your volunteering goals
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">
              Selected Interests ({selectedInterests.length}/5)
            </h3>
            <div className="flex flex-wrap gap-2 mb-6">
              {selectedInterests.length > 0 ? (
                selectedInterests.map((interest) => (
                  <Badge
                    key={interest}
                    variant="default"
                    className="cursor-pointer bg-vollie-blue hover:bg-vollie-blue/90"
                    onClick={() => handleInterestToggle(interest)}
                  >
                    {interest} ×
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No interests selected yet</p>
              )}
            </div>
            <ScrollArea className="h-[300px] rounded-md border p-4">
              <Accordion type="multiple" className="w-full">
                {INTEREST_CATEGORIES.map((category) => (
                  <AccordionItem key={category.name} value={category.name}>
                    <AccordionTrigger className="text-lg font-medium">
                      {category.name}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="flex flex-wrap gap-2 pt-2">
                        {category.interests.map((interest) => (
                          <Badge
                            key={interest}
                            variant={selectedInterests.includes(interest) ? "default" : "outline"}
                            className={`cursor-pointer ${
                              selectedInterests.includes(interest)
                                ? "bg-vollie-blue hover:bg-vollie-blue/90"
                                : "hover:bg-vollie-blue/10"
                            }`}
                            onClick={() => handleInterestToggle(interest)}
                          >
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </ScrollArea>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Bio</h3>
            <Textarea
              placeholder="Write a short bio about your volunteering experience and goals (max 500 characters)"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={500}
              rows={4}
            />
            <p className="text-sm text-muted-foreground">
              {bio.length}/500 characters
            </p>
          </div>
          <Button type="submit" className="w-full bg-vollie-blue hover:bg-vollie-blue/90" loading={isLoading||false}>
            Complete Profile
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
