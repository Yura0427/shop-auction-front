import React, { FC, useContext, useEffect, useState } from 'react';
import { UserContext } from '../../context/user-context';
import { LoadingContext } from '../../context/loading-context';
import { useUserComments } from 'hooks/useComments';
import styles from './comments.module.scss';
import { Row, Spinner } from 'reactstrap';
import CommentItem from './commentItem';
import { useRouter } from 'next/router';
import { IGetComment } from '../../../interfaces/comment/comment';
import PaginationBlock from '../../pagination/pagination-block';

const Comments: FC = () => {
  const { user } = useContext(UserContext);
  if (!user) return null;

  const router = useRouter();
  const queryPage = +router.query.page;

  const { isLoading, setLoading } = useContext(LoadingContext);
  const [commentsPage, setCommentsPage] = useState<number>(queryPage || 1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [comments, setComments] = useState<IGetComment[]>([]);

  useEffect(() => {
    queryPage && setCommentsPage(queryPage);
  }, [queryPage]);
  const { data } = useUserComments(user.id, commentsPage);

  useEffect(() => {
    setLoading(true);
    if (!data) return;
    setTotalPages(data.totalPages);
    setComments(data.data);
    setLoading(false);
  }, [data]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [commentsPage]);

  const userComments = comments.length
    ? data?.data.map((comment) => (
        <CommentItem
          comment={comment}
          key={comment.id}
          commentsData={data}
          commentsPage={commentsPage}
          setCommentsPage={setCommentsPage}
        />
      ))
    : null;

  return (
    <div className={styles['reviews-container']}>
      <h2>Мої відгуки</h2>
      {isLoading ? (
        <span className={styles['spinner']}>
          <Spinner style={{ width: '5rem', height: '5rem' }} color="success" />
        </span>
      ) : (
        <div>
          <Row>{userComments}</Row>
          {comments.length ? (
            <PaginationBlock
              routerPush={null}
              totalPages={totalPages}
              setCurrentPage={setCommentsPage}
              currentPage={commentsPage}
            />
          ) : (
            <p style={{ fontSize: '1.1rem' }}>Ви ще не залишили жодного коментаря</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Comments;
