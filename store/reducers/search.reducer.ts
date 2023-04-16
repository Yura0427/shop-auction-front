import {
  ISearchQueryActionTypes,
  ISearchReducer,
  SET_SEARCH_QUERY,
  SET_SHOW_DROPDOWN,
} from '../types/search.type';

export const initialState: ISearchReducer = {
  searchQuery: '',
  showSearchDropdown: false,
};

export const searchReducer = (state = initialState, action: ISearchQueryActionTypes) => {
  switch (action.type) {
    case SET_SEARCH_QUERY:
      return { ...state, searchQuery: action.data };

    case SET_SHOW_DROPDOWN:
      return { ...state, showSearchDropdown: action.data };

    default:
      return state;
  }
};
