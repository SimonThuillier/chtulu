import {createSelector} from "reselect/lib/index";


export const getCurrentUserSelector = createSelector(
    [
        (appState,userWaoState) => appState.get("currentUser"),
        (appState,userWaoState) => userWaoState.get("items")
    ],
    (currentUser,users) => () => {
        if(users.has(+currentUser)) return users.get(+currentUser);
        return null;
    }
);