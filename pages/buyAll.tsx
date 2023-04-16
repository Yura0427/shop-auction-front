import Link from 'next/link';
import Route from 'components/route/Route';
import styles from 'pages/buyAll.module.scss';
import React from 'react';

const BuyAll = () => {
  return (
    <div className={styles.container}>
      <div className={styles.aboutPage}>
        <div className={styles.logo}>
          <Route href="/">Buy All</Route>
        </div>
        <div className={styles.dFlex}>
          <div className={styles.textBlock}>
            <div className={styles.h10}>
              <div className={styles.collapse}>
                <div className={styles.line}></div>
              </div>
              <div className={styles.expand}>
                <div className={styles.interior}></div>
              </div>
              <div className={styles.close}></div>
            </div>
            <div className={styles.hLine}></div>
            <div className={styles.p15}>
              <h4>Наша мета</h4>
              <p>
                допомогти кожному знайти найкрутіші речі: <br />
                сукню для свята, зручне <br />
                взуття, стильні годинники, <br />
                яскраві прикраси, все для <br />
                спорту і відпочинку та <br />
                багато інших цікавих <br />
                речей
              </p>
            </div>
          </div>
          <div className={styles.basketBlock}>
            <div className={styles.sneakers}>
              <div className={styles.necklace}>
                <div className={styles.basket}></div>
              </div>
            </div>
            <Link href="/new-arrivals">
              <div className={styles.knowBtn}>
                дізнатися <br /> більше
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyAll;
