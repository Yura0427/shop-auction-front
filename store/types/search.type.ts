export const SET_SEARCH_QUERY = 'SEARCH/SET_SEARCH_QUERY';
export const SET_SHOW_DROPDOWN = 'SEARCH/SET_SHOW_DROPDOWN';

export interface ISearchReducer {
  searchQuery: string;
  showSearchDropdown: boolean;
}

export interface ISearchQueryActionTypes {
  type: string;
  data: any;
}
