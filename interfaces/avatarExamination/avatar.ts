export interface RootState {
  avatarReduser: IAvatarData;
}
export interface IAvatarData {
  res: IAvatarTree[];
  errorAvatar: boolean;
}
export interface IAvatarTree {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  key: string;
  description: string;
  mpath: string;
  parent: null | { id: number };
  children: IAvatarTree[];
}
