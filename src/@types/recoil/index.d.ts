// Type definitions for recoil 0.0
// Project: https://github.com/facebookexperimental/recoil#readme
// Definitions by: Christian Santos <https://github.com/csantos42>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// Minimum TypeScript Version: 3.7

declare module 'recoil' {
  // node.d.ts
  export class DefaultValue {}

  // recoilValue.d.ts
  export class AbstractRecoilValue<T> {
    tag: 'Writeable';
    key: NodeKey;
    constructor(newKey: NodeKey);
  }

  export class AbstractRecoilValueReadonly<T> {
    tag: 'Readonly';
    key: NodeKey;
    constructor(newKey: NodeKey);
  }

  export class RecoilState<T> extends AbstractRecoilValue<T> {}

  export class RecoilValueReadOnly<T> extends AbstractRecoilValueReadonly<T> {}

  export type RecoilValue<T> = RecoilValueReadOnly<T> | RecoilState<T>;

  export function isRecoilValue(val: unknown): val is RecoilValue<any>;

  // loadable.d.ts
  export type ResolvedLoadablePromiseInfo<T> = Readonly<{
    value: T;
    upstreamState__INTERNAL_DO_NOT_USE?: TreeState;
  }>;

  export type LoadablePromise<T> = Promise<ResolvedLoadablePromiseInfo<T>>;

  export type Accessors<T> = Readonly<{
    /**
     *  Attempt to get the value.
     *  If there's an error, throw an error.  If it's still loading, throw a Promise.
     *  This is useful for composing with React Suspense or in a Recoil Selector.
     */
    getValue: () => T;

    toPromise: () => LoadablePromise<T>;

    // Convenience accessors
    valueMaybe: () => T | void;
    valueOrThrow: () => T;
    errorMaybe: () => Error | void;
    errorOrThrow: () => Error;
    promiseMaybe: () => Promise<T> | void;
    promiseOrThrow: () => Promise<T>;

    map: <S>(map: (val: any) => Promise<S> | S) => Loadable<S>;
  }>;

  export type Loadable<T> =
    | Readonly<Accessors<T> & { state: 'hasValue'; contents: T }>
    | Readonly<Accessors<T> & { state: 'hasError'; contents: Error }>
    | Readonly<
        Accessors<T> & {
          state: 'loading';
          contents: LoadablePromise<T>;
        }
      >;

  // state.d.ts
  export type NodeKey = string;
  export type AtomValues = Map<NodeKey, any>;
  export type AtomLoadableValues = Map<NodeKey, Loadable<T>>;
  export type ComponentCallback = (state: TreeState) => void;
  export type TreeState = Readonly<{
    // Information about the TreeState itself:
    isSnapshot: boolean;
    transactionMetadata: object;
    dirtyAtoms: Set<NodeKey>;

    // ATOMS
    atomValues: AtomLoadableValues;
    nonvalidatedAtoms: Map<NodeKey, unknown>;

    // NODE GRAPH -- will soon move to StoreState
    // Upstream Node dependencies
    nodeDeps: Map<NodeKey, Set<NodeKey>>;

    // Downstream Node subscriptions
    nodeToNodeSubscriptions: Map<NodeKey, Set<NodeKey>>;
    nodeToComponentSubscriptions: Map<
      NodeKey,
      Map<number, [string, ComponentCallback]>
    >;
  }>;

  // RecoilRoot.d.ts
  import { FC } from 'react';

  export interface RecoilRootProps {
    initializeState?: (options: {
      set: <T>(recoilVal: RecoilState<T>, newVal: T) => void;
      setUnvalidatedAtomValues: (atomMap: Map<string, unknown>) => void;
    }) => void;
  }

  export const RecoilRoot: FC<RecoilRootProps>;

  // atom.d.ts
  export type PersistenceType = 'none' | 'url';
  export type PersistenceInfo = {
    readonly type: PersistenceType;
    readonly backButton?: boolean;
  };
  export type PersistenceSettings<T> = PersistenceInfo & {
    readonly validator: (newVal: T, defaultVal: T) => T | DefaultValue;
  };
  export interface AtomOptions<T> {
    readonly key: NodeKey;
    readonly default: RecoilValue<T> | Promise<T> | T;
    readonly persistence_UNSTABLE?: PersistenceSettings<T>;
    readonly dangerouslyAllowMutability?: boolean;
  }

