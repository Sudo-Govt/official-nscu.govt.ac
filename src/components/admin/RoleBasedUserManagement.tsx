import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Users, Shield, GraduationCap, UserCheck, DollarSign, 
  Heart, Briefcase, UserCog, ClipboardCheck, Megaphone,
  FileSearch, Building2, HelpCircle
} from 'lucide-react';
import SuperAdminUserManagement from './SuperAdminUserManagement';

interface RoleTab {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  filterRole: string;
  description: string;
}

const roleTabs: RoleTab[] = [
  { id: 'all', label: 'All Users', icon: Users, filterRole: '', description: 'View and manage all system users' },
  { id: 'superadmin', label: 'Super Admins', icon: Shield, filterRole: 'superadmin', description: 'System-wide administrators' },
  { id: 'platform_admin', label: 'Platform Admins', icon: Building2, filterRole: 'platform_admin', description: 'Platform level administrators' },
  { id: 'admin', label: 'Admins', icon: UserCog, filterRole: 'admin', description: 'Department administrators' },
  { id: 'hr_admin', label: 'HR Admins', icon: Users, filterRole: 'hr_admin', description: 'Human resources management' },
  { id: 'finance', label: 'Finance', icon: DollarSign, filterRole: 'finance', description: 'Finance department users' },
  { id: 'compliance_admin', label: 'Compliance', icon: ClipboardCheck, filterRole: 'compliance_admin', description: 'Compliance and regulatory staff' },
  { id: 'admission_admin', label: 'Admission Admin', icon: GraduationCap, filterRole: 'admission_admin', description: 'Admission department heads' },
  { id: 'admission_staff', label: 'Admission Staff', icon: UserCheck, filterRole: 'admission_staff', description: 'Admission processing staff' },
  { id: 'admission_agent', label: 'Agents', icon: Briefcase, filterRole: 'admission_agent', description: 'External admission agents' },
  { id: 'master_agent', label: 'Master Agents', icon: Briefcase, filterRole: 'master_agent', description: 'Senior admission agents' },
  { id: 'faculty', label: 'Faculty', icon: GraduationCap, filterRole: 'faculty', description: 'Teaching staff and professors' },
  { id: 'student', label: 'Students', icon: GraduationCap, filterRole: 'student', description: 'Enrolled students' },
  { id: 'alumni', label: 'Alumni', icon: Heart, filterRole: 'alumni', description: 'Graduated students' },
  { id: 'support', label: 'Support', icon: HelpCircle, filterRole: 'support', description: 'Support staff' },
  { id: 'marketing_admin', label: 'Marketing', icon: Megaphone, filterRole: 'marketing_admin', description: 'Marketing team' },
  { id: 'auditor', label: 'Auditors', icon: FileSearch, filterRole: 'auditor', description: 'System auditors (read-only)' },
];

const RoleBasedUserManagement = () => {
  const [activeTab, setActiveTab] = useState('all');

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Users className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl">Central User Management</CardTitle>
            <CardDescription className="text-base">
              Manage all users from a centralized interface with role-based filtering
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="overflow-x-auto pb-2">
            <TabsList className="inline-flex h-auto p-1 gap-1 flex-wrap">
              {roleTabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <TabsTrigger 
                    key={tab.id} 
                    value={tab.id}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs whitespace-nowrap"
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{tab.label}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>

          {roleTabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id} className="mt-4">
              <div className="mb-4 p-3 bg-muted/50 rounded-lg border">
                <div className="flex items-center gap-2">
                  <tab.icon className="h-4 w-4 text-primary" />
                  <span className="font-medium text-sm">{tab.label}</span>
                  <Badge variant="outline" className="ml-auto text-xs">
                    {tab.filterRole || 'All Roles'}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{tab.description}</p>
              </div>
              <SuperAdminUserManagement filterRole={tab.filterRole || undefined} />
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default RoleBasedUserManagement;
