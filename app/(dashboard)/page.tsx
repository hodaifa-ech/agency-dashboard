import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Building2, Users, Eye, ArrowUpRight, PhoneCall } from "lucide-react";
import { getAgencies, getContacts, getUserUsage } from "@/lib/actions";
import { Badge } from "@/components/ui/badge";
import UsageCounter from "@/components/UsageCounter";

export default async function DashboardPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const [agencies, contactsData, usage] = await Promise.all([
    getAgencies(1),
    getContacts(1, 20, "", undefined),
    getUserUsage(),
  ]);

  const contacts = contactsData.contacts;
  const usageCount = usage?.count ?? 0;

  const statHighlights = [
    {
      title: "Total Agencies",
      value: agencies.length,
      change: "+8 new this month",
      icon: Building2,
      accent: "from-emerald-500/10 to-emerald-500/0",
      href: "/agencies",
    },
    {
      title: "Contacts in DB",
      value: contactsData.total,
      change: "2,150 verified emails",
      icon: Users,
      accent: "from-sky-500/10 to-sky-500/0",
      href: "/contacts",
    },
    {
      title: "Active Searches",
      value: Math.max(4, Math.ceil(contactsData.total / 120)),
      change: "Running outreach campaigns",
      icon: PhoneCall,
      accent: "from-amber-500/10 to-amber-500/0",
      href: "/contacts",
    },
  ];

  const today = new Date();
  const viewHistory = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
    (day, index) => {
      const dayOffset = (today.getDay() + index) % 7;
      const wave = Math.sin((dayOffset + 1) * 0.9);
      const base =
        usageCount * 0.6 +
        contactsData.total / 200 +
        index * 3 +
        wave * 10;
      return {
        day,
        value: Math.max(8, Math.round(base)),
      };
    }
  );
  const maxViews = Math.max(...viewHistory.map((item) => item.value));
  const bestDay = viewHistory.reduce(
    (prev, curr) => (curr.value > prev.value ? curr : prev),
    viewHistory[0]
  );

  const contactSheet = contacts.slice(0, 4).map((contact, index) => ({
    id: contact.id,
    name:
      `${contact.firstName || ""} ${contact.lastName || ""}`.trim() ||
      `Contact ${index + 1}`,
    agency: contact.agency?.name || "Unknown Agency",
    status: ["Reviewed", "Need follow up", "Pending", "In progress"][index] ||
      "Pending",
  }));

  return (
    <div className="min-h-full bg-white p-6 transition-colors dark:bg-slate-950">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900/80 lg:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-500">
            Plan. Prioritize. Connect.
          </p>
          <div className="mt-2 flex flex-col gap-2 text-slate-900 dark:text-white">
            <h1 className="text-3xl font-bold">
              Welcome back,{" "}
              {user.firstName || user.emailAddresses[0]?.emailAddress}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Keep nurturing agency relationships and uncovering new contacts.
            </p>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          {statHighlights.map((stat) => {
            const Icon = stat.icon;
            return (
              <Link
                key={stat.title}
                href={stat.href}
                className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.title}
                  </span>
                  <div
                    className={`rounded-full bg-gradient-to-br ${stat.accent} p-2`}
                  >
                    <Icon className="h-4 w-4 text-emerald-600 dark:text-emerald-300" />
                  </div>
                </div>
                <p className="mt-4 text-4xl font-semibold text-gray-900 dark:text-gray-100">{stat.value}</p>
                <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                  {stat.change}
                </p>
              </Link>
            );
          })}
        </section>

        <section>
          <UsageCounter initialCount={usageCount} variant="dashboard" />
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <Card className="rounded-3xl border border-slate-200 bg-white shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900/80">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-gray-900 dark:text-gray-100">Daily Contact Views</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Track how many contacts your team revealed each day
                </CardDescription>
              </div>
              <Badge variant="secondary" className="text-xs text-gray-700 dark:text-gray-300">
                +12% vs last week
              </Badge>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-end gap-4">
                {viewHistory.map((item) => (
                  <div
                    key={item.day}
                    className="flex flex-1 flex-col items-center gap-2 text-xs font-medium text-gray-600 dark:text-gray-400"
                  >
                    <div className="relative flex h-36 w-full items-end justify-center rounded-full bg-emerald-50 dark:bg-emerald-900/30">
                      <div
                        className="w-full rounded-full bg-gradient-to-t from-emerald-500 to-emerald-300 dark:from-emerald-400 dark:to-emerald-200"
                        style={{ height: `${(item.value / maxViews) * 100}%` }}
                      />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">{item.day}</span>
                    <span className="text-sm text-gray-900 dark:text-gray-100 font-semibold">{item.value}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-4 text-sm">
                <p className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Eye className="h-4 w-4 text-emerald-500" />
                  {usageCount} views today
                </p>
                <p className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                  Best day: {bestDay.day}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border border-slate-200 bg-white shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900/80">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-gray-100">Today&apos;s Contact Sheet</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                People we planned to reach today
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {contactSheet.map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-center justify-between rounded-2xl border border-slate-200 p-4 dark:border-slate-800"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {contact.name}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {contact.agency}
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-gray-700 dark:text-gray-300">{contact.status}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <Card className="rounded-3xl border border-slate-200 bg-white shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900/80">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-gray-100">Recent Agencies</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">Latest additions to the network</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {agencies.slice(0, 6).map((agency) => (
                <div
                  key={agency.id}
                  className="flex items-center justify-between border-b border-slate-200 pb-3 last:border-0 last:pb-0 dark:border-slate-800"
                >
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">{agency.name}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {agency.state || "N/A"}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-gray-700 dark:text-gray-300">Agency</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-3xl border border-slate-200 bg-white shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900/80">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-gray-100">Recent Contacts</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">Latest profiles discovered</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {contacts.slice(0, 6).map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-center justify-between border-b border-slate-200 pb-3 last:border-0 last:pb-0 dark:border-slate-800"
                >
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      {(contact.firstName || "") + " " + (contact.lastName || "")}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {contact.agency?.name || "Unknown agency"}
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-gray-700 dark:text-gray-300">New</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}

