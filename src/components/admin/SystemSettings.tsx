import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Database, Download, Upload, RefreshCw, Shield, Server, FileText, HardDrive } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const SystemSettings = () => {
  const { toast } = useToast();
  const [isBackingUp, setIsBackingUp] = useState(false);
  
  const systemInfo = {
    version: '1.0.0',
    database: 'Supabase PostgreSQL',
    uptime: '15 days, 3 hours',
    lastBackup: '2024-01-15 02:00:00',
    totalUsers: 245,
    storageUsed: '2.3 GB'
  };

  const handleBackup = async (backupType: string) => {
    setIsBackingUp(true);
    toast({
      title: "Backup Started",
      description: `Creating ${backupType} backup...`
    });

    try {
      let data: Record<string, any> = {};
      
      switch (backupType) {
        case 'financial': {
          // Backup financial data
          const { data: feePayments } = await supabase.from('fee_payments').select('*');
          const { data: commissions } = await supabase.from('agent_commissions').select('*');
          data = { feePayments, commissions, timestamp: new Date().toISOString() };
          break;
        }
          
        case 'reports': {
          // Backup generated reports/documents
          const { data: documents } = await supabase.from('documents_generated').select('*');
          data = { documents, timestamp: new Date().toISOString() };
          break;
        }
          
        case 'dashboard': {
          // Backup all dashboard/admin data
          const { data: students } = await supabase.from('students').select('*');
          const { data: applications } = await supabase.from('student_applications').select('*');
          const { data: profiles } = await supabase.from('profiles').select('*');
          data = { students, applications, profiles, timestamp: new Date().toISOString() };
          break;
        }
          
        case 'full': {
          // Backup everything
          const tables = ['students', 'student_applications', 'profiles', 'fee_payments', 
                         'courses', 'documents', 'announcements', 'agent_profiles'] as const;
          
          const fullData: Record<string, any> = {};
          for (const table of tables) {
            const { data: tableData } = await supabase.from(table).select('*');
            fullData[table] = tableData;
          }
          fullData.timestamp = new Date().toISOString();
          data = fullData;
          break;
        }
      }
      
      // Create downloadable JSON file
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ncore-backup-${backupType}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Backup Complete",
        description: `${backupType} backup downloaded successfully`
      });
    } catch (error: any) {
      console.error('Backup error:', error);
      toast({
        title: "Backup Failed",
        description: error.message || "Failed to create backup",
        variant: "destructive"
      });
    } finally {
      setIsBackingUp(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Version</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemInfo.version}</div>
            <p className="text-xs text-muted-foreground">Current version</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Database</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemInfo.database}</div>
            <p className="text-xs text-muted-foreground">Database type</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemInfo.storageUsed}</div>
            <p className="text-xs text-muted-foreground">of 10 GB available</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Backup Management
            </CardTitle>
            <CardDescription>Create comprehensive backups of different data types</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Last Backup</p>
                <p className="text-sm text-muted-foreground">{systemInfo.lastBackup}</p>
              </div>
              <Badge variant="secondary">Completed</Badge>
            </div>
            
            <div className="space-y-2">
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => handleBackup('financial')}
                disabled={isBackingUp}
              >
                <Download className="h-4 w-4 mr-2" />
                Backup Financial Documents
              </Button>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => handleBackup('reports')}
                disabled={isBackingUp}
              >
                <FileText className="h-4 w-4 mr-2" />
                Backup Reports
              </Button>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => handleBackup('dashboard')}
                disabled={isBackingUp}
              >
                <HardDrive className="h-4 w-4 mr-2" />
                Backup Entire Dashboard
              </Button>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => handleBackup('full')}
                disabled={isBackingUp}
              >
                <Server className="h-4 w-4 mr-2" />
                Full Website Backup
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security Settings
            </CardTitle>
            <CardDescription>System security and access controls</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Password Policy</span>
                <Badge variant="default">Enabled</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Session Timeout</span>
                <Badge variant="secondary">24 hours</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Login Attempts</span>
                <Badge variant="secondary">5 max</Badge>
              </div>
            </div>
            
            <Button className="w-full" variant="outline">
              <Shield className="h-4 w-4 mr-2" />
              Configure Security
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
          <CardDescription>Current system status and information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">System Uptime:</span>
                <span className="text-sm text-muted-foreground">{systemInfo.uptime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Total Users:</span>
                <span className="text-sm text-muted-foreground">{systemInfo.totalUsers}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Database Size:</span>
                <span className="text-sm text-muted-foreground">156 MB</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Active Sessions:</span>
                <span className="text-sm text-muted-foreground">23</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Last Login:</span>
                <span className="text-sm text-muted-foreground">2 minutes ago</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">System Status:</span>
                <Badge variant="default">Online</Badge>
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <Button variant="outline" className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh System Status
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemSettings;