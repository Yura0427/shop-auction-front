import { BaseEntity } from '../baseEntity';

export interface IFeedback extends BaseEntity {
  text: string;
}

export interface IAddFeedback {
  userId?: number;
  text: string;
}
