import React, { FC } from 'react';
import { IoIosArrowBack, IoMdClose } from 'react-icons/io';
import { Button } from 'reactstrap';
import classNames from 'classnames';

import styles from '../DropdownCategories/DropdownCategories.module.scss';

interface MobileMenuHeaderProps {
  data: {
    step: number;
    goBack: () => void;
    toggle?: () => void;
    navTitle: string;
  };
}

const MenuHeader: FC<MobileMenuHeaderProps> = ({ data }) => {
  const { step, goBack, toggle, navTitle } = data;

  return (
    <div className={styles.dropdownHeader}>
      <Button
        className={classNames(styles.goBackBtn, {
          [styles.goBackBtnDisabled]: step === 0,
        })}
        onClick={goBack}
      >
        <IoIosArrowBack size={25} />
      </Button>
      <span
        className={classNames(styles.categoryName, {
          [styles.categoryNameTranslated]: step === 0,
        })}
      >
        {navTitle}
      </span>
      <Button className={styles.close} onClick={toggle}>
        <IoMdClose size={25} color={styles.fontColor} />
      </Button>
    </div>
  );
};

export default MenuHeader;
