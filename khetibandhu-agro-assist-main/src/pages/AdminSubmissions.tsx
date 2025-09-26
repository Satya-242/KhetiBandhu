import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/context/AuthContext';

interface SubmissionDto {
  id: number;
  farmer: number;
  quest: number;
  file: string;
  notes: string;
  status: 'pending' | 'approved' | 'rejected';
  submitted_at: string;
  reviewed_at?: string;
  review_comment?: string;
}

const AdminSubmissions: React.FC = () => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const API_BASE = (import.meta as any).env?.VITE_API_BASE || 'http://localhost:8000';

  const [submissions, setSubmissions] = useState<SubmissionDto[]>([]);
  const [statusFilter, setStatusFilter] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 12;

  const load = async (p = 1) => {
    setIsLoading(true);
    const params = new URLSearchParams();
    if (statusFilter !== 'all') params.set('status', statusFilter);
    params.set('page', String(p));
    params.set('page_size', String(pageSize));
    const res = await fetch(`${API_BASE}/api/quests/submissions/?${params.toString()}`);
    const data = await res.json();
    if (res.ok && data?.status === 'success') {
      setSubmissions(data.results || []);
      setPage(data.page || 1);
      setTotalPages(data.total_pages || 1);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    load(1);
  }, [statusFilter]);

  const review = async (submissionId: number, action: 'approve' | 'reject') => {
    const res = await fetch(`${API_BASE}/api/quests/review/${submissionId}/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    });
    const data = await res.json();
    if (res.ok && data?.status === 'success') {
      // Refresh current page
      load(page);
    } else {
      alert(data?.message || 'Failed to review');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-sky-50">
      <div className="container mx-auto px-4 py-6 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{t('admin.submissions.title') || 'Quest Submissions'}</h1>
          <div className="flex items-center gap-2">
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => load(1)} disabled={isLoading}>
              {isLoading ? (t('loading') || 'Loading...') : (t('refresh') || 'Refresh')}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {submissions.map((s) => (
            <Card key={s.id} className="hover-scale">
              <CardHeader>
                <CardTitle className="text-base">#{s.id} • {s.status.toUpperCase()}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-muted-foreground">Submitted: {new Date(s.submitted_at).toLocaleString()}</div>
                <a href={s.file} target="_blank" rel="noreferrer" className="text-primary underline text-sm">View file</a>
                <div className="text-sm break-words">{s.notes}</div>
                <div className="flex gap-2">
                  <Button size="sm" variant="default" onClick={() => review(s.id, 'approve')} disabled={s.status !== 'pending'}>
                    {t('approve') || 'Approve'}
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => review(s.id, 'reject')} disabled={s.status !== 'pending'}>
                    {t('reject') || 'Reject'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-center items-center gap-2">
          <Button variant="outline" disabled={page <= 1} onClick={() => load(page - 1)}>Prev</Button>
          <span className="text-sm">Page {page} / {totalPages}</span>
          <Button variant="outline" disabled={page >= totalPages} onClick={() => load(page + 1)}>Next</Button>
        </div>
      </div>
    </div>
  );
};

export default AdminSubmissions;


