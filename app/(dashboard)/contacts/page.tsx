import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getContacts, getUserUsage } from "@/lib/actions";
import ContactsClient from "./ContactsClient";

export default async function ContactsPage() {
  const user = await currentUser();
  
  if (!user) {
    redirect("/sign-in");
  }

  const [contacts, usage] = await Promise.all([
    getContacts(1),
    getUserUsage()
  ]);

  return (
    <ContactsClient 
      contacts={contacts} 
      initialCount={usage?.count || 0}
    />
  );
}

