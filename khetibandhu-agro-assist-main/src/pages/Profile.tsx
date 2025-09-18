import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import LoadingSpinner from '@/components/LoadingSpinner';
import { 
  User, MapPin, Phone, Mail, Edit, Save, X, 
  Trophy, Target, Award, Calendar, TrendingUp,
  Leaf, Star, ArrowLeft, Settings
} from 'lucide-react';

interface ProfileStats {
  total_points: number;
  level: number;
  badges_earned: number;
  quests_completed: number;
  days_active: number;
  achievements: Array<{
    id: string;
    name: string;
    description: string;
    earned_date: string;
    category: string;
  }>;
  activity_summary: {
    this_week: number;
    this_month: number;
    streak_days: number;
    best_streak: number;
  };
}

const Profile: React.FC = () => {
  const { isAuthenticated, user, updateUser, isLoading: authLoading } = useAuth();
  const [profileStats, setProfileStats] = useState<ProfileStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    village: '',
    crops: ''
  });
  const navigate = useNavigate();

  if (!authLoading && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user?.id) return;

      try {
        // Initialize edit form with user data
        setEditForm({
          name: user.name || '',
          email: user.email || '',
          phone: user.phone || '',
          village: user.village || '',
          crops: user.crops?.join(', ') || ''
        });

        // Mock profile stats - replace with actual API call
        const mockStats: ProfileStats = {
          total_points: user.total_points || 2850,
          level: user.level || 6,
          badges_earned: 8,
          quests_completed: 24,
          days_active: 45,
          achievements: [
            {
              id: '1',
              name: 'First Quest',
              description: 'Completed your first farming quest',
              earned_date: '2024-09-10T10:30:00Z',
              category: 'achiever'
            },
            {
              id: '2',
              name: 'Water Wizard',
              description: 'Mastered water management techniques',
              earned_date: '2024-09-12T14:20:00Z',
              category: 'expert'
            },
            {
              id: '3',
              name: 'Sustainability Champion',
              description: 'Achieved high sustainability scores',
              earned_date: '2024-09-14T09:15:00Z',
              category: 'expert'
            }
          ],
          activity_summary: {
            this_week: 5,
            this_month: 18,
            streak_days: 12,
            best_streak: 28
          }
        };

        setTimeout(() => {
          setProfileStats(mockStats);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Failed to fetch profile data:', error);
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [user]);

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing - reset form
      setEditForm({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        village: user?.village || '',
        crops: user?.crops?.join(', ') || ''
      });
    }
    setIsEditing(!isEditing);
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    try {
      // Mock save - replace with actual API call
      const updatedUser = {
        ...user,
        name: editForm.name,
        email: editForm.email,
        phone: editForm.phone,
        village: editForm.village,
        crops: editForm.crops.split(',').map(crop => crop.trim()).filter(Boolean)
      };

      updateUser(updatedUser);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getLevelProgress = (level: number) => {
    const currentLevelPoints = (level - 1) * 500;
    const nextLevelPoints = level * 500;
    const userPoints = profileStats?.total_points || 0;
    const progress = ((userPoints - currentLevelPoints) / (nextLevelPoints - currentLevelPoints)) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading profile..." />
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
                <h1 className="text-2xl font-bold font-heading">Farmer Profile</h1>
                <p className="text-sm text-muted-foreground">Manage your account and view achievements</p>
              </div>
            </div>
            <Button 
              variant={isEditing ? "outline" : "secondary"} 
              size="sm" 
              onClick={handleEditToggle}
              className="gap-2"
            >
              {isEditing ? (
                <>
                  <X className="h-4 w-4" />
                  Cancel
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4" />
                  Edit Profile
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info Card */}
            <Card className="card-agricultural">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20 border-4 border-primary/20">
                    <AvatarFallback className="bg-primary text-white text-2xl font-bold">
                      {user && getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-2xl">{user?.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="gap-1">
                        <Star className="h-3 w-3" />
                        Level {profileStats?.level}
                      </Badge>
                      <Badge variant="secondary">
                        {user?.pm_kisan_id}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={editForm.email}
                          onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                          placeholder="Enter your email"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={editForm.phone}
                          onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                          placeholder="Enter your phone number"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="village">Village</Label>
                        <Input
                          id="village"
                          value={editForm.village}
                          onChange={(e) => setEditForm({ ...editForm, village: e.target.value })}
                          placeholder="Enter your village"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="crops">Crops (comma-separated)</Label>
                      <Textarea
                        id="crops"
                        value={editForm.crops}
                        onChange={(e) => setEditForm({ ...editForm, crops: e.target.value })}
                        placeholder="e.g., Rice, Wheat, Cotton"
                        rows={3}
                      />
                    </div>
                    <Button onClick={handleSaveProfile} className="gap-2">
                      <Save className="h-4 w-4" />
                      Save Changes
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Email</p>
                          <p className="font-medium">{user?.email || 'Not provided'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Phone</p>
                          <p className="font-medium">{user?.phone || 'Not provided'}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Village</p>
                          <p className="font-medium">{user?.village || 'Not provided'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Leaf className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Crops</p>
                          <p className="font-medium">
                            {user?.crops?.join(', ') || 'Not specified'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Achievements */}
            <Card className="card-agricultural">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-6 w-6 text-primary" />
                  Recent Achievements
                </CardTitle>
                <CardDescription>Your latest badges and accomplishments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {profileStats?.achievements.map((achievement) => (
                    <div key={achievement.id} className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                      <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <Award className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{achievement.name}</h4>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(achievement.earned_date).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant="outline" className="capitalize">
                        {achievement.category}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-6">
            {/* Level Progress */}
            <Card className="card-dashboard border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-primary" />
                  Level Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary">Level {profileStats?.level}</p>
                  <p className="text-sm text-muted-foreground">
                    {profileStats?.total_points} total points
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress to Level {(profileStats?.level || 0) + 1}</span>
                    <span>{getLevelProgress(profileStats?.level || 0).toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div 
                      className="bg-primary rounded-full h-3 transition-all duration-300"
                      style={{ width: `${getLevelProgress(profileStats?.level || 0)}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="card-dashboard">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-primary" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">{profileStats?.badges_earned}</p>
                    <p className="text-xs text-muted-foreground">Badges Earned</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{profileStats?.quests_completed}</p>
                    <p className="text-xs text-muted-foreground">Quests Done</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{profileStats?.days_active}</p>
                    <p className="text-xs text-muted-foreground">Days Active</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-emerald-600">{profileStats?.activity_summary.streak_days}</p>
                    <p className="text-xs text-muted-foreground">Current Streak</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Activity Summary */}
            <Card className="card-dashboard">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Activity Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">This Week</span>
                    <span className="font-semibold">{profileStats?.activity_summary.this_week} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">This Month</span>
                    <span className="font-semibold">{profileStats?.activity_summary.this_month} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Best Streak</span>
                    <span className="font-semibold text-primary">{profileStats?.activity_summary.best_streak} days</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Account Settings */}
            <Card className="card-dashboard">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" />
                  Account
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <User className="h-4 w-4 mr-2" />
                    Privacy
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;