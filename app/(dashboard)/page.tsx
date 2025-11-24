import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Users, Eye } from "lucide-react";
import { getAgencies, getContacts, getUserUsage } from "@/lib/actions";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const user = await currentUser();
  
  if (!user) {
    redirect("/sign-in");
  }

  const [agencies, contactsData, usage] = await Promise.all([
    getAgencies(1),
    getContacts(1, 20, '', undefined),
    getUserUsage()
  ]);

  const contacts = contactsData.contacts;

  const stats = [
    {
      title: "Agencies",
      value: agencies.length,
      description: "Total agencies",
      icon: Building2,
      href: "/agencies",
    },
    {
      title: "Contacts",
      value: contactsData.total,
      description: "Available contacts",
      icon: Users,
      href: "/contacts",
    },
    {
      title: "Views today",
      value: usage?.count || 0,
      description: "Out of 50 maximum",
      icon: Eye,
      href: "/contacts",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome, {user.firstName || user.emailAddresses[0]?.emailAddress}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
                <Link href={stat.href} className="mt-4 inline-block">
                  <Button variant="outline" size="sm">
                    See more
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Agencies</CardTitle>
            <CardDescription>
              Latest added agencies
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {agencies.slice(0, 5).map((agency) => (
                <div key={agency.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="font-medium">{agency.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {agency.state || "N/A"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/agencies" className="mt-4 inline-block">
              <Button variant="outline" size="sm" className="w-full">
                View all agencies
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Contacts</CardTitle>
            <CardDescription>
              Latest added contacts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {contacts.slice(0, 5).map((contact) => (
                <div key={contact.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="font-medium">
                      {contact.firstName || ""} {contact.lastName || ""}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {contact.agency?.name || "N/A"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/contacts" className="mt-4 inline-block">
              <Button variant="outline" size="sm" className="w-full">
                View all contacts
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

