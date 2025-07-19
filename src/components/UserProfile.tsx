
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
import { User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const USERNAME_KEY = "mathverse-username";

export default function UserProfile() {
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [inputValue, setInputValue] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    // This code runs only on the client, so localStorage is safe to use.
    const storedUsername = localStorage.getItem(USERNAME_KEY);
    if (storedUsername) {
      setUsername(storedUsername);
      setInputValue(storedUsername);
    }
  }, []);

  const handleSave = () => {
    if (inputValue.trim()) {
      localStorage.setItem(USERNAME_KEY, inputValue.trim());
      setUsername(inputValue.trim());
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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-6 w-6" />
                <span className="sr-only">Set User Name</span>
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>{username ? `Logged in as ${username}` : 'Set User Name'}</p>
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
