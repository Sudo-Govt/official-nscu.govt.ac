import React from 'react';
import { useAuth } from '@/context/AuthContext';
import AdminDashboard from '@/components/dashboards/AdminDashboard';
import StudentDashboard from '@/components/dashboards/StudentDashboard';
import FacultyDashboard from '@/components/dashboards/FacultyDashboard';
import AdmissionAgentDashboard from '@/components/dashboards/AdmissionAgentDashboard';
import DelegatorDashboard from '@/components/dashboards/DelegatorDashboard';
import FinanceDashboard from '@/components/dashboards/FinanceDashboard';
import AlumniDashboard from '@/components/dashboards/AlumniDashboard';

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) {
    return <div>Loading...</div>;
  }

  const renderDashboard = () => {
    switch (user.role) {
      case 'admin':
      case 'superadmin':
      case 'registrar':
        return <AdminDashboard />;
      case 'student':
        return <StudentDashboard />;
      case 'faculty':
        return <FacultyDashboard />;
      case 'admission_agent':
        return <DelegatorDashboard />;
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