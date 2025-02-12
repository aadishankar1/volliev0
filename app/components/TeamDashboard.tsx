import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, Users, Award, Calendar, ChevronUp, ChevronDown } from "lucide-react"

interface TeamDashboardProps {
  teamName: string
  teamData: {
    totalHours: number
    totalVolunteers: number
    upcomingEvents: number
    topMembers: Array<{ name: string; hours: number }>
    recentActivity: Array<{ user: string; action: string; time: string }>
  }
}

export function TeamDashboard({ teamName, teamData }: TeamDashboardProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{teamName} Volunteering Dashboard</CardTitle>
          <CardDescription>Track and manage volunteer activities for {teamName}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Volunteer Hours</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{teamData.totalHours}</div>
                <p className="text-xs text-muted-foreground">+20.1% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Volunteers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{teamData.totalVolunteers}</div>
                <p className="text-xs text-muted-foreground">+12 new volunteers this week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{teamData.upcomingEvents}</div>
                <p className="text-xs text-muted-foreground">Next event in 3 days</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Top Performing Member</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{teamData.topMembers[0].name}</div>
                <p className="text-xs text-muted-foreground">{teamData.topMembers[0].hours} hours this month</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Top Performing Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {teamData.topMembers.map((member, index) => (
                <div key={index} className="flex items-center">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={`/placeholder.svg?height=36&width=36`} alt={member.name} />
                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">{member.name}</p>
                    <p className="text-sm text-muted-foreground">{member.hours} hours</p>
                  </div>
                  <div className="ml-auto font-medium">
                    {index === 0 && <ChevronUp className="h-4 w-4 text-green-500" />}
                    {index === teamData.topMembers.length - 1 && <ChevronDown className="h-4 w-4 text-red-500" />}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates from {teamName} volunteers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {teamData.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={`/placeholder.svg?height=36&width=36`} alt={activity.user} />
                    <AvatarFallback>{activity.user.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">{activity.user}</p>
                    <p className="text-sm text-muted-foreground">{activity.action}</p>
                  </div>
                  <div className="ml-auto font-medium text-xs text-muted-foreground">{activity.time}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Log Volunteer Hours</CardTitle>
          <CardDescription>Record your volunteer hours for {teamName} events</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="event" className="text-sm font-medium">
                  Event
                </label>
                <select id="event" className="w-full p-2 border rounded">
                  <option>Select an event</option>
                  <option>Campus Cleanup</option>
                  <option>Tutoring Program</option>
                  <option>Food Drive</option>
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="hours" className="text-sm font-medium">
                  Hours
                </label>
                <input type="number" id="hours" className="w-full p-2 border rounded" placeholder="Enter hours" />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <textarea
                id="description"
                className="w-full p-2 border rounded"
                rows={3}
                placeholder="Briefly describe your volunteer work"
              ></textarea>
            </div>
            <Button>Log Hours</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