  export function atom<T>(options: AtomOptions<T>): RecoilState<T>;

  //selector.d.ts
  export type GetRecoilValue = <T>(recoilVal: RecoilValue<T>) => T;
  export type SetRecoilState = <T>(
    recoilVal: RecoilState<T>,
    newVal: T | DefaultValue | ((prevValue: T) => T | DefaultValue)
  ) => void;

  export type ResetRecoilState = (recoilVal: RecoilState<any>) => void;

  export interface ReadOnlySelectorOptions<T> {
    key: string;
    get: (opts: { get: GetRecoilValue }) => Promise<T> | RecoilValue<T> | T;

    // cacheImplementation_UNSTABLE?: CacheImplementation<Loadable<T>>,
    dangerouslyAllowMutability?: boolean;
  }

  export type ReadWriteSelectorOptions<T> = ReadOnlySelectorOptions<T> & {
    set: (
      opts: {
        set: SetRecoilState;
        get: GetRecoilValue;
        reset: ResetRecoilState;
      },
      newValue: T | DefaultValue
    ) => void;
  };

  export function selector<T>(
    options: ReadWriteSelectorOptions<T>
  ): RecoilState<T>;
  export function selector<T>(
    options: ReadOnlySelectorOptions<T>
  ): RecoilValueReadOnly<T>;

  // hooks.d.ts
  export type SetterOrUpdater<T> = (
    valOrUpdater: ((currVal: T) => T) | T
  ) => void;
  export type Resetter = () => void;
  export type CallbackInterface = Readonly<{
    getPromise: <T>(recoilVal: RecoilValue<T>) => Promise<T>;
    getLoadable: <T>(recoilVal: RecoilValue<T>) => Loadable<T>;
    set: <T>(
      recoilVal: RecoilState<T>,
      valOrUpdater: ((currVal: T) => T) | T
    ) => void;
    reset: (recoilVal: RecoilState<any>) => void;
  }>;

  export function useRecoilValue<T>(recoilValue: RecoilValue<T>): T;
  export function useRecoilValueLoadable<T>(
    recoilValue: RecoilValue<T>
  ): Loadable<T>;
  export function useRecoilState<T>(
    recoilState: RecoilState<T>
  ): [T, SetterOrUpdater<T>];
  export function useRecoilStateLoadable<T>(
    recoilState: RecoilState<T>
  ): [Loadable<T>, SetterOrUpdater<T>];
  export function useSetRecoilState<T>(
    recoilState: RecoilState<T>
  ): SetterOrUpdater<T>;
  export function useResetRecoilState(recoilState: RecoilState<any>): Resetter;
  export function useRecoilCallback<
    Args extends ReadonlyArray<unknown>,
    Return
  >(
    fn: (interface: CallbackInterface, ...args: Args) => Return,
    deps?: ReadonlyArray<unknown>
  ): (...args: Args) => Return;

  // Hooks for Persistence/Debugging
  type PersistenceType = 'none' | 'url';
  type ExternallyVisibleAtomInfo = {
    persistence_UNSTABLE: {
      type: PersistenceType;
      backButton: boolean;
    };
  };
  type TransactionCallbackOptions = {
    atomValues: AtomValues;
    previousAtomValues: AtomValues;
    atomInfo: Map<NodeKey, ExternallyVisibleAtomInfo>;
    modifiedAtoms: Set<NodeKey>;
    transactionMetadata: { [NodeKey]: any };
  };

  export function useTransactionObservation_UNSTABLE(
    callback: (optons: TransactionCallbackOptions) => void
  ): void;
  export function useTransactionSubscription_UNSTABLE(
    callback: (store: any, treeState: TreeState) => void
  ): void;
  export function useSetUnvalidatedAtomValues_UNSTABLE(
    values: AtomValues,
    transactionMetadata: any
  ): void;
}
