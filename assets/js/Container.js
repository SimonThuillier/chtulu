import {App} from './layout-react';
import {Container} from 'flux/utils';
import Stores from './Stores.js';

function getStores() {
    let containerStores = [];
    for (let type in Stores) {
        if(Stores.hasOwnProperty(type)){
            containerStores.push(Stores[type]);
        }
    }
    console.table(Stores);
    console.table(containerStores);
    return containerStores;

}

function getState() {
    let containerState={};

    for (let type in Stores) {
        if(Stores.hasOwnProperty(type)){
            containerState[type] = Stores[type].getState();
        }
    }
    console.log(containerState);
    return containerState;
}

//export default App;
// TODO find the good hierarchy between container and router
export default Container.createFunctional(App, getStores, getState);