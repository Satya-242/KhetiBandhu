import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import DashboardHeader from '@/components/Dashboard/DashboardHeader';
import StatCard from '@/components/Dashboard/StatCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import LoadingSpinner from '@/components/LoadingSpinner';
import { 
  Target, TrendingUp, Trophy, Cloud, Plus, Eye, Gift, 
  Activity, Calendar, ArrowRight, Sprout, BarChart3, Users,
  Thermometer, Droplets, Wind, Sun
} from 'lucide-react';

interface DashboardData {
  quests: {
    active: number;
    completed: number;
    available: number;
  };
  predictions: {
    latest: string;
    confidence: number;
  };
  leaderboard: {
    rank: number;
    total_farmers: number;
  };
  weather: {
    temperature: number;
    humidity: number;
    condition: string;
  };
  recentActivity: Array<{
    id: string;
    type: string;
    description: string;
    timestamp: string;
  }>;
}

const Dashboard: React.FC = () => {
  const { isAuthenticated, user, isLoading: authLoading } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.id) return;

      try {
        // Simulated API calls - replace with actual API integration
        const mockData: DashboardData = {
          quests: {
            active: 2,
            completed: 8,
            available: 5,
          },
          predictions: {
            latest: '+15% yield increase expected',
            confidence: 85,
          },
          leaderboard: {
            rank: 12,
            total_farmers: 156,
          },
          weather: {
            temperature: 28,
            humidity: 65,
            condition: 'Partly Cloudy',
          },
          recentActivity: [
            {
              id: '1',
              type: 'quest_completed',
              description: 'Completed "Water Management Optimization"',
              timestamp: '2 hours ago',
            },
            {
              id: '2',
              type: 'prediction_received',
              description: 'New Rice yield prediction available',
              timestamp: '5 hours ago',
            },
            {
              id: '3',
              type: 'badge_earned',
              description: 'Earned "Efficiency Expert" badge',
              timestamp: '1 day ago',
            },
          ],
        };

        // Simulate API delay
        setTimeout(() => {
          setDashboardData(mockData);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  // Redirect if not authenticated (after all hooks are called)
  if (!authLoading && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Show loading while auth is initializing or dashboard data is loading
  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading your dashboard..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-sky-50">
      <DashboardHeader />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Points"
            value={user?.total_points || 0}
            subtitle="Keep growing!"
            icon={Trophy}
            variant="primary"
          />
          <StatCard
            title="Active Quests"
            value={dashboardData?.quests.active || 0}
            subtitle={`${dashboardData?.quests.available || 0} available`}
            icon={Target}
          />
          <StatCard
            title="Leaderboard Rank"
            value={`#${dashboardData?.leaderboard.rank || 0}`}
            subtitle={`of ${dashboardData?.leaderboard.total_farmers || 0} farmers`}
            icon={Users}
          />
          <StatCard
            title="Prediction Confidence"
            value={`${dashboardData?.predictions.confidence || 0}%`}
            subtitle="Latest crop prediction"
            icon={BarChart3}
            variant="accent"
          />
        </div>

        {/* Main Action Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* My Quests Card */}
          <Card className="card-dashboard">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                My Quests
              </CardTitle>
              <CardDescription>
                Track your farming missions and earn rewards
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Active Quests</span>
                  <span className="font-semibold text-primary">{dashboardData?.quests.active}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Completed</span>
                  <span className="font-semibold text-emerald-600">{dashboardData?.quests.completed}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Available</span>
                  <span className="font-semibold text-accent">{dashboardData?.quests.available}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="agricultural" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => navigate('/quests')}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View All
                </Button>
                <Button variant="secondary" size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Predictions Card */}
          <Card className="card-dashboard">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Crop Predictions
              </CardTitle>
              <CardDescription>
                AI-powered yield and sustainability insights
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <p className="text-sm font-medium text-primary">Latest Prediction</p>
                  <p className="font-semibold">{dashboardData?.predictions.latest}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Confidence</span>
                      <span>{dashboardData?.predictions.confidence}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary rounded-full h-2 transition-all duration-300"
                        style={{ width: `${dashboardData?.predictions.confidence}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => navigate('/predictions')}
              >
                View Detailed Predictions
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* Weather Card */}
          <Card className="card-dashboard">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Cloud className="h-5 w-5 text-primary" />
                Today's Weather
              </CardTitle>
              <CardDescription>
                {user?.village || 'Your location'} weather conditions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Sun className="h-8 w-8 text-orange-500" />
                  <span className="text-3xl font-bold">{dashboardData?.weather.temperature}°C</span>
                </div>
                <p className="text-sm text-muted-foreground">{dashboardData?.weather.condition}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Droplets className="h-4 w-4 text-sky-500" />
                  <span>Humidity: {dashboardData?.weather.humidity}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <Wind className="h-4 w-4 text-gray-500" />
                  <span>Wind: Light</span>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                7-Day Forecast
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <Card className="card-dashboard lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sprout className="h-5 w-5 text-primary" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="hero" 
                size="sm" 
                className="w-full justify-start"
                onClick={() => navigate('/quests')}
              >
                <Plus className="h-4 w-4 mr-2" />
                Start New Quest
              </Button>
              <Button 
                variant="secondary" 
                size="sm" 
                className="w-full justify-start"
                onClick={() => navigate('/predictions')}
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                View Predictions
              </Button>
              <Button 
                variant="secondary" 
                size="sm" 
                className="w-full justify-start"
                onClick={() => navigate('/rewards')}
              >
                <Gift className="h-4 w-4 mr-2" />
                Check Rewards
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start"
                onClick={() => navigate('/leaderboard')}
              >
                <Trophy className="h-4 w-4 mr-2" />
                View Leaderboard
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="card-dashboard lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Recent Activity
              </CardTitle>
              <CardDescription>Your latest farming achievements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData?.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      {activity.type === 'quest_completed' && <Target className="h-4 w-4 text-primary" />}
                      {activity.type === 'prediction_received' && <TrendingUp className="h-4 w-4 text-primary" />}
                      {activity.type === 'badge_earned' && <Trophy className="h-4 w-4 text-primary" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.description}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {activity.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;