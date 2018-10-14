import Dispatcher from './Dispatcher.js';
import ActionTypes from './ActionTypes.js';
import SearchBag from './SearchBag.js';

const Actions = {
    get(uuid,params)
    {
        params = Object.assign({
            uuid:uuid ,
            actionType: ActionTypes.GET,
            dataType:null,
            groups:true,
            searchBag:null,
            onDataLoading:null
        },params);


        console.log("get action called");
        Dispatcher.dispatch(params);
    },
};

export default Actions;