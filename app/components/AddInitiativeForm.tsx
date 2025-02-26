"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAuth } from "../context/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "react-toastify";
import Loader from "./Loader";
import { uploadMedia } from "@/services/uploadMedia";
import { addInitiative, getLatLng } from "@/services/apiAction/initiative";
import { INTEREST_CATEGORIES, ALL_INTERESTS } from "@/lib/constants/interests";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import AddressAutocomplete from "./LocationTypehead";

interface AddInitiativeFormProps {
  onClose: () => void;
}

export function AddInitiativeForm({ onClose }: AddInitiativeFormProps) {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState<File | string | null>(null);
  const [isMultiDay, setIsMultiDay] = useState(false);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [timeCommitment, setTimeCommitment] = useState("");
  const [isOnCampus, setIsOnCampus] = useState(false);
  const [address, setAddress] = useState("");
  const [location, setLocation] = useState<{ lat?: number; lng?: number }>({});
  const [volunteersNeeded, setVolunteersNeeded] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const router = useRouter();
  const { user, updateProfile } = useAuth();

  const handleInterestToggle = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else if (selectedInterests.length < 3) {
      setSelectedInterests([...selectedInterests, interest]);
    } else {
      toast.error("You can select up to 3 interests for an initiative.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      if (!user || user.userType !== 1) {
        toast.error("Only organizations can add initiatives.");
        return;
      }
      if (selectedInterests.length === 0) {
        toast.error("Please select at least one interest category.");
        return;
      }
      setIsLoading(true);
      const newInitiative: any = {
        title,
        img: image instanceof File ? URL.createObjectURL(image) : image,
        startDate: startDate?.toISOString(),
        endDate: isMultiDay ? endDate?.toISOString() : null,
        timeCommitment,
        address: isOnCampus ? "On Campus" : address,
        volunteersNeeded: Number.parseInt(volunteersNeeded),
        description,
        status: 0,
        isOnCampus,
        interests: selectedInterests,
      };
      if (location.lat && location.lng && !isOnCampus) {
        newInitiative.lat = location?.lat;
        newInitiative.lng = location?.lng;
      }
      await addInitiative(newInitiative);
      console.log("new initiative", newInitiative);
      setIsLoading(false);
      toast.success("Your initiative has been successfully added.");
      onClose();
      router.push("/explore");
    } catch (err: any) {
      setIsLoading(false);
      toast.error(`Error:${err.message}`);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      uploadMedia(e.target.files[0], setImage, null);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Initiative Image</Label>
        {/* <Loader /> */}
        <Input
          id="image"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          // disabled={true}
        />
      </div>

      <div className="space-y-2">
        <Label>Organization Description</Label>
        <p className="text-sm text-muted-foreground">
          {user?.description || "No description provided"}
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Initiative Details</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          required
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Switch
            id="multi-day"
            checked={isMultiDay}
            onCheckedChange={setIsMultiDay}
          />
          <Label htmlFor="multi-day">Multi-day Initiative</Label>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "PPP") : <span>Start Date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {isMultiDay && (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : <span>End Date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="timeCommitment">Estimated Time Commitment</Label>
        <Input
          id="timeCommitment"
          value={timeCommitment}
          onChange={(e) => setTimeCommitment(e.target.value)}
          placeholder="e.g., 2 hours per day, 10 hours total"
          required
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Switch
            id="on-campus"
            checked={isOnCampus}
            onCheckedChange={setIsOnCampus}
          />
          <Label htmlFor="on-campus">On Campus</Label>
        </div>
        {!isOnCampus && (
           <AddressAutocomplete
           className="w-full px-3 py-2"
           placeholder="Enter Address"
           setLocation={setLocation}
           onPlaceSelected={(place) =>
             setAddress(place.formatted_address || "")
           }
         />
          
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="volunteersNeeded">Volunteers Needed</Label>
        <Input
          id="volunteersNeeded"
          type="number"
          value={volunteersNeeded}
          onChange={(e) => setVolunteersNeeded(e.target.value)}
          required
        />
      </div>

      <div className="space-y-4">
        <Label>Initiative Categories</Label>
        <p className="text-sm text-muted-foreground mb-2">
          Select up to 3 categories that best describe this initiative
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {selectedInterests.map((interest) => (
            <Badge
              key={interest}
              variant="default"
              className="cursor-pointer bg-vollie-blue hover:bg-vollie-blue/90"
              onClick={() => handleInterestToggle(interest)}
            >
              {interest} ×
            </Badge>
          ))}
        </div>
        <ScrollArea className="h-[200px] rounded-md border p-4">
          <Accordion type="multiple" className="w-full">
            {INTEREST_CATEGORIES.map((category) => (
              <AccordionItem key={category.name} value={category.name}>
                <AccordionTrigger className="text-sm font-medium">
                  {category.name}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {category.interests.map((interest) => (
                      <Badge
                        key={interest}
                        variant={
                          selectedInterests.includes(interest)
                            ? "default"
                            : "outline"
                        }
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

      <Button
        type="submit"
        className="w-full bg-vollie-blue hover:bg-vollie-blue/90 text-white"
        disabled={isLoading || selectedInterests.length === 0}
      >
        {isLoading ? "Adding Initiative..." : "Add Initiative"}
      </Button>
    </form>
  );
}
