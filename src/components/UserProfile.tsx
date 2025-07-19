
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

const USERNAME_KEY = "mathverse-username";
const DEFAULT_USERNAME = "Guest";

export default function UserProfile() {
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState(DEFAULT_USERNAME);
  const [inputValue, setInputValue] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const storedUsername = localStorage.getItem(USERNAME_KEY);
    const currentUsername = storedUsername || DEFAULT_USERNAME;
    setUsername(currentUsername);
    setInputValue(currentUsername === DEFAULT_USERNAME ? "" : currentUsername);
  }, []);

  const handleSave = () => {
    if (inputValue.trim()) {
      const newUsername = inputValue.trim();
      localStorage.setItem(USERNAME_KEY, newUsername);
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
  );
}
