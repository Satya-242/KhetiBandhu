import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoadingSpinner from '@/components/LoadingSpinner';
import { 
  Award, Trophy, Star, Target, Leaf, Droplets, 
  TrendingUp, Users, Clock, Zap, Shield, Crown,
  ArrowLeft, Lock, CheckCircle, Calendar
} from 'lucide-react';

interface BadgeData {
  id: string;
  name: string;
  description: string;
  category: 'achiever' | 'expert' | 'pioneer' | 'helper' | 'learner';
  icon: string;
  earned: boolean;
  earned_date?: string;
  requirements: {
    description: string;
    progress: number;
    target: number;
  };
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points_reward: number;
}

interface BadgeStats {
  total_badges: number;
  earned_badges: number;
  points_from_badges: number;
  completion_rate: number;
  latest_badge?: {
    name: string;
    earned_date: string;
  };
}

const Badges: React.FC = () => {
  const { isAuthenticated, user, isLoading: authLoading } = useAuth();
  const { t } = useTranslation();
  const [badges, setBadges] = useState<BadgeData[]>([]);
  const [stats, setStats] = useState<BadgeStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const navigate = useNavigate();

  if (!authLoading && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    const fetchBadges = async () => {
      if (!user?.id) return;

      try {
        const mockBadges: BadgeData[] = [
          {
            id: '1',
            name: t('badges.items.first_quest.name'),
            description: t('badges.items.first_quest.description'),
            category: 'achiever',
            icon: 'target',
            earned: true,
            earned_date: '2024-09-10T10:30:00Z',
            requirements: {
              description: t('badges.items.first_quest.req'),
              progress: 1,
              target: 1
            },
            rarity: 'common',
            points_reward: 50
          },
          {
            id: '2',
            name: t('badges.items.quest_master.name'),
            description: t('badges.items.quest_master.description'),
            category: 'achiever',
            icon: 'trophy',
            earned: true,
            earned_date: '2024-09-12T14:20:00Z',
            requirements: {
              description: t('badges.items.quest_master.req'),
              progress: 10,
              target: 10
            },
            rarity: 'rare',
            points_reward: 200
          },
          {
            id: '3',
            name: t('badges.items.water_wizard.name'),
            description: t('badges.items.water_wizard.description'),
            category: 'expert',
            icon: 'droplets',
            earned: false,
            requirements: {
              description: t('badges.items.water_wizard.req'),
              progress: 3,
              target: 5
            },
            rarity: 'epic',
            points_reward: 300
          },
          {
            id: '4',
            name: t('badges.items.sustainability_champion.name'),
            description: t('badges.items.sustainability_champion.description'),
            category: 'expert',
            icon: 'leaf',
            earned: true,
            earned_date: '2024-09-14T09:15:00Z',
            requirements: {
              description: t('badges.items.sustainability_champion.req'),
              progress: 30,
              target: 30
            },
            rarity: 'epic',
            points_reward: 400
          },
          {
            id: '5',
            name: t('badges.items.innovation_pioneer.name'),
            description: t('badges.items.innovation_pioneer.description'),
            category: 'pioneer',
            icon: 'zap',
            earned: false,
            requirements: {
              description: t('badges.items.innovation_pioneer.req'),
              progress: 1,
              target: 3
            },
            rarity: 'legendary',
            points_reward: 500
          },
          {
            id: '6',
            name: t('badges.items.community_helper.name'),
            description: t('badges.items.community_helper.description'),
            category: 'helper',
            icon: 'users',
            earned: false,
            requirements: {
              description: t('badges.items.community_helper.req'),
              progress: 4,
              target: 10
            },
            rarity: 'rare',
            points_reward: 250
          },
          {
            id: '7',
            name: t('badges.items.knowledge_seeker.name'),
            description: t('badges.items.knowledge_seeker.description'),
            category: 'learner',
            icon: 'star',
            earned: false,
            requirements: {
              description: t('badges.items.knowledge_seeker.req'),
              progress: 5,
              target: 8
            },
            rarity: 'rare',
            points_reward: 200
          },
          {
            id: '8',
            name: t('badges.items.streak_warrior.name'),
            description: t('badges.items.streak_warrior.description'),
            category: 'achiever',
            icon: 'clock',
            earned: false,
            requirements: {
              description: t('badges.items.streak_warrior.req'),
              progress: 18,
              target: 30
            },
            rarity: 'epic',
            points_reward: 350
          },
          {
            id: '9',
            name: t('badges.items.legendary_farmer.name'),
            description: t('badges.items.legendary_farmer.description'),
            category: 'expert',
            icon: 'crown',
            earned: false,
            requirements: {
              description: t('badges.items.legendary_farmer.req'),
              progress: 2850,
              target: 5000
            },
            rarity: 'legendary',
            points_reward: 1000
          }
        ];

        const mockStats: BadgeStats = {
          total_badges: 9,
          earned_badges: 3,
          points_from_badges: 650,
          completion_rate: 33.3,
          latest_badge: {
            name: t('badges.items.sustainability_champion.name'),
            earned_date: '2024-09-14T09:15:00Z'
          }
        };

        setTimeout(() => {
          setBadges(mockBadges);
          setStats(mockStats);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Failed to fetch badges:', error);
        setIsLoading(false);
      }
    };

    fetchBadges();
  }, [user, t]);

  const getIconComponent = (iconName: string) => {
    const icons: { [key: string]: React.ComponentType<{ className?: string }> } = {
      target: Target,
      trophy: Trophy,
      droplets: Droplets,
      leaf: Leaf,
      zap: Zap,
      users: Users,
      star: Star,
      clock: Clock,
      crown: Crown,
      shield: Shield
    };
    return icons[iconName] || Award;
  };

  const getRarityColor = (rarity: BadgeData['rarity']) => {
    switch (rarity) {
      case 'common': return 'border-gray-300 bg-gray-50';
      case 'rare': return 'border-blue-300 bg-blue-50';
      case 'epic': return 'border-purple-300 bg-purple-50';
      case 'legendary': return 'border-yellow-300 bg-yellow-50';
    }
  };

  const getRarityBadge = (rarity: BadgeData['rarity']) => {
    const variants = {
      common: { variant: 'secondary' as const, text: t('badges.rarity.common') },
      rare: { variant: 'default' as const, text: t('badges.rarity.rare') },
      epic: { variant: 'outline' as const, text: t('badges.rarity.epic') },
      legendary: { variant: 'destructive' as const, text: t('badges.rarity.legendary') }
    };
    return variants[rarity];
  };

  const filteredBadges = badges.filter(badge => 
    activeCategory === 'all' || badge.category === activeCategory
  );

  const earnedBadges = filteredBadges.filter(badge => badge.earned);
  const unearnedBadges = filteredBadges.filter(badge => !badge.earned);

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text={t('badges.loading')} />
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
                {t('badges.header.back_to_dashboard')}
              </Button>
              <div className="h-6 w-px bg-border" />
              <div>
                <h1 className="text-2xl font-bold font-heading">{t('badges.header.title')}</h1>
                <p className="text-sm text-muted-foreground">{t('badges.header.subtitle')}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-primary/10 px-3 py-2 rounded-lg">
              <Award className="h-4 w-4 text-primary" />
              <span className="font-semibold text-primary">
                {t('badges.header.earned_count', { earned: stats?.earned_badges || 0, total: stats?.total_badges || 0 })}
              </span>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="card-dashboard">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">{t('badges.stats.total_badges')}</span>
              </div>
              <p className="text-3xl font-bold">{stats?.total_badges}</p>
            </CardContent>
          </Card>
          
          <Card className="card-dashboard">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
                <span className="text-sm font-medium text-muted-foreground">{t('badges.stats.earned')}</span>
              </div>
              <p className="text-3xl font-bold text-emerald-600">{stats?.earned_badges}</p>
            </CardContent>
          </Card>
          
          <Card className="card-dashboard">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <Star className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">{t('badges.stats.points')}</span>
              </div>
              <p className="text-3xl font-bold text-primary">{stats?.points_from_badges}</p>
            </CardContent>
          </Card>
          
          <Card className="card-dashboard">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">{t('badges.stats.completion')}</span>
              </div>
              <p className="text-3xl font-bold">{stats?.completion_rate.toFixed(1)}%</p>
            </CardContent>
          </Card>
        </div>

        {/* Latest Badge */}
        {stats?.latest_badge && (
          <Card className="card-agricultural border-primary/20 bg-primary/5">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{t('badges.latest.title')}</h3>
                  <p className="text-muted-foreground">
                    {t('badges.latest.subtitle', { name: stats.latest_badge.name })}
                  </p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(stats.latest_badge.earned_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Badge Categories */}
        <Tabs value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="all">{t('badges.categories.all')}</TabsTrigger>
            <TabsTrigger value="achiever">{t('badges.categories.achiever')}</TabsTrigger>
            <TabsTrigger value="expert">{t('badges.categories.expert')}</TabsTrigger>
            <TabsTrigger value="pioneer">{t('badges.categories.pioneer')}</TabsTrigger>
            <TabsTrigger value="helper">{t('badges.categories.helper')}</TabsTrigger>
            <TabsTrigger value="learner">{t('badges.categories.learner')}</TabsTrigger>
          </TabsList>

          <TabsContent value={activeCategory} className="space-y-6">
            {/* Earned Badges */}
            {earnedBadges.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold font-heading text-emerald-600">🏆 {t('badges.sections.earned')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {earnedBadges.map((badge) => {
                    const IconComponent = getIconComponent(badge.icon);
                    const rarityBadge = getRarityBadge(badge.rarity);
                    
                    return (
                      <Card key={badge.id} className={`card-agricultural ${getRarityColor(badge.rarity)} relative overflow-hidden`}>
                        <div className="absolute top-2 right-2">
                          <CheckCircle className="h-6 w-6 text-emerald-600" />
                        </div>
                        
                        <CardHeader className="pb-3">
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                              <IconComponent className="h-6 w-6 text-primary" />
                            </div>
                            <div className="flex-1">
                              <CardTitle className="text-lg">{badge.name}</CardTitle>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant={rarityBadge.variant} className="text-xs">
                                  {rarityBadge.text}
                                </Badge>
                                <span className="text-xs text-primary font-semibold">
                                  {t('badges.points_short', { points: badge.points_reward })}
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        
                        <CardContent className="space-y-3">
                          <CardDescription>{badge.description}</CardDescription>
                          
                          {badge.earned_date && (
                            <div className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {t('badges.earned_on', { date: new Date(badge.earned_date).toLocaleDateString() })}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Progress Badges */}
            {unearnedBadges.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold font-heading text-muted-foreground">🎯 {t('badges.sections.in_progress')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {unearnedBadges.map((badge) => {
                    const IconComponent = getIconComponent(badge.icon);
                    const rarityBadge = getRarityBadge(badge.rarity);
                    const progress = (badge.requirements.progress / badge.requirements.target) * 100;
                    
                    return (
                      <Card key={badge.id} className={`card-agricultural ${getRarityColor(badge.rarity)} opacity-75 relative overflow-hidden`}>
                        <div className="absolute top-2 right-2">
                          <Lock className="h-6 w-6 text-muted-foreground" />
                        </div>
                        
                        <CardHeader className="pb-3">
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-12 bg-muted/30 rounded-lg flex items-center justify-center">
                              <IconComponent className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <div className="flex-1">
                              <CardTitle className="text-lg text-muted-foreground">{badge.name}</CardTitle>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant={rarityBadge.variant} className="text-xs opacity-75">
                                  {rarityBadge.text}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {t('badges.points_short', { points: badge.points_reward })}
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        
                        <CardContent className="space-y-3">
                          <CardDescription className="text-muted-foreground">{badge.description}</CardDescription>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">{t('badges.progress')}</span>
                              <span className="font-semibold">
                                {badge.requirements.progress}/{badge.requirements.target}
                              </span>
                            </div>
                            <Progress value={progress} className="h-2" />
                            <p className="text-xs text-muted-foreground">
                              {badge.requirements.description}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {filteredBadges.length === 0 && (
              <div className="text-center py-12">
                <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">{t('badges.empty.title')}</h3>
                <p className="text-muted-foreground">{t('badges.empty.subtitle')}</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Badges;
