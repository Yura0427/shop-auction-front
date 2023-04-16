import { IAction } from '../interfaces/interfaces';

import {
  GET_PARAMETERS_BY_NAME_SUCCESS,
  GET_PARAMETERS_BY_NAME_ERROR,
} from '../types/parameters.type';

interface IParametersState {
  parameters: { [key: string]: { [key: string]: number } };
  error: string | null;
}

export const initialState: IParametersState = {
  parameters: {},
  error: null,
};

export const parametersReducer = (
  state = initialState,
  { type, data }: IAction
): IParametersState => {
  switch (type) {
    case GET_PARAMETERS_BY_NAME_SUCCESS:
      return { ...state, parameters: { [data.name]: data.payload }, error: null };

    case GET_PARAMETERS_BY_NAME_ERROR:
      return { ...state, error: data.payload };

    default:
      return state;
  }
};
