import { FC } from 'react';
import { CustomSvg } from '../../interfaces/customSvg';

export const LoveSvg: FC<CustomSvg> = ({ className, color, width, height }) => {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 37 34"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M36 11.2157C36 20.7602 18.5 32 18.5 32C18.5 32 1 20.7602 1 11.2157C1 -1 14.6111 -1.48444 18.5 6.26703C21.9028 -1.48445 36 -1 36 11.2157Z"
        strokeWidth="2"
      />
    </svg>
  );
};
