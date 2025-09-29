import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Calendar, ArrowLeft, Droplets, Thermometer, Wind, Sun, Cloud } from 'lucide-react';

interface ForecastDay {
  date: string;
  temp_max: number;
  temp_min: number;
  condition: string;
  rain_chance: number;
}

interface WeatherPageData {
  location: string;
  temperature: number;
  humidity: number;
  wind_speed: number;
  condition: string;
  forecast: ForecastDay[];
}

const Forecast: React.FC = () => {
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<WeatherPageData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Mock data; replace with API call if available
    const mock: WeatherPageData = {
      location: user?.village || 'Your Location',
      temperature: 28,
      humidity: 65,
      wind_speed: 8,
      condition: 'Partly Cloudy',
      forecast: [
        { date: '2024-09-16', temp_max: 30, temp_min: 22, condition: 'Sunny', rain_chance: 10 },
        { date: '2024-09-17', temp_max: 28, temp_min: 20, condition: 'Cloudy', rain_chance: 40 },
        { date: '2024-09-18', temp_max: 26, temp_min: 19, condition: 'Rainy', rain_chance: 80 },
        { date: '2024-09-19', temp_max: 29, temp_min: 21, condition: 'Partly Cloudy', rain_chance: 25 },
        { date: '2024-09-20', temp_max: 31, temp_min: 23, condition: 'Sunny', rain_chance: 5 },
        { date: '2024-09-21', temp_max: 27, temp_min: 20, condition: 'Cloudy', rain_chance: 35 },
        { date: '2024-09-22', temp_max: 29, temp_min: 22, condition: 'Sunny', rain_chance: 15 }
      ]
    };
    setTimeout(() => { setData(mock); setIsLoading(false); }, 600);
  }, [user]);

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny': return Sun;
      case 'cloudy': case 'partly cloudy': return Cloud;
      case 'rainy': return Droplets;
      default: return Cloud;
    }
  };

  if (!authLoading && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading forecast..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-sky-50">
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
                <h1 className="text-2xl font-bold font-heading">7-Day Forecast</h1>
                <p className="text-sm text-muted-foreground">Detailed weather outlook for {data?.location}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Current Weather */}
          <Card className="card-dashboard lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Thermometer className="h-5 w-5 text-primary" />
                Current Weather
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  {data && React.createElement(getWeatherIcon(data.condition), { 
                    className: "h-8 w-8 text-orange-500" 
                  })}
                  <span className="text-3xl font-bold">{data?.temperature}°C</span>
                </div>
                <p className="text-sm text-muted-foreground">{data?.condition}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Droplets className="h-4 w-4 text-sky-500" />
                  <span>Humidity: {data?.humidity}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <Wind className="h-4 w-4 text-gray-500" />
                  <span>Wind: {data?.wind_speed} km/h</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 7-Day Forecast */}
          <Card className="card-dashboard lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                7-Day Forecast
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data?.forecast.map((day, index) => {
                  const WeatherIcon = getWeatherIcon(day.condition);
                  return (
                    <div key={day.date} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <WeatherIcon className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">
                            {index === 0 ? 'Today' : new Date(day.date).toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' })}
                          </p>
                          <p className="text-sm text-muted-foreground">{day.condition}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{day.temp_max}° / {day.temp_min}°</p>
                        <p className="text-sm text-sky-600">{day.rain_chance}% rain</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Forecast;


