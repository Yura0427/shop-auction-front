import { Dispatch, SetStateAction } from 'react';

import { IProduct, IProductComment, IProductPreviewImg } from 'interfaces/product/products';
import { IAvatar } from 'interfaces/user/userData';
import { BaseEntity } from '../baseEntity';
import { ICategory } from 'interfaces/category/category';

export interface IComment extends BaseEntity {
  text: string;
}

export interface IGetComment extends IComment {
  author: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    avatar: IAvatar;
  };
  product: {
    id: number;
    category: ICategory;
    key: string;
    url: string;
    mainImg: {
      id: number;
      name: string;
    };
    name: string;
    price: string;
  };
}

export interface ICommentResponse extends BaseEntity, IComment {
  data: IGetComment[];
  count: number;
  totalPages: number;
}

export interface IAddComment {
  text: string;
  productId: number;
}

export interface IUpdateComment {
  text: string;
}

export interface ReviewsProps {
  product: IProduct;
  initialComments: ICommentResponse;
  activeTab: string;
}

export interface IUserComment extends IProductComment {
  mainImg: IProductPreviewImg | null;
  category: ICategory;
}

export interface IReviewForm {
  editMode: boolean;
  cancelEditMode?: () => void;
  mainForm?: boolean;
  initialText?: string;
  setCommentToUpdate?: Dispatch<SetStateAction<IGetComment | null>>;
  getFormValue: (c: string) => void;
  comment?: IGetComment | null;
}

export interface IReviewListItem {
  comment: IGetComment;
  getFormValue: (c: string) => void;
  commentToUpdate: IGetComment | null;
  setCommentToUpdate?: Dispatch<SetStateAction<IGetComment | null>>;
  setItemToDelete?: Dispatch<SetStateAction<number>>;
  handleDeleteItem?: () => void;
}

export interface IGetListUserComments {
  comment: IGetComment;
  commentsData: ICommentResponse;
  setCommentsPage: Dispatch<SetStateAction<number>>;
  commentsPage: number;
}

export interface IActionButtons {
  comment: IGetComment;
  setEditMode: () => void;
  onDeleteClick: (id: number) => void;
  setCommentToUpdate: Dispatch<SetStateAction<IGetComment | null>>;
}

export interface IBtnLink {
  text: string;
  handleClick: () => void;
}
