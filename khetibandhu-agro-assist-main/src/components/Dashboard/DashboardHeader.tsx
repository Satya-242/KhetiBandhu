import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { LogOut, User, Award, Sprout } from 'lucide-react';

export const DashboardHeader: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="bg-card/80 backdrop-blur-md border-b border-border/50 sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4 bg-radial-hero">
        <div className="flex items-center justify-between">
          {/* Left - Greeting & Logo */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Sprout className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold font-heading text-primary">KhetiBandhu</h1>
            </div>
            <div className="hidden md:block h-6 w-px bg-border glow-divider" />
            <div className="hidden md:block">
              <h2 className="text-lg font-semibold">
                Welcome back, {user?.name || 'Farmer'}!
              </h2>
              <p className="text-sm text-muted-foreground">
                {user?.village && `${user.village} • `}
                Ready to grow today?
              </p>
            </div>
          </div>

          {/* Right - Stats & Actions */}
          <div className="flex items-center gap-4">
            {/* Points Display */}
            <div className="hidden sm:flex items-center gap-2 bg-primary/10 px-3 py-2 rounded-lg shadow-soft hover:shadow-medium transition-all duration-300">
              <Award className="h-4 w-4 text-primary" />
              <span className="font-semibold text-primary">
                {user?.total_points || 0} Points
              </span>
            </div>

            {/* Profile & Logout */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="gap-2 hover:-translate-y-0.5 transition-transform" onClick={() => navigate('/profile')}>
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Profile</span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={logout}
                className="gap-2 text-destructive hover:text-destructive hover:-translate-y-0.5 transition-transform"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Greeting */}
        <div className="md:hidden mt-3 pt-3 border-t border-border/50">
          <h2 className="font-semibold">Welcome back, {user?.name || 'Farmer'}!</h2>
          <p className="text-sm text-muted-foreground">
            {user?.village && `${user.village} • `}Ready to grow today?
          </p>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;