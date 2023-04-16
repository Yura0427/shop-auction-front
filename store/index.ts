import { useMemo } from 'react';
import { createStore, Store } from 'redux';
import { AppState, rootReducer } from './reducers';
import { composeWithDevTools } from 'redux-devtools-extension';
import { middleware } from './middleware';
import { initialState as initialProductsState } from './reducers/products.reducer';
import { initialState as initialCategoriesState } from './reducers/categories.reducer';
import { initialState as initialParametersState } from './reducers/parameters.reducer';
import { initialState as initialAvatarReducer } from './reducers/avatar.reducer';

let store: Store<AppState> | undefined;

export const initialState: AppState = {
  productsReducer: initialProductsState,
  categoriesReducer: initialCategoriesState,
  avatarReduser: initialAvatarReducer,
  parametersReducer: initialParametersState,
};

function initStore(initialState: AppState) {
  return createStore(rootReducer, initialState, composeWithDevTools(middleware));
}

export const initializeStore = (preloadedState: AppState) => {
  const _store = store ?? initStore(preloadedState);

  if (preloadedState && _store) {
    return initStore({
      ..._store.getState(),
      ...preloadedState,
    });
  }

  if (typeof window === 'undefined') return _store;
  if (!store) store = _store;

  return _store;
};

export function useStore(initialState: AppState) {
  return useMemo(() => initializeStore(initialState), [initialState]);
}
