import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Calendar, Clock, MapPin, Users, Share2 } from 'lucide-react'

interface OpportunityDialogProps {
  opportunity: any
  onSignUp: (opportunity: any) => void
  onShare: (opportunity: any) => void
}

export default function OpportunityDialog({ opportunity, onSignUp, onShare }: OpportunityDialogProps) {
  return (
    <DialogContent className="max-w-3xl">
      <DialogHeader>
        <DialogTitle>{opportunity.title}</DialogTitle>
        <DialogDescription>{opportunity.organization}</DialogDescription>
      </DialogHeader>
      <div className="grid gap-6">
        <div className="relative h-64 w-full">
          <Image
            src={opportunity.image || "/placeholder.svg"}
            alt={opportunity.title}
            layout="fill"
            objectFit="cover"
            className="rounded-lg"
          />
        </div>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">About the Organization</h3>
            <p className="text-gray-600">{opportunity.organizationDescription}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Initiative Details</h3>
            <p className="text-gray-600">{opportunity.description}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <div>
                <h4 className="font-medium">Start Date</h4>
                <p className="text-gray-600">{opportunity.startDate}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <div>
                <h4 className="font-medium">Time Commitment</h4>
                <p className="text-gray-600">{opportunity.timeCommitment}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              <div>
                <h4 className="font-medium">Location</h4>
                <p className="text-gray-600">{opportunity.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-500" />
              <div>
                <h4 className="font-medium">Volunteers</h4>
                <p className="text-gray-600">
                  {opportunity.currentVolunteers} / {opportunity.volunteersNeeded} needed
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {opportunity.tags.map((tag: string, index: number) => (
              <Badge key={index} variant="secondary">{tag}</Badge>
            ))}
          </div>
        </div>
        <div className="flex gap-4">
          <Button 
            className="flex-1" 
            onClick={() => onSignUp(opportunity)}
          >
            Sign Up Now
          </Button>
          <Button 
            variant="outline" 
            onClick={() => onShare(opportunity)}
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </DialogContent>
  )
}

