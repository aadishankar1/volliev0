<<<<<<< HEAD
"use client"

import { useAuth } from "../context/AuthContext"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { AddInitiativeForm } from "../components/AddInitiativeForm"
import { useRouter } from "next/navigation"
=======
'use client'

import { useAuth } from '../context/AuthContext'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { AddInitiativeForm } from '../components/AddInitiativeForm'
import { useRouter } from 'next/navigation'
>>>>>>> c1a5115ad8324999f9a144066399c5b279dc5111

export default function AddInitiativePage() {
  const { user } = useAuth()
  const router = useRouter()

<<<<<<< HEAD
  if (!user || user.userType !== 1) {
=======
  if (!user || user.type !== 'organization') {
>>>>>>> c1a5115ad8324999f9a144066399c5b279dc5111
    return (
      <div className="container mx-auto py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Unauthorized</CardTitle>
            <CardDescription>Only organizations can add initiatives.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 pt-20">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
<<<<<<< HEAD
          <CardTitle className="text-vollie-blue dark:text-vollie-blue">Add New Initiative</CardTitle>
          <CardDescription>Create a new volunteering opportunity</CardDescription>
        </CardHeader>
        <CardContent>
          <AddInitiativeForm onClose={() => router.push("/explore")} />
=======
          <CardTitle>Add New Initiative</CardTitle>
          <CardDescription>Create a new volunteering opportunity</CardDescription>
        </CardHeader>
        <CardContent>
          <AddInitiativeForm onClose={() => router.push('/explore')} />
>>>>>>> c1a5115ad8324999f9a144066399c5b279dc5111
        </CardContent>
      </Card>
    </div>
  )
}

