"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { 
  Bell, 
  Calendar, 
  Check,
  Clock,
  Download
} from "lucide-react";
import { toast } from "react-toastify";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { format, addDays, addHours } from "date-fns";

interface InitiativeReminderProps {
  initiative: {
    id: string;
    title: string;
    description: string;
    startDate: string;
    endDate?: string | null;
    location?: string;
  };
  className?: string;
}

export function InitiativeReminder({ initiative, className = "" }: InitiativeReminderProps) {
  const [reminderSet, setReminderSet] = useState(false);
  const [reminderTime, setReminderTime] = useState("1day");
  
  // Generate iCalendar file
  const generateICalFile = () => {
    try {
      const startDate = new Date(initiative.startDate);
      const endDate = initiative.endDate ? new Date(initiative.endDate) : addHours(startDate, 2); // Default to 2 hours if no end date
      
      // Format dates for iCal
      const formatDate = (date: Date) => {
        return date.toISOString().replace(/-|:|\.\d+/g, "");
      };
      
      const icalContent = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Vollie//Initiative Calendar//EN",
        "CALSCALE:GREGORIAN",
        "METHOD:PUBLISH",
        "BEGIN:VEVENT",
        `UID:${initiative.id}@vollie.app`,
        `SUMMARY:${initiative.title}`,
        `DESCRIPTION:${initiative.description.replace(/\n/g, "\\n")}`,
        `LOCATION:${initiative.location || ""}`,
        `DTSTART:${formatDate(startDate)}`,
        `DTEND:${formatDate(endDate)}`,
        "BEGIN:VALARM",
        "ACTION:DISPLAY",
        "DESCRIPTION:Reminder",
        "TRIGGER:-PT1H", // 1 hour before
        "END:VALARM",
        "END:VEVENT",
        "END:VCALENDAR"
      ].join("\r\n");
      
      const blob = new Blob([icalContent], { type: "text/calendar;charset=utf-8" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${initiative.title.replace(/\s+/g, "_")}.ics`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Calendar file downloaded successfully!");
    } catch (err) {
      console.error("Failed to generate calendar file:", err);
      toast.error("Failed to generate calendar file");
    }
  };
  
  // Set browser notification
  const setNotification = () => {
    try {
      // Check if browser supports notifications
      if (!("Notification" in window)) {
        toast.error("This browser does not support desktop notifications");
        return;
      }
      
      // Request permission
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          const startDate = new Date(initiative.startDate);
          let reminderDate;
          
          // Calculate reminder time
          switch (reminderTime) {
            case "1hour":
              reminderDate = new Date(startDate.getTime() - 60 * 60 * 1000);
              break;
            case "3hours":
              reminderDate = new Date(startDate.getTime() - 3 * 60 * 60 * 1000);
              break;
            case "1day":
              reminderDate = new Date(startDate.getTime() - 24 * 60 * 60 * 1000);
              break;
            case "2days":
              reminderDate = new Date(startDate.getTime() - 2 * 24 * 60 * 60 * 1000);
              break;
            case "1week":
              reminderDate = new Date(startDate.getTime() - 7 * 24 * 60 * 60 * 1000);
              break;
            default:
              reminderDate = new Date(startDate.getTime() - 24 * 60 * 60 * 1000); // Default to 1 day
          }
          
          // Store reminder in localStorage
          const reminders = JSON.parse(localStorage.getItem("initiativeReminders") || "{}");
          reminders[initiative.id] = {
            id: initiative.id,
            title: initiative.title,
            description: initiative.description,
            startDate: initiative.startDate,
            reminderDate: reminderDate.toISOString(),
            reminderTime
          };
          localStorage.setItem("initiativeReminders", JSON.stringify(reminders));
          
          // Set reminder flag
          setReminderSet(true);
          
          toast.success(`Reminder set for ${format(reminderDate, "PPp")}`);
          
          // If the reminder time is in the past, show notification immediately
          if (reminderDate <= new Date()) {
            new Notification(`Reminder: ${initiative.title}`, {
              body: `This initiative starts on ${format(startDate, "PPp")}`,
              icon: "/favicon.ico"
            });
          }
        } else {
          toast.error("Notification permission denied");
        }
      });
    } catch (err) {
      console.error("Failed to set notification:", err);
      toast.error("Failed to set reminder");
    }
  };
  
  // Remove reminder
  const removeReminder = () => {
    try {
      const reminders = JSON.parse(localStorage.getItem("initiativeReminders") || "{}");
      delete reminders[initiative.id];
      localStorage.setItem("initiativeReminders", JSON.stringify(reminders));
      setReminderSet(false);
      toast.success("Reminder removed");
    } catch (err) {
      console.error("Failed to remove reminder:", err);
      toast.error("Failed to remove reminder");
    }
  };
  
  // Check if reminder is already set on component mount
  useState(() => {
    try {
      const reminders = JSON.parse(localStorage.getItem("initiativeReminders") || "{}");
      if (reminders[initiative.id]) {
        setReminderSet(true);
        setReminderTime(reminders[initiative.id].reminderTime);
      }
    } catch (err) {
      console.error("Failed to check reminders:", err);
    }
  });
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className={`flex items-center gap-1 ${className} ${reminderSet ? 'border-amber-500 text-amber-500' : ''}`}
        >
          <Bell className="h-4 w-4" />
          <span>{reminderSet ? "Reminder Set" : "Remind Me"}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-4">
        <div className="space-y-4">
          <h3 className="font-medium">Initiative Reminder</h3>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="reminder-toggle">Set Reminder</Label>
              <Switch 
                id="reminder-toggle" 
                checked={reminderSet}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setNotification();
                  } else {
                    removeReminder();
                  }
                }}
              />
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="reminder-time">Remind me before</Label>
              <Select 
                value={reminderTime} 
                onValueChange={setReminderTime}
                disabled={!reminderSet}
              >
                <SelectTrigger id="reminder-time" className="w-full">
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1hour">1 hour before</SelectItem>
                  <SelectItem value="3hours">3 hours before</SelectItem>
                  <SelectItem value="1day">1 day before</SelectItem>
                  <SelectItem value="2days">2 days before</SelectItem>
                  <SelectItem value="1week">1 week before</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Separator className="my-2" />
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Add to Calendar</h4>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full flex items-center justify-center gap-2"
              onClick={generateICalFile}
            >
              <Calendar className="h-4 w-4" />
              <span>Download .ics File</span>
            </Button>
            
            <div className="text-xs text-muted-foreground mt-1">
              Compatible with Google Calendar, Apple Calendar, Outlook and more.
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

// Separator component
function Separator({ className }: { className?: string }) {
  return (
    <div className={`h-px bg-border ${className}`}></div>
  );
}