import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePerspective } from '@/context/PerspectiveContext';
import PerspectiveBanner from '@/components/admin/PerspectiveBanner';

// Role-specific dashboards
import SuperAdminDashboard from '@/components/dashboards/SuperAdminDashboard';
import PlatformAdminDashboard from '@/components/dashboards/PlatformAdminDashboard';
import AdminDashboard from '@/components/dashboards/AdminDashboard';
import HRAdminDashboard from '@/components/dashboards/HRAdminDashboard';
import FinanceDashboard from '@/components/dashboards/FinanceDashboard';
import ComplianceAdminDashboard from '@/components/dashboards/ComplianceAdminDashboard';
import AdmissionAdminDashboard from '@/components/dashboards/AdmissionAdminDashboard';
import AdmissionStaffDashboard from '@/components/dashboards/AdmissionStaffDashboard';
import AdmissionAgentDashboard from '@/components/dashboards/AdmissionAgentDashboard';
import MasterAgentDashboard from '@/components/dashboards/MasterAgentDashboard';
import StudentDashboardV2 from '@/components/dashboards/StudentDashboardV2';
import AlumniDashboard from '@/components/dashboards/AlumniDashboard';
import SupportDashboard from '@/components/dashboards/SupportDashboard';
import MarketingAdminDashboard from '@/components/dashboards/MarketingAdminDashboard';
import AuditorDashboard from '@/components/dashboards/AuditorDashboard';
import FacultyDashboard from '@/components/dashboards/FacultyDashboard';
import DelegatorDashboard from '@/components/dashboards/DelegatorDashboard';

const Dashboard = () => {
  const { user, isLoading } = useAuth();
  const { perspectiveUser, isInPerspectiveMode } = usePerspective();

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

  // Determine which role to render - use perspective if active
  const activeRole = isInPerspectiveMode && perspectiveUser ? perspectiveUser.role : user.role;

  // Route to role-specific dashboard
  const renderDashboard = () => {
    switch (activeRole) {
      // System & Platform Administration
      case 'superadmin':
        return <SuperAdminDashboard />;
      case 'platform_admin':
        return <PlatformAdminDashboard />;
      case 'admin':
      case 'registrar':
        return <AdminDashboard />;
      
      // HR Administration
      case 'hr_admin':
        return <HRAdminDashboard />;
      
      // Finance Administration
      case 'finance':
      case 'accounts':
        return <FinanceDashboard />;
      
      // Compliance & Legal
      case 'compliance_admin':
        return <ComplianceAdminDashboard />;
      
      // Admission Management
      case 'admission_admin':
        return <AdmissionAdminDashboard />;
      case 'admission_staff':
        return <AdmissionStaffDashboard />;
      
      // Agent Roles
      case 'admission_agent':
        return <AdmissionAgentDashboard />;
      case 'master_agent':
        return <MasterAgentDashboard />;
      
      // Student & Alumni
      case 'student':
        return <StudentDashboardV2 />;
      case 'alumni':
        return <AlumniDashboard />;
      
      // Support & Marketing
      case 'support':
        return <SupportDashboard />;
      case 'marketing_admin':
        return <MarketingAdminDashboard />;
      
      // Auditor (Read-Only)
      case 'auditor':
        return <AuditorDashboard />;
      
      // Faculty & Staff
      case 'faculty':
        return <FacultyDashboard />;
      case 'staff':
        return <SupportDashboard />; // Staff uses support dashboard
      case 'delegator':
        return <DelegatorDashboard />;
      
      default:
        return (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-destructive">Access Denied</h1>
              <p className="text-muted-foreground mt-2">Invalid or unassigned role: {activeRole}</p>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      <PerspectiveBanner />
      <div className={isInPerspectiveMode ? 'pt-10' : ''}>
        {renderDashboard()}
      </div>
    </>
  );
};

export default Dashboard;
