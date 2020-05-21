import {
  RecoilState,
  SetterOrUpdater,
  useRecoilState,
  useTransactionObservation_UNSTABLE,
} from 'recoil';

import Utils from '../Utils';

const NAMESPACE = 'todoMVC-recoil';

const storeStateToLocalStorage = (key: string, value: any) => {
  Utils.store(`${NAMESPACE}/${key}`, value);
};

export const getStoredState = <T>(key: string): T => {
  const store = localStorage.getItem(`${NAMESPACE}/${key}`);
  return store && JSON.parse(store);
};

export const useRecoilLocalStorageState = <T>(
  state: RecoilState<T>
): [T, SetterOrUpdater<T>] => {
  const [value, setValue] = useRecoilState(state);

  useTransactionObservation_UNSTABLE(({ atomValues, modifiedAtoms }) => {
    if (modifiedAtoms.has(state.key)) {
      storeStateToLocalStorage(state.key, atomValues.get(state.key));
    }
  });

  return [value, setValue];
};
