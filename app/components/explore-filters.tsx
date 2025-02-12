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

export interface Filters {
  date: Date | undefined
  radius: number
  isVirtual: boolean
  isCampus: boolean
  isMultiDay: boolean
}

interface FiltersProps {
  onFilterChange: (filters: Filters) => void
  showCampusFilter?: boolean
}

export function ExploreFilters({ onFilterChange, showCampusFilter = false }: FiltersProps) {
  const [date, setDate] = React.useState<Date | undefined>(undefined)
  const [radius, setRadius] = React.useState<number[]>([10])
  const [isVirtual, setIsVirtual] = React.useState(false)
  const [isCampus, setIsCampus] = React.useState(false)
  const [isMultiDay, setIsMultiDay] = React.useState(false)

  React.useEffect(() => {
    onFilterChange({
      date,
      radius: radius[0],
      isVirtual,
      isCampus,
      isMultiDay,
    })
  }, [date, radius, isVirtual, isCampus, isMultiDay, onFilterChange])

  return (
    <div className="flex flex-wrap gap-4 items-center">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn("justify-start text-left font-normal", !date && "text-muted-foreground")}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : "Pick a date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
        </PopoverContent>
      </Popover>

      <div className="flex items-center gap-2">
        <span>📍</span>
        <div className="w-[100px]">
          <Slider value={radius} onValueChange={setRadius} max={50} step={1} />
        </div>
        <span className="min-w-[60px]">{radius[0]}mi</span>
      </div>

      <div className="flex items-center gap-2">
        <Switch id="virtual" checked={isVirtual} onCheckedChange={setIsVirtual} />
        <Label htmlFor="virtual">Virtual only</Label>
      </div>

      <div className="flex items-center gap-2">
        <Switch id="multiday" checked={isMultiDay} onCheckedChange={setIsMultiDay} />
        <Label htmlFor="multiday">Multi-day events</Label>
      </div>

      {showCampusFilter && (
        <div className="flex items-center gap-2">
          <Switch id="campus" checked={isCampus} onCheckedChange={setIsCampus} />
          <Label htmlFor="campus" className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            UC Berkeley Campus
          </Label>
        </div>
      )}
    </div>
  )
}

