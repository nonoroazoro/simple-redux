// initial action.
export const INIT_ACTION = { type: "@@REDUX/INIT" };

/**
 * create a store with root reducer and initial state.
 *
 * @param {any} p_reducer root reducer.
 * @param {any} p_initialState initial state.
 * @returns {any} a store.
 */
export default function createStore(p_reducer, p_initialState)
{
    const listeners = [];
    let dispatching = false;
    let state = p_initialState;
    const store = {
        dispatch(p_action)
        {
            if (!dispatching)
            {
                try
                {
                    dispatching = true;
                    state = p_reducer(state, p_action);
                }
                finally
                {
                    dispatching = false;
                }
            }

            listeners.slice().forEach((l) => l());
            return p_action;
        },
        subscribe(p_listener)
        {
            if (typeof p_listener === "function")
            {
                let subscribed = true;
                listeners.push(p_listener);
                return function unsubscribe()
                {
                    if (subscribed)
                    {
                        subscribed = false;
                        listeners.splice(listeners.indexOf(p_listener), 1);
                    }
                };
            }
            return () => { };
        },
        getState()
        {
            return state;
        }
    };

    store.dispatch(INIT_ACTION);
    return store;
}
