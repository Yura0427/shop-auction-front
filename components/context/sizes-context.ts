import React from 'react';

interface ISizesContext {
    isCurrentColor: string;
    setIsCurrentColor: React.Dispatch<any>;
    isCurrentSize: string;
    setIsCurrentSize: React.Dispatch<any>;
}

export const SizeContext = React.createContext<ISizesContext>({
    isCurrentColor: '',
    setIsCurrentColor: () => {},
    isCurrentSize: '',
    setIsCurrentSize: () => {},
});

