import React, { createContext, useCallback, useState } from 'react';
import { AdminWindow } from './AdminWindow';

type AdminWindowContextType = {
  adminWindowOpen: boolean;
  setAdminWindowOpen: (state: boolean) => void;
  toggleAdminWindow: () => void;
};

export const AdminWindowContext = createContext<AdminWindowContextType>(null!);

export const RaisedHandsProvider: React.FC = ({ children }) => {
  const [adminWindowOpen, setAdminWindowOpen] = useState(false);

  const toggleAdminWindow = useCallback(() => {
    setAdminWindowOpen(!adminWindowOpen);
  }, [adminWindowOpen]);

  return (
    <AdminWindowContext.Provider value={{ adminWindowOpen, setAdminWindowOpen, toggleAdminWindow }}>
      <AdminWindow />
      {children}
    </AdminWindowContext.Provider>
  );
};
