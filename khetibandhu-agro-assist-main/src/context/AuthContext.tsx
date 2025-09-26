import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Farmer {
  id: string;
  name: string;
  username: string;
  email: string;
  pm_kisan_id: string;
  village: string;
  crops: string[];
  phone: string;
  total_points?: number;
  level?: number;
  is_staff?: boolean;
}

interface AuthState {
  user: Farmer | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; message?: string }>;
  register: (userData: RegisterData) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  updateUser: (user: Farmer) => void;
}

interface LoginCredentials {
  username: string;
  password: string;
}

interface RegisterData {
  name: string;
  username: string;
  password: string;
  email: string;
  pm_kisan_id: string;
  village: string;
  crops: string;
  phone: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const API_BASE_URL = 'http://localhost:8000/api';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  const normalizeFarmer = (raw: any): Farmer => {
    const cropsArray = Array.isArray(raw?.crops)
      ? raw.crops
      : (raw?.crops ? String(raw.crops).split(',').map((c: string) => c.trim()).filter(Boolean) : []);

    return {
      id: String(raw?.id ?? raw?.pk ?? ''),
      name: raw?.name ?? '',
      username: raw?.username ?? raw?.user?.username ?? '',
      email: raw?.email ?? raw?.user?.email ?? '',
      pm_kisan_id: raw?.pm_kisan_id ?? '',
      village: raw?.village ?? '',
      crops: cropsArray,
      phone: raw?.phone ?? raw?.phone_number ?? '',
      total_points: raw?.total_points,
      level: raw?.level,
      is_staff: Boolean(raw?.is_staff),
    };
  };

  // Check for existing session on mount
  useEffect(() => {
    const initAuth = () => {
      try {
        const token = localStorage.getItem('khetibandhu_token');
        const user = localStorage.getItem('khetibandhu_user');
        
        if (token && user) {
          const parsed = JSON.parse(user);
          setState({
            user: normalizeFarmer(parsed),
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          setState(prev => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        localStorage.removeItem('khetibandhu_token');
        localStorage.removeItem('khetibandhu_user');
        localStorage.removeItem('khetibandhu_farmer_id');
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/farmers/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        const { farmer, token } = data;
        
        // Store in localStorage
        const normalized = normalizeFarmer(farmer);
        localStorage.setItem('khetibandhu_token', token);
        localStorage.setItem('khetibandhu_user', JSON.stringify(normalized));
        localStorage.setItem('khetibandhu_farmer_id', normalized.id.toString());

        setState({
          user: normalized,
          token,
          isAuthenticated: true,
          isLoading: false,
        });

        return { success: true };
      } else {
        return { success: false, message: data.message || 'Login failed. Please check your credentials.' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Network error. Please check your connection and try again.' };
    }
  };

  const register = async (userData: RegisterData): Promise<{ success: boolean; message?: string }> => {
    try {
      // Validate PM-Kisan ID
      if (!userData.pm_kisan_id.startsWith('PMK') || userData.pm_kisan_id.length < 10) {
        return { success: false, message: 'PM-Kisan ID must start with "PMK" and be at least 10 characters long.' };
      }

      const response = await fetch(`${API_BASE_URL}/farmers/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        const { farmer, token } = data;
        
        // Store in localStorage
        const normalized = normalizeFarmer(farmer);
        localStorage.setItem('khetibandhu_token', token);
        localStorage.setItem('khetibandhu_user', JSON.stringify(normalized));
        localStorage.setItem('khetibandhu_farmer_id', normalized.id.toString());

        setState({
          user: normalized,
          token,
          isAuthenticated: true,
          isLoading: false,
        });

        return { success: true };
      } else {
        return { success: false, message: data.message || 'Registration failed. Please try again.' };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: 'Network error. Please check your connection and try again.' };
    }
  };

  const logout = () => {
    localStorage.removeItem('khetibandhu_token');
    localStorage.removeItem('khetibandhu_user');
    localStorage.removeItem('khetibandhu_farmer_id');
    
    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  const updateUser = (user: Farmer) => {
    localStorage.setItem('khetibandhu_user', JSON.stringify(user));
    setState(prev => ({ ...prev, user }));
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};