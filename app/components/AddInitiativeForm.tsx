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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
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

