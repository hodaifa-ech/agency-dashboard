import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getAgencies } from "@/lib/actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, MapPin, Globe, Briefcase } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default async function AgenciesPage() {
  const user = await currentUser();
  
  if (!user) {
    redirect("/sign-in");
  }

  const agencies = await getAgencies(1);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Agencies</h1>
        <p className="text-muted-foreground mt-2">
          List of all agencies
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {agencies.map((agency) => (
          <Card key={agency.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-muted-foreground" />
                  <CardTitle className="text-lg">{agency.name}</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {agency.state && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{agency.state}</span>
                </div>
              )}
              {agency.type && (
                <div className="flex items-center gap-2 text-sm">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <Badge variant="outline">{agency.type}</Badge>
                </div>
              )}
              {agency.website && (
                <div className="flex items-center gap-2 text-sm">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={agency.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline truncate"
                  >
                    {agency.website}
                  </a>
                </div>
              )}
              <div className="pt-2 border-t">
                <p className="text-sm text-muted-foreground">
                  {agency._count?.contacts || 0} contact(s)
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {agencies.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No agencies found</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

