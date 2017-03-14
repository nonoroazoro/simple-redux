// initial action.
const INIT_ACTION = { type: "REDUX-INIT" };

/**
 * create a store with root reducer and initial state.
 *
 * @param {any} p_reducer root reducer.
 * @param {any} p_initialState initial state.
 * @returns {function} a store.
 */
module.exports = function createStore(p_reducer, p_initialState = {})
{
    const listeners = [];
    let state = p_initialState;
    const store = {
        dispatch(p_action)
        {
            state = p_reducer(state, p_action);
            listeners.slice().forEach((l) => l());
            return p_action;
        },
        subscribe(p_listener)
        {
            listeners.push(p_listener);
            return function unsubscribe()
            {
                listeners.splice(listeners.indexOf(p_listener), 1);
            };
        },
        getState()
        {
            return state;
        }
    };

    store.dispatch(INIT_ACTION);
    return store;
};
