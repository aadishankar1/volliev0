'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../context/AuthContext'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { toast } from "react-toastify"
import Image from "next/image"
import Link from "next/link"

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const a=await login({ email, pass: password });
      toast.success("You have been successfully logged in.");
      router.push("/profile");
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    }
  }

  return (
    <div className="container mx-auto py-8 pt-20">
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
      <Card className="w-full max-w-md mx-auto shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
          <CardDescription className="text-center">Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
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
            <Button type="submit" className="w-full bg-vollie-blue hover:bg-vollie-blue/90">Login</Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-4">
          <p className="text-sm text-muted-foreground">Don't have an account?</p>
          <div className="flex flex-col sm:flex-row gap-2 w-full">
            <Button 
              variant="outline" 
              onClick={() => router.push('/signup/volunteer')}
              className="w-full border-vollie-blue text-vollie-blue hover:bg-vollie-blue/10"
            >
              Sign up as Volunteer
            </Button>
            <Button 
              variant="outline" 
              onClick={() => router.push('/signup/organization')}
              className="w-full border-vollie-blue text-vollie-blue hover:bg-vollie-blue/10"
            >
              Sign up as Organization
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

