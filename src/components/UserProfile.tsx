
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

const USERNAME_KEY = "mathverse-username";
const USERID_KEY = "mathverse-userid";
const DEFAULT_USERNAME = "Guest";

function UserProfileContent({ showName = false }: { showName?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState(DEFAULT_USERNAME);
  const [inputValue, setInputValue] = useState("");
  const { toast } = useToast();
  const searchParams = useSearchParams();

  const updateUsernameFromStorage = () => {
    const storedUsername = localStorage.getItem(USERNAME_KEY);
    const currentUsername = storedUsername || DEFAULT_USERNAME;
    setUsername(currentUsername);
    setInputValue(currentUsername === DEFAULT_USERNAME ? "" : currentUsername);
  };
  
  useEffect(() => {
    // Check for username and id from URL params on initial load
    const urlUser = searchParams.get('user');
    const urlId = searchParams.get('id');

    if (urlUser) {
        localStorage.setItem(USERNAME_KEY, urlUser);
    }
    if (urlId) {
        localStorage.setItem(USERID_KEY, urlId);
    }

    updateUsernameFromStorage();
    
    // Listen for changes to localStorage from other tabs/windows
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === USERNAME_KEY) {
        updateUsernameFromStorage();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = () => {
    if (inputValue.trim()) {
      const newUsername = inputValue.trim();
      // This will trigger the 'storage' event in other tabs
      localStorage.setItem(USERNAME_KEY, newUsername);
      // Manually update the state for the current tab
      setUsername(newUsername);
      toast({
        title: "Success",
        description: "Your name has been saved.",
      });
      setIsOpen(false);
    } else {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Please enter a name.",
        });
    }
  };
  
  const handleOpenChange = (open: boolean) => {
    if (open) {
      const storedUsername = localStorage.getItem(USERNAME_KEY) || "";
      setInputValue(storedUsername);
    }
    setIsOpen(open);
  }

  return (
    <div className="flex flex-col items-center gap-1">
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <DialogTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Image
                      src="https://placehold.co/40x40.png"
                      alt="User Profile"
                      data-ai-hint="user avatar"
                      className="rounded-full"
                      width={40}
                      height={40}
                    />
                    <span className="sr-only">Set User Name</span>
                  </Button>
                </DialogTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>Logged in as {username}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit profile</DialogTitle>
              <DialogDescription>
                Make changes to your profile here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="col-span-3"
                  autoComplete="name"
                  placeholder="Enter your name"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSave}>Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {showName && <span className="text-sm text-muted-foreground font-semibold">{username}</span>}
    </div>
  );
}

// Wrap with Suspense because useSearchParams requires it.
export default function UserProfile(props: { showName?: boolean }) {
    return (
        <React.Suspense fallback={<div>Loading...</div>}>
            <UserProfileContent {...props} />
        </React.Suspense>
    )
}
