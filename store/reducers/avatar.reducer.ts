import { IAction } from '../../interfaces/action';
import { IAvatarData } from '../../interfaces/avatarExamination/avatar';
export const initialState: IAvatarData = {
  res: [],
  errorAvatar: true,
};

export const avatarReduser = (state = initialState, action: IAction): IAvatarData => {
  switch (action.type) {
    case 'resSuccesAvatar':
      return {
        ...state,
        res: [action.payload],
        errorAvatar: true,
      };
    case 'resErrorAvatar':
      return {
        ...state,
        res: [action.payload],
        errorAvatar: false,
      };
    default:
      return state;
  }
};
export const dataOkResponseAvatar = (payload: any) => ({ type: 'resSuccesAvatar', payload });
export const dataErrorResponseAvatar = (payload: any) => ({ type: 'resErrorAvatar', payload });
