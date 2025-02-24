<<<<<<< HEAD
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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

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
  const [address, setaddress] = useState("");
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
      if (address && !isOnCampus) {
        const data = await getLatLng(address);
        newInitiative.lat = data?.lat;
        newInitiative.lng = data?.lng;
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
=======
"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "../context/AuthContext"
import { Badge } from "@/components/ui/badge"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"

const TAGS = [
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
]

const TIME_COMMITMENTS = [1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 40]

interface AddInitiativeFormProps {
  onClose: () => void
}

export function AddInitiativeForm({ onClose }: AddInitiativeFormProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState("")
  const [startDate, setStartDate] = useState("")
  const [timeCommitment, setTimeCommitment] = useState<number>(1)
  const [volunteersNeeded, setVolunteersNeeded] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [image, setImage] = useState<File | null>(null)
  const [openTimeCommitment, setOpenTimeCommitment] = useState(false)
  const [openTags, setOpenTags] = useState(false)

  const router = useRouter()
  const { toast } = useToast()
  const { user, updateProfile } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || user.type !== "organization") {
      toast({
        title: "Unauthorized",
        description: "Only organizations can add initiatives.",
        variant: "destructive",
      })
      return
    }

    // In a real application, you would send this data to your backend
    const newInitiative = {
      id: Date.now().toString(),
      title,
      description,
      location,
      startDate,
      timeCommitment,
      volunteersNeeded: Number.parseInt(volunteersNeeded),
      tags: selectedTags,
      organization: user.name,
      status: "Open",
    }

    // Update user's stats
    const updatedStats = {
      ...user.stats,
      initiativesCreated: (user.stats?.initiativesCreated || 0) + 1,
    }

    updateProfile({ stats: updatedStats })

    toast({
      title: "Initiative Added",
      description: "Your initiative has been successfully added.",
    })
    onClose()
    router.push("/explore")
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0])
    }
  }

  const handleTagSelect = useCallback((tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }, [])
>>>>>>> c1a5115ad8324999f9a144066399c5b279dc5111

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
<<<<<<< HEAD
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
          <Input
            id="address"
            value={address}
            onChange={(e) => setaddress(e.target.value)}
            placeholder="Enter address"
            required
          />
        )}
      </div>

=======
        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description (max 200 words)</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => {
            const words = e.target.value.trim().split(/\s+/)
            if (words.length <= 200) {
              setDescription(e.target.value)
            }
          }}
          required
        />
        <p className="text-sm text-muted-foreground">{description.trim().split(/\s+/).length}/200 words</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="startDate">Start Date</Label>
        <Input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="timeCommitment">Time Commitment (hours)</Label>
        <Popover open={openTimeCommitment} onOpenChange={setOpenTimeCommitment}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openTimeCommitment}
              className="w-full justify-between"
            >
              {timeCommitment} hours
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Search time commitment..." />
              <CommandEmpty>No time commitment found.</CommandEmpty>
              <CommandGroup>
                {TIME_COMMITMENTS.map((hours) => (
                  <CommandItem
                    key={hours}
                    onSelect={() => {
                      setTimeCommitment(hours)
                      setOpenTimeCommitment(false)
                    }}
                  >
                    <Check className={cn("mr-2 h-4 w-4", timeCommitment === hours ? "opacity-100" : "opacity-0")} />
                    {hours} hours
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
>>>>>>> c1a5115ad8324999f9a144066399c5b279dc5111
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
<<<<<<< HEAD

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
=======
      <div className="space-y-2">
        <Label htmlFor="tags">Tags</Label>
        <Popover open={openTags} onOpenChange={setOpenTags}>
          <PopoverTrigger asChild>
            <Button variant="outline" role="combobox" aria-expanded={openTags} className="w-full justify-between">
              {selectedTags.length > 0 ? `${selectedTags.length} selected` : "Select tags"}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Search tags..." />
              <CommandEmpty>No tag found.</CommandEmpty>
              <CommandGroup>
                {TAGS.map((tag) => (
                  <CommandItem key={tag} onSelect={() => handleTagSelect(tag)}>
                    <Check className={cn("mr-2 h-4 w-4", selectedTags.includes(tag) ? "opacity-100" : "opacity-0")} />
                    {tag}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedTags.map((tag) => (
            <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => handleTagSelect(tag)}>
              {tag} ×
            </Badge>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="image">Initiative Image</Label>
        <Input id="image" type="file" accept="image/*" onChange={handleImageChange} />
      </div>
      <Button type="submit" className="w-full">
        Add Initiative
      </Button>
    </form>
  )
}

>>>>>>> c1a5115ad8324999f9a144066399c5b279dc5111
