import React, { FC, useContext, useState } from 'react';
import {
  ButtonDropdown,
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  ListGroup,
  ListGroupItem,
} from 'reactstrap';
import { RiChatSettingsLine } from 'react-icons/ri';
import Image from 'next/image';
import parse from 'html-react-parser';

import { IGetComment, IGetListUserComments } from 'interfaces/comment/comment';
import { UserContext } from '../../context/user-context';
import { api } from '../../../api';
import ReviewForm from '../../products/products-tabs/review-tab/review-form/review-form';
import ConfirmDelete from '@modals/confirm-delete/confirm-delete';
import styles from './comments.module.scss';
import apiUrl from '../../../api/config';
import { useUserComments } from 'hooks/useComments';
import Route from '../../route/Route';

const CommentItem: FC<IGetListUserComments> = ({
  comment,
  commentsPage,
  setCommentsPage,
  commentsData,
}) => {
  const { product } = comment;
  const { user } = useContext(UserContext);

  const { mutate } = useUserComments(user!.id, commentsPage);

  const [dropdownOpen, setOpen] = useState(false);
  const toggle = () => setOpen(!dropdownOpen);

  const [editMode, setEditMode] = useState<boolean>(false);

  const onEditClick = () => {
    setEditMode(true);
    setCommentToUpdate(comment);
  };

  const cancelEditMode = () => {
    setEditMode(false);
    setCommentToUpdate(null);
  };

  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);

  const onDeleteClick = () => {
    if (!comment.id) return;
    setItemToDelete(comment.id);
    setOpenDeleteModal(true);
  };

  const baseUrl = product.url;

  const [commentToUpdate, setCommentToUpdate] = useState<IGetComment | null>(null);

  const getFormValue = async (text: string) => {
    if (!text || !user || !comment) return;
    if (commentToUpdate) {
      const updatedComment =
        commentToUpdate.id && (await api.comments.updateComment(commentToUpdate.id, { text }));
      if (!updatedComment) return;
      const updatedComments = commentsData.data.map((comment) =>
        comment.id === updatedComment.data.id ? updatedComment.data : comment
      );
      mutate({ ...commentsData!, data: updatedComments }, false);
    }
  };

  const [itemToDelete, setItemToDelete] = useState<number>(0);

  const handleDeleteItem = async () => {
    const updatedCommentsOnPage: IGetComment[] =
      commentsData.data.filter((comment) => comment.id !== itemToDelete) || [];

    await api.comments.deleteComment(itemToDelete);

    if (!updatedCommentsOnPage.length && commentsPage > 1) {
      setCommentsPage(commentsPage - 1);
    }
    mutate();
  };

  return (
    <Col sm="12">
      <ListGroup>
        {commentToUpdate && (
          <ReviewForm
            editMode={editMode}
            cancelEditMode={cancelEditMode}
            initialText={commentToUpdate ? commentToUpdate.text : ''}
            setCommentToUpdate={setCommentToUpdate}
            getFormValue={getFormValue}
          />
        )}

        {openDeleteModal && (
          <ConfirmDelete
            openModal={openDeleteModal}
            toggle={() => setOpenDeleteModal(!openDeleteModal)}
            handleDelete={handleDeleteItem}
          />
        )}

        <ListGroupItem className={styles['comment-list-item']} key={comment.id}>
          {product ? (
            <div className={styles['header']}>
              <div className={styles['header-product']}>
                <div className={styles['header-product-img']}>
                  <Route href={`${baseUrl}/${product.key}`}>
                    {product.mainImg ? (
                      <Image
                        width={70}
                        height={70}
                        src={`${apiUrl}/static/uploads/${product.mainImg.name}`}
                        alt={`${product.mainImg.name}`}
                      />
                    ) : (
                      <Image
                        width={70}
                        height={70}
                        src={`${apiUrl}/static/uploads/empty-preview.png`}
                        alt={`${product.name}`}
                      />
                    )}
                  </Route>
                </div>
                <div className={styles['header-product-text']}>
                  <span className={styles['product-name']}>
                    <Route href={`${baseUrl}/${product.key}`} linkClass={styles.title}>
                      {parse(product.name)}
                    </Route>
                  </span>
                  <span className={styles['comment-date']}>
                    {comment.updatedAt && new Date(comment.updatedAt).toLocaleString()}
                  </span>
                </div>
              </div>

              {comment ? (
                <ButtonDropdown isOpen={dropdownOpen} toggle={toggle} direction="left">
                  <DropdownToggle caret color="default" size="sm" className={styles.toggle}>
                    <RiChatSettingsLine size={20} />
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem onClick={onEditClick}>Редагувати</DropdownItem>
                    <DropdownItem onClick={onDeleteClick}>Видалити</DropdownItem>
                  </DropdownMenu>
                </ButtonDropdown>
              ) : null}
            </div>
          ) : null}

          <div className={styles['comment-list-item-body']}>
            <p>
              <span className={styles['comment-list-item-text']}>{comment.text}</span>
            </p>
          </div>
        </ListGroupItem>
      </ListGroup>
    </Col>
  );
};

export default CommentItem;
