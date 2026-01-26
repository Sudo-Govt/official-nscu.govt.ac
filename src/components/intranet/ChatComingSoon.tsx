import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MessageCircle, Clock, Bell } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export const ChatComingSoon = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size="icon"
          className="fixed bottom-8 right-8 h-14 w-14 rounded-full shadow-lg z-50"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[400px] sm:w-[450px] p-0">
        <div className="flex h-full flex-col items-center justify-center p-8 text-center">
          <div className="relative mb-6">
            <div className="p-6 rounded-full bg-primary/10">
              <MessageCircle className="h-16 w-16 text-primary" />
            </div>
            <div className="absolute -top-2 -right-2 p-2 rounded-full bg-accent">
              <Clock className="h-6 w-6 text-accent-foreground" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold mb-2">
            Chat Coming Soon
          </h2>
          
          <p className="text-muted-foreground mb-6 max-w-sm">
            We're working on enhancing your messaging experience. The instant chat feature will be available shortly with improved functionality.
          </p>
          
          <Card className="w-full p-4 bg-muted/50 border-dashed">
            <div className="flex items-start gap-3">
              <Bell className="h-5 w-5 text-primary mt-0.5" />
              <div className="text-left">
                <p className="font-medium text-sm">Stay Connected</p>
                <p className="text-xs text-muted-foreground mt-1">
                  In the meantime, you can use the internal messaging system available in your dashboard for communication.
                </p>
              </div>
            </div>
          </Card>
          
          <div className="mt-8 flex flex-col gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
              <span>Under Development</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <span>Internal Mail System Available</span>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ChatComingSoon;
