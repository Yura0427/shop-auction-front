import { applyMiddleware, compose, Middleware } from 'redux';
import { createLogger } from 'redux-logger';
import createSagaMiddleware from 'redux-saga';

export const saga = createSagaMiddleware();

const logger = createLogger({
  duration: true,
  collapsed: true,
  colors: {
    title: (action): string => (action.error ? 'firebrick' : 'deepskyblue'),
    prevState: (): string => '#1C5FAF',
    action: (): string => '#149945',
    nextState: (): string => '#A47104',
    error: (): string => '#ff0005',
  },
});

export const middlewares: Middleware[] = [saga];

if (process.env.NODE_ENV === 'development') {
  middlewares.push(logger);
}

export const middleware = compose(applyMiddleware(...middlewares));
