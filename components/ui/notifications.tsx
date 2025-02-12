import { useToast } from "./use-toast"

type Notification = {
  type: "initiative_signup" | "achievement_unlocked" | "initiative_reminder" | "new_opportunity" | "team_invite"
  title: string
  message: string
}

export const addNotification = (notification: Notification) => {
  const { toast } = useToast()
  toast({
    title: notification.title,
    description: notification.message,
    variant: notification.type === "team_invite" ? "destructive" : "default",
  })
}

