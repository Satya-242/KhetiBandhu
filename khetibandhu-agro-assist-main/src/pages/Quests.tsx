import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import LoadingSpinner from '@/components/LoadingSpinner';
import { 
  Target, Star, Clock, Trophy, Wheat, Droplets, Sprout, 
  Search, Filter, ArrowLeft, Play, CheckCircle, Calendar,
  TrendingUp, Award
} from 'lucide-react';

interface Quest {
  id: number;
  quest: {
    title: string;
    description: string;
    reward_points: number;
    difficulty_level: number;
    target_crop: string;
    duration_days: number;
      video_url?: string;
  };
  status: 'available' | 'in_progress' | 'completed';
  progress?: number;
  deadline?: string;
}

const Quests: React.FC = () => {
  const { isAuthenticated, user, isLoading: authLoading } = useAuth();
  const { t } = useTranslation();
  const [quests, setQuests] = useState<Quest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(12);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const API_BASE = (import.meta as any).env?.VITE_API_BASE || 'http://localhost:8000';

  if (!authLoading && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const fetchQuests = async (nextPage: number, isLoadMore: boolean = false) => {
    if (!user?.id) return;
    const params = new URLSearchParams();
    params.set('page', String(nextPage));
    params.set('page_size', String(pageSize));

    try {
      if (isLoadMore) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      const res = await fetch(`${API_BASE}/api/quests/list/${user.id}/?${params.toString()}`);
      const data = await res.json();
      if (res.ok && data?.status === 'success' && Array.isArray(data.quests)) {
        setQuests((prev: Quest[]) => {
          const combined: Quest[] = isLoadMore ? [...prev, ...(data.quests as Quest[])] : (data.quests as Quest[]);
          const map = new Map<number, Quest>(combined.map((q: Quest) => [q.id, q]));
          const deduped: Quest[] = Array.from(map.values());
          return deduped;
        });
        setHasMore(data.quests.length >= pageSize);
        setPage(nextPage);
      } else {
        setError('Failed to fetch quests');
        console.error('Failed to fetch quests:', data);
        setHasMore(false);
      }
    } catch (e) {
      setError('Failed to fetch quests');
      console.error('Failed to fetch quests:', e);
      setHasMore(false);
    } finally {
      if (isLoadMore) {
        setIsLoadingMore(false);
      } else {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (!user?.id) return;
    // Reset to first page on mount or when user changes
    setPage(1);
    setHasMore(true);
    fetchQuests(1, false);
  }, [user, t]);

  const filteredQuests = quests.filter(quest => {
    const matchesFilter = filter === 'all' || quest.status === filter;
    const hay = `${quest.quest.title} ${quest.quest.target_crop}`.toLowerCase();
    const matchesSearch = hay.includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const startQuest = async (questId: number) => {
    if (!user?.id) return;
    try {
      const res = await fetch(`${API_BASE}/api/quests/start/${user.id}/${questId}/`, {
        method: 'POST'
      });
      const data = await res.json();
      if (res.ok && data?.status === 'success') {
        setQuests(prev => prev.map(q => q.id === questId ? { ...q, status: 'in_progress' as const, progress: 0 } : q));
      } else {
        console.error('Start quest failed', data);
      }
    } catch (e) {
      console.error('Start quest error', e);
    }
  };

  const getDifficultyStars = (level: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < level ? 'text-primary fill-primary' : 'text-muted-foreground'}`} 
      />
    ));
  };

  const getStatusBadge = (status: Quest['status']) => {
    const variants = {
      available: { variant: 'secondary' as const, text: t('quests.status.available'), icon: Target },
      in_progress: { variant: 'default' as const, text: t('quests.status.in_progress'), icon: Clock },
      completed: { variant: 'outline' as const, text: t('quests.status.completed'), icon: CheckCircle }
    };
    
    const { variant, text, icon: Icon } = variants[status];
    
    return (
      <Badge variant={variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {text}
      </Badge>
    );
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text={t('quests.loading')} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-sky-50">
      {/* Header */}
      <div className="bg-card/80 backdrop-blur-md border-b border-border/50 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/dashboard')}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                {t('quests.header.back_to_dashboard')}
              </Button>
              <div className="h-6 w-px bg-border" />
              <div>
                <h1 className="text-2xl font-bold font-heading">{t('quests.header.title')}</h1>
                <p className="text-sm text-muted-foreground">{t('quests.header.subtitle')}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-primary/10 px-3 py-2 rounded-lg">
              <Trophy className="h-4 w-4 text-primary" />
              <span className="font-semibold text-primary">
                {t('quests.header.points', { points: user?.total_points || 0 })}
              </span>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 space-y-6">
        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={t('quests.filters.search_placeholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder={t('quests.filters.filter_by_status')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('quests.filters.all_quests')}</SelectItem>
              <SelectItem value="available">{t('quests.status.available')}</SelectItem>
              <SelectItem value="in_progress">{t('quests.status.in_progress')}</SelectItem>
              <SelectItem value="completed">{t('quests.status.completed')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Quest Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuests.map((quest) => (
            <Card key={quest.id} className="card-agricultural hover-scale">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2">
                      {quest.quest.title}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex">{getDifficultyStars(quest.quest.difficulty_level)}</div>
                      <span className="text-xs text-muted-foreground">
                        {t('quests.card.level', { level: quest.quest.difficulty_level })}
                      </span>
                    </div>
                  </div>
                  {getStatusBadge(quest.status)}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <CardDescription className="line-clamp-3">
                  {quest.quest.description}
                </CardDescription>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Wheat className="h-4 w-4 text-primary" />
                      <span>{quest.quest.target_crop}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{t('quests.card.duration_days', { days: quest.quest.duration_days })}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-primary font-semibold">
                      <Award className="h-4 w-4" />
                      <span>{t('quests.card.reward_points', { points: quest.quest.reward_points })}</span>
                    </div>
                  </div>

                  {quest.status === 'available' && (
                    <Button 
                      variant="agricultural" 
                      size="sm" 
                      className="w-full gap-2"
                      onClick={() => navigate(`/quests/${quest.id}`)}
                    >
                      <Play className="h-4 w-4" />
                      {t('quests.actions.start_quest')}
                    </Button>
                  )}

                  {quest.status === 'in_progress' && (
                    <Button variant="outline" size="sm" className="w-full gap-2" onClick={() => navigate(`/quests/${quest.id}`)}>
                      <TrendingUp className="h-4 w-4" />
                      {t('quests.actions.view_progress')}
                    </Button>
                  )}

                  {quest.status === 'completed' && (
                    <Button variant="secondary" size="sm" className="w-full gap-2" disabled>
                      <CheckCircle className="h-4 w-4" />
                      {t('quests.status.completed')}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More / Pagination */}
        {hasMore && filteredQuests.length > 0 && (
          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={() => fetchQuests(page + 1, true)}
              disabled={isLoadingMore}
              className="min-w-[160px]"
            >
              {isLoadingMore ? t('quests.loading') : 'Load more'}
            </Button>
          </div>
        )}

        {filteredQuests.length === 0 && (
          <div className="text-center py-12">
            <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">{t('quests.empty.title')}</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || filter !== 'all' 
                ? t('quests.empty.adjust_filters')
                : t('quests.empty.check_back')}
            </p>
            {(searchTerm || filter !== 'all') && (
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('');
                  setFilter('all');
                }}
              >
                {t('quests.empty.clear_filters')}
              </Button>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Quests;
