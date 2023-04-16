import { FC } from 'react';

import classes from '../Footer.module.scss';
import Route from '../../route/Route';

export const CopyrightSection: FC = () => {
  const year = new Date().getFullYear();

  return (
    <section>
      <div className={classes.footer__logo}>
        <Route href="/">
          <a>buy All</a>
        </Route>
      </div>
      <span className={classes.footer__copy}>&copy; {year} buy All</span>
    </section>
  );
};
