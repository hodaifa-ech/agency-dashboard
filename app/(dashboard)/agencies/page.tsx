import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getAgencies } from "@/lib/actions";
import AgenciesClient from "./AgenciesClient";

export default async function AgenciesPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const agenciesData = await getAgencies(1, 20);

  return (
    <AgenciesClient
      initialAgencies={agenciesData.agencies}
      initialTotal={agenciesData.total}
      initialTotalPages={agenciesData.totalPages}
    />
  );
}

