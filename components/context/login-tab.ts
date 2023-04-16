import React from 'react';

interface ILoginTab {
  currentTab: number;
  setCurrentTab: React.Dispatch<any>;
}

export const LoginTab = React.createContext<ILoginTab>({
  currentTab: 0,
  setCurrentTab: () => {},
});
