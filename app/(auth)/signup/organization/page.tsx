"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "../../../context/AuthContext"
import { toast } from "react-toastify";

export default function OrganizationSignUp() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [location, setLocation] = useState("")
  const router = useRouter()
  // const { toast } = useToast()
  const { createUser } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
  
      try {
        // await createUser({email, password,name,type:'organization'})
        await createUser({ email, pass: password, name, userType: 1 });
        toast.success("Your organization account has been created successfully.");
        router.push("/profile");
      } catch (error: any) {
        toast.error(`Error: ${error.message}`);
      }
  }

  return (
    <div className="container mx-auto py-8 pt-20">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Sign Up as Organization</CardTitle>
          <CardDescription>Create an account for your organization</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Organization Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} required />
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
            <Button type="submit" className="w-full">
              Sign Up
            </Button>
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
  )
}

