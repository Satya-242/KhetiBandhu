import React, { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import LoadingSpinner from '@/components/LoadingSpinner';
import ToastNotification from '@/components/ui/toast-notification';
import { UserPlus, Mail, Phone, MapPin, Wheat, IdCard, User, Lock } from 'lucide-react';
import heroFarm from '@/assets/hero-farm.jpg';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    email: '',
    pm_kisan_id: '',
    village: '',
    crops: '',
    phone: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    const result = await register(formData);
    
    if (result.success) {
      setSuccess('Account created successfully! Welcome to KhetiBandhu!');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } else {
      setError(result.message || 'Registration failed');
    }
    
    setIsLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
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
        <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-primary/30" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white p-8">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Wheat className="w-12 h-12" />
              <h1 className="text-4xl font-bold font-heading">Join KhetiBandhu</h1>
            </div>
            <p className="text-xl mb-4">Start Your Digital Farming Journey</p>
            <p className="text-lg opacity-90">Get predictions, complete quests, and grow with the community</p>
          </div>
        </div>
      </div>

      {/* Right Side - Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 bg-gradient-to-br from-emerald-50 to-earth-50 overflow-y-auto">
        <div className="w-full max-w-md my-8">
          <Card className="card-agricultural">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-heading flex items-center justify-center gap-2">
                <UserPlus className="w-6 h-6 text-primary" />
                Farmer Registration
              </CardTitle>
              <CardDescription>
                Create your account to access farming assistance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <ToastNotification
                    type="error"
                    title="Registration Failed"
                    message={error}
                  />
                )}

                {success && (
                  <ToastNotification
                    type="success"
                    title="Success!"
                    message={success}
                  />
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="input-agricultural"
                      placeholder="Your full name"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="username" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Username
                    </Label>
                    <Input
                      id="username"
                      name="username"
                      type="text"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="input-agricultural"
                      placeholder="Choose username"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="input-agricultural"
                    placeholder="your.email@example.com"
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
                    value={formData.password}
                    onChange={handleInputChange}
                    className="input-agricultural"
                    placeholder="Create strong password"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pm_kisan_id" className="flex items-center gap-2">
                      <IdCard className="w-4 h-4" />
                      PM-Kisan ID
                    </Label>
                    <Input
                      id="pm_kisan_id"
                      name="pm_kisan_id"
                      type="text"
                      value={formData.pm_kisan_id}
                      onChange={handleInputChange}
                      className="input-agricultural"
                      placeholder="PMK1234567890"
                      required
                      disabled={isLoading}
                    />
                    <p className="text-xs text-muted-foreground">Must start with 'PMK' and be 10+ characters</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="village" className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Village
                    </Label>
                    <Input
                      id="village"
                      name="village"
                      type="text"
                      value={formData.village}
                      onChange={handleInputChange}
                      className="input-agricultural"
                      placeholder="Your village name"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="crops" className="flex items-center gap-2">
                      <Wheat className="w-4 h-4" />
                      Crops Grown
                    </Label>
                    <Input
                      id="crops"
                      name="crops"
                      type="text"
                      value={formData.crops}
                      onChange={handleInputChange}
                      className="input-agricultural"
                      placeholder="Rice, Wheat, Corn"
                      required
                      disabled={isLoading}
                    />
                    <p className="text-xs text-muted-foreground">Separate with commas</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="input-agricultural"
                      placeholder="+91 9876543210"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  variant="hero" 
                  size="lg" 
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <LoadingSpinner size="sm" text="Creating account..." />
                  ) : (
                    'Create Account'
                  )}
                </Button>

                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <Link 
                      to="/login" 
                      className="text-primary hover:text-primary-hover font-medium underline-offset-4 hover:underline"
                    >
                      Sign in here
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

export default Register;