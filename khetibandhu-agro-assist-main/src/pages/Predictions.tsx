import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import LoadingSpinner from '@/components/LoadingSpinner';
import { 
  TrendingUp, TrendingDown, Leaf, ArrowLeft, RefreshCw,
  Calendar, BarChart3, Target, Info
} from 'lucide-react';

interface CropPrediction {
  crop_name: string;
  prediction_value: string;
  confidence_score: number;
  sustainability_score: number;
  recommendations: string[];
  last_updated: string;
}

interface PredictionSummary {
  average_confidence: number;
  total_predictions: number;
  last_updated: string;
  trends: {
    positive: number;
    negative: number;
    neutral: number;
  };
}

const Predictions: React.FC = () => {
  const { isAuthenticated, user, isLoading: authLoading } = useAuth();
  const [predictions, setPredictions] = useState<CropPrediction[]>([]);
  const [summary, setSummary] = useState<PredictionSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  if (!authLoading && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    const fetchPredictionsData = async () => {
      if (!user?.id) return;

      try {
        // Mock data - replace with actual API calls
        const mockPredictions: CropPrediction[] = [
          {
            crop_name: "Rice",
            prediction_value: "+15%",
            confidence_score: 85,
            sustainability_score: 78,
            recommendations: [
              "Increase organic fertilizer usage",
              "Monitor water levels closely",
              "Consider pest prevention measures"
            ],
            last_updated: "2024-09-15T10:30:00Z"
          },
          {
            crop_name: "Wheat",
            prediction_value: "+8%",
            confidence_score: 72,
            sustainability_score: 65,
            recommendations: [
              "Optimize planting density",
              "Apply nitrogen-rich fertilizer",
              "Monitor soil moisture"
            ],
            last_updated: "2024-09-15T09:15:00Z"
          },
          {
            crop_name: "Cotton",
            prediction_value: "-3%",
            confidence_score: 90,
            sustainability_score: 82,
            recommendations: [
              "Improve irrigation efficiency",
              "Consider drought-resistant varieties",
              "Enhance soil health"
            ],
            last_updated: "2024-09-15T08:45:00Z"
          },
          {
            crop_name: "Sugarcane",
            prediction_value: "+22%",
            confidence_score: 76,
            sustainability_score: 71,
            recommendations: [
              "Maintain consistent watering",
              "Apply phosphorus fertilizer",
              "Monitor for pest activity"
            ],
            last_updated: "2024-09-15T11:00:00Z"
          }
        ];

        const mockSummary: PredictionSummary = {
          average_confidence: 80.75,
          total_predictions: 4,
          last_updated: "2024-09-15T11:00:00Z",
          trends: {
            positive: 3,
            negative: 1,
            neutral: 0
          }
        };

        setTimeout(() => {
          setPredictions(mockPredictions);
          setSummary(mockSummary);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Failed to fetch predictions data:', error);
        setIsLoading(false);
      }
    };

    fetchPredictionsData();
  }, [user]);

  const getPredictionTrend = (value: string) => {
    const isPositive = value.includes('+');
    const isNegative = value.includes('-');
    
    if (isPositive) return { icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' };
    if (isNegative) return { icon: TrendingDown, color: 'text-red-600', bg: 'bg-red-50' };
    return { icon: BarChart3, color: 'text-blue-600', bg: 'bg-blue-50' };
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const getSustainabilityBadge = (score: number) => {
    if (score >= 80) return { variant: 'default' as const, text: 'Excellent' };
    if (score >= 70) return { variant: 'secondary' as const, text: 'Good' };
    if (score >= 60) return { variant: 'outline' as const, text: 'Fair' };
    return { variant: 'destructive' as const, text: 'Poor' };
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading predictions..." />
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
                <h1 className="text-2xl font-bold font-heading">Crop Predictions</h1>
                <p className="text-sm text-muted-foreground">AI-powered yield and sustainability insights</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh Data
            </Button>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="card-dashboard">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">Total Predictions</span>
              </div>
              <p className="text-3xl font-bold">{summary?.total_predictions}</p>
            </CardContent>
          </Card>
          
          <Card className="card-dashboard">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">Avg Confidence</span>
              </div>
              <p className="text-3xl font-bold">{summary?.average_confidence.toFixed(1)}%</p>
            </CardContent>
          </Card>
          
          <Card className="card-dashboard">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
                <span className="text-sm font-medium text-muted-foreground">Positive Trends</span>
              </div>
              <p className="text-3xl font-bold text-emerald-600">{summary?.trends.positive}</p>
            </CardContent>
          </Card>
          
          <Card className="card-dashboard">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">Last Updated</span>
              </div>
              <p className="text-sm font-medium">
                {summary && new Date(summary.last_updated).toLocaleDateString()}
              </p>
              <p className="text-xs text-muted-foreground">
                {summary && new Date(summary.last_updated).toLocaleTimeString()}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Crop Predictions */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold font-heading">Crop Yield Predictions</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {predictions.map((prediction) => {
              const trend = getPredictionTrend(prediction.prediction_value);
              const TrendIcon = trend.icon;
              const sustainabilityBadge = getSustainabilityBadge(prediction.sustainability_score);
              
              return (
                <Card key={prediction.crop_name} className="card-agricultural">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Leaf className="h-5 w-5 text-primary" />
                        {prediction.crop_name}
                      </CardTitle>
                      <div className={`p-2 rounded-lg ${trend.bg}`}>
                        <TrendIcon className={`h-5 w-5 ${trend.color}`} />
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Yield Prediction</span>
                        <span className={`text-2xl font-bold ${trend.color}`}>
                          {prediction.prediction_value}
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Confidence Score</span>
                          <span className={`font-semibold ${getConfidenceColor(prediction.confidence_score)}`}>
                            {prediction.confidence_score}%
                          </span>
                        </div>
                        <Progress value={prediction.confidence_score} className="h-2" />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Sustainability</span>
                        <Badge variant={sustainabilityBadge.variant}>
                          {sustainabilityBadge.text} ({prediction.sustainability_score}%)
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Info className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">Recommendations</span>
                      </div>
                      <ul className="space-y-1">
                        {prediction.recommendations.map((rec, index) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="text-xs text-muted-foreground pt-2 border-t">
                      Updated: {new Date(prediction.last_updated).toLocaleString()}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Predictions;
