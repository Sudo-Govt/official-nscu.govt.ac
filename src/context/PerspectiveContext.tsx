import React, { createContext, useContext, useState } from 'react';

interface PerspectiveUser {
  id: string;
  full_name: string;
  email: string;
  role: string;
}

interface PerspectiveContextType {
  perspectiveUser: PerspectiveUser | null;
  isInPerspectiveMode: boolean;
  enterPerspective: (user: PerspectiveUser) => void;
  exitPerspective: () => void;
}

const PerspectiveContext = createContext<PerspectiveContextType | undefined>(undefined);

export const PerspectiveProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [perspectiveUser, setPerspectiveUser] = useState<PerspectiveUser | null>(null);

  const enterPerspective = (user: PerspectiveUser) => {
    setPerspectiveUser(user);
  };

  const exitPerspective = () => {
    setPerspectiveUser(null);
  };

  return (
    <PerspectiveContext.Provider 
      value={{ 
        perspectiveUser, 
        isInPerspectiveMode: !!perspectiveUser,
        enterPerspective, 
        exitPerspective 
      }}
    >
      {children}
    </PerspectiveContext.Provider>
  );
};

export const usePerspective = () => {
  const context = useContext(PerspectiveContext);
  if (context === undefined) {
    throw new Error('usePerspective must be used within a PerspectiveProvider');
  }
  return context;
};
