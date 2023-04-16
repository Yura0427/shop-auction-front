import React, { FC, useState, createRef, useEffect, MutableRefObject, useContext } from 'react';
import { Container } from 'reactstrap';
import { VscFeedback } from 'react-icons/vsc';
import { BsFillStarFill } from 'react-icons/bs';
import { MdKeyboardArrowDown, MdPayment } from 'react-icons/md';
import { GiReceiveMoney } from 'react-icons/gi';

import { ContactUs } from '@modals/contact-us/ContactUs';
import classes from './MainNav.module.scss';

import { useModal } from 'hooks/useModal';
import { DropdownCategories } from '../DropdownCategories/DropdownCategories';
import { ICategoryData } from '../../../interfaces/category/category';
import { useDelay } from 'hooks/useDelay';
import { CatalogIcon } from '../../svgs/CatalogIcon.svg';
import Route from '../../route/Route';
import { UserContext } from '../../../components/context/user-context';
import { api } from 'api';

export const MainNav: FC<ICategoryData> = ({ categories }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isDrawEnable, setIsDrawEnable] = useState(false);
  const [contactUsState, toggleContactUsState] = useModal();

  let categoryItemRef: MutableRefObject<any> = createRef();
  let hoveredInnerNav: MutableRefObject<any> = createRef();

  const dropdownHide = (): void => setDropdownOpen(false);
  const dropdownOpen = (): void => setDropdownOpen(true);
  const [onShow, onHide] = useDelay(isDropdownOpen, setDropdownOpen);

  const { user } = useContext(UserContext);
  useEffect(() => {
    if (!isDropdownOpen && categoryItemRef.current) {
      categoryItemRef.current.classList.remove(classes.categoryNavActive);
    }
  }, [isDropdownOpen]);
  useEffect(() => {
    api.parameters.getParametersByName('draw').then(({ data }) => {
      if (data) {
        setIsDrawEnable(data.settings.enable);
      }
    });
  }, []);

  const handleHover = () => {
    if (hoveredInnerNav.current) {
      hoveredInnerNav.current.classList.remove(classes.hoveredInnerNav);
    }
    onShow();
  };

  const handleBlur = () => {
    if (categoryItemRef.current && hoveredInnerNav.current) {
      categoryItemRef.current.classList.add(classes.categoryNavActive);
    }

    if (hoveredInnerNav.current) {
      hoveredInnerNav.current.classList.add(classes.hoveredInnerNav);
    }
    onHide();
  };

  const handleInnerNavHover = (innerNav: EventTarget & Element) => {
    hoveredInnerNav.current = innerNav;
  };

  const desktopCategoryLI = (
    <li
      onClick={dropdownOpen}
      onMouseEnter={handleHover}
      onMouseLeave={handleBlur}
      ref={categoryItemRef}
    >
      <div className={classes.mainwrapper}>
        <span className={classes.dropdown}>
          <CatalogIcon width={18} height={18} fill={'#3E484C'} />
          Категорії
        </span>
        <MdKeyboardArrowDown size={18} />
      </div>

      {isDropdownOpen && (
        <DropdownCategories
          categories={categories}
          isOpen={isDropdownOpen}
          dropdownHide={dropdownHide}
          onInnerNavHover={handleInnerNavHover}
        />
      )}
    </li>
  );

  return (
    <div className={classes.bottombar}>
      <Container className={classes.bottombar__inner}>
        <ul className={classes.bottombar__nav}>
          {desktopCategoryLI}
          <li>
            <Route href={'/new-arrivals'}>
              <BsFillStarFill size={18} color={'#ffa500'} />
              НОВИНКИ
            </Route>
          </li>
          <li>
            <MdPayment size={18} />
            Інформація про компанію
            <MdKeyboardArrowDown size={18} />
            <ul className={classes.sections}>
              <li>
                <Route href={'/about'}>Про нас</Route>
              </li>
              <li>
                <Route href={'/privacy-policy'}>Політика конфіденційності</Route>
              </li>
              <li>
                <Route href={'/offer'}>Оферта</Route>
              </li>
              <li>
                <Route href={'/payment-and-delivery'}>Оплата і доставка</Route>
              </li>
            </ul>
          </li>
          {user && isDrawEnable && (
            <li>
              <Route href={'/draw'}>
                <GiReceiveMoney size={18} color={'#4e5a5e'} />
                Розіграш
              </Route>
            </li>
          )}
          <li onClick={toggleContactUsState}>
            <VscFeedback size={18} />
            Зв'язатися з нами
          </li>
        </ul>
        <ContactUs isOpen={contactUsState} toggle={toggleContactUsState} />
      </Container>
    </div>
  );
};
