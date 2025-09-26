import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from '@/hooks/useTranslation';

interface QuestItem {
  id: number;
  quest: {
    id: number;
    title: string;
    description: string;
    reward_points: number;
    difficulty_level: number;
    target_crop: string;
    duration_days: number;
    video_url?: string;
  };
  status: 'available' | 'in_progress' | 'completed';
}

const QuestDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();
  const API_BASE = (import.meta as any).env?.VITE_API_BASE || 'http://localhost:8000';

  const [quest, setQuest] = useState<QuestItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const load = async () => {
      if (!user?.id || !id) return;
      try {
        const res = await fetch(`${API_BASE}/api/quests/list/${user.id}/`);
        const data = await res.json();
        if (res.ok && data?.status === 'success') {
          const found = (data.quests as QuestItem[]).find((q) => String(q.id) === String(id));
          setQuest(found ?? null);
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user, id]);

  const videoEmbedSrc = useMemo(() => {
    if (!quest?.quest.video_url) return '';
    try {
      const url = new URL(quest.quest.video_url);
      if (url.hostname.includes('youtube.com')) {
        const v = url.searchParams.get('v');
        if (v) return `https://www.youtube.com/embed/${v}`;
      }
      if (url.hostname === 'youtu.be') {
        return `https://www.youtube.com/embed${url.pathname}`;
      }
      return quest.quest.video_url;
    } catch {
      return quest.quest.video_url;
    }
  }, [quest?.quest.video_url]);

  const startQuest = async (): Promise<boolean> => {
    if (!user?.id || !quest) return false;
    try {
      const res = await fetch(`${API_BASE}/api/quests/start/${user.id}/${quest.quest.id}/`, { method: 'POST' });
      const data = await res.json();
      if (res.ok && data?.status === 'success') {
        setQuest({ ...quest, status: 'in_progress' });
        return true;
      }
    } catch {}
    return false;
  };

  const submitProof = async () => {
    if (!user?.id || !quest || !file) return;
    setSubmitting(true);
    try {
      if (quest.status !== 'in_progress') {
        const started = await startQuest();
        if (!started) {
          alert(t('quests.details.not_found') || 'Quest not found');
          return;
        }
      }
      const form = new FormData();
      form.append('file', file);
      // Provide media_type hint to backend if useful
      const mediaType = file.type?.startsWith('video') ? 'video' : (file.type?.startsWith('image') ? 'image' : 'unknown');
      form.append('media_type', mediaType);
      if (notes) form.append('notes', notes);
      const res = await fetch(`${API_BASE}/api/quests/submit/${user.id}/${quest.quest.id}/`, {
        method: 'POST',
        body: form,
      });
      const data = await res.json();
      if (res.ok && data?.status === 'success') {
        setNotes('');
        setFile(null);
        alert(t('quests.details.submitted_successfully') || 'Submitted successfully');
      } else {
        alert(data?.message || (t('quests.details.not_found') || 'Submission failed'));
      }
    } catch (e) {
      alert('Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="container mx-auto p-6">{t('loading') || 'Loading...'}</div>;
  }

  if (!quest) {
    return <div className="container mx-auto p-6">{t('quests.details.not_found') || 'Quest not found'}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-sky-50">
      <div className="container mx-auto px-4 py-6">
        <Button variant="ghost" onClick={() => navigate('/quests')} className="mb-4">{t('back') || 'Back'}</Button>

        <Card className="card-agricultural">
          <CardHeader>
            <CardTitle>{quest.quest.title}</CardTitle>
            <CardDescription>{quest.quest.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {videoEmbedSrc && (
              <div className="aspect-video w-full rounded-lg overflow-hidden shadow-soft">
                <iframe src={videoEmbedSrc} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
              </div>
            )}

            {quest.status === 'available' && (
              <Button onClick={startQuest} className="w-full">{t('quests.actions.start_quest') || 'Start Quest'}</Button>
            )}

            <div className="space-y-2">
              <Label>{t('quests.details.submit_proof') || 'Submit Proof'}</Label>
              <Input type="file" accept="image/*,video/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
              <Input placeholder={t('quests.details.notes_placeholder') || 'Notes (optional)'} value={notes} onChange={(e) => setNotes(e.target.value)} />
              <Button disabled={!file || submitting} onClick={submitProof} className="mt-2">
                {submitting ? (t('submitting') || 'Submitting...') : (t('submit') || 'Submit')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuestDetails;
