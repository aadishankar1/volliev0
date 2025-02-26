"use client"

import * as React from "react"
import { CalendarIcon, GraduationCap } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { INTEREST_CATEGORIES } from "@/lib/constants/interests"

export interface Filters {
  date: Date | undefined
  radius: number
  isVirtual: boolean
  isCampus: boolean
  isMultiDay: boolean
  interests: string[]
}

interface ExploreFiltersProps {
  filters: Filters
  setFilters: (filters: Filters) => void
}

export function ExploreFilters({ filters, setFilters }: ExploreFiltersProps) {
  const handleInterestToggle = (interest: string) => {
    if (filters.interests.includes(interest)) {
      setFilters({
        ...filters,
        interests: filters.interests.filter((i) => i !== interest),
      })
    } else {
      setFilters({
        ...filters,
        interests: [...filters.interests, interest],
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Filters</h3>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !filters.date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.date ? format(filters.date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={filters.date}
                  onSelect={(date) => setFilters({ ...filters, date })}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>Distance (miles)</Label>
            <Slider
              value={[filters.radius]}
              onValueChange={(value) => setFilters({ ...filters, radius: value[0] })}
              max={50}
              step={1}
              className="py-4"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0</span>
              <span>{filters.radius} miles</span>
              <span>50</span>
            </div>
          </div>

          <div className="space-y-4 rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="campus" className="font-medium">On Campus Only</Label>
              <Switch
                id="campus"
                checked={filters.isCampus}
                onCheckedChange={(isCampus) => setFilters({ ...filters, isCampus })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="virtual" className="font-medium">Virtual Opportunities</Label>
              <Switch
                id="virtual"
                checked={filters.isVirtual}
                onCheckedChange={(isVirtual) => setFilters({ ...filters, isVirtual })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="multiday" className="font-medium">Multi-day Events</Label>
              <Switch
                id="multiday"
                checked={filters.isMultiDay}
                onCheckedChange={(isMultiDay) => setFilters({ ...filters, isMultiDay })}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">Categories</Label>
              {filters.interests.length > 0 && (
                <span className="text-sm text-muted-foreground">
                  {filters.interests.length} selected
                </span>
              )}
            </div>
            {filters.interests.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {filters.interests.map((interest) => (
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
            )}
            <ScrollArea className="h-[300px] rounded-lg border">
              <div className="p-4">
                <Accordion type="multiple" className="w-full space-y-2">
                  {INTEREST_CATEGORIES.map((category) => (
                    <AccordionItem key={category.name} value={category.name} className="border-0 bg-background">
                      <AccordionTrigger className="text-sm font-medium py-2 hover:no-underline">
                        {category.name}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="flex flex-wrap gap-2 pt-2">
                          {category.interests.map((interest) => (
                            <Badge
                              key={interest}
                              variant={filters.interests.includes(interest) ? "default" : "outline"}
                              className={`cursor-pointer ${
                                filters.interests.includes(interest)
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
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full"
        onClick={() => setFilters({
          date: undefined,
          radius: 10,
          isVirtual: false,
          isCampus: false,
          isMultiDay: false,
          interests: [],
        })}
      >
        Reset Filters
      </Button>
    </div>
  )
}

