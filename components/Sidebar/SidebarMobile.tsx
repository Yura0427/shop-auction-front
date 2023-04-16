import React, { FC, useEffect } from 'react';
import { Button } from 'reactstrap';
import styles from '../SideMenu/SideMenu.module.scss';
import { IoMdClose } from 'react-icons/io';
import Filters from '../filters/filters';
import { useRouter } from 'next/router';
import { useCategory } from '../../hooks/useCategory';
import ReactDOM from 'react-dom';
import { getLastUrlSegment } from '../../utils/urlValidation';

interface FiltersProps {
  mobileSidebar: boolean;
  closeMobileFilters: () => void;
}

const SidebarMobile: FC<FiltersProps> = ({ mobileSidebar, closeMobileFilters }) => {
  const categoryQuery = getLastUrlSegment(useRouter().query.slug as string[]);
  const { category: relatedCategory } = useCategory(categoryQuery);

  useEffect(() => {
    mobileSidebar
      ? document.body.classList.add('modal-open')
      : document.body.classList.remove('modal-open');
  }, [mobileSidebar]);

  if (relatedCategory) {
    const filteredGroups = relatedCategory.characteristicGroup.filter(
      (group) => group.characteristic.length
    );
    return ReactDOM.createPortal(
      <div
        className={mobileSidebar ? styles.openMobileSidebarWindow : styles.closeMobileSidebarWindow}
      >
        <div className={styles.sideMenu}>
          <div className={styles.sideMenuHeader}>
            <div>
              <div className={styles.logo}>buy All</div>
              <Button onClick={() => closeMobileFilters()} className={styles.close}>
                <IoMdClose size={35} color="white" />
              </Button>
            </div>
          </div>
        </div>
        <div className={styles.mobileFilters}>
          <Filters filteredGroups={filteredGroups} priceRange={{ ...relatedCategory.priceRange }} />
        </div>
      </div>,
      document.body
    );
  }
  return null;
};

export default SidebarMobile;
