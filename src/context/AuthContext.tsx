import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';

interface User {
  id: string;
  user_id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  role: 'admin' | 'student' | 'faculty' | 'admission_agent' | 'finance' | 'superadmin' | 'alumni' | 'staff' | 'accounts' | 'registrar' | 'auditor' | 'delegator';
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (profileError) {
        setIsLoading(false);
        return;
      }
      
      // SECURITY FIX: Only use user_roles table as source of truth for roles
      const { data: userRole, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .maybeSingle();

      if (roleError) {
        setIsLoading(false);
        return;
      }

      // If no role found in user_roles, user cannot login
      if (!userRole) {
        setIsLoading(false);
        return;
      }
      
      if (profile) {
        const { data: authUser } = await supabase.auth.getUser();
        if (authUser.user) {
          setUser({
            id: authUser.user.id,
            user_id: authUser.user.id,
            email: authUser.user.email!,
            full_name: profile.full_name,
            avatar_url: profile.avatar_url,
            role: userRole.role
          });
        }
      }
    } catch (error) {
      // Error fetching user profile
    }
    setIsLoading(false);
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        if (session?.user) {
          // Defer profile fetch to avoid deadlock
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 0);
        } else {
          setUser(null);
          setIsLoading(false);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSession(session);
        // Fetch profile for existing session
        setTimeout(() => {
          fetchUserProfile(session.user.id);
        }, 0);
      } else {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        return false;
      }
      
      return true;
    } catch (error) {
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ user, session, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};