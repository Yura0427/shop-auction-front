import { IAction } from '../interfaces/interfaces';
import { IGetParametersByNameSuccess } from '../interfaces/parameters.interfaces';
import {
  GET_PARAMETERS_BY_NAME_REQUEST,
  GET_PARAMETERS_BY_NAME_SUCCESS,
  GET_PARAMETERS_BY_NAME_ERROR,
} from '../types/parameters.type';

export const getParametersByNameRequest = (name: string): IAction => ({
  type: GET_PARAMETERS_BY_NAME_REQUEST,
  data: name,
});

export const getParametersByNameSuccess = (result: IGetParametersByNameSuccess) => ({
  type: GET_PARAMETERS_BY_NAME_SUCCESS,
  data: result,
});

export const getParametersByNameError = (message: string) => ({
  type: GET_PARAMETERS_BY_NAME_ERROR,
  data: message,
});
