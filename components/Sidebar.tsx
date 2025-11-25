'use client'

import { useState } from 'react';
import { UserButton } from "@clerk/nextjs";
import { Menu, ChevronLeft, ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Navigation from "@/components/Navigation";
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
          "hidden md:flex flex-col border-r border-slate-200 bg-white transition-all duration-300 ease-in-out shadow-lg",
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-transparent px-5">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-emerald-100 p-2 text-emerald-600">
                <Menu className="h-4 w-4" />
              </span>
              <div>
                <p className="text-xs uppercase tracking-widest text-slate-400">
                  Agency
                </p>
                <p className="text-lg font-semibold text-slate-900">
                  Dashboard
                </p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-slate-400 hover:text-slate-900 hover:bg-slate-100"
          >
            {isCollapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </Button>
        </div>
        <Navigation isCollapsed={isCollapsed} />
        <div className="mt-auto space-y-4 px-4 pb-6">
          <div
            className={cn(
              "flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4",
              isCollapsed && "justify-center"
            )}
          >
            <Avatar>
              <AvatarImage src={user.imageUrl} />
              <AvatarFallback className="bg-emerald-500/20 text-emerald-600">
                {user.firstName?.[0] || user.emailAddress[0] || "U"}
              </AvatarFallback>
            </Avatar>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate text-slate-900">
                  {user.firstName || user.emailAddress}
                </p>
                <p className="text-xs text-slate-500 truncate">
                  {user.emailAddress}
                </p>
              </div>
            )}
            {!isCollapsed && <UserButton />}
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 border-b border-slate-200 bg-white">
        <div className="flex h-16 items-center justify-between px-4">
          <h1 className="text-lg font-bold text-slate-900">
            Agency Dashboard
          </h1>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-72 p-0 border-r-0 bg-white"
            >
              <div className="flex h-16 items-center border-b border-slate-200 px-6">
                <h1 className="text-xl font-semibold">Agency Dashboard</h1>
              </div>
              <Navigation mobile />
              <div className="border-t border-slate-200 p-4">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={user.imageUrl} />
                    <AvatarFallback className="bg-emerald-500/20 text-emerald-600">
                      {user.firstName?.[0] || user.emailAddress[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {user.firstName || user.emailAddress}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
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

