import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Wheat, Sprout, Target, TrendingUp, Award, Users, ArrowRight, Check } from 'lucide-react';
import heroFarm from '@/assets/hero-farm.jpg';
import { useTranslation } from '@/hooks/useTranslation';

const Index: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const features = [
    {
      icon: Target,
      title: t('landing.features.smart_quests.title'),
      description: t('landing.features.smart_quests.description')
    },
    {
      icon: TrendingUp,
      title: t('landing.features.ai_predictions.title'),
      description: t('landing.features.ai_predictions.description')
    },
    {
      icon: Award,
      title: t('landing.features.gamification.title'),
      description: t('landing.features.gamification.description')
    },
    {
      icon: Users,
      title: t('landing.features.community.title'),
      description: t('landing.features.community.description')
    }
  ];

  const benefits = [
    t('landing.benefits.ai_yield'),
    t('landing.benefits.sustainable_practices'),
    t('landing.benefits.community_connect'),
    t('landing.benefits.earn_rewards'),
    t('landing.benefits.weather_access'),
    t('landing.benefits.track_progress')
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-sky-50">
      {/* Navigation */}
      <nav className="bg-card/80 backdrop-blur-md border-b border-border/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wheat className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold font-heading text-primary">{t('landing.brand')}</h1>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/login">
                <Button variant="ghost">{t('landing.nav.sign_in')}</Button>
              </Link>
              <Link to="/register">
                <Button variant="hero">{t('landing.nav.get_started')}</Button>
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
            alt={t('landing.hero.alt')}
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Sprout className="h-12 w-12 text-primary" />
              <h1 className="text-5xl md:text-6xl font-bold font-heading text-foreground">
                {t('landing.brand')}
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              {t('landing.hero.tagline')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button variant="hero" size="xl" className="gap-2">
                  {t('landing.hero.cta_start')}
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="xl">
                  {t('landing.nav.sign_in')}
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
              {t('landing.features.title')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('landing.features.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card-agricultural p-6 text-center group">
                <div className="h-16 w-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  {/* @ts-ignore */}
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
                {t('landing.benefits.title')}
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                {t('landing.benefits.subtitle')}
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
                  <div className="text-4xl font-bold text-primary mb-2">{t('landing.stats.active_farmers')}</div>
                  <div className="text-muted-foreground">{t('landing.stats.active_farmers_label')}</div>
                </div>
                <div className="grid grid-cols-2 gap-6 text-center">
                  <div>
                    <div className="text-2xl font-bold text-accent mb-1">{t('landing.stats.yield_improvement.value')}</div>
                    <div className="text-sm text-muted-foreground">{t('landing.stats.yield_improvement.label')}</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-accent mb-1">{t('landing.stats.user_satisfaction.value')}</div>
                    <div className="text-sm text-muted-foreground">{t('landing.stats.user_satisfaction.label')}</div>
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
              {t('landing.cta.title')}
            </h2>
            <p className="text-xl mb-8 opacity-90">
              {t('landing.cta.subtitle')}
            </p>
            <Link to="/register">
              <Button variant="secondary" size="xl" className="gap-2">
                {t('landing.cta.create_free_account')}
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
              <span className="font-semibold">{t('landing.brand')}</span>
              <span className="text-muted-foreground">- {t('landing.footer.tagline')}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              {t('landing.footer.copyright', { year: new Date().getFullYear() })}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
