'use client'

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import ContactRow from "@/components/ContactsTable";
import UsageCounter from "@/components/UsageCounter";
import UpgradeDialog from "@/components/UpgradeDialog";
import { Users, Search, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { getContacts, getAllAgencies } from "@/lib/actions";

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

interface Agency {
  id: string;
  name: string;
}

interface ContactsClientProps {
  initialContacts: Contact[];
  initialTotal: number;
  initialTotalPages: number;
  initialAgencies: Agency[];
  initialCount: number;
}

export default function ContactsClient({ 
  initialContacts, 
  initialTotal,
  initialTotalPages,
  initialAgencies,
  initialCount 
}: ContactsClientProps) {
  const [count, setCount] = useState(initialCount);
  const [contacts, setContacts] = useState(initialContacts);
  const [total, setTotal] = useState(initialTotal);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [agencies, setAgencies] = useState(initialAgencies);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [search, setSearch] = useState('');
  const [agencyFilter, setAgencyFilter] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);

  const remainingViews = 50 - count;

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to first page on search
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [search]);

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getContacts(
        page,
        pageSize,
        debouncedSearch,
        agencyFilter || undefined
      );
      setContacts(result.contacts);
      setTotal(result.total);
      setTotalPages(result.totalPages);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, debouncedSearch, agencyFilter]);

  // Fetch contacts when page, pageSize, debouncedSearch, or agencyFilter changes
  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const handleReveal = (newCount: number) => {
    setCount(newCount);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePageSizeChange = (newPageSize: string) => {
    const size = parseInt(newPageSize);
    setPageSize(size);
    setPage(1); // Reset to first page when changing page size
  };

  const handleAgencyFilterChange = (agencyId: string) => {
    setAgencyFilter(agencyId);
    setPage(1); // Reset to first page when filtering
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Contacts</h1>
          <p className="text-muted-foreground mt-2">
            List of all contacts ({total} total)
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
        <CardContent className="space-y-4">
          {/* Search and Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Select
                  value={agencyFilter}
                  onChange={(e) => handleAgencyFilterChange(e.target.value)}
                  className="pl-9 min-w-[200px]"
                >
                  <option value="">All Agencies</option>
                  {agencies.map((agency) => (
                    <option key={agency.id} value={agency.id}>
                      {agency.name}
                    </option>
                  ))}
                </Select>
              </div>
              <Select
                value={pageSize.toString()}
                onChange={(e) => handlePageSizeChange(e.target.value)}
                className="min-w-[120px]"
              >
                <option value="10">10 per page</option>
                <option value="20">20 per page</option>
                <option value="50">50 per page</option>
                <option value="100">100 per page</option>
              </Select>
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">Loading contacts...</p>
            </div>
          ) : contacts.length > 0 ? (
            <>
              <div className="rounded-md border">
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
              </div>

              {/* Pagination Controls */}
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, total)} of {total} contacts
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1 || loading}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (page <= 3) {
                        pageNum = i + 1;
                      } else if (page >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = page - 2 + i;
                      }
                      return (
                        <Button
                          key={pageNum}
                          variant={page === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(pageNum)}
                          disabled={loading}
                          className="min-w-[40px]"
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages || loading}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
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

