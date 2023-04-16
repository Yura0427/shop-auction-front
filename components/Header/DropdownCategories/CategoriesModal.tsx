import React, { FC, useEffect, useState } from 'react';
import { Modal } from 'reactstrap';

import styles from './DropdownCategories.module.scss';
import { IModalProps } from 'interfaces/modal';
import { ICategory, ICategoryMobile, ICategoryTree } from '../../../interfaces/category/category';
import { useCategories } from '../../../hooks/useCategories';
import { useRouter } from 'next/router';
import MenuHeader from '../MobileMenu/menu-header';
import MainCategoriesList from '../MobileMenu/main-categories-list';
import SubCategoriesList from '../MobileMenu/sub-categories-list';

interface CategoriesModalProps extends IModalProps {
  categories?: ICategory[];
}

const CategoriesModal: FC<CategoriesModalProps> = ({ toggle, isOpen }) => {
  const router = useRouter();
  const { allCategories } = useCategories();
  const [dropMenuOpen, setOpenDropMenu] = useState(false);
  const [subList, setSubList] = useState<ICategoryMobile>({
    step: 0,
    data: [],
    currentMpath: '',
  });
  const [navTitle, setNavTitle] = useState('Категорії');

  const subListHandler = (subCategory: ICategoryTree) => {
    const children = subCategory.children;

    setSubList((prevState) => ({
      ...prevState,
      data: [...prevState.data, children],
      step: prevState.step + 1,
      currentMpath: subCategory.mpath.slice(0, -1),
    }));
  };

  const changeDropList = (evt: React.SyntheticEvent<HTMLLIElement>) => {
    const id = evt.currentTarget.dataset.id;
    const categoryName = evt.currentTarget.textContent;
    const targetCategory = simpleCategories[categoriesIdsByIndex[+id!]];
    const hasChildren = targetCategory.children.length > 0;

    if (!hasChildren) {
      const mpath = targetCategory.mpath.slice(0, -1);
      let url = '';

      mpath.split('.').forEach((path) => {
        const { key } = simpleCategories[categoriesIdsByIndex[+path!]];
        url += `/${key}`;
      });
      router.push(url);
      return;
    }

    subListHandler(targetCategory);

    setOpenDropMenu(true);
    setNavTitle(categoryName!);
  };

  const restoreSublist = () => {
    while (!router.isReady) {}
    const path = router.asPath.split('/');
    let categoryName: string;
    let subListRestored: ICategoryMobile = {
      step: 0,
      data: [],
      currentMpath: '',
    };
    let doesToggleRequired = false;
    path.forEach((key) => {
      const targetCategory = simpleCategories[categoriesIdsByKey[key]];
      if (targetCategory && targetCategory.children.length) {
        doesToggleRequired = true;
        categoryName = targetCategory.name;
        subListRestored = {
          ...subListRestored,
          data: [...subListRestored.data, targetCategory.children],
          step: subListRestored.step + 1,
          currentMpath: targetCategory.mpath.slice(0, -1),
        };
      } else {
        doesToggleRequired = false;
      }
    });
    setSubList(subListRestored);
    setNavTitle(categoryName!);
    doesToggleRequired && toggle();
  };

  const stepBack = () => {
    if (subList.step === 1) {
      goHome();
    } else {
      const mpath = subList.currentMpath.split('.');
      const newMpath = mpath.slice(0, -1).join('.');
      const prevID = mpath[mpath.length - 2];
      const prevName = simpleCategories[categoriesIdsByIndex[+prevID]].name;

      setNavTitle(prevName);
      setSubList((prevState) => ({ ...prevState, currentMpath: newMpath }));
    }

    setSubList((prevState) => ({
      ...prevState,
      data: prevState.data.slice(0, -1),
      step: prevState.step - 1,
    }));
  };

  const goHome = () => {
    setOpenDropMenu(false);
    setNavTitle('Категорії');
    setSubList((prevState) => ({ ...prevState, currentMpath: '' }));
  };
  const goMain = () => {
    toggle()
    router.push('/')
  }

  useEffect(() => {
    if (dropMenuOpen) {
      setOpenDropMenu(false);
    }
    if (isOpen) toggle();

    restoreSublist();
  }, [router.query]);

  const flattenCategories = (category: ICategoryTree[] | ICategoryTree) => {
    const flattArr: ICategoryTree[] = [];

    (function flat(category) {
      (category as ICategoryTree[]).forEach((item) => {
        if (item.children.length) {
          flattArr.push(item);
          flat(item.children);
        } else {
          flattArr.push(item);
        }
      });
    })(category);

    return flattArr;
  };

  const simpleCategories = allCategories ? flattenCategories(allCategories!) : [];

  const categoriesIdsByIndex: Record<number, number> = {};
  simpleCategories.forEach((category, i) => {
    categoriesIdsByIndex[category.id] = i;
  });

  const categoriesIdsByKey = simpleCategories.reduce(
    (acc: { [key: string]: number }, category, index) => {
      acc[category.key] = index;
      return acc;
    },
    {}
  );

  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      modalClassName={styles.fade}
      className={styles.modal}
      contentClassName={styles.content}
      modalTransition={{ baseClass: styles.appearanceCenter, timeout: 0 }}
    >
      <MenuHeader data={{ toggle: goMain, step: subList.step, goBack: stepBack, navTitle }} />
      <div
        className={styles.categoriesWrapper}
        style={{ transform: `translateX(${-100 * subList.step}%)` }}
      >
        <MainCategoriesList allCategories={allCategories!} changeDropList={changeDropList} />
        <SubCategoriesList subList={subList.data} changeDropList={changeDropList} />
      </div>
    </Modal>
  );
};

export default CategoriesModal;
