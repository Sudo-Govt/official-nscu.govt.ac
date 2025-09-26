import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LogOut } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarHeader,
  useSidebar,
} from '@/components/ui/sidebar';

interface MenuItem {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  onClick?: () => void;
}

interface MenuGroup {
  label: string;
  items: MenuItem[];
}

interface DashboardLayoutProps {
  title: string;
  subtitle: string;
  userBadge?: string;
  menuGroups: MenuGroup[];
  activeTab: string;
  children: React.ReactNode;
}

function DashboardSidebar({ menuGroups, activeTab }: { menuGroups: MenuGroup[], activeTab: string }) {
  const { user, logout } = useAuth();

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="border-b px-6 py-4">
        <div className="flex items-center space-x-3">
          <img 
            src="/lovable-uploads/3dc31e79-5bd0-461f-a8f1-30c173bb258a.png" 
            alt="NSCU Logo" 
            className="h-8 w-auto"
          />
          <div className="flex flex-col">
            <span className="font-semibold text-foreground">NSCU Portal</span>
            <span className="text-xs text-muted-foreground">{user?.full_name}</span>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        {menuGroups.map((group, groupIndex) => (
          <SidebarGroup key={groupIndex}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.value}>
                    <SidebarMenuButton
                      onClick={item.onClick}
                      isActive={activeTab === item.value}
                      className="w-full justify-start"
                    >
                      <item.icon className="mr-3 h-4 w-4" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
        
        {/* Logout at bottom */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={logout}
                  className="w-full justify-start text-destructive hover:text-destructive"
                >
                  <LogOut className="mr-3 h-4 w-4" />
                  <span>Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export default function DashboardLayout({ 
  title, 
  subtitle, 
  userBadge,
  menuGroups, 
  activeTab, 
  children 
}: DashboardLayoutProps) {
  const { user } = useAuth();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <DashboardSidebar menuGroups={menuGroups} activeTab={activeTab} />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Header */}
          <header className="border-b bg-card/50 backdrop-blur-sm">
            <div className="flex h-16 items-center justify-between px-6">
              <div className="flex items-center space-x-4">
                <SidebarTrigger />
                <div>
                  <h1 className="text-xl font-semibold text-foreground">{title}</h1>
                  <p className="text-sm text-muted-foreground">{subtitle}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                {userBadge && (
                  <Badge variant="secondary">{userBadge}</Badge>
                )}
                <div className="text-right">
                  <p className="text-sm font-medium">{user?.full_name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
                </div>
              </div>
            </div>
          </header>
          
          {/* Main Content */}
          <main className="flex-1 overflow-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}