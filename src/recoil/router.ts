import { useEffect } from 'react';
import page from 'page';
import { match } from 'path-to-regexp';
import { atom, RecoilState, AtomOptions, useRecoilState } from 'recoil';

let pageinitialized = false;

interface RouterState<T> extends RecoilState<T> {
  path: string;
  paramKey: string;
}
type RouterAtomOptions<T> = Partial<AtomOptions<T>> &
  Pick<RouterState<T>, 'path' | 'paramKey'> & {
    default: T;
  };

export const routerAtom = <T>({
  path,
  paramKey,
  ...atomOptions
}: RouterAtomOptions<T>): RouterState<T> => {
  const matchFunc = match(path, { decode: decodeURIComponent });
  const result: { [index: string]: any } | false = matchFunc(
    window.location.pathname
  );
  const routerValue: T = result ? result.params[paramKey] : atomOptions.default;

  const routerAtom = atom<T>({
    ...atomOptions,
    key: `router${paramKey}`,
    default: routerValue,
  });

  return {
    ...routerAtom,
    path,
    paramKey,
  };
};

export const useRecoilRouterState = <T>(state: RouterState<T>) => {
  const [value, setValue] = useRecoilState(state);
  const { path, paramKey } = state;

  useEffect(() => {
    page(path, (ctx) => {
      const { params } = ctx;
      if (params[paramKey] !== undefined) {
        setValue(params[paramKey]);
      }
    });
  }, [path, paramKey, setValue]);

  if (!pageinitialized) {
    page.start();
    pageinitialized = true;
  }

  return [value, setValue];
};

export const useRecoilRouterValue = <T>(state: RouterState<T>) => {
  const [value, _setValue] = useRecoilRouterState(state);
  return value;
};

export type TodoFilter = 'all' | 'active' | 'completed';
export const todoFilterState = routerAtom<TodoFilter>({
  path: '/:todoFilter',
  paramKey: 'todoFilter',
  default: 'all',
});
