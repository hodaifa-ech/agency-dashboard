'use client'

import { useState } from 'react';
import { UserButton } from "@clerk/nextjs";
import { Menu, ChevronLeft, ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Navigation from "@/components/Navigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";

interface SidebarProps {
  user: {
    firstName: string | null;
    emailAddress: string;
    imageUrl: string;
  };
}

export default function Sidebar({ user }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      {/* Sidebar Desktop */}
      <aside 
        className={cn(
          "hidden md:flex flex-col border-r bg-slate-900 dark:bg-slate-900 transition-all duration-300 ease-in-out",
          isCollapsed ? "w-16" : "w-64"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b px-6 border-slate-700">
          {!isCollapsed && (
            <h1 className="text-xl font-bold text-white">Agency Dashboard</h1>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-slate-300 hover:text-white hover:bg-slate-800 ml-auto"
          >
            {isCollapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </Button>
        </div>
        <Navigation isCollapsed={isCollapsed} />
        <div className="border-t p-4 border-slate-700">
          <ThemeToggle isCollapsed={isCollapsed} />
        </div>
        <div className="border-t p-4 border-slate-700">
          <div className={cn(
            "flex items-center gap-3",
            isCollapsed && "justify-center"
          )}>
            <Avatar>
              <AvatarImage src={user.imageUrl} />
              <AvatarFallback className="bg-slate-700 text-white">
                {user.firstName?.[0] || user.emailAddress[0] || "U"}
              </AvatarFallback>
            </Avatar>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate text-white">
                  {user.firstName || user.emailAddress}
                </p>
                <p className="text-xs text-slate-400 truncate">
                  {user.emailAddress}
                </p>
              </div>
            )}
            {!isCollapsed && <UserButton />}
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 border-b bg-background">
        <div className="flex h-16 items-center justify-between px-4">
          <h1 className="text-lg font-bold">Agency Dashboard</h1>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0 bg-slate-900 dark:bg-slate-900">
              <div className="flex h-16 items-center border-b px-6 border-slate-700">
                <h1 className="text-xl font-bold text-white">Agency Dashboard</h1>
              </div>
              <Navigation mobile />
              <div className="border-t p-4 border-slate-700">
                <ThemeToggle />
              </div>
              <div className="border-t p-4 border-slate-700">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={user.imageUrl} />
                    <AvatarFallback className="bg-slate-700 text-white">
                      {user.firstName?.[0] || user.emailAddress[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate text-white">
                      {user.firstName || user.emailAddress}
                    </p>
                    <p className="text-xs text-slate-400 truncate">
                      {user.emailAddress}
                    </p>
                  </div>
                  <UserButton />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </>
  );
}

