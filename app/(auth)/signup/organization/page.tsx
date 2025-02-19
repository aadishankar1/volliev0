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
import Intrests from "../volunteer/intresets";

export default function OrganizationSignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [location, setLocation] = useState<{ lat?: number; lng?: number }>({});
  const [chooseIntrest, setChooseIntrest] = useState<Boolean>(false);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [bio, setBio] = useState("");
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

    try {
      // await createUser({email, password,name,type:'organization'})
      await createUser({
        email,
        pass: password,
        address,
        selectedInterests,
        bio,
        lat: location.lat,
        lng: location.lng,
        name,
        userType: 1,
      });
      toast.success("Your organization account has been created successfully.");
      router.push("/profile");
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    }
  };

  return (
    <div className={chooseIntrest ? "" : "container mx-auto py-8 pt-20"}>
      <Card className={chooseIntrest ? "" : "w-full max-w-md mx-auto"}>
        <CardHeader>
          <CardTitle>Sign Up as Organization</CardTitle>
          <CardDescription>
            Create an account for your organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!chooseIntrest ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">Organization Name</Label>
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
              />
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
