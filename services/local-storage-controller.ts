import { IUser } from 'interfaces/user/userData';
import { StorageKeys as CNST } from '../constants/storage-keys';
import { ChosenColor, ChosenProduct, ChosenSize } from '../interfaces/product/products';
import { SelectActionType } from '../enums/selectActionType';
import { IGetLikeResponse } from 'interfaces/like';
import { ISortedSize } from '../interfaces/product/sortedSizes';

export const getToken = (): string | null => {
  const itemStr = localStorage.getItem(CNST.TOKEN);
  const date = new Date();

  if (!itemStr) {
    return null;
  }

  try {
    const item = JSON.parse(itemStr);
    if (date.getDate() > item.expiry) {
      removeToken();
      removeUser();
      return null;
    }

    return item.value;
  } catch (e) {
    removeToken();
    removeUser();
    return null;
  }
};

export const setToken = (token: string): void => {
  const date = new Date();
  const item = {
    value: token,
    expiry: date.setDate(date.getDate() + 7),
  };

  localStorage.setItem(CNST.TOKEN, JSON.stringify(item));
};

export const removeToken = (): void => {
  localStorage.removeItem(CNST.TOKEN);
};

export const setUser = (user: IUser) => {
  if (!user) return;
  localStorage.setItem(CNST.USER, JSON.stringify(user));
};

export const removeUser = () => {
  localStorage.removeItem(CNST.USER);
  localStorage.removeItem('likedProduct');
  localStorage.removeItem('deliveryValues');
};

export const getUser = (): IUser | null => {
  const user = process.browser ? localStorage.getItem(CNST.USER) : null;

  try {
    return JSON.parse(user as string);
  } catch (error) {
    return null;
  }
};

export const getLSLikedProduct = (): IGetLikeResponse[] => {
  return JSON.parse(localStorage.getItem('likedProduct') as string);
};

export const clearLSLikedProduct = () => {
  localStorage.removeItem('likedProduct');
};

export const setLsLikedProduct = (data: IGetLikeResponse[]) => {
  localStorage.setItem('likedProduct', JSON.stringify(data));
};

export const getLSCart = () => {
  return JSON.parse(localStorage.getItem('Cart') as string);
};

export const clearLsCart = () => {
  localStorage.removeItem('Cart');
  localStorage.removeItem('deliveryValues');
};

export const setLsCart = (data: any[]) => {
  localStorage.setItem('Cart', JSON.stringify(data));
};

export const getFeedbackClick = (): string | null => {
  const hours = 24;
  const setupTime = localStorage.getItem('FEEDBACK-CLICK-TIME');
  const isExpire = setupTime && new Date().getTime() - +setupTime > hours * 60 * 60 * 1000;

  if (isExpire) {
    localStorage.removeItem('FEEDBACK-CLICK-TIME');
    return null;
  }

  return setupTime;
};

export const setFeedbackClick = (): void => {
  localStorage.setItem('FEEDBACK-CLICK-TIME', String(Date.now()));
};

export const getSelectedProduct = (
  action: keyof typeof SelectActionType
): ChosenSize | ChosenColor => {
  const keyMap = {
    [SelectActionType.size]: 'size',
    [SelectActionType.color]: 'color',
  };

  const existData = JSON.parse(localStorage.getItem('chosenProduct') as string);

  return existData && existData[keyMap[action]];
};

export const setSelectedProduct = (action: keyof typeof SelectActionType, data: any) => {
  const keyMap = {
    [SelectActionType.size]: 'size',
    [SelectActionType.color]: 'color',
  };

  let existData = JSON.parse(localStorage.getItem('chosenProduct') as string);

  if (existData && existData[keyMap[action]]) {
    const findItem = existData[keyMap[action]].selected.findIndex(
      (item: ChosenProduct) => item.id === data.selected.id
    );

    if (findItem === -1) {
      existData[keyMap[action]].selected.push(data.selected);
    } else {
      existData[keyMap[action]].selected[findItem].value = data.selected.value;
    }
  } else {
    existData = {
      ...existData,
      [keyMap[action]]: {
        selected: [data.selected],
      },
    };
  }

  localStorage.setItem('chosenProduct', JSON.stringify(existData));
};

export const removeSelectedProduct = (action: keyof typeof SelectActionType, id: number) => {
  const keyMap = {
    [SelectActionType.size]: 'size',
    [SelectActionType.color]: 'color',
  };

  const existData = JSON.parse(localStorage.getItem('chosenProduct') as string);

  const findItem = existData[keyMap[action]].selected.findIndex(
    (item: ChosenProduct) => item.id === id
  );

  if (findItem !== -1) {
    existData[keyMap[action]].selected.splice(findItem, 1);
  }
  localStorage.setItem('chosenProduct', JSON.stringify(existData));
};

export const setSortedSizeToLS = (sortedSize: ISortedSize): void => {
  const key = 'sortedSizes';
  localStorage.removeItem(key);
  localStorage.setItem(key, JSON.stringify(sortedSize));
};

export const getSortedSizeFromLS = (): ISortedSize | null => {
  try {
    const sortedSizeString = localStorage.getItem('sortedSizes');
    return sortedSizeString ? JSON.parse(sortedSizeString) : null;
  } catch (err) {
    console.error(err);
    return null;
  }
};
