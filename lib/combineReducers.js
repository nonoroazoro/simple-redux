/**
 * reducer is a pure function which process its state with an action.
 * @param {any} p_state sub-state of this reducer.
 * @param {any} p_action action.
 */

/**
 * process store's state with reducers.
 *
 * @param {any} p_reducers key-value pair of reducers, like { name: reducer }.
 * @returns {function} a state process function.
 */
module.exports = function combineReducers(p_reducers)
{
    const keys = Object.keys(p_reducers);

    /**
     * Process store's state with reducers.
     *
     * @param p_state store's state.
     * @param p_action current action.
     * @returns processed state.
     */
    return function process(p_state = {}, p_action)
    {
        let changed = false;
        let prev, next, processed;
        for (let key of keys)
        {
            prev = p_state[key];
            processed[key] = next = p_reducers[key](prev, p_action);
            if (!changed)
            {
                changed = prev !== next;
            }
        };
        return changed ? processed : p_state;
    };
};
