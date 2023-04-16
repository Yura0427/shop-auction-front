import React, { FC, useContext, useState } from 'react';
import {
  ButtonDropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  ListGroupItem,
} from 'reactstrap';
import Avatar from 'react-avatar';
import { RiChatSettingsLine } from 'react-icons/ri';
import moment from 'moment';

import { IReviewListItem } from 'interfaces/comment/comment';
import ReviewForm from '../review-form/review-form';
import ConfirmDelete from '@modals/confirm-delete/confirm-delete';
import apiUrl from 'api/config';
import { UserContext } from 'components/context/user-context';
import styles from './review-list-item.module.scss';

const ReviewListItem: FC<IReviewListItem> = ({
  comment,
  getFormValue,
  commentToUpdate,
  setCommentToUpdate = () => {},
  setItemToDelete = () => {},
  handleDeleteItem = () => {},
}) => {
  const { user } = useContext(UserContext);
  const { updatedAt } = comment;
  const [dropdownOpen, setOpen] = useState(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);

  const setDate = (dateType?: string): string => {
    return moment(dateType).local().format('YYYY.M.D H:mm');
  };

  const toggle = () => setOpen(!dropdownOpen);

  const onEditClick = () => {
    setEditMode(true);
    setCommentToUpdate(comment);
  };

  const cancelEditMode = () => {
    setEditMode(false);
    setCommentToUpdate(null);
  };

  const onDeleteClick = () => {
    if (!comment.id) return;
    setItemToDelete(comment.id);
    setOpenDeleteModal(true);
  };

  return (
    <>
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

      <ListGroupItem
        className={!editMode ? styles['comment-list-item'] : styles['hide-container']}
        key={comment.id}
      >
        {comment.author ? (
          <div className={styles['header']}>
            <div className={styles['header-author']}>
              {comment.author.avatar ? (
                <Avatar
                  name={`${comment.author.lastName} ${comment.author.firstName}`}
                  size="45"
                  round={true}
                  src={`${apiUrl}/static/uploads/avatar/${comment.author.avatar.name}`}
                />
              ) : (
                <Avatar
                  name={`${comment.author.lastName} ${comment.author.firstName}`}
                  size="45"
                  round={true}
                />
              )}

              <div className={styles['header-author-text']}>
                <span className={styles['author-name']}>
                  {comment.author.lastName} {comment.author.firstName}
                </span>
                <span className={styles['comment-date']}>{setDate(updatedAt)}</span>
              </div>
            </div>

            {comment && user?.id === comment.author.id ? (
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
    </>
  );
};

export default ReviewListItem;
