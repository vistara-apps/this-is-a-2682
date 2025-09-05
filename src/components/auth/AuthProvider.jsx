import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, dbService } from '../../services/supabase';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { user, error } = await authService.getCurrentUser();
        if (error) {
          console.error('Error getting initial session:', error);
        } else if (user) {
          setUser(user);
          setSession({ user });
          
          // Get or create user profile
          await getOrCreateUserProfile(user);
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = authService.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        
        if (session?.user) {
          setUser(session.user);
          setSession(session);
          await getOrCreateUserProfile(session.user);
        } else {
          setUser(null);
          setSession(null);
        }
        
        setLoading(false);
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const getOrCreateUserProfile = async (authUser) => {
    try {
      // Try to get existing user profile
      const { data: existingUser, error: getUserError } = await dbService.getUser(authUser.id);
      
      if (getUserError && getUserError.code !== 'PGRST116') {
        console.error('Error getting user profile:', getUserError);
        return;
      }

      if (!existingUser) {
        // Create new user profile
        const userData = {
          user_id: authUser.id,
          email: authUser.email,
          subscription_tier: 'Free',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        const { data: newUser, error: createError } = await dbService.createUser(userData);
        
        if (createError) {
          console.error('Error creating user profile:', createError);
        } else {
          console.log('Created new user profile:', newUser);
        }
      }
    } catch (error) {
      console.error('Error in getOrCreateUserProfile:', error);
    }
  };

  const signUp = async (email, password, userData = {}) => {
    try {
      setLoading(true);
      const { data, error } = await authService.signUp(email, password, userData);
      
      if (error) {
        toast.error(error.message);
        return { data: null, error };
      }

      if (data.user && !data.session) {
        toast.success('Check your email for the confirmation link!');
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error in signUp:', error);
      toast.error('An unexpected error occurred');
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    try {
      setLoading(true);
      const { data, error } = await authService.signIn(email, password);
      
      if (error) {
        toast.error(error.message);
        return { data: null, error };
      }

      toast.success('Welcome back!');
      return { data, error: null };
    } catch (error) {
      console.error('Error in signIn:', error);
      toast.error('An unexpected error occurred');
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await authService.signOut();
      
      if (error) {
        toast.error(error.message);
        return { error };
      }

      toast.success('Signed out successfully');
      return { error: null };
    } catch (error) {
      console.error('Error in signOut:', error);
      toast.error('An unexpected error occurred');
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
