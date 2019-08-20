import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunkMiddleware from "redux-thunk";

const exampleInitialState = {};

export const actionTypes = {
    // TICK: "TICK",
};

// REDUCERS
export const reducer = (state = exampleInitialState, action) => {
    switch (action.type) {
        // case actionTypes.TICK:
        //     return Object.assign({}, state, {
        //         lastUpdate: action.ts,
        //         light: !!action.light
        //     });
        default:
            return state;
    }
};

// ACTIONS
// export const serverRenderClock = isServer => dispatch => {
//     return dispatch({
//         type: actionTypes.TICK,
//         light: !isServer,
//         ts: Date.now()
//     });
// };

export function initializeStore(initialState = exampleInitialState) {
    return createStore(
        reducer,
        initialState,
        composeWithDevTools(applyMiddleware(thunkMiddleware))
    );
}
