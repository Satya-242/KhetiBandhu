import React, { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import LoadingSpinner from '@/components/LoadingSpinner';
import ToastNotification from '@/components/ui/toast-notification';
import { Wheat, Sprout, User, Lock, Tractor } from 'lucide-react';
import heroFarm from '@/assets/hero-farm.jpg';

const Login: React.FC = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const result = await login(credentials);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message || 'Login failed');
    }
    
    setIsLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setError(''); // Clear error when user starts typing
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Hero Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <img 
          src={heroFarm} 
          alt="Beautiful Indian farm landscape"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-emerald-600/30" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white p-8">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Wheat className="w-12 h-12" />
              <h1 className="text-4xl font-bold font-heading">KhetiBandhu</h1>
            </div>
            <p className="text-xl mb-4">Your Digital Farming Assistant</p>
            <p className="text-lg opacity-90">Empowering farmers with smart agriculture solutions</p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-emerald-50 to-sky-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Tractor className="w-10 h-10 text-primary" />
              <h1 className="text-3xl font-bold font-heading text-primary">KhetiBandhu</h1>
            </div>
            <p className="text-muted-foreground">Your Digital Farming Assistant</p>
          </div>

          <Card className="card-agricultural">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-heading flex items-center justify-center gap-2">
                <Sprout className="w-6 h-6 text-primary" />
                Farmer Login
              </CardTitle>
              <CardDescription>
                Sign in to access your farming dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <ToastNotification
                    type="error"
                    title="Login Failed"
                    message={error}
                  />
                )}

                <div className="space-y-2">
                  <Label htmlFor="username" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Username
                  </Label>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    value={credentials.username}
                    onChange={handleInputChange}
                    className="input-agricultural"
                    placeholder="Enter your username"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Password
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={credentials.password}
                    onChange={handleInputChange}
                    className="input-agricultural"
                    placeholder="Enter your password"
                    required
                    disabled={isLoading}
                  />
                </div>

                <Button 
                  type="submit" 
                  variant="hero" 
                  size="lg" 
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <LoadingSpinner size="sm" text="Signing in..." />
                  ) : (
                    'Sign In'
                  )}
                </Button>

                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    New farmer?{' '}
                    <Link 
                      to="/register" 
                      className="text-primary hover:text-primary-hover font-medium underline-offset-4 hover:underline"
                    >
                      Create an account
                    </Link>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;