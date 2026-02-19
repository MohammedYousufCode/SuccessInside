import { supabase } from '../lib/supabase';
import type { 
  SignupCredentials, 
  LoginCredentials, 
  AuthResponse,
  User,
  AuthError
} from '../types/auth';

class AuthService {
  /**
   * Sign up a new user with email and password
   */
async login(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // Return error MESSAGE as string, not the whole object
      return { user: null, error: error.message };
    }

    return { user: data.user, error: null };
  } catch (err) {
    return { 
      user: null, 
      error: err instanceof Error ? err.message : 'Failed to login' 
    };
  }
}

async signUp(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });

    if (error) {
      // Return error MESSAGE as string, not the whole object
      return { user: null, error: error.message };
    }

    if (data.user) {
      return { user: data.user, error: null };
    }

    return { user: null, error: 'Signup completed but user not returned' };
  } catch (err) {
    return { 
      user: null, 
      error: err instanceof Error ? err.message : 'Failed to sign up' 
    };
  }
}


  /**
   * Sign out the current user
   */
  async logout(): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        return {
          error: {
            message: error.message,
            status: error.status,
          },
        };
      }

      return { error: null };
    } catch (err) {
      return {
        error: {
          message: err instanceof Error ? err.message : 'Logout failed',
        },
      };
    }
  }

  /**
   * Get the current session
   */
  async getSession() {
    try {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        return { session: null, error };
      }

      return { session: data.session, error: null };
    } catch (err) {
      return {
        session: null,
        error: {
          message: err instanceof Error ? err.message : 'Failed to get session',
        },
      };
    }
  }

  /**
   * Get the current user
   */
  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error) {
        return { user: null, error };
      }

      return { user: user as User | null, error: null };
    } catch (err) {
      return {
        user: null,
        error: {
          message: err instanceof Error ? err.message : 'Failed to get user',
        },
      };
    }
  }

  /**
   * Listen to auth state changes
   */
  onAuthStateChange(callback: (user: User | null, session: any) => void) {
    return supabase.auth.onAuthStateChange((_event, session) => {
      callback(session?.user as User | null ?? null, session);
    });
  }
}

export const authService = new AuthService();
