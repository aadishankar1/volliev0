import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, Clock } from "lucide-react"
import Image from "next/image"

interface CampusOpportunity {
  id: string
  title: string
  organization: string
  location: string
  date: string
  duration: string
  image: string
  tags: string[]
}

interface CampusOpportunitiesProps {
  opportunities: CampusOpportunity[]
  onViewMore: () => Promise<void>
}

export function CampusOpportunities({ opportunities, onViewMore }: CampusOpportunitiesProps) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4 text-vollie-blue">UC Berkeley Opportunities</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-4">
        {opportunities.map((opportunity) => (
          <Card
            key={opportunity.id}
            className="cursor-pointer hover:shadow-lg transition-shadow border-vollie-light-blue"
          >
            <div className="relative h-48 w-full">
              <Image
                src={opportunity.image || "/placeholder.svg"}
                alt={opportunity.title}
                layout="fill"
                objectFit="cover"
                className="rounded-t-lg"
              />
            </div>
            <CardContent className="p-4">
              <h3 className="text-xl font-semibold mb-2 text-vollie-blue">{opportunity.title}</h3>
              <p className="text-sm text-muted-foreground mb-2">{opportunity.organization}</p>
              <div className="flex items-center text-sm text-muted-foreground mb-2">
                <MapPin className="h-4 w-4 mr-1 text-vollie-green" />
                {opportunity.location}
              </div>
              <div className="flex items-center text-sm text-muted-foreground mb-2">
                <Calendar className="h-4 w-4 mr-1 text-vollie-green" />
                {opportunity.date}
              </div>
              <div className="flex items-center text-sm text-muted-foreground mb-2">
                <Clock className="h-4 w-4 mr-1 text-vollie-green" />
                {opportunity.duration}
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {opportunity.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="bg-vollie-light-blue text-vollie-blue">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Button onClick={onViewMore} variant="outline" className="w-full">
        View More Campus Opportunities
      </Button>
    </div>
  )
}

