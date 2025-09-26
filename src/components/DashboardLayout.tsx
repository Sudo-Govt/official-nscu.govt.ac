import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { 
  LogOut, 
  Menu, 
  X,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  subItems?: {
    id: string;
    label: string;
  }[];
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  menuItems: MenuItem[];
  defaultTab?: string;
  title: string;
  subtitle: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  menuItems,
  defaultTab = 'overview',
  title,
  subtitle
}) => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const allTabValues = menuItems.reduce((acc, item) => {
    acc.push(item.id);
    if (item.subItems) {
      acc.push(...item.subItems.map(sub => sub.id));
    }
    return acc;
  }, [] as string[]);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div className={cn(
        "bg-card border-r border-border transition-all duration-300 flex flex-col",
        sidebarOpen ? "w-80" : "w-16"
      )}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className={cn("flex items-center space-x-3", !sidebarOpen && "hidden")}>
            <img 
              src="/lovable-uploads/3dc31e79-5bd0-461f-a8f1-30c173bb258a.png" 
              alt="NSCU Logo" 
              className="h-8 w-auto"
            />
            <div>
              <h1 className="font-semibold text-foreground text-lg">{title}</h1>
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="h-8 w-8 p-0"
          >
            {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>

        {/* User Info */}
        <div className={cn(
          "p-4 border-b border-border",
          !sidebarOpen && "p-2"
        )}>
          <div className={cn("flex items-center space-x-3", !sidebarOpen && "justify-center")}>
            <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-primary font-semibold text-sm">
                {user?.full_name?.charAt(0)}
              </span>
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">{user?.full_name}</p>
                <Badge variant="secondary" className="text-xs">
                  {user?.role.toUpperCase()}
                </Badge>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto">
          <Tabs defaultValue={defaultTab} orientation="vertical" className="h-full">
            <div className="p-2">
              <TabsList className="grid w-full h-auto bg-transparent space-y-1" style={{
                display: 'grid',
                gridTemplateColumns: '1fr',
                gap: '4px'
              }}>
                {menuItems.map((item) => (
                  <div key={item.id} className="space-y-1">
                    {item.subItems ? (
                      // Parent item with sub-items
                      <div>
                        <button
                          onClick={() => toggleExpanded(item.id)}
                          className={cn(
                            "w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors",
                            "hover:bg-muted/50 text-muted-foreground",
                            !sidebarOpen && "justify-center"
                          )}
                        >
                          <div className="flex items-center space-x-3">
                            <item.icon className="h-4 w-4 shrink-0" />
                            {sidebarOpen && <span>{item.label}</span>}
                          </div>
                          {sidebarOpen && (
                            expandedItems.includes(item.id) ? 
                              <ChevronDown className="h-4 w-4" /> : 
                              <ChevronRight className="h-4 w-4" />
                          )}
                        </button>
                        {sidebarOpen && expandedItems.includes(item.id) && item.subItems && (
                          <div className="ml-6 space-y-1">
                            {item.subItems.map((subItem) => (
                              <TabsTrigger
                                key={subItem.id}
                                value={subItem.id}
                                className="w-full justify-start text-xs py-2 px-3 data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
                              >
                                {subItem.label}
                              </TabsTrigger>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      // Regular tab item
                      <TabsTrigger
                        value={item.id}
                        className={cn(
                          "w-full justify-start py-2 px-3 data-[state=active]:bg-primary/10 data-[state=active]:text-primary",
                          !sidebarOpen && "justify-center px-2"
                        )}
                      >
                        <div className="flex items-center space-x-3">
                          <item.icon className="h-4 w-4 shrink-0" />
                          {sidebarOpen && <span>{item.label}</span>}
                        </div>
                      </TabsTrigger>
                    )}
                  </div>
                ))}
              </TabsList>
            </div>

            {/* Tab Content */}
            <div className="flex-1">
              {React.Children.map(children, (child, index) => {
                if (React.isValidElement(child) && child.type === TabsContent) {
                  return child;
                }
                return null;
              })}
            </div>
          </Tabs>
        </div>

        {/* Logout Button */}
        <div className="p-4 border-t border-border">
          <Button
            variant="outline"
            onClick={logout}
            className={cn(
              "w-full justify-start",
              !sidebarOpen && "justify-center px-2"
            )}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {sidebarOpen && <span className="ml-2">Logout</span>}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <main className="flex-1 overflow-y-auto">
          <Tabs defaultValue={defaultTab} className="h-full">
            {children}
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;