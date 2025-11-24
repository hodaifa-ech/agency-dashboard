import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getContacts, getUserUsage, getAllAgencies } from "@/lib/actions";
import ContactsClient from "./ContactsClient";

export default async function ContactsPage() {
  const user = await currentUser();
  
  if (!user) {
    redirect("/sign-in");
  }

  const [contactsData, usage, agencies] = await Promise.all([
    getContacts(1, 20, '', undefined),
    getUserUsage(),
    getAllAgencies()
  ]);

  return (
    <ContactsClient 
      initialContacts={contactsData.contacts}
      initialTotal={contactsData.total}
      initialTotalPages={contactsData.totalPages}
      initialAgencies={agencies}
      initialCount={usage?.count || 0}
    />
  );
}

