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

export default function VolunteerSignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [address, setAddress] = useState("");
  const [chooseIntrest, setChooseIntrest] = useState<Boolean>(false);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState<{ lat?: number; lng?: number }>({});
  useEffect(() => {
    if ("geolocation" in navigator) {
      // Retrieve latitude & longitude coordinates from `navigator.geolocation` Web API
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        const { latitude, longitude } = coords;
        setLocation({ lat: latitude, lng: longitude });
      });
    }
  }, []);
  const router = useRouter();
  // const { toast } = useToast()
  const { createUser } = useAuth();
  const handleNext = () => {
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (!(location.lat && location.lng)) {
      return toast.error("please allow location to signup");
    }
    if (!isBerkeleyEmail(email)) {
      return toast.error("email should be berkeley org");
    }
    setChooseIntrest(true);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Please ensure your passwords match.");
      return;
    }
   
    try {
      const createdUser = await createUser({
        email,
        pass: password,
        name,
        userType: 2,
        bio,
        address,
        lat:location.lat,
        lng:location.lng,
        intrests: selectedInterests,
      });

      toast.success("Your organization account has been created successfully.");
      router.push("/profile");
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    }
  };

  return (
    <div className={!chooseIntrest ? "container mx-auto py-8 pt-20" : ""}>
      <Card className={!chooseIntrest ? "w-full max-w-md mx-auto" : ""}>
        <CardHeader>
          <CardTitle>Sign Up as Volunteer</CardTitle>
          <CardDescription>Create your volunteer account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!chooseIntrest ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="button" onClick={handleNext} className="w-full">
                  Next
                </Button>
              </>
            ) : (
              <Intrests
                selectedInterests={selectedInterests}
                setSelectedInterests={setSelectedInterests}
                bio={bio}
                setBio={setBio}
              ></Intrests>
            )}
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <p>
            Already have an account?{" "}
            <Button variant="link" onClick={() => router.push("/login")}>
              Log in
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
