import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();
  
  if (!user) {
    redirect("/sign-in");
  }

  // Extract only serializable values
  const userData = {
    firstName: user.firstName,
    emailAddress: user.emailAddresses[0]?.emailAddress || "",
    imageUrl: user.imageUrl || ""
  };

  return (
    <div className="flex h-screen bg-white">
      <Sidebar user={userData} />

      {/* Main Content */}
      <main className="flex-1 overflow-auto md:mt-0 mt-16 bg-white">
        {children}
      </main>
    </div>
  );
}

