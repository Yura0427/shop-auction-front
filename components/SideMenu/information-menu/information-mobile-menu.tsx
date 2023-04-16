import { FC } from 'react';
import Route from '../../route/Route';
import styles from './information-mobile-menu.module.scss';

type SideMenuProps = {
  toggleSideMenu: () => void;
};

const InformationMobileMenu: FC<SideMenuProps> = ({ toggleSideMenu }) => {
  return (
    <ul className={styles.sections}>
      <li>
        <Route href={'/about'} onClick={() => toggleSideMenu()}>
          Про нас
        </Route>
      </li>
      <li>
        <Route href={'/privacy-policy'} onClick={() => toggleSideMenu()}>
          Політика конфіденційності
        </Route>
      </li>
      <li>
        <Route href={'/offer'} onClick={() => toggleSideMenu()}>
          Оферта
        </Route>
      </li>
      <li>
        <Route href={'/payment-and-delivery'} onClick={() => toggleSideMenu()}>
          Оплата і доставка
        </Route>
      </li>
    </ul>
  );
};

export default InformationMobileMenu;
