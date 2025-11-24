import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { Menu } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Navigation from "@/components/Navigation";
import { ThemeToggle } from "@/components/ThemeToggle";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();
  
  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex w-64 flex-col border-r bg-slate-900 dark:bg-slate-900">
        <div className="flex h-16 items-center border-b px-6 border-slate-700">
          <h1 className="text-xl font-bold text-white">Agency Dashboard</h1>
        </div>
        <Navigation />
        <div className="border-t p-4 border-slate-700">
          <ThemeToggle />
        </div>
        <div className="border-t p-4 border-slate-700">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={user.imageUrl} />
              <AvatarFallback className="bg-slate-700 text-white">
                {user.firstName?.[0] || user.emailAddresses[0]?.emailAddress[0] || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate text-white">
                {user.firstName || user.emailAddresses[0]?.emailAddress}
              </p>
              <p className="text-xs text-slate-400 truncate">
                {user.emailAddresses[0]?.emailAddress}
              </p>
            </div>
            <UserButton />
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
                      {user.firstName?.[0] || user.emailAddresses[0]?.emailAddress[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate text-white">
                      {user.firstName || user.emailAddresses[0]?.emailAddress}
                    </p>
                    <p className="text-xs text-slate-400 truncate">
                      {user.emailAddresses[0]?.emailAddress}
                    </p>
                  </div>
                  <UserButton />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-auto md:mt-0 mt-16">
        {children}
      </main>
    </div>
  );
}

