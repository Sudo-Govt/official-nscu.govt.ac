import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Shield, Plus, Search, Code, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface RLSPolicy {
  schemaname: string;
  tablename: string;
  policyname: string;
  permissive: string;
  roles: string[];
  cmd: string;
  qual: string;
  with_check: string;
}

const RLSPolicyManager = () => {
  const [policies, setPolicies] = useState<RLSPolicy[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTable, setSelectedTable] = useState('all');
  const { toast } = useToast();

  const mockPolicies: RLSPolicy[] = [
    {
      schemaname: 'public',
      tablename: 'profiles',
      policyname: 'Users can view their own profile',
      permissive: 'PERMISSIVE',
      roles: ['authenticated'],
      cmd: 'SELECT',
      qual: '(auth.uid() = user_id)',
      with_check: ''
    },
    {
      schemaname: 'public',
      tablename: 'profiles',
      policyname: 'Admins can view all profiles',
      permissive: 'PERMISSIVE',
      roles: ['authenticated'],
      cmd: 'SELECT',
      qual: 'has_role(auth.uid(), \'admin\')',
      with_check: ''
    },
    {
      schemaname: 'public',
      tablename: 'user_roles',
      policyname: 'Only admins can manage roles',
      permissive: 'PERMISSIVE',
      roles: ['authenticated'],
      cmd: 'ALL',
      qual: 'has_role(auth.uid(), \'admin\')',
      with_check: 'has_role(auth.uid(), \'admin\')'
    },
    {
      schemaname: 'public',
      tablename: 'students',
      policyname: 'Students can view their own data',
      permissive: 'PERMISSIVE',
      roles: ['authenticated'],
      cmd: 'SELECT',
      qual: '(user_id = auth.uid())',
      with_check: ''
    },
    {
      schemaname: 'public',
      tablename: 'students',
      policyname: 'Admins can manage students',
      permissive: 'PERMISSIVE',
      roles: ['authenticated'],
      cmd: 'ALL',
      qual: 'has_role(auth.uid(), \'admin\')',
      with_check: 'has_role(auth.uid(), \'admin\')'
    }
  ];

  useEffect(() => {
    setPolicies(mockPolicies);
  }, []);

  const uniqueTables = [...new Set(mockPolicies.map(p => p.tablename))];

  const filteredPolicies = policies.filter(policy => {
    const matchesSearch = 
      policy.policyname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      policy.tablename.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTable = selectedTable === 'all' || policy.tablename === selectedTable;
    return matchesSearch && matchesTable;
  });

  const getCommandColor = (cmd: string) => {
    switch (cmd) {
      case 'SELECT': return 'bg-blue-500/10 text-blue-500';
      case 'INSERT': return 'bg-green-500/10 text-green-500';
      case 'UPDATE': return 'bg-yellow-500/10 text-yellow-500';
      case 'DELETE': return 'bg-red-500/10 text-red-500';
      case 'ALL': return 'bg-purple-500/10 text-purple-500';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">Row Level Security Policies</CardTitle>
              <CardDescription>View and manage database access policies</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
              <div>
                <p className="font-semibold text-yellow-500 mb-1">Read-Only Mode</p>
                <p className="text-sm text-muted-foreground">
                  RLS policies are displayed for monitoring purposes. To modify policies, use database migrations.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search policies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={selectedTable} onValueChange={setSelectedTable}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by table" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tables</SelectItem>
                {uniqueTables.map(table => (
                  <SelectItem key={table} value={table}>{table}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            {filteredPolicies.map((policy, index) => (
              <Card key={index} className="border-l-4 border-l-primary">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Code className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-mono text-muted-foreground">
                          {policy.schemaname}.{policy.tablename}
                        </span>
                      </div>
                      <CardTitle className="text-lg">{policy.policyname}</CardTitle>
                    </div>
                    <Badge className={getCommandColor(policy.cmd)}>
                      {policy.cmd}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {policy.qual && (
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">USING Expression</Label>
                      <div className="bg-muted rounded-md p-3">
                        <code className="text-sm font-mono">{policy.qual}</code>
                      </div>
                    </div>
                  )}
                  {policy.with_check && (
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">WITH CHECK Expression</Label>
                      <div className="bg-muted rounded-md p-3">
                        <code className="text-sm font-mono">{policy.with_check}</code>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-2 pt-2">
                    <Badge variant="outline" className="text-xs">
                      {policy.permissive}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Roles: {policy.roles.join(', ')}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RLSPolicyManager;
