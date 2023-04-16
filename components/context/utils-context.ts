import React from 'react';

interface IUtilsContext {
  feedbackVisible: boolean;
  feedbackOpen: boolean;
  setFeedbackOpen: React.Dispatch<any>;
  setFeedbackVisible: React.Dispatch<any>;
  cartOpen: boolean;
  setCartOpen: React.Dispatch<any>;
}

export const UtilsContext = React.createContext<IUtilsContext>({
  feedbackVisible: true,
  feedbackOpen: false,
  setFeedbackOpen: () => {},
  setFeedbackVisible: () => {},
  cartOpen: false,
  setCartOpen: () => {},
});
