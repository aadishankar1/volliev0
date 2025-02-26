"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "../../../context/AuthContext";
import { toast } from "react-toastify";
import Intrests from "./intresets";
import { isBerkeleyEmail } from "@/lib/helper";
import Image from "next/image";
import Link from "next/link";
import { Upload } from "lucide-react";
import { uploadMedia } from "@/services/uploadMedia";
import AddressAutocomplete from "@/app/components/LocationTypehead";

export default function VolunteerSignUp() {
  const [name, setName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [address, setAddress] = useState("");
  const [linkedIn, setLinkedIn] = useState("");
  const [chooseIntrest, setChooseIntrest] = useState<Boolean>(false);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState<{ lat?: number; lng?: number }>({});
  const [locationError, setLocationError] = useState<string>("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [isLoading, setIsloading] = useState<null | boolean>(false);
  const router = useRouter();

  // const { toast } = useToast()
  const { createUser } = useAuth();
  const handleNext = () => {
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (!(location.lat && location.lng)) {
      toast.error(
        "Location access is required to help match you with nearby opportunities. " +
        "Please enable location access in your browser settings and refresh the page.",
        { autoClose: 5000 }
      );
      return;
    }
    if (!isBerkeleyEmail(email)) {
      return toast.error("Please use a Berkeley email address to sign up");
    }
    setChooseIntrest(true);
  };
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        uploadMedia(file, setAvatar, null);
      } catch (error) {
        toast.error("Error uploading image. Please try again.");
      }
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Please ensure your passwords match.");
      return;
    }
   
    try {
      setIsloading(true)
      const createdUser = await createUser({
        email,
        pass: password,
        firstName,
        lastName,
        name: `${firstName} ${lastName}`,
        userType: 2,
        bio,
        address,
        lat: location.lat,
        lng: location.lng,
        linkedIn,
        img:avatar,
        intrests: selectedInterests,
      });
      setIsloading(false)
      toast.success("Your volunteer account has been created successfully.");
      router.push("/profile");
    } catch (error: any) {
      setIsloading(false)
      toast.error(`Error: ${error.message}`);
    }
  };

  return (
    <div className={!chooseIntrest ? "container mx-auto py-8 pt-20" : ""}>
      <div className="flex flex-col items-center mb-8">
        <Link href="/" className="flex items-center space-x-2 mb-4">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Copy_of_Volunteen_Logo-removebg-preview-RiE6TyzfOc1innz0Iud7ZxghahIAY0.png"
            alt="Vollie Logo"
            width={60}
            height={60}
            className="w-auto h-12"
          />
          <span className="text-3xl font-bold text-vollie-blue">Vollie</span>
        </Link>
      </div>
      <Card className={!chooseIntrest ? "w-full max-w-md mx-auto shadow-lg" : ""}>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Sign Up as Volunteer</CardTitle>
          <CardDescription className="text-center">Create your volunteer account and start making a difference</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {!chooseIntrest ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm font-medium">First Name</Label>
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-3 py-2"
                      placeholder="John"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm font-medium">Last Name</Label>
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-3 py-2"
                      placeholder="Doe"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Berkeley Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2"
                    placeholder="you@berkeley.edu"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-sm font-medium">Location</Label>
                  {/* <Input
                    id="location"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3 py-2"
                    placeholder="Enter your address"
                    required
                  /> */}
                 <AddressAutocomplete
                    className="w-full px-3 py-2"
                    placeholder="Enter your organization's address"
                    setLocation={setLocation}
                    onPlaceSelected={(place) =>
                      setAddress(place.formatted_address || "")
                    }
                  />
                  {locationError && (
                    <p className="text-sm text-red-500 mt-1">{locationError}</p>
                  )}
                  <p className="text-sm text-muted-foreground mt-1">
                    Your location helps us match you with nearby volunteer opportunities.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedin" className="text-sm font-medium">LinkedIn Profile (Optional)</Label>
                  <Input
                    id="linkedin"
                    type="url"
                    value={linkedIn}
                    onChange={(e) => setLinkedIn(e.target.value)}
                    className="w-full px-3 py-2"
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="avatar" className="text-sm font-medium">Profile Photo (Optional)</Label>
                  <div className="flex items-center gap-4">
                    {avatar && (
                      <div className="relative w-16 h-16 rounded-full overflow-hidden">
                        <Image
                          src={avatar}
                          alt="Profile preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <Input
                        id="avatar"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="w-full px-3 py-2"
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        Upload your profile photo (max 5MB)
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2"
                    placeholder="••••••••"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2"
                    placeholder="••••••••"
                    required
                  />
                </div>
                <Button type="button" onClick={handleNext} className="w-full bg-vollie-blue hover:bg-vollie-blue/90">
                  Next
                </Button>
              </>
            ) : (
              <Intrests
                selectedInterests={selectedInterests}
                setSelectedInterests={setSelectedInterests}
                bio={bio}
                setBio={setBio}
                isLoading={isLoading}
              />
            )}
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Button variant="link" onClick={() => router.push("/login")} className="text-vollie-blue hover:text-vollie-blue/90 p-0">
              Log in
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
