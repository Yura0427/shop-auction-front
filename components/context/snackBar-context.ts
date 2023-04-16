import React from 'react';

interface ISnackBarContext {
  showSnackBar: (message: string, success: boolean) => void;
}

export const SnackBarContext = React.createContext<ISnackBarContext>({
  showSnackBar: () => {},
});
