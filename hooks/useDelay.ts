import { Dispatch, SetStateAction, useRef } from 'react';

interface useDelayProps {
  (itemState: boolean, itemSetter: Dispatch<SetStateAction<any>>, delay?: number): [
    () => void,
    () => void
  ];
}

export const useDelay: useDelayProps = (itemState, itemSetter, delay = 150) => {
  let isDelayStarted = useRef(false);

  const onShow = () => {
    if (itemState && !isDelayStarted.current) {
      isDelayStarted.current = true;
    }

    if (!itemState && !isDelayStarted.current) {
      isDelayStarted.current = true;
      setTimeout(() => {
        if (isDelayStarted.current) itemSetter(true);
      }, delay);
    }
  };

  const onLeave = () => {
    if (!itemState && isDelayStarted.current) {
      isDelayStarted.current = false;
    }

    if (itemState && isDelayStarted.current) {
      isDelayStarted.current = false;
      setTimeout(() => {
        if (!isDelayStarted.current) itemSetter(false);
      }, delay);
    }
  };
  return [onShow, onLeave];
};
