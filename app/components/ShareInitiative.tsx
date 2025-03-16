"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { 
  Share, 
  Linkedin, 
  Mail, 
  Copy, 
  MessageSquare, 
  Instagram, 
  Check 
} from "lucide-react";
import { toast } from "react-toastify";

interface ShareInitiativeProps {
  initiative: {
    id: string;
    title: string;
    description: string;
  };
  className?: string;
}

export function ShareInitiative({ initiative, className = "" }: ShareInitiativeProps) {
  const [copied, setCopied] = useState(false);
  
  // Base URL for the application
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  
  // URL to the initiative
  const initiativeUrl = `${baseUrl}/explore/${initiative.id}`;
  
  // Prepare share text
  const shareTitle = `Check out this volunteer opportunity: ${initiative.title}`;
  const shareText = `${initiative.title} - ${initiative.description.substring(0, 100)}${initiative.description.length > 100 ? '...' : ''}`;
  
  // Share on LinkedIn
  const shareOnLinkedIn = () => {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(initiativeUrl)}&title=${encodeURIComponent(shareTitle)}`;
    window.open(linkedInUrl, '_blank');
    toast.success("Opening LinkedIn sharing...");
  };
  
  // Share via Email
  const shareViaEmail = () => {
    const emailSubject = encodeURIComponent(shareTitle);
    const emailBody = encodeURIComponent(`${shareText}\n\nLearn more and sign up: ${initiativeUrl}`);
    window.open(`mailto:?subject=${emailSubject}&body=${emailBody}`, '_blank');
    toast.success("Opening email client...");
  };
  
  // Share via SMS/Messages
  const shareViaSMS = () => {
    const smsBody = encodeURIComponent(`${shareTitle}\n${initiativeUrl}`);
    
    // Different URI schemes for different platforms
    if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      window.open(`sms:&body=${smsBody}`);
    } else if (/Android/i.test(navigator.userAgent)) {
      window.open(`sms:?body=${smsBody}`);
    } else {
      // Fallback to copy to clipboard
      copyToClipboard();
    }
    toast.success("Opening messages app...");
  };
  
  // Share on Instagram (via copy to clipboard)
  const shareOnInstagram = () => {
    copyToClipboard();
    toast.info("Link copied! Open Instagram and paste in your story or DM");
  };
  
  // Copy to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${shareTitle}\n${initiativeUrl}`).then(() => {
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }).catch(err => {
      console.error('Failed to copy: ', err);
      toast.error("Failed to copy link");
    });
  };
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className={`flex items-center gap-1 ${className}`}
        >
          <Share className="h-4 w-4" />
          <span>Share</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-2">
        <div className="grid gap-1">
          <h3 className="font-medium mb-1 px-2">Share Initiative</h3>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex justify-start items-center gap-2" 
            onClick={shareOnLinkedIn}
          >
            <Linkedin className="h-4 w-4" />
            <span>LinkedIn</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex justify-start items-center gap-2" 
            onClick={shareViaEmail}
          >
            <Mail className="h-4 w-4" />
            <span>Email</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex justify-start items-center gap-2" 
            onClick={shareViaSMS}
          >
            <MessageSquare className="h-4 w-4" />
            <span>Messages/SMS</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex justify-start items-center gap-2" 
            onClick={shareOnInstagram}
          >
            <Instagram className="h-4 w-4" />
            <span>Instagram</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex justify-start items-center gap-2" 
            onClick={copyToClipboard}
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            <span>{copied ? "Copied!" : "Copy Link"}</span>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
} 