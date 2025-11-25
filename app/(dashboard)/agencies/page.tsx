import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getAgencies } from "@/lib/actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Building2, MapPin, Globe, Briefcase } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default async function AgenciesPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const agencies = await getAgencies(1);

  return (
    <div className="min-h-full bg-white p-6 transition-colors dark:bg-slate-950">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Agencies</h1>
          <p className="text-base text-gray-600 dark:text-gray-400 mt-2">
            List of all agencies
          </p>
        </header>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {agencies.map((agency) => (
            <Card
              key={agency.id}
              className="rounded-3xl border border-slate-200 bg-white shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900/70"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-emerald-50 p-2 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-200">
                      <Building2 className="h-4 w-4" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-gray-900 dark:text-gray-100">{agency.name}</CardTitle>
                      <CardDescription className="text-gray-600 dark:text-gray-400">
                        {agency.state || "No state provided"}
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {agency.type && (
                  <div className="flex items-center gap-2 text-sm">
                    <Briefcase className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <Badge variant="outline" className="text-gray-700 dark:text-gray-300">{agency.type}</Badge>
                  </div>
                )}
                {agency.website && (
                  <div className="flex items-center gap-2 text-sm">
                    <Globe className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <a
                      href={agency.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 hover:underline truncate"
                    >
                      {agency.website}
                    </a>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-400">
                    {agency.state || "Unknown location"}
                  </span>
                </div>
                <div className="pt-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {agency._count?.contacts || 0} contact(s)
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {agencies.length === 0 && (
          <Card className="rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
            <CardContent className="py-12 text-center">
              <Building2 className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
              <p className="text-gray-600 dark:text-gray-400">No agencies found</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

