// A new hook introduced in React 18 that also works in React 17
import { useSyncExternalStore } from "use-sync-external-store/shim";

const create = (createState) => {
  // let state = initState;
  //state;
  console.log("createState =", createState);

  // We need a set of listeners to notify the state updates.
  const listeners = new Set();

  // Likewise, we define a function to set state.
  const setState = (getNextState) => {
    console.log("setState(getNextState), getNextState =", getNextState);
    // If `getNextState` is a function apply the current state,
    // otherwise, just use `getNextState` as next state.
    const nextState =
      typeof getNextState === "function" ? getNextState(state) : getNextState;
    console.log("getNextState's type is", typeof getNextState);
    // To avoid overwriting functions in state, we merge states.
    state = Object.assign({}, state, nextState);
    // Finally, invoke all listeners in the set.
    listeners.forEach((listener) => {
      console.log("exec listener() =", listener);
      listener(); // = handleStoreChange() in use-sync-external-store
      /*
       * createState()により作成された共通stateの各propertyに対して更新をチェックし、
       * useStore()ごとに作成されるuseSyncExternalStoreのstateを更新。
       * 結果としてuseStore()を呼び出したComponentが再描画される。
       */
    });
  };

  // Now, we define the initial state by calling `createState`.
  // We pass the two functions defined above.
  let state = createState(setState);

  // For reactivity, we define a function to subscribe.
  const subscribe = (listener) => {
    console.log("added listener =", listener);
    // Add the callback function to the listeners set.
    listeners.add(listener);
    // And, return a function to unsubscribe.
    return () => {
      console.log("unsubscribe");
      listeners.delete(listener);
    };
  };

  // Let's define a hook to be used in React.
  const useStore = (selector) => {
    const getSnapshot = () => {
      //console.log("exec selector =", selector, ", n =", state.n);
      return selector(state);
    };
    return useSyncExternalStore(subscribe, getSnapshot);
  };

  // Return the hook function.
  return useStore;
};

export default create;
