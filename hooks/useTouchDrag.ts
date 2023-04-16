import { useRef } from 'react';

interface ITouchDrag {
  (): [RefObject<any>, (e: React.TouchEvent<any>) => void, () => void];
}

type RefObject<T> = {
  -readonly [K in keyof React.RefObject<T>]: React.RefObject<T>[K];
};

export const useTouchDrag: ITouchDrag = () => {
  const mainRef: RefObject<HTMLElement | null | undefined> = useRef();
  const temp: RefObject<any> = useRef();

  const handleTouchMove = (e: React.TouchEvent<any>) => {
    if (mainRef.current) {
      if (e.touches.length === 1 && temp.current) {
        mainRef.current.style.left = `${
          e.touches[0].pageX - temp.current.shiftX - temp.current.rect.x
        }px`;
        mainRef.current.style.top = `${
          e.touches[0].pageY - temp.current.shiftY - temp.current.rect.y
        }px`;
      }
      if (e.touches.length === 1 && !temp.current) {
        temp.current = { rect: mainRef.current.getBoundingClientRect() };
        temp.current.shiftX = e.touches[0].pageX - temp.current.rect.x;
        temp.current.shiftY = e.touches[0].pageY - temp.current.rect.y;
      }
    }
  };

  const handleTouchEnd = () => {
    temp.current = null;
  };

  return [mainRef, handleTouchMove, handleTouchEnd];
};
