import { useState } from 'react';

export const useModal = (): [ boolean, () => void ] => {
  const [ isShowing, setIsShowing ] = useState(false);

  function toggle() {
    setIsShowing(!isShowing);
  }

  return [
    isShowing,
    toggle
  ];
};
