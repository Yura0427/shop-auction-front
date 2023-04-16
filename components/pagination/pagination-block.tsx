import React, { Dispatch, SetStateAction } from 'react';
import ReactPaginate from 'react-paginate';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

import styles from './pagination-block.module.scss';
import { useRouter } from 'next/router';

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  routerPush: boolean | null;
  setCurrentPage: Dispatch<SetStateAction<number>>;
}

const PaginationBlock: React.FC<PaginationProps> = ({
  totalPages,
  currentPage,
  setCurrentPage,
  routerPush,
}) => {
  interface IPage {
    selected: number;
  }

  const router = useRouter();
  const searchProduct = router.query.q as string;

  const handleChange = (page: IPage) => {
    if (routerPush) {
      router.push(`/search/?q=${searchProduct}&page=${page.selected + 1}`, undefined, {
        scroll: false,
      });
    }
    setCurrentPage(page.selected + 1);
  };

  return (
    <div className={styles['pagination-block']}>
      <ReactPaginate
        pageCount={totalPages}
        pageRangeDisplayed={3}
        marginPagesDisplayed={1}
        onPageChange={handleChange}
        previousLabel={<IoIosArrowBack size={20} />}
        nextLabel={<IoIosArrowForward size={20} />}
        pageClassName={styles.page}
        activeClassName={styles['active-page']}
        breakClassName={styles.break}
        disabledClassName={styles.disabled}
        forcePage={currentPage - 1}
      />
    </div>
  );
};

export default PaginationBlock;
