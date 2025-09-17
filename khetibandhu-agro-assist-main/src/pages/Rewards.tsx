import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoadingSpinner from '@/components/LoadingSpinner';
import { 
  Gift, ShoppingCart, Check, Star, Smartphone, 
  Leaf, Wrench, BookOpen, Coins, History,
  ArrowLeft, Clock, Trophy, Tag
} from 'lucide-react';

interface Reward {
  id: string;
  name: string;
  description: string;
  category: 'tools' | 'seeds' | 'education' | 'technology' | 'vouchers';
  points_cost: number;
  availability: 'available' | 'limited' | 'out_of_stock';
  stock_remaining?: number;
  image_url?: string;
  estimated_delivery: string;
  redemption_limit: number;
}

interface RedeemedReward {
  id: string;
  reward: Reward;
  redeemed_date: string;
  status: 'pending' | 'shipped' | 'delivered';
  tracking_code?: string;
}

interface RewardStats {
  total_points: number;
  points_spent: number;
  points_available: number;
  total_redeemed: number;
}

const Rewards: React.FC = () => {
  const { isAuthenticated, user, isLoading: authLoading } = useAuth();
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [redeemedRewards, setRedeemedRewards] = useState<RedeemedReward[]>([]);
  const [stats, setStats] = useState<RewardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('available');
  const navigate = useNavigate();

  if (!authLoading && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    const fetchRewards = async () => {
      if (!user?.id) return;

      try {
        // Mock data - replace with actual API calls
        const mockRewards: Reward[] = [
          {
            id: '1',
            name: 'Premium Seed Varieties Pack',
            description: 'High-yield drought-resistant seeds for wheat, rice, and maize',
            category: 'seeds',
            points_cost: 500,
            availability: 'available',
            stock_remaining: 25,
            estimated_delivery: '5-7 days',
            redemption_limit: 2
          },
          {
            id: '2',
            name: 'Smart Irrigation Kit',
            description: 'IoT-enabled drip irrigation system for efficient water management',
            category: 'technology',
            points_cost: 1200,
            availability: 'limited',
            stock_remaining: 5,
            estimated_delivery: '10-14 days',
            redemption_limit: 1
          },
          {
            id: '3',
            name: 'Organic Fertilizer Bundle',
            description: '50kg premium organic compost and bio-fertilizer mix',
            category: 'tools',
            points_cost: 300,
            availability: 'available',
            stock_remaining: 50,
            estimated_delivery: '3-5 days',
            redemption_limit: 3
          },
          {
            id: '4',
            name: 'Advanced Farming Course',
            description: 'Online certification course on sustainable farming practices',
            category: 'education',
            points_cost: 800,
            availability: 'available',
            estimated_delivery: 'Instant access',
            redemption_limit: 1
          },
          {
            id: '5',
            name: 'Soil Testing Kit',
            description: 'Professional soil analysis kit with pH and nutrient testing',
            category: 'tools',
            points_cost: 400,
            availability: 'available',
            stock_remaining: 30,
            estimated_delivery: '5-7 days',
            redemption_limit: 2
          },
          {
            id: '6',
            name: 'Agricultural Equipment Voucher',
            description: '₹2000 voucher for tractors, harvesters, and farming equipment',
            category: 'vouchers',
            points_cost: 1000,
            availability: 'limited',
            stock_remaining: 10,
            estimated_delivery: 'Instant',
            redemption_limit: 1
          },
          {
            id: '7',
            name: 'Weather Station',
            description: 'Portable weather monitoring station with app connectivity',
            category: 'technology',
            points_cost: 2000,
            availability: 'limited',
            stock_remaining: 3,
            estimated_delivery: '14-21 days',
            redemption_limit: 1
          },
          {
            id: '8',
            name: 'Pest Control Handbook',
            description: 'Comprehensive guide on organic pest management techniques',
            category: 'education',
            points_cost: 200,
            availability: 'available',
            estimated_delivery: 'Digital download',
            redemption_limit: 1
          }
        ];

        const mockRedeemedRewards: RedeemedReward[] = [
          {
            id: '1',
            reward: mockRewards[2], // Organic Fertilizer Bundle
            redeemed_date: '2024-09-10T10:30:00Z',
            status: 'delivered',
            tracking_code: 'KB123456789'
          },
          {
            id: '2',
            reward: mockRewards[7], // Pest Control Handbook
            redeemed_date: '2024-09-12T14:20:00Z',
            status: 'delivered'
          }
        ];

        const mockStats: RewardStats = {
          total_points: 2850,
          points_spent: 500,
          points_available: 2350,
          total_redeemed: 2
        };

        setTimeout(() => {
          setRewards(mockRewards);
          setRedeemedRewards(mockRedeemedRewards);
          setStats(mockStats);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Failed to fetch rewards:', error);
        setIsLoading(false);
      }
    };

    fetchRewards();
  }, [user]);

  const getCategoryIcon = (category: Reward['category']) => {
    const icons = {
      tools: Wrench,
      seeds: Leaf,
      education: BookOpen,
      technology: Smartphone,
      vouchers: Tag
    };
    return icons[category] || Gift;
  };

  const getCategoryColor = (category: Reward['category']) => {
    const colors = {
      tools: 'text-orange-600 bg-orange-50',
      seeds: 'text-emerald-600 bg-emerald-50',
      education: 'text-blue-600 bg-blue-50',
      technology: 'text-purple-600 bg-purple-50',
      vouchers: 'text-pink-600 bg-pink-50'
    };
    return colors[category] || 'text-gray-600 bg-gray-50';
  };

  const getAvailabilityBadge = (availability: Reward['availability']) => {
    const variants = {
      available: { variant: 'default' as const, text: 'Available' },
      limited: { variant: 'secondary' as const, text: 'Limited Stock' },
      out_of_stock: { variant: 'destructive' as const, text: 'Out of Stock' }
    };
    return variants[availability];
  };

  const getStatusBadge = (status: RedeemedReward['status']) => {
    const variants = {
      pending: { variant: 'secondary' as const, text: 'Processing', icon: Clock },
      shipped: { variant: 'default' as const, text: 'Shipped', icon: ShoppingCart },
      delivered: { variant: 'outline' as const, text: 'Delivered', icon: Check }
    };
    return variants[status];
  };

  const canAfford = (pointsCost: number) => {
    return (stats?.points_available || 0) >= pointsCost;
  };

  const redeemReward = async (rewardId: string) => {
    const reward = rewards.find(r => r.id === rewardId);
    if (!reward || !canAfford(reward.points_cost)) return;

    // Mock redemption - replace with actual API call
    const newRedemption: RedeemedReward = {
      id: Date.now().toString(),
      reward,
      redeemed_date: new Date().toISOString(),
      status: 'pending'
    };

    setRedeemedRewards(prev => [newRedemption, ...prev]);
    setStats(prev => prev ? {
      ...prev,
      points_spent: prev.points_spent + reward.points_cost,
      points_available: prev.points_available - reward.points_cost,
      total_redeemed: prev.total_redeemed + 1
    } : null);
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading rewards..." />
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
                <h1 className="text-2xl font-bold font-heading">Reward Store</h1>
                <p className="text-sm text-muted-foreground">Redeem your points for valuable farming resources</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-primary/10 px-3 py-2 rounded-lg">
              <Coins className="h-4 w-4 text-primary" />
              <span className="font-semibold text-primary">{stats?.points_available} Points</span>
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
                <span className="text-sm font-medium text-muted-foreground">Total Points</span>
              </div>
              <p className="text-3xl font-bold">{stats?.total_points}</p>
            </CardContent>
          </Card>
          
          <Card className="card-dashboard">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <Coins className="h-5 w-5 text-emerald-600" />
                <span className="text-sm font-medium text-muted-foreground">Available</span>
              </div>
              <p className="text-3xl font-bold text-emerald-600">{stats?.points_available}</p>
            </CardContent>
          </Card>
          
          <Card className="card-dashboard">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <ShoppingCart className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">Points Spent</span>
              </div>
              <p className="text-3xl font-bold">{stats?.points_spent}</p>
            </CardContent>
          </Card>
          
          <Card className="card-dashboard">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <Gift className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">Items Redeemed</span>
              </div>
              <p className="text-3xl font-bold">{stats?.total_redeemed}</p>
            </CardContent>
          </Card>
        </div>

        {/* Rewards Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="available">Available Rewards</TabsTrigger>
            <TabsTrigger value="history">Redemption History</TabsTrigger>
          </TabsList>

          <TabsContent value="available" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rewards.map((reward) => {
                const CategoryIcon = getCategoryIcon(reward.category);
                const availabilityBadge = getAvailabilityBadge(reward.availability);
                const affordable = canAfford(reward.points_cost);
                
                return (
                  <Card key={reward.id} className="card-agricultural hover-scale">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${getCategoryColor(reward.category)}`}>
                            <CategoryIcon className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-lg line-clamp-2">{reward.name}</CardTitle>
                          </div>
                        </div>
                        <Badge variant={availabilityBadge.variant} className="text-xs">
                          {availabilityBadge.text}
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <CardDescription className="line-clamp-3">
                        {reward.description}
                      </CardDescription>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Delivery:</span>
                          <span className="font-medium">{reward.estimated_delivery}</span>
                        </div>
                        {reward.stock_remaining && (
                          <div className="flex justify-between">
                            <span>Stock:</span>
                            <span className="font-medium">{reward.stock_remaining} left</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span>Limit:</span>
                          <span className="font-medium">{reward.redemption_limit} per farmer</span>
                        </div>
                      </div>

                      <div className="border-t pt-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Coins className="h-4 w-4 text-primary" />
                            <span className="text-2xl font-bold text-primary">{reward.points_cost}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">points</span>
                        </div>

                        <Button
                          variant={affordable ? "agricultural" : "outline"}
                          size="sm"
                          className="w-full gap-2"
                          disabled={!affordable || reward.availability === 'out_of_stock'}
                          onClick={() => redeemReward(reward.id)}
                        >
                          <Gift className="h-4 w-4" />
                          {!affordable ? 'Insufficient Points' : 
                           reward.availability === 'out_of_stock' ? 'Out of Stock' : 
                           'Redeem Now'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            {redeemedRewards.length > 0 ? (
              <div className="space-y-4">
                {redeemedRewards.map((redemption) => {
                  const statusBadge = getStatusBadge(redemption.status);
                  const StatusIcon = statusBadge.icon;
                  const CategoryIcon = getCategoryIcon(redemption.reward.category);
                  
                  return (
                    <Card key={redemption.id} className="card-agricultural">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${getCategoryColor(redemption.reward.category)}`}>
                            <CategoryIcon className="h-6 w-6" />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <h3 className="font-semibold text-lg">{redemption.reward.name}</h3>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                  {redemption.reward.description}
                                </p>
                              </div>
                              <Badge variant={statusBadge.variant} className="gap-1">
                                <StatusIcon className="h-3 w-3" />
                                {statusBadge.text}
                              </Badge>
                            </div>
                            
                            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">Redeemed:</span>
                                <p className="font-medium">
                                  {new Date(redemption.redeemed_date).toLocaleDateString()}
                                </p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Points Used:</span>
                                <p className="font-medium text-primary">{redemption.reward.points_cost}</p>
                              </div>
                              {redemption.tracking_code && (
                                <div>
                                  <span className="text-muted-foreground">Tracking:</span>
                                  <p className="font-medium">{redemption.tracking_code}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No redemptions yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start redeeming rewards to build your farming toolkit!
                </p>
                <Button onClick={() => setActiveTab('available')}>
                  Browse Available Rewards
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Rewards;