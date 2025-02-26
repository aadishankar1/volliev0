import { Badge } from "@/components/ui/badge"
import { Trophy } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface AchievementBadgeProps {
  name: string
  description: string
  icon?: React.ReactNode
  variant?: "default" | "secondary" | "destructive" | "outline"
  unlocked?: boolean
}

export function AchievementBadge({
  name,
  description,
  icon = <Trophy className="h-4 w-4" />,
  variant = "default",
  unlocked = false
}: AchievementBadgeProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Badge 
            variant={variant}
            className={`flex items-center gap-1 ${!unlocked && 'opacity-50'}`}
          >
            {icon}
            {name}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>{description}</p>
          {!unlocked && <p className="text-sm text-muted-foreground">Locked</p>}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

