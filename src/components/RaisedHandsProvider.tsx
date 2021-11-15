import React, { createContext, useCallback, useState } from 'react';

type RaisedHandsContextType = {
  raisedHandsWindowOpen: boolean;
  setRaisedHandsWindowOpen: (state: boolean) => void;
  toggleRaisedHandsWindow: () => void;
};

export const RaisedHandsContext = createContext<RaisedHandsContextType>(null!);

export const RaisedHandsProvider: React.FC = ({ children }) => {
  const [raisedHandsWindowOpen, setRaisedHandsWindowOpen] = useState(false);

  const toggleRaisedHandsWindow = useCallback(() => {
    setRaisedHandsWindowOpen(!raisedHandsWindowOpen);
  }, [raisedHandsWindowOpen]);

  return (
    <RaisedHandsContext.Provider value={{ raisedHandsWindowOpen, setRaisedHandsWindowOpen, toggleRaisedHandsWindow }}>
      {children}
    </RaisedHandsContext.Provider>
  );
};
