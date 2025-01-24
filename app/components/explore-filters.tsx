"use client"

import * as React from "react"
import { Calendar, ChevronsUpDown } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"

export interface Filters {
  date: Date | undefined
  radius: number
  isVirtual: boolean
}

interface FiltersProps {
  onFilterChange: (filters: Filters) => void
}

export function ExploreFilters({ onFilterChange }: FiltersProps) {
  const [date, setDate] = React.useState<Date | undefined>(undefined)
  const [radius, setRadius] = React.useState<number[]>([10])
  const [isVirtual, setIsVirtual] = React.useState(false)

  React.useEffect(() => {
    onFilterChange({
      date,
      radius: radius[0],
      isVirtual,
    })
  }, [date, radius, isVirtual, onFilterChange])

  return (
    <div className="flex flex-wrap gap-4 items-center">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn("justify-start text-left font-normal", !date && "text-muted-foreground")}
          >
            <Calendar className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : "Pick a date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <CalendarComponent mode="single" selected={date} onSelect={setDate} initialFocus />
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
        <span>💻</span>
        <Switch checked={isVirtual} onCheckedChange={setIsVirtual} />
        <span>Virtual only</span>
      </div>
    </div>
  )
}

