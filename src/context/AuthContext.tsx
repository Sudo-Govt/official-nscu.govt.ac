import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';

interface User {
  id: string;
  user_id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  role: 'admin' | 'student' | 'faculty' | 'admission_agent' | 'finance' | 'superadmin' | 'alumni' | 'staff' | 'accounts' | 'registrar' | 'auditor' | 'delegator' | 'platform_admin' | 'hr_admin' | 'compliance_admin' | 'admission_admin' | 'admission_staff' | 'master_agent' | 'support' | 'marketing_admin';
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to get device/browser info
const getDeviceInfo = () => {
  const ua = navigator.userAgent;
  let device = 'Desktop';
  if (/mobile/i.test(ua)) device = 'Mobile';
  else if (/tablet|ipad/i.test(ua)) device = 'Tablet';
  
  let browser = 'Unknown';
  if (ua.includes('Chrome')) browser = 'Chrome';
  else if (ua.includes('Firefox')) browser = 'Firefox';
  else if (ua.includes('Safari')) browser = 'Safari';
  else if (ua.includes('Edge')) browser = 'Edge';
  
  return `${device} - ${browser}`;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const currentSessionId = useRef<string | null>(null);

  // Track user session in database (non-blocking)
  const trackSession = (userId: string, action: 'sign_in' | 'sign_out') => {
    // Run session tracking in background - don't await to prevent blocking login
    (async () => {
      try {
        if (action === 'sign_in') {
          // Create new session record
          const { data, error } = await supabase
            .from('user_sessions')
            .insert({
              user_id: userId,
              user_agent: navigator.userAgent,
              device_info: getDeviceInfo(),
              signed_in_at: new Date().toISOString(),
              last_activity_at: new Date().toISOString(),
              is_active: true,
            })
            .select('id')
            .single();

          if (!error && data) {
            currentSessionId.current = data.id;
            
            // Log the sign-in activity
            await supabase.from('user_activity_logs').insert({
              user_id: userId,
              session_id: data.id,
              action_type: 'sign_in',
              action_description: 'User signed in',
              user_agent: navigator.userAgent,
            });
          } else if (error) {
            console.warn('Session tracking failed (non-critical):', error.message);
          }
        } else if (action === 'sign_out' && currentSessionId.current) {
          // Update session as ended
          await supabase
            .from('user_sessions')
            .update({
              signed_out_at: new Date().toISOString(),
              is_active: false,
            })
            .eq('id', currentSessionId.current);

          // Log the sign-out activity
          await supabase.from('user_activity_logs').insert({
            user_id: userId,
            session_id: currentSessionId.current,
            action_type: 'sign_out',
            action_description: 'User signed out',
            user_agent: navigator.userAgent,
          });

          currentSessionId.current = null;
        }
      } catch (error) {
        console.warn('Error tracking session (non-critical):', error);
      }
    })();
  };

  // Update last activity periodically
  const updateLastActivity = async () => {
    if (currentSessionId.current) {
      await supabase
        .from('user_sessions')
        .update({ last_activity_at: new Date().toISOString() })
        .eq('id', currentSessionId.current);
    }
  };

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

      // If no role assigned yet (new user), wait for trigger and retry
      if (!userRole) {
        console.log('No role found for user, waiting for trigger...', userId);
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Retry fetching role
        const { data: retryRole } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', userId)
          .maybeSingle();
        
        if (!retryRole) {
          console.error('No role assigned for user after retry:', userId);
          setIsLoading(false);
          return;
        }
        
        const finalRole = retryRole.role;
        
        if (profile) {
          const { data: authUser } = await supabase.auth.getUser();
          if (authUser.user) {
            setUser({
              id: authUser.user.id,
              user_id: authUser.user.id,
              email: authUser.user.email!,
              full_name: profile.full_name,
              avatar_url: profile.avatar_url,
              role: finalRole as any
            });
          }
        }
        setIsLoading(false);
        return;
      }
      
      const finalRole = userRole.role;
      
      if (profile) {
        const { data: authUser } = await supabase.auth.getUser();
        if (authUser.user) {
          setUser({
            id: authUser.user.id,
            user_id: authUser.user.id,
            email: authUser.user.email!,
            full_name: profile.full_name,
            avatar_url: profile.avatar_url,
            role: finalRole as any
          });
        }
      }
    } catch (error) {
      // Error fetching user profile
    }
    setIsLoading(false);
  };

  useEffect(() => {
    // Set up auth state listener FIRST (before getSession)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state change:', event);
        setSession(session);
        
        if (session?.user) {
          // Track sign-in when user authenticates (non-blocking)
          if (event === 'SIGNED_IN') {
            trackSession(session.user.id, 'sign_in');
          }
          
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
        // For existing sessions, create a session record if we don't have one
        trackSession(session.user.id, 'sign_in');
        // Fetch profile for existing session
        setTimeout(() => {
          fetchUserProfile(session.user.id);
        }, 0);
      } else {
        setIsLoading(false);
      }
    });

    // Update activity every 2 minutes while user is active
    const activityInterval = setInterval(updateLastActivity, 2 * 60 * 1000);

    return () => {
      subscription.unsubscribe();
      clearInterval(activityInterval);
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Don't set isLoading here - let onAuthStateChange handle it
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('Login error:', error.message);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Login exception:', error);
      return false;
    }
  };

  const logout = async () => {
    // Track sign-out before logging out
    if (user?.id) {
      await trackSession(user.id, 'sign_out');
    }
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