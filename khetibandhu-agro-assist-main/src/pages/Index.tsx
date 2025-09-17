import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Wheat, Sprout, Target, TrendingUp, Award, Users, ArrowRight, Check } from 'lucide-react';
import heroFarm from '@/assets/hero-farm.jpg';

const Index = () => {
  const { isAuthenticated } = useAuth();

  // Redirect to dashboard if already logged in
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const features = [
    {
      icon: Target,
      title: "Smart Quests",
      description: "Complete farming missions and earn points while improving your agricultural practices."
    },
    {
      icon: TrendingUp,
      title: "AI Predictions",
      description: "Get accurate crop yield predictions powered by machine learning and weather data."
    },
    {
      icon: Award,
      title: "Gamification",
      description: "Earn badges, climb leaderboards, and unlock rewards for your farming achievements."
    },
    {
      icon: Users,
      title: "Community",
      description: "Connect with fellow farmers and learn from the agricultural community."
    }
  ];

  const benefits = [
    "Increase crop yields with AI-powered insights",
    "Learn sustainable farming practices",
    "Connect with farming community",
    "Earn rewards for good practices",
    "Access weather forecasts and alerts",
    "Track your farming progress"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-sky-50">
      {/* Navigation */}
      <nav className="bg-card/80 backdrop-blur-md border-b border-border/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wheat className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold font-heading text-primary">KhetiBandhu</h1>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link to="/register">
                <Button variant="hero">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroFarm} 
            alt="Modern farming landscape"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Sprout className="h-12 w-12 text-primary" />
              <h1 className="text-5xl md:text-6xl font-bold font-heading text-foreground">
                KhetiBandhu
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Your Digital Farming Assistant - Empowering Indian farmers with AI-powered insights, 
              gamified learning, and community support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button variant="hero" size="xl" className="gap-2">
                  Start Your Journey
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="xl">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">
              Revolutionizing Indian Agriculture
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover how KhetiBandhu combines traditional farming wisdom with modern technology 
              to help you grow better crops and build a sustainable future.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card-agricultural p-6 text-center group">
                <div className="h-16 w-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold font-heading mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold font-heading mb-6">
                Why Choose KhetiBandhu?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Join thousands of Indian farmers who are already transforming their agricultural 
                practices with our innovative platform.
              </p>
              <div className="grid grid-cols-1 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="h-6 w-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="card-agricultural p-8">
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">10,000+</div>
                  <div className="text-muted-foreground">Active Farmers</div>
                </div>
                <div className="grid grid-cols-2 gap-6 text-center">
                  <div>
                    <div className="text-2xl font-bold text-accent mb-1">85%</div>
                    <div className="text-sm text-muted-foreground">Yield Improvement</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-accent mb-1">92%</div>
                    <div className="text-sm text-muted-foreground">User Satisfaction</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-gradient">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto text-white">
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-6">
              Ready to Transform Your Farming?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join KhetiBandhu today and start your journey towards smarter, 
              more sustainable agriculture.
            </p>
            <Link to="/register">
              <Button variant="secondary" size="xl" className="gap-2">
                Create Free Account
                <Sprout className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Wheat className="h-6 w-6 text-primary" />
              <span className="font-semibold">KhetiBandhu</span>
              <span className="text-muted-foreground">- Empowering Indian Agriculture</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2024 KhetiBandhu. Built for farmers, by farmers.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
