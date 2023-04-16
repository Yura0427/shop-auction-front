import React, { FC } from 'react';
import classes from './Switch.module.scss';

interface ISwitchProps {
  left: string;
  right: string;
}

export const Switch: FC<ISwitchProps> = ({ left, right }) => {
  return (
    <div className={classes.switch}>
      <span>{left}</span>
      <span>|</span>
      <span>{right}</span>
    </div>
  );
};
