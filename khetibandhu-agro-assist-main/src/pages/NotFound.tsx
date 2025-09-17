import React from 'react';
import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from '@/components/ui/button';
import { Wheat, Home, ArrowLeft, Sprout } from 'lucide-react';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-sky-50 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Wheat className="h-12 w-12 text-primary" />
            <h1 className="text-2xl font-bold font-heading text-primary">KhetiBandhu</h1>
          </div>
          <div className="w-24 h-24 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
            <Sprout className="h-12 w-12 text-primary" />
          </div>
        </div>
        
        <h2 className="text-6xl font-bold text-primary mb-4">404</h2>
        <h3 className="text-2xl font-semibold font-heading mb-2">Field Not Found</h3>
        <p className="text-muted-foreground mb-8">
          Looks like this farming path doesn't exist. Let's get you back to growing!
        </p>
        
        <div className="space-y-4">
          <Link to="/">
            <Button variant="hero" size="lg" className="gap-2">
              <Home className="h-5 w-5" />
              Return to Home
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button variant="outline" size="lg" className="gap-2 w-full">
              <ArrowLeft className="h-5 w-5" />
              Go to Dashboard
            </Button>
          </Link>
        </div>
        
        <p className="text-sm text-muted-foreground mt-8">
          Path: <code className="bg-muted px-2 py-1 rounded">{location.pathname}</code>
        </p>
      </div>
    </div>
  );
};

export default NotFound;
