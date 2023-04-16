import React, { FC, useContext, useEffect, useState } from 'react';
import { ModalBody, Nav, NavItem, NavLink } from 'reactstrap';
import classnames from 'classnames';
import style from '../modals/auth/auth.module.scss';

import { EAuthTabs } from 'interfaces/modal';
import { LoginForm } from '@forms/auth/login';
import { RegisterForm } from '@forms/auth/register';
import { UserContext } from '../context/user-context';
import { FastOrderRegisterForm } from '@forms/auth/fast-order';
import { UseProductsInCart } from '../../hooks/cart/useProductsInCart';
import { IPopoverState } from '../../interfaces/user/auth';
import { LoginTab } from '../../components/context/login-tab';

export interface AuthModalProps {
  headerName?: string;
  activeTab?: any;
  toggleConfirmed?: () => void | undefined;
  fastOrder?: boolean;
  visible?: boolean;
  popoverState?: IPopoverState;
  popoverOpen?: boolean;
  formik?: any;
  toggle?: () => void;
  returnToTab: number;
}

export const Auth: FC<AuthModalProps> = ({
  formik,
  visible,
  popoverState,
  popoverOpen,
  toggle,
  toggleConfirmed,
  headerName = '',
  activeTab,
  fastOrder,
  returnToTab,
}) => {
  const { user } = useContext(UserContext);
  const { productsInCart } = UseProductsInCart();
  const [tab, setTab] = useState(activeTab);
  const { setCurrentTab } = useContext(LoginTab);


  useEffect(() => {
    if (fastOrder) setTab(EAuthTabs.fastOrder);
  }, [user]);

  useEffect(() => {
    if (!productsInCart?.length) {
      setTab(activeTab);
      setCurrentTab(activeTab);
    }
  }, [productsInCart?.length]);

  return (
    <>
      {!user && (
        <header>
          <div className={style.Auth__modal__header__name}>{headerName}</div>
          <Nav tabs className={style.navTabs}>
            {fastOrder && productsInCart?.length ? (
              <NavItem>
                <NavLink
                  className={classnames({ active: tab === EAuthTabs.fastOrder })}
                  onClick={() => {
                    setCurrentTab(EAuthTabs.fastOrder);
                    setTab(EAuthTabs.fastOrder);
                    if (typeof activeTab === 'function') activeTab(EAuthTabs.fastOrder);
                  }}
                >
                  Швидке замовлення
                </NavLink>
              </NavItem>
            ) : null}
            <NavItem>
              <NavLink
                className={classnames({ active: tab === EAuthTabs.login })}
                onClick={() => {
                  setCurrentTab(EAuthTabs.login);
                  setTab(EAuthTabs.login);
                  if (typeof activeTab === 'function') activeTab(EAuthTabs.login);
                }}
              >
                Увійти
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: tab === EAuthTabs.register })}
                onClick={() => {
                  setCurrentTab(EAuthTabs.register);
                  setTab(EAuthTabs.register);
                  if (typeof activeTab === 'function') activeTab(EAuthTabs.register);
                }}
              >
                Реєстрація
              </NavLink>
            </NavItem>
          </Nav>
        </header>
      )}
      <ModalBody className={style.modalBody}>
        {tab === EAuthTabs.fastOrder && (
          <FastOrderRegisterForm
            formik={formik}
            visible={visible}
            popoverState={popoverState}
            popoverOpen={popoverOpen}
          />
        )}
        {tab === EAuthTabs.login && (
          <LoginForm toggle={toggle} returnToTabHandler={() => setTab(returnToTab)} />
        )}
        {tab === EAuthTabs.register && (
          <RegisterForm
            toggle={toggle}
            toggleConfirmed={toggleConfirmed}
            returnToTabHandler={() => setTab(returnToTab)}
          />
        )}
      </ModalBody>
    </>
  );
};
