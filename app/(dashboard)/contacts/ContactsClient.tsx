'use client'

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ContactRow from "@/components/ContactsTable";
import UsageCounter from "@/components/UsageCounter";
import { Users, Eye } from "lucide-react";

interface Contact {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  phone: string | null;
  title: string | null;
  agency: {
    name: string;
  } | null;
  isRevealed?: boolean;
}

interface ContactsClientProps {
  contacts: Contact[];
  initialCount: number;
}

export default function ContactsClient({ contacts, initialCount }: ContactsClientProps) {
  const [count, setCount] = useState(initialCount);
  const remainingViews = 50 - count;

  const handleReveal = (newCount: number) => {
    setCount(newCount);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Contacts</h1>
          <p className="text-muted-foreground mt-2">
            List of all contacts
          </p>
        </div>
        <div className="flex items-center gap-4">
          <UsageCounter initialCount={count} />
        </div>
      </div>

      {remainingViews === 0 && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Limit Reached</CardTitle>
            <CardDescription>
              You have reached your daily limit of 50 views. Upgrade to Pro to see more contacts.
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Contact List</CardTitle>
          <CardDescription>
            Click "View" to reveal a contact's details
          </CardDescription>
        </CardHeader>
        <CardContent>
          {contacts.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Agency</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contacts.map((contact) => (
                  <ContactRow 
                    key={contact.id} 
                    contact={contact} 
                    onReveal={handleReveal}
                  />
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="py-12 text-center">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No contacts found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

