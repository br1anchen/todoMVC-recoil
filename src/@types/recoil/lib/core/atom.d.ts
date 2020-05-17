import { NodeKey } from './state';
import { RecoilValue, RecoilState } from './recoilValue';

export interface AtomOptions<T> {
  readonly key: NodeKey;
  readonly default: RecoilValue<T> | Promise<T> | T;
  // persistence_UNSTABLE?: PersistenceSettings<T>,
  readonly dangerouslyAllowMutability?: boolean;
}

export function atom<T>(options: AtomOptions<T>): RecoilState<T>;
