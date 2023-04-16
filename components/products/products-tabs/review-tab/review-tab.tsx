import React, { FC, useContext, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { Col, Row, TabPane, ListGroup, Button } from 'reactstrap';

import { useComments } from 'hooks/useComments';
import PaginationBlock from 'components/pagination/pagination-block';
import ReviewListItem from './review-list-item/review-list-item';
import ReviewForm from './review-form/review-form';
import ReviewAuth from './review-auth/review-auth';
import { IGetComment, ReviewsProps } from 'interfaces/comment/comment';
import { api } from 'api';
import { LoadingContext } from 'components/context/loading-context';
import styles from './review-tab.module.scss';
import { UserContext } from '../../../context/user-context';

const ReviewTab: FC<ReviewsProps> = ({ product, initialComments, activeTab }) => {
  const router = useRouter();

  const queryPage = useMemo(
    () => router.query.page && Number(router.query.page),
    [router.query.page]
  );

  const { user } = useContext(UserContext);

  const [commentsPage, setCommentsPage] = useState<number>(queryPage || 1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [count, setCount] = useState<number>(0);
  const [comments, setComments] = useState<IGetComment[]>([]);

  useEffect(() => {
    queryPage && setCommentsPage(queryPage);
  }, [queryPage]);

  const { commentsData, mutate } =
    commentsPage === 1
      ? useComments(product.id, commentsPage, initialComments)
      : useComments(product.id, commentsPage);

  useEffect(() => {
    if (!commentsData) return;

    setTotalPages(commentsData.totalPages);
    setCount(commentsData.count);
    setComments(commentsData.data);
  }, [commentsData]);

  const { setLoading } = useContext(LoadingContext);
  const [error, setError] = useState<boolean>(false);

  const baseUrl = `${product.url}/${product.key}?tab=reviews`;

  useEffect(() => {
    if (activeTab === '3') {
      commentsPage === 1
        ? router.push(baseUrl, undefined, { shallow: true })
        : router.push(`${baseUrl}&page=${commentsPage}`, undefined, { shallow: true });
    }

    const getComments = async () => {
      setLoading(true);
      try {
        const response = await api.comments.getByProduct(product.id, commentsPage);
        await mutate(
          {
            ...commentsData!,
            data: response.data.data,
            count: response.data.count,
            totalPages: response.data.totalPages,
          },
          false
        );
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    getComments();

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [commentsPage, activeTab]);

  const resetError = () => {
    setCommentsPage(1);
    setError(false);
  };

  const [commentToUpdate, setCommentToUpdate] = useState<IGetComment | null>(null);

  const getFormValue = async (text: string) => {
    if (!text || !user || !commentsData) return;

    if (commentToUpdate) {
      const updatedComment =
        commentToUpdate.id && (await api.comments.updateComment(commentToUpdate.id, { text }));

      if (!updatedComment) return;

      const updatedComments = commentsData.data.map((comment) =>
        comment.id === updatedComment.data.id ? updatedComment.data : comment
      );

      mutate({ ...commentsData!, data: updatedComments }, false);
    } else {
      const newComment = await api.comments.addComment({ text, productId: product.id });
      const newData = [...commentsData.data, newComment.data];
      const sortNewData = newData.sort((a, b) => b.id! - a.id!);
      if (sortNewData.length > 10) {
        sortNewData.length = 10;
      }

      if (commentsPage !== 1) {
        setCommentsPage(1);
      } else {
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });

        mutate(
          {
            ...commentsData,
            data: sortNewData,
            count: count + 1,
            totalPages: count % 10 === 0 ? commentsData.totalPages + 1 : totalPages || 1,
          },
          false
        );
      }
    }
  };

  const [itemToDelete, setItemToDelete] = useState<number>(0);

  const handleDeleteItem = async () => {
    const updatedCommentsOnPage: IGetComment[] =
      commentsData?.data.filter((comment) => comment.id !== itemToDelete) || [];

    await api.comments.deleteComment(itemToDelete);

    if (!updatedCommentsOnPage.length && commentsPage > 1) {
      setCommentsPage(commentsPage - 1);
    }
    mutate();
  };

  return (
    <>
      {activeTab === '3' ? (
        <div className={styles['reviews-container']}>
          {error ? (
            <>
              <div className={styles['error-msg']}>
                <p>Такої сторінки не існує. Перейти на </p>
                <Button color="link" onClick={resetError} className={styles['btn-link']}>
                  першу сторінку
                </Button>
              </div>
            </>
          ) : (
            <TabPane tabId="3">
              <Row>
                <Col sm="12">
                  <p className={styles['reviews-count']}>Відгуків ({count || 0})</p>

                  {comments && comments.length ? (
                    <>
                      <ListGroup>
                        {comments.map((comment) => (
                          <ReviewListItem
                            key={comment.id}
                            comment={comment}
                            getFormValue={getFormValue}
                            commentToUpdate={commentToUpdate}
                            setCommentToUpdate={setCommentToUpdate}
                            setItemToDelete={setItemToDelete}
                            handleDeleteItem={handleDeleteItem}
                          />
                        ))}
                      </ListGroup>

                      <PaginationBlock
                        totalPages={totalPages}
                        setCurrentPage={setCommentsPage}
                        currentPage={commentsPage}
                        routerPush={null}
                      />
                    </>
                  ) : (
                    <p>Немає відгуків про цей товар.</p>
                  )}

                  <div className={styles['reviews-form-wrapper']}>
                    {!user ? (
                      <ReviewAuth
                        beginningOfPhrase={'Є що сказати? Будь ласка, '}
                        endOfPhrase={' щоб залишити відгук.'}
                      />
                    ) : (
                      <ReviewForm editMode={false} mainForm={true} getFormValue={getFormValue} />
                    )}
                  </div>
                </Col>
              </Row>
            </TabPane>
          )}
        </div>
      ) : null}
    </>
  );
};

export default ReviewTab;
