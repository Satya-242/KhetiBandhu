import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
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
  };
  status: 'available' | 'in_progress' | 'completed';
  progress?: number;
  deadline?: string;
}

const Quests: React.FC = () => {
  const { isAuthenticated, user, isLoading: authLoading } = useAuth();
  const [quests, setQuests] = useState<Quest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  if (!authLoading && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    const fetchQuests = async () => {
      if (!user?.id) return;

      try {
        // Mock data - replace with actual API call
        const mockQuests: Quest[] = [
          {
            id: 1,
            quest: {
              title: "Water Usage Optimization",
              description: "Implement smart irrigation techniques to reduce water consumption by 20%",
              reward_points: 150,
              difficulty_level: 2,
              target_crop: "Rice",
              duration_days: 14
            },
            status: 'available'
          },
          {
            id: 2,
            quest: {
              title: "Organic Fertilizer Adoption",
              description: "Switch to organic fertilizers and document the impact on soil health",
              reward_points: 200,
              difficulty_level: 3,
              target_crop: "Wheat",
              duration_days: 21
            },
            status: 'in_progress',
            progress: 65,
            deadline: '2024-10-15'
          },
          {
            id: 3,
            quest: {
              title: "Crop Rotation Planning",
              description: "Design and implement a 4-season crop rotation plan",
              reward_points: 300,
              difficulty_level: 4,
              target_crop: "Mixed",
              duration_days: 30
            },
            status: 'available'
          },
          {
            id: 4,
            quest: {
              title: "Pest Management Survey",
              description: "Complete detailed pest monitoring and submit weekly reports",
              reward_points: 100,
              difficulty_level: 1,
              target_crop: "Cotton",
              duration_days: 7
            },
            status: 'completed'
          },
          {
            id: 5,
            quest: {
              title: "Sustainable Harvesting",
              description: "Implement eco-friendly harvesting methods and measure efficiency",
              reward_points: 250,
              difficulty_level: 3,
              target_crop: "Sugarcane",
              duration_days: 10
            },
            status: 'available'
          }
        ];

        setTimeout(() => {
          setQuests(mockQuests);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Failed to fetch quests:', error);
        setIsLoading(false);
      }
    };

    fetchQuests();
  }, [user]);

  const filteredQuests = quests.filter(quest => {
    const matchesFilter = filter === 'all' || quest.status === filter;
    const matchesSearch = quest.quest.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quest.quest.target_crop.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const startQuest = async (questId: number) => {
    // Mock API call
    setQuests(prev => prev.map(quest => 
      quest.id === questId 
        ? { ...quest, status: 'in_progress' as const, progress: 0 }
        : quest
    ));
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
      available: { variant: 'secondary' as const, text: 'Available', icon: Target },
      in_progress: { variant: 'default' as const, text: 'In Progress', icon: Clock },
      completed: { variant: 'outline' as const, text: 'Completed', icon: CheckCircle }
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
        <LoadingSpinner size="lg" text="Loading quests..." />
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
                <h1 className="text-2xl font-bold font-heading">Farming Quests</h1>
                <p className="text-sm text-muted-foreground">Complete challenges and earn rewards</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-primary/10 px-3 py-2 rounded-lg">
              <Trophy className="h-4 w-4 text-primary" />
              <span className="font-semibold text-primary">{user?.total_points || 0} Points</span>
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
                placeholder="Search quests by title or crop..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Quests</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
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
                        Level {quest.quest.difficulty_level}
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
                      <span>{quest.quest.duration_days} days</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-primary font-semibold">
                      <Award className="h-4 w-4" />
                      <span>{quest.quest.reward_points} points</span>
                    </div>
                  </div>

                  {quest.status === 'in_progress' && quest.progress !== undefined && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{quest.progress}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary rounded-full h-2 transition-all duration-300"
                          style={{ width: `${quest.progress}%` }}
                        />
                      </div>
                      {quest.deadline && (
                        <p className="text-xs text-muted-foreground">
                          Deadline: {new Date(quest.deadline).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  )}

                  {quest.status === 'available' && (
                    <Button 
                      variant="agricultural" 
                      size="sm" 
                      className="w-full gap-2"
                      onClick={() => startQuest(quest.id)}
                    >
                      <Play className="h-4 w-4" />
                      Start Quest
                    </Button>
                  )}

                  {quest.status === 'in_progress' && (
                    <Button variant="outline" size="sm" className="w-full gap-2">
                      <TrendingUp className="h-4 w-4" />
                      View Progress
                    </Button>
                  )}

                  {quest.status === 'completed' && (
                    <Button variant="secondary" size="sm" className="w-full gap-2" disabled>
                      <CheckCircle className="h-4 w-4" />
                      Completed
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredQuests.length === 0 && (
          <div className="text-center py-12">
            <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No quests found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || filter !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Check back soon for new farming challenges!'}
            </p>
            {(searchTerm || filter !== 'all') && (
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('');
                  setFilter('all');
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Quests;