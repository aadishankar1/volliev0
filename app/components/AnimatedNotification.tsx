import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Star, Award } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnimatedNotificationProps {
  type: "achievement" | "levelUp" | "quest";
  title: string;
  description: string;
  xp?: number;
  isVisible: boolean;
  onClose: () => void;
}

export function AnimatedNotification({
  type,
  title,
  description,
  xp,
  isVisible,
  onClose
}: AnimatedNotificationProps) {
  const getIcon = () => {
    switch (type) {
      case "achievement":
        return <Trophy className="h-6 w-6" />;
      case "levelUp":
        return <Star className="h-6 w-6" />;
      case "quest":
        return <Award className="h-6 w-6" />;
    }
  };

  const getColors = () => {
    switch (type) {
      case "achievement":
        return "bg-vollie-blue text-white";
      case "levelUp":
        return "bg-gradient-to-r from-vollie-blue via-purple-500 to-pink-500 text-white";
      case "quest":
        return "bg-green-500 text-white";
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.3 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
          className="fixed bottom-4 right-4 z-50"
        >
          <div
            className={cn(
              "rounded-lg shadow-lg p-4 max-w-sm",
              getColors()
            )}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                {getIcon()}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{title}</h3>
                <p className="text-sm opacity-90">{description}</p>
                {xp && (
                  <p className="mt-1 text-sm font-semibold">
                    +{xp} XP
                  </p>
                )}
              </div>
              <button
                onClick={onClose}
                className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
              >
                ×
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 