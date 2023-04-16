import React, { FC } from 'react';
import Head from 'next/head';

import styles from './MainLayout.module.scss';
import { MetaData } from '../../interfaces/pages/dynamic-pages';

interface MainLayoutProps {
  children: React.ReactNode;
  metaData: MetaData;
}

const MainLayout: FC<MainLayoutProps> = ({ children, metaData }) => {
  const { title, description, addBrand, noIndex } = metaData;

  return (
    <>
      <Head>
        <title>{addBrand ? title + ' | Buy All Shop' : title}</title>
        <meta
          name="description"
          content={addBrand ? description + ' | Buy All Shop' : description}
        />
        {noIndex && <meta name="robots" content="noindex" />}
        <meta charSet="utf-8" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
        <script src="https://accounts.google.com/gsi/client" async defer></script> {/* https://developers.google.com/identity */}
      </Head>
      <main className={styles.mainContent}>{children}</main>
    </>
  );
};

export default MainLayout;
