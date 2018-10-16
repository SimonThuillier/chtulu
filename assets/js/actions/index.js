import ActionTypes from "../ActionTypes";
import Dispatcher from "../Dispatcher";

export const GET = 'GET';

export const get = text => ({
    type: GET,
    text
});

// const Actions = {
//     get(uuid,params)
//     {
//         params = Object.assign({
//             uuid:uuid ,
//             actionType: ActionTypes.GET,
//             dataType:null,
//             groups:true,
//             searchBag:null,
//             onDataLoading:null
//         },params);
//
//
//         console.log("get action called");
//         Dispatcher.dispatch(params);
//     },
// };

