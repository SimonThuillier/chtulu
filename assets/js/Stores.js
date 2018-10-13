import {Store,ReduceStore} from 'flux/utils';
import ActionTypes from './ActionTypes';
import Dispatcher from './Dispatcher';
import WAOTypes from './WAOTypes';


class ConcreteStore extends ReduceStore {
    constructor(waoType) {
        super(Dispatcher);
        this.waoType = waoType;
    }

    getInitialState() {
        return [];
    }

    reduce(state, action) {
        switch (action.type) {
            case ActionTypes.GET:
                console.log(`${this.waoType} store get called`);
                return state;

            default:
                return state;
        }
    }
}

console.log(WAOTypes);
console.log(Object.keys(WAOTypes));
console.log(WAOTypes.hasOwnProperty("article"));

let Stores = {};
for (let type in WAOTypes) {
    console.log(type);
    if(WAOTypes.hasOwnProperty(type)){
        Stores[type] = new ConcreteStore(type);
    }
}

export default Stores;