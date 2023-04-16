import { SagaIterator } from 'redux-saga';
import { call, put, takeEvery } from 'redux-saga/effects';

import { api } from '../../api/';
import { setSortedSizeToLS } from '../../services/local-storage-controller';

import { getParametersByNameSuccess, getParametersByNameError } from '../actions/parameters.action';
import { IAction } from '../interfaces/interfaces';

import { GET_PARAMETERS_BY_NAME_REQUEST } from '../types/parameters.type';

function* getParametersByNameWorker({ data }: IAction): SagaIterator {
  try {
    const { data: responseData } = yield call(api.parameters.getParametersByName, data);

    setSortedSizeToLS(responseData.settings);
    yield put(getParametersByNameSuccess({ name: data, payload: responseData.settings }));
  } catch (error) {
    yield put(getParametersByNameError((error as any).message));
  }
}

export function* parametersWatcher(): SagaIterator {
  yield takeEvery(GET_PARAMETERS_BY_NAME_REQUEST, getParametersByNameWorker);
}
