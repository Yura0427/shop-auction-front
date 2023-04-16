import { IAction } from '../interfaces/interfaces';
import { SET_SEARCH_QUERY, SET_SHOW_DROPDOWN } from '../types/search.type';

export const setSearchQuery = (query: string): IAction => ({
  type: SET_SEARCH_QUERY,
  data: query,
});

export const setShowDropdown = (show: boolean): IAction => ({
  type: SET_SHOW_DROPDOWN,
  data: show,
});
