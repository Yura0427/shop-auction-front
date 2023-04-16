import { SagaIterator } from 'redux-saga';
import { all, fork } from 'redux-saga/effects';
import { parametersWatcher } from './parameters.saga';

export default function* rootSaga(): SagaIterator {
  yield all([fork(parametersWatcher)]);
}
