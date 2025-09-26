import React, { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Dashboard from '@/pages/Dashboard';
import LoginForm from '@/components/auth/LoginForm';
import PageLayout from '@/components/PageLayout';

const MyNSCU = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <PageLayout title="MyNSCU Portal" description="Loading your dashboard...">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </PageLayout>
    );
  }

  if (!user) {
    return (
      <PageLayout 
        title="MyNSCU Portal - Login" 
        description="Access your NSCU Delaware USA student information, grades, and university services"
      >
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto">
            <div className="bg-card p-8 rounded-lg shadow-lg border">
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-foreground">Welcome to MyNSCU</h1>
                <p className="text-muted-foreground mt-2">Sign in to access your personalized dashboard</p>
              </div>
              <LoginForm />
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  // If user is authenticated, render the Dashboard directly
  return <Dashboard />;
};

export default MyNSCU;