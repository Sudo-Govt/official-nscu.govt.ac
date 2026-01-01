import React from 'react';
import { useAuth } from '@/context/AuthContext';
import AdminDashboard from '@/components/dashboards/AdminDashboard';
import StudentDashboardV2 from '@/components/dashboards/StudentDashboardV2';
import FacultyDashboard from '@/components/dashboards/FacultyDashboard';
import AdmissionAgentDashboard from '@/components/dashboards/AdmissionAgentDashboard';
import DelegatorDashboard from '@/components/dashboards/DelegatorDashboard';
import FinanceDashboard from '@/components/dashboards/FinanceDashboard';
import AlumniDashboard from '@/components/dashboards/AlumniDashboard';

const Dashboard = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <div>Please log in to access your dashboard.</div>;
  }

  const renderDashboard = () => {
    switch (user.role) {
      case 'admin':
      case 'superadmin':
      case 'registrar':
        return <AdminDashboard />;
      case 'student':
        return <StudentDashboardV2 />;
      case 'faculty':
        return <FacultyDashboard />;
      case 'admission_agent':
        return <AdmissionAgentDashboard />;
      case 'finance':
      case 'accounts':
        return <FinanceDashboard />;
      case 'alumni':
        return <AlumniDashboard />;
      default:
        return <div>Invalid user role</div>;
    }
  };

  return renderDashboard();
};

export default Dashboard;