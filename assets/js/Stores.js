import {ReduceStore} from 'flux/utils';
import ActionTypes from './ActionTypes';
import Dispatcher from './Dispatcher';
import WAOTypes from './util/WAOs';
import Server from './util/Server';
import Immutable from 'immutable';

class ConcreteStore extends ReduceStore {
    constructor(waoType,waoPrototype) {
        super(Dispatcher);
        this.waoType = waoType;
        this.waoPrototype = waoPrototype;
    }

    getInitialState() {
        return Immutable.OrderedMap();
    }

    reduce(state, action) {
        if(action.dataType !== this.waoType) return state;
        console.log(action);
        switch (action.actionType) {
            case ActionTypes.GET:
                console.log(`${this.waoType} store get called`);
                let prototype = this.waoPrototype;
                console.log(state);
                return Server.get(action.dataType,action.groups,action.searchBag)
                    .then(data =>{
                        console.log("reception client");
                        console.log(state);
                        for(let row in data){
                            state = state.set(row.id, Immutable.Record(row));
                        }

                        /*data.rows.forEach((row)=>{
                            Object.setPrototypeOf(row,prototype);
                            console.log(row);
                            console.log(state);

                        });*/
                        console.log(state);
                        return state;
                    });




                //return state;

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
        Stores[type] = new ConcreteStore(type,WAOTypes[type]);
    }
}

export default Stores;