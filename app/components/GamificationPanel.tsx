import { useAuth } from "../context/AuthContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Flame, Award, Target, Star, Trophy } from "lucide-react"
import { motion } from "framer-motion"
import { useEffect } from "react"

export function GamificationPanel() {
  const { user, updateDailyStreak, completeChallenge, updateQuestProgress } = useAuth()

  // Update daily streak when component mounts
  useEffect(() => {
    if (user?.stats) {
      updateDailyStreak();
    }
  }, []);

  // Auto-update quest progress based on user stats
  useEffect(() => {
    if (user?.stats?.quests) {
      user.stats.quests.forEach(quest => {
        let progress = 0;
        
        // Calculate progress based on quest type
        switch (quest.name) {
          case "Initiative Master":
            progress = user.stats?.initiativesCompleted || 0;
            break;
          case "Hour Champion":
            progress = user.stats?.hoursVolunteered || 0;
            break;
          case "Organization Explorer":
            progress = user.stats?.organizationsHelped || 0;
            break;
        }

        if (progress > 0) {
          updateQuestProgress(quest.id, progress);
        }
      });
    }
  }, [user?.stats]);

  if (!user || user.userType !== 2 || !user.stats) return null;

  const completedChallenges = user.stats.challenges?.filter(c => c.completed).length || 0;
  const totalChallenges = user.stats.challenges?.length || 0;
  const completedQuests = user.stats.quests?.filter(q => q.completed).length || 0;
  const totalQuests = user.stats.quests?.length || 0;

  // Calculate XP progress
  const currentLevelXP = user.xp - 100 * (user.level - 1) ** 2;
  const nextLevelXP = 100 * user.level ** 2;
  const xpProgress = (currentLevelXP / (nextLevelXP - 100 * (user.level - 1) ** 2)) * 100;

  return (
    <Card className="border-vollie-light-blue shadow-md hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl text-vollie-blue">Your Volunteering Journey</CardTitle>
            <CardDescription>Track your progress and achievements</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-vollie-blue/10">
              <Star className="h-6 w-6 text-vollie-blue" />
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Current Level</p>
              <p className="text-xl font-bold text-vollie-blue">Level {user.level || 1}</p>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <Progress 
            value={xpProgress} 
            className="h-2 [&>div]:bg-vollie-blue bg-vollie-blue/20" 
          />
          <div className="flex justify-between mt-2 text-sm text-muted-foreground">
            <span>{currentLevelXP} XP</span>
            <span>{nextLevelXP - currentLevelXP} XP to next level</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Daily Streak */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-vollie-blue/10">
                <Flame className="h-6 w-6 text-vollie-blue" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Daily Streak</p>
                <p className="text-2xl font-bold text-vollie-blue">{user.stats.dailyStreak || 0} days</p>
              </div>
            </div>

            {/* Challenges */}
            <Card className="border-vollie-light-blue">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-vollie-blue">Daily Challenges</h3>
                  <Badge className="bg-vollie-blue">
                    {completedChallenges}/{totalChallenges}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {user.stats.challenges?.map((challenge) => (
                  <motion.div
                    key={challenge.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`p-3 rounded-lg border transition-colors ${
                      challenge.completed
                        ? "border-vollie-blue bg-vollie-blue/5"
                        : "border-gray-200"
                    }`}
                    onClick={() => !challenge.completed && completeChallenge(challenge.id)}
                    style={{ cursor: challenge.completed ? 'default' : 'pointer' }}
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <p className={`font-medium ${
                          challenge.completed ? "text-vollie-blue" : "text-muted-foreground"
                        }`}>
                          {challenge.name}
                        </p>
                        <p className="text-xs text-muted-foreground">{challenge.description}</p>
                      </div>
                      <Badge 
                        variant={challenge.completed ? "default" : "outline"}
                        className={challenge.completed 
                          ? "bg-vollie-blue text-white" 
                          : "text-muted-foreground"
                        }
                      >
                        {challenge.completed ? "Done" : `${challenge.xp} XP`}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Quests */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-vollie-blue/10">
                <Target className="h-6 w-6 text-vollie-blue" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Quests</p>
                <p className="text-2xl font-bold text-vollie-blue">
                  {completedQuests}/{totalQuests}
                </p>
              </div>
            </div>

            <Card className="border-vollie-light-blue">
              <CardHeader className="pb-2">
                <h3 className="font-semibold text-vollie-blue">Current Quests</h3>
              </CardHeader>
              <CardContent className="space-y-3">
                {user.stats.quests?.map((quest) => (
                  <motion.div
                    key={quest.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`p-3 rounded-lg border transition-colors ${
                      quest.completed
                        ? "border-vollie-blue bg-vollie-blue/5"
                        : "border-gray-200"
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <p className={`font-medium ${
                          quest.completed ? "text-vollie-blue" : "text-muted-foreground"
                        }`}>
                          {quest.name}
                        </p>
                        <Badge 
                          variant={quest.completed ? "default" : "outline"}
                          className={quest.completed 
                            ? "bg-vollie-blue text-white" 
                            : "text-muted-foreground"
                          }
                        >
                          {quest.completed ? "Complete" : `${quest.xp} XP`}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{quest.description}</p>
                      <div className="space-y-1">
                        <Progress 
                          value={(quest.progress / quest.total) * 100} 
                          className="h-2 [&>div]:bg-vollie-blue bg-vollie-blue/20" 
                        />
                        <p className="text-xs text-right text-muted-foreground">
                          {quest.progress} / {quest.total}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Recent Achievements */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-vollie-blue/10">
                <Trophy className="h-6 w-6 text-vollie-blue" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Recent Achievements</p>
                <p className="text-2xl font-bold text-vollie-blue">
                  {user.stats.achievements?.filter(a => a.unlocked).length || 0}
                </p>
              </div>
            </div>

            <Card className="border-vollie-light-blue">
              <CardHeader className="pb-2">
                <h3 className="font-semibold text-vollie-blue">Latest Unlocks</h3>
              </CardHeader>
              <CardContent className="space-y-3">
                {user.stats.achievements
                  ?.filter((achievement) => achievement.unlocked)
                  .slice(0, 3)
                  .map((achievement) => (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      className="p-3 rounded-lg border border-vollie-blue bg-vollie-blue/5"
                    >
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <p className="font-medium text-vollie-blue">{achievement.name}</p>
                          <p className="text-xs text-muted-foreground">{achievement.description}</p>
                        </div>
                        <Badge className="bg-vollie-blue text-white">
                          {achievement.xp} XP
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                {(!user.stats.achievements || user.stats.achievements.filter(a => a.unlocked).length === 0) && (
                  <div className="text-center py-4">
                    <Trophy className="h-8 w-8 text-vollie-blue/40 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No achievements unlocked yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

