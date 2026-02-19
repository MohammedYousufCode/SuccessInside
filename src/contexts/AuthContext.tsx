import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authService } from '../services/authService';
import type { User, AuthState } from '../types/auth';

interface AuthContextType extends AuthState {
  signup: (email: string, password: string) => Promise<{ error: string | null }>;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    initialized: false,
  });

  useEffect(() => {
    let mounted = true;
    
    const initializeAuth = async () => {
      try {
        const { session } = await authService.getSession();
        
        if (!mounted) return;
        
        if (session) {
          const { user } = await authService.getCurrentUser();
          if (mounted) {
            setAuthState({
              user: user,
              session,
              loading: false,
              initialized: true,
            });
          }
        } else {
          if (mounted) {
            setAuthState({
              user: null,
              session: null,
              loading: false,
              initialized: true,
            });
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          setAuthState({
            user: null,
            session: null,
            loading: false,
            initialized: true,
          });
        }
      }
    };

    initializeAuth();

    const { data: authListener } = authService.onAuthStateChange(
      (user, session) => {
        if (mounted) {
          setAuthState(prev => ({
            ...prev,
            user,
            session,
            loading: false,
            initialized: true,
          }));
        }
      }
    );

    return () => {
      mounted = false;
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const signup = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, loading: true }));

    const { user, session, error } = await authService.signup({
      email,
      password,
    });

    if (error) {
      setAuthState(prev => ({ ...prev, loading: false }));
      return { error: error.message };
    }

    setAuthState({
      user,
      session,
      loading: false,
      initialized: true,
    });

    return { error: null };
  };

  const login = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, loading: true }));

    const { user, session, error } = await authService.login({
      email,
      password,
    });

    if (error) {
      setAuthState(prev => ({ ...prev, loading: false }));
      return { error: error.message };
    }

    setAuthState({
      user,
      session,
      loading: false,
      initialized: true,
    });

    return { error: null };
  };

  const logout = async () => {
    setAuthState(prev => ({ ...prev, loading: true }));
    
    await authService.logout();

    setAuthState({
      user: null,
      session: null,
      loading: false,
      initialized: true,
    });
  };

  const refreshSession = async () => {
    const { session } = await authService.getSession();
    if (session) {
      const { user } = await authService.getCurrentUser();
      setAuthState(prev => ({
        ...prev,
        user,
        session,
      }));
    }
  };

  const value: AuthContextType = {
    ...authState,
    signup,
    login,
    logout,
    refreshSession,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
