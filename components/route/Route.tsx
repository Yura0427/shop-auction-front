import { useRouter } from 'next/router';
import React, { FC, ReactNode } from 'react';

interface RouteProps {
  href: string;
  linkClass?: string;
  onClick?: () => void;
  children: ReactNode;
}

const Route: FC<RouteProps> = ({ href, linkClass, onClick, children }) => {
  const router = useRouter();

  const isExternal =
    !href.includes(process.env.NEXT_PUBLIC_REACT_APP_FRONT_DOMAIN as string) &&
    href.includes('http');

  const onClickHandler = async (evt: React.MouseEvent) => {
    if (!isExternal) {
      evt.preventDefault();
      await router.push(href);
    }

    onClick && onClick();
  };

  const onHoverHandler = async () => {
    if (isExternal) return;

    await router.prefetch(href);
  };

  return (
    <a
      target={isExternal ? '_blank' : undefined}
      onClick={onClickHandler}
      onMouseEnter={onHoverHandler}
      href={href}
      className={linkClass || undefined}
    >
      {children}
    </a>
  );
};

export default Route;
