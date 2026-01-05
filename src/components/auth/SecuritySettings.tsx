import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Key } from 'lucide-react';
import MFAManagement from './MFAManagement';
import ChangePassword from '@/components/ChangePassword';

interface SecuritySettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SecuritySettings: React.FC<SecuritySettingsProps> = ({ open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Settings
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="2fa" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="2fa" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Two-Factor Auth
            </TabsTrigger>
            <TabsTrigger value="password" className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              Password
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="2fa" className="mt-4">
            <MFAManagement />
          </TabsContent>
          
          <TabsContent value="password" className="mt-4">
            <ChangePassword />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default SecuritySettings;
