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
import { add, format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "react-toastify";
import Loader from "./Loader";
import { uploadMedia } from "@/services/uploadMedia";
import { addInitiative, getLatLng } from "@/services/apiAction/initiative";

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

  const router = useRouter();
  // const { toast } = useToast()
  const { user, updateProfile } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      if (!user || user.userType !== 1) {
        toast.error("Only organizations can add initiatives.");
        return;
      }
      setIsLoading(true);
      // In a real application, you would send this data to your backend
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
          <Input
            id="address"
            value={address}
            onChange={(e) => setaddress(e.target.value)}
            placeholder="Enter address"
            required
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

      <div className="space-y-2">
        <Label>Tags/Interests</Label>
        <div className="flex flex-wrap gap-2">
          {user?.intrests?.map((interest, index) => (
            <Badge key={index} variant="secondary">
              {interest}
            </Badge>
          ))}
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-vollie-blue hover:bg-vollie-blue/90 text-white"
        loading={isLoading}
      >
        Add Initiative
      </Button>
    </form>
  );
}
