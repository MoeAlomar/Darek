import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import apiService from '../apiService';
import { useNavigate } from 'react-router-dom';

// Define the shape of the User object, based on your backend serializer
interface User {
  id: string;
  username: string;
  email: string;
  role: 'student' | 'landlord' | 'other';
  first_name: string;
  last_name: string;
}

// Define the shape of the AuthContext
interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (data: { access: string; refresh: string; user: User }) => void;
  logout: () => void;
  loading: boolean;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider component
 * This component will wrap our application and provide auth state to all children.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check localStorage for user data on initial component mount
  useEffect(() => {
    setLoading(true);
    try {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('access_token');

      if (storedUser && token) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      // If error, clear storage
      localStorage.removeItem('user');
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    } finally {
      setLoading(false);
    }
  }, []);

  // Login function
  const login = (data: { access: string; refresh: string; user: User }) => {
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
  };

  // Logout function
  const logout = () => {
    // Clear tokens and user from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');

    // Clear user state
    setUser(null);

    // Remove token from apiService header
    delete apiService.defaults.headers.common['Authorization'];

    // Redirect to login page
    navigate('/login');
  };

  const value = {
    user,
    isLoggedIn: !!user,
    login,
    logout,
    loading,
  };

  // Don't render children until we've checked auth status
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Custom hook to easily access AuthContext
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}