import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import LoadingSpinner from '@/components/LoadingSpinner';
import { 
  Trophy, Medal, Crown, Star, ArrowLeft, Users, 
  TrendingUp, MapPin, Award, Target, Calendar
} from 'lucide-react';

interface LeaderboardEntry {
  rank: number;
  farmer: {
    id: string;
    name: string;
    village: string;
    avatar?: string;
  };
  total_points: number;
  level: number;
  badges_count: number;
  quests_completed: number;
  streak_days: number;
}

interface LeaderboardStats {
  total_farmers: number;
  user_rank: number;
  top_village: string;
  average_points: number;
}

const Leaderboard: React.FC = () => {
  const { isAuthenticated, user, isLoading: authLoading } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [stats, setStats] = useState<LeaderboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('all-time');
  const navigate = useNavigate();

  if (!authLoading && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    const fetchLeaderboard = async () => {
      if (!user?.id) return;

      try {
        // Mock data - replace with actual API call
        const mockLeaderboard: LeaderboardEntry[] = [
          {
            rank: 1,
            farmer: { id: '1', name: 'Rajesh Kumar', village: 'Kisan Nagar' },
            total_points: 2850,
            level: 8,
            badges_count: 12,
            quests_completed: 45,
            streak_days: 28
          },
          {
            rank: 2,
            farmer: { id: '2', name: 'Priya Sharma', village: 'Green Valley' },
            total_points: 2640,
            level: 7,
            badges_count: 10,
            quests_completed: 38,
            streak_days: 21
          },
          {
            rank: 3,
            farmer: { id: '3', name: 'Amit Patel', village: 'Harvest Hills' },
            total_points: 2450,
            level: 7,
            badges_count: 9,
            quests_completed: 34,
            streak_days: 15
          },
          {
            rank: 4,
            farmer: { id: '4', name: 'Sunita Devi', village: 'Kisan Nagar' },
            total_points: 2280,
            level: 6,
            badges_count: 8,
            quests_completed: 31,
            streak_days: 12
          },
          {
            rank: 5,
            farmer: { id: '5', name: 'Mohan Singh', village: 'Farm Valley' },
            total_points: 2150,
            level: 6,
            badges_count: 7,
            quests_completed: 29,
            streak_days: 18
          },
          {
            rank: 6,
            farmer: { id: '6', name: 'Kavita Reddy', village: 'Green Valley' },
            total_points: 1980,
            level: 5,
            badges_count: 6,
            quests_completed: 26,
            streak_days: 9
          },
          {
            rank: 7,
            farmer: { id: '7', name: 'Ravi Gupta', village: 'Harvest Hills' },
            total_points: 1850,
            level: 5,
            badges_count: 6,
            quests_completed: 24,
            streak_days: 14
          },
          {
            rank: 8,
            farmer: { id: '8', name: 'Anita Singh', village: 'Farm Valley' },
            total_points: 1720,
            level: 5,
            badges_count: 5,
            quests_completed: 22,
            streak_days: 7
          },
          {
            rank: 9,
            farmer: { id: '9', name: 'Deepak Kumar', village: 'Kisan Nagar' },
            total_points: 1650,
            level: 4,
            badges_count: 5,
            quests_completed: 20,
            streak_days: 11
          },
          {
            rank: 10,
            farmer: { id: '10', name: 'Meera Patel', village: 'Green Valley' },
            total_points: 1580,
            level: 4,
            badges_count: 4,
            quests_completed: 19,
            streak_days: 6
          }
        ];

        const mockStats: LeaderboardStats = {
          total_farmers: 156,
          user_rank: 12,
          top_village: 'Kisan Nagar',
          average_points: 1240
        };

        setTimeout(() => {
          setLeaderboard(mockLeaderboard);
          setStats(mockStats);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, [user, timeframe]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Medal className="h-6 w-6 text-amber-600" />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-sm font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return { variant: 'default' as const, text: '🥇 Champion' };
    if (rank <= 3) return { variant: 'secondary' as const, text: '🏆 Top 3' };
    if (rank <= 10) return { variant: 'outline' as const, text: '⭐ Top 10' };
    return { variant: 'outline' as const, text: `#${rank}` };
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading leaderboard..." />
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
                Dashboard
              </Button>
              <div className="h-6 w-px bg-border" />
              <div>
                <h1 className="text-2xl font-bold font-heading">Leaderboard</h1>
                <p className="text-sm text-muted-foreground">Top performing farmers in the community</p>
              </div>
            </div>
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-48">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">This Week</SelectItem>
                <SelectItem value="monthly">This Month</SelectItem>
                <SelectItem value="all-time">All Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="card-dashboard">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">Total Farmers</span>
              </div>
              <p className="text-3xl font-bold">{stats?.total_farmers}</p>
            </CardContent>
          </Card>
          
          <Card className="card-dashboard">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">Your Rank</span>
              </div>
              <p className="text-3xl font-bold text-primary">#{stats?.user_rank}</p>
            </CardContent>
          </Card>
          
          <Card className="card-dashboard">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">Top Village</span>
              </div>
              <p className="text-lg font-bold">{stats?.top_village}</p>
            </CardContent>
          </Card>
          
          <Card className="card-dashboard">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">Avg Points</span>
              </div>
              <p className="text-3xl font-bold">{stats?.average_points}</p>
            </CardContent>
          </Card>
        </div>

        {/* Top 3 Podium */}
        <Card className="card-agricultural">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-6 w-6 text-primary" />
              Top Champions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {leaderboard.slice(0, 3).map((entry, index) => {
                const positions = [1, 0, 2]; // Center the #1, left #2, right #3
                const heights = ['h-32', 'h-40', 'h-28'];
                const actualIndex = positions[index];
                const actualEntry = leaderboard[actualIndex];
                
                return (
                  <div key={actualEntry.farmer.id} className="text-center">
                    <div className={`${heights[actualIndex]} bg-gradient-to-t from-primary/10 to-primary/5 rounded-lg flex flex-col justify-end p-4 mb-4 relative`}>
                      <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
                        {getRankIcon(actualEntry.rank)}
                      </div>
                      <div className="space-y-2">
                        <Avatar className="h-16 w-16 mx-auto border-4 border-white shadow-lg">
                          <AvatarFallback className="bg-primary text-white font-bold text-lg">
                            {getInitials(actualEntry.farmer.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-bold text-lg">{actualEntry.farmer.name}</h3>
                          <p className="text-sm text-muted-foreground">{actualEntry.farmer.village}</p>
                          <p className="text-2xl font-bold text-primary">{actualEntry.total_points}</p>
                          <p className="text-xs text-muted-foreground">points</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Full Leaderboard */}
        <Card className="card-agricultural">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-6 w-6 text-primary" />
              Complete Rankings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {leaderboard.map((entry) => {
                const isCurrentUser = entry.farmer.id === user?.id;
                const rankBadge = getRankBadge(entry.rank);
                
                return (
                  <div 
                    key={entry.farmer.id} 
                    className={`flex items-center gap-4 p-4 rounded-lg transition-colors ${
                      isCurrentUser 
                        ? 'bg-primary/10 border-2 border-primary/20' 
                        : 'bg-muted/30 hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="flex items-center justify-center w-10">
                        {getRankIcon(entry.rank)}
                      </div>
                      
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                          {getInitials(entry.farmer.name)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{entry.farmer.name}</h3>
                          {isCurrentUser && <Badge variant="outline">You</Badge>}
                          <Badge variant={rankBadge.variant}>{rankBadge.text}</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {entry.farmer.village}
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="h-3 w-3" />
                            Level {entry.level}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right space-y-1">
                      <p className="text-2xl font-bold text-primary">{entry.total_points}</p>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Award className="h-3 w-3" />
                          {entry.badges_count}
                        </span>
                        <span className="flex items-center gap-1">
                          <Target className="h-3 w-3" />
                          {entry.quests_completed}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Your Progress */}
        {stats && (
          <Card className="card-dashboard border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-primary" />
                Your Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary">#{stats.user_rank}</p>
                  <p className="text-sm text-muted-foreground">Current Rank</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold">{user?.total_points || 0}</p>
                  <p className="text-sm text-muted-foreground">Your Points</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary">
                    {stats.average_points > (user?.total_points || 0) ? '+' : ''}
                    {(user?.total_points || 0) - stats.average_points}
                  </p>
                  <p className="text-sm text-muted-foreground">vs Average</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Leaderboard;