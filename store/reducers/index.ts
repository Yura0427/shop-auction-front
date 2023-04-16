import { combineReducers } from 'redux';

import { productsReducer } from './products.reducer';
import { categoriesReducer } from './categories.reducer';
import { avatarReduser } from './avatar.reducer';
import { parametersReducer } from './parameters.reducer';
import { searchReducer } from './search.reducer';

export const rootReducer = combineReducers({
  productsReducer,
  categoriesReducer,
  avatarReduser,
  parametersReducer,
  searchReducer,
});

export type AppState = ReturnType<typeof rootReducer>;
