'use client'

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Building2, MapPin, Globe, Briefcase, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getAgencies } from "@/lib/actions";

interface Agency {
  id: string;
  name: string;
  state: string | null;
  type: string | null;
  website: string | null;
  _count?: {
    contacts: number;
  };
}

interface AgenciesClientProps {
  initialAgencies: Agency[];
  initialTotal: number;
  initialTotalPages: number;
}

export default function AgenciesClient({
  initialAgencies,
  initialTotal,
  initialTotalPages,
}: AgenciesClientProps) {
  const [agencies, setAgencies] = useState(initialAgencies);
  const [total, setTotal] = useState(initialTotal);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [loading, setLoading] = useState(false);

  const fetchAgencies = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getAgencies(page, pageSize);
      setAgencies(result.agencies);
      setTotal(result.total);
      setTotalPages(result.totalPages);
    } catch (error) {
      console.error('Error fetching agencies:', error);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  // Fetch agencies when page or pageSize changes
  useEffect(() => {
    fetchAgencies();
  }, [fetchAgencies]);

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

  return (
    <div className="min-h-full bg-white p-6 transition-colors">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Agencies</h1>
              <p className="text-base text-gray-600">
                List of all agencies ({total} total)
              </p>
            </div>
            <div className="flex items-center gap-2">
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
        </header>

        {loading ? (
          <div className="py-12 text-center">
            <p className="text-gray-600">Loading agencies...</p>
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {agencies.map((agency) => (
                <Card
                  key={agency.id}
                  className="rounded-3xl border border-slate-200 bg-white shadow-sm transition-colors"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className="rounded-full bg-emerald-50 p-2 text-emerald-600">
                          <Building2 className="h-4 w-4" />
                        </div>
                        <div>
                          <CardTitle className="text-lg text-gray-900">{agency.name}</CardTitle>
                          <CardDescription className="text-gray-600">
                            {agency.state || "No state provided"}
                          </CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {agency.type && (
                      <div className="flex items-center gap-2 text-sm">
                        <Briefcase className="h-4 w-4 text-gray-500" />
                        <Badge variant="outline" className="text-gray-700">{agency.type}</Badge>
                      </div>
                    )}
                    {agency.website && (
                      <div className="flex items-center gap-2 text-sm">
                        <Globe className="h-4 w-4 text-gray-500" />
                        <a
                          href={agency.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-600 hover:text-emerald-700"
                        >
                          {agency.website}
                        </a>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">
                        {agency.state || "Unknown location"}
                      </span>
                    </div>
                    <div className="pt-2">
                      <p className="text-sm text-gray-600">
                        {agency._count?.contacts || 0} contact(s)
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {agencies.length === 0 && (
              <Card className="rounded-3xl border border-slate-200 bg-white shadow-sm">
                <CardContent className="py-12 text-center">
                  <Building2 className="h-12 w-12 mx-auto text-gray-400" />
                  <p className="text-gray-600">No agencies found</p>
                </CardContent>
              </Card>
            )}

            {/* Pagination Controls */}
            {agencies.length > 0 && (
              <div className="flex items-center justify-between rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="text-sm text-gray-600">
                  Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, total)} of {total} agencies
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
            )}
          </>
        )}
      </div>
    </div>
  );
}

