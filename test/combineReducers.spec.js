import { combineReducers } from "../index";

describe("Utils", () =>
{
    describe("combineReducers", () =>
    {
        it("returns a composite reducer that maps the state keys to given reducers", () =>
        {
            const reducer = combineReducers({
                counter: (state = 0, action) =>
                    (action.type === "increment" ? state + 1 : state),
                stack: (state = [], action) =>
                    (action.type === "push" ? [...state, action.value] : state)
            });

            const s1 = reducer({}, { type: "increment" });
            expect(s1).toEqual({ counter: 1, stack: [] });
            const s2 = reducer(s1, { type: "push", value: "a" });
            expect(s2).toEqual({ counter: 1, stack: ["a"] });
        });

        it("ignores all props which are not a function", () =>
        {
            const reducer = combineReducers({
                fake: true,
                broken: "string",
                another: { nested: "object" },
                stack: (state = []) => state
            });

            expect(
                Object.keys(reducer({}, { type: "push" }))
            ).toEqual(["stack"]);
        });

        it("catches error thrown in reducer when initializing and re-throw", () =>
        {
            const reducer = combineReducers({
                throwingReducer()
                {
                    throw new Error("Error thrown in reducer");
                }
            });
            expect(() => reducer({})).toThrow(
                /Error thrown in reducer/
            );
        });

        it("allows a symbol to be used as an action type", () =>
        {
            const increment = Symbol("INCREMENT");

            const reducer = combineReducers({
                counter(state = 0, action)
                {
                    switch (action.type)
                    {
                        case increment:
                            return state + 1;
                        default:
                            return state;
                    }
                }
            });

            expect(reducer({ counter: 0 }, { type: increment }).counter).toEqual(1);
        });

        it("maintains referential equality if the reducers it is combining do", () =>
        {
            const reducer = combineReducers({
                child1(state = {})
                {
                    return state;
                },
                child2(state = {})
                {
                    return state;
                },
                child3(state = {})
                {
                    return state;
                }
            });

            const initialState = reducer(undefined, "@@INIT");
            expect(reducer(initialState, { type: "FOO" })).toBe(initialState);
        });

        it("does not have referential equality if one of the reducers changes something", () =>
        {
            const reducer = combineReducers({
                child1(state = {})
                {
                    return state;
                },
                child2(state = { count: 0 }, action)
                {
                    switch (action.type)
                    {
                        case "increment":
                            return { count: state.count + 1 };
                        default:
                            return state;
                    }
                },
                child3(state = {})
                {
                    return state;
                }
            });

            const initialState = reducer(undefined, "@@INIT");
            expect(reducer(initialState, { type: "increment" })).not.toBe(initialState);
        });
    });
});
