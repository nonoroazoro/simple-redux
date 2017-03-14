const INIT_ACTION = { type: "REDUX-INIT" };

module.exports = function createStore(p_reducer, p_initialState = {})
{
    const listeners = [];
    let state = p_initialState;

    function dispatch(p_action)
    {
        state = p_reducer(state, p_action);
        listeners.slice().forEach((l) => l());
        return p_action;
    }

    function subscribe(p_listener)
    {
        listeners.push(p_listener);
        return function unsubscribe()
        {
            listeners.splice(listeners.indexOf(p_listener), 1);
        }
    }

    function getState()
    {
        return state;
    }

    // init.
    dispatch(INIT_ACTION);

    return {
        dispatch,
        getState,
        subscribe
    }
};
