import React from 'react';

interface ILoadingContext {
  isLoading: boolean;
  setLoading: React.Dispatch<any>;
}

export const LoadingContext = React.createContext<ILoadingContext>({
  isLoading: false,
  setLoading: () => {},
});

