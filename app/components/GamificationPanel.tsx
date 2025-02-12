import { useAuth } from "../context/AuthContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Flame, Award, Target } from "lucide-react"

export function GamificationPanel() {
  const { user } = useAuth()

  if (!user || user.type !== "volunteer" || !user.stats) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Volunteering Journey</CardTitle>
        <CardDescription>Track your progress and achievements</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <Flame className="h-6 w-6 text-orange-500" />
              <div>
                <p className="text-sm font-medium">Daily Streak</p>
                <p className="text-2xl font-bold">{user.stats.dailyStreak} days</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Challenges</h3>
              {user.stats.challenges.map((challenge) => (
                <div key={challenge.id} className="mb-2">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium">{challenge.name}</p>
                    <Badge variant={challenge.completed ? "default" : "outline"}>
                      {challenge.completed ? "Completed" : `${challenge.xp} XP`}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{challenge.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Quests</h3>
            {user.stats.quests.map((quest) => (
              <div key={quest.id} className="mb-2">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium">{quest.name}</p>
                  <Badge variant={quest.progress === quest.total ? "default" : "outline"}>
                    {quest.progress === quest.total ? "Completed" : `${quest.xp} XP`}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{quest.description}</p>
                <Progress value={(quest.progress / quest.total) * 100} className="mt-1" />
                <p className="text-xs text-right mt-1">
                  {quest.progress} / {quest.total}
                </p>
              </div>
            ))}
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Recent Achievements</h3>
            {user.stats.achievements
              .filter((achievement) => achievement.unlocked)
              .slice(0, 3)
              .map((achievement) => (
                <div key={achievement.id} className="mb-2">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium">{achievement.name}</p>
                    <Badge variant="default">{achievement.xp} XP</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{achievement.description}</p>
                </div>
              ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

