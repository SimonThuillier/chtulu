import {createSelector} from "reselect/lib/index";
import SearchBagUtil from "../util/SearchBagUtil";
import WAOs from "../util/WAOs";
const Imm = require("immutable");

const getItems = (state) => state.get("items");

export const makeGetNotificationsSelector = ()=> {
    return createSelector(
        [(state) => state.get("notifications")],
        (notifications) => {
            return createSelector([(senderKey) => senderKey], (senderKey) => {
                return notifications.get(senderKey);
            });
        }
    );
};

export const getNotificationsSelector = createSelector(
    [(state) => state.get("notifications")],
    (notifications) => (senderKey) => notifications.get(senderKey)
);

export const getNextNewIdSelector = createSelector(
    [(state) => state.get("nextNewId")],
    (nextNewId) => () => nextNewId
);

export const makeGetNextNewIdSelector = () =>{
    return createSelector(
        [(state) => state.get("nextNewId")],
        (nextNewId) => () => nextNewId
    );
};


export const getBabiesSelector = createSelector(
    [(state) => state.get("babyItemIds"),(state) => state.get("items")],
    (babyItemIds,items) => () => {
        return createSelector([()=>null],()=>{
            let babies = [];
            babyItemIds.keySeq().forEach((k)=>{
                if(items.has(+k) || false) babies.push(items.get(+k));
            });
            return babies;
        });
    }
);

export const makeGetBabiesSelector = () =>{
    return createSelector(
        [(state) => state.get("babyItemIds"),(state) => state.get("items")],
        (babyItemIds,items) => () => {
            let babies = [];
            babyItemIds.keySeq().forEach((k)=>{
                if(items.has(+k) || false) babies.push(items.get(+k));
            });
            return babies;
        }
    );
};


export const getNewlyCreatedIdSelector = createSelector(
    [(state) => state.get("createdItemIds")],
    (createdItemIds) => (id) => {

        if(createdItemIds.has(+id)) return createdItemIds.get(+id);
        return null;
    }
);

export const makeGetNewlyCreatedIdSelector = () => {
    return createSelector(
        [(state) => state.get("createdItemIds")],
        (createdItemIds) => {
            return createSelector([(id)=>+id],(id)=>{
                if(createdItemIds.has(+id)) return createdItemIds.get(+id);
                return null;
            });
        }
    );
};

export const getOneByIdSelector = createSelector(
    [(state) => state.get("items")],
    (items) => (id) => {
        if(items.has(+id)) return items.get(+id);
        return null;
    }
);

export const makeGetOneByIdSelector = () =>{
    return createSelector(
        [(state) => state.get("items")],
        (items) => {
            return createSelector([(id)=>+id],(id)=>{
                if(items.has(+id)) return items.get(+id);
                return null;
            });
        }
    );
};

export const makeGetOneByIdPlusBabiesSelector = () =>{
    return createSelector(
        [(state) => state.get("items"),(state) => state.get("babyItemIds")],
        (items,babyItemIds) => {
            return createSelector([
                (id,extraIds)=>+id,
                (id,extraIds)=>extraIds.join(',')
            ],(id,extraIds)=>{
                let selectedEntries = [];
                if(items.has(+id)) selectedEntries.push(items.get(+id));

                // add extra Ids
                extraIds = extraIds.split(',');
                extraIds.forEach((k)=>{
                    if (items.has(+k) || false) selectedEntries.push(items.get(+k));
                });

                // add babies
                babyItemIds.keySeq().forEach((k) => {
                    if (items.has(+k) || false) selectedEntries.push(items.get(+k));
                });
                return selectedEntries;
            });
        }
    );
};

export const getByIdsSelector = createSelector(
    [(state) => state.get("items")],
    (items) => (ids) => ids.map(id => items.get(+id)).filter((v,k)=>v || false)
);

export const makeGetByIdsSelector = () =>{
    return createSelector(
        [(state) => state.get("items")],
        (items) => {
            return createSelector([(ids)=>ids.join('|')],(serializedIds)=>{
                const ids = serializedIds.split('|');
                return ids.map(id => items.get(+id)).filter((v,k)=>v || false);
            });
        }
    );
};



export const getSelector = createSelector(
    [(state) => state.get("items"),(state) => state.get("searchCache")],
    (items,searchCache) => (searchBag) => {
        const searchCacheEntry = searchCache.get(JSON.stringify(SearchBagUtil.getCoreBag(searchBag)));
        const {offset,limit} = searchBag;
        if(! searchCacheEntry) return [];
        let indexMap = searchCacheEntry.get("indexMap");
        indexMap = (searchBag.order===SearchBagUtil.ASC)?indexMap:
            SearchBagUtil.invertIndexMap(indexMap,searchCacheEntry.get("total"));
        let selectedEntries = [];

        indexMap.forEach((v,k)=>{
            // console.log(`k : ${k}, v : ${v}`);
            if(k>=offset && k<(offset+limit)) selectedEntries[k] = +v;
        });
        return selectedEntries.map((id)=> items.get(+id)).filter((v,k)=>v || false);
    }
);

export const makeGetSelector = () =>{
    return createSelector(
        [(state) => state.get("items"),(state) => state.get("searchCache")],
        (items,searchCache) => (searchBag) => {
            const searchCacheEntry = searchCache.get(JSON.stringify(SearchBagUtil.getCoreBag(searchBag)));
            const {offset,limit} = searchBag;
            if(! searchCacheEntry) return [];
            let indexMap = searchCacheEntry.get("indexMap");
            indexMap = (searchBag.order===SearchBagUtil.ASC)?indexMap:
                SearchBagUtil.invertIndexMap(indexMap,searchCacheEntry.get("total"));
            let selectedEntries = [];

            indexMap.forEach((v,k)=>{
                // console.log(`k : ${k}, v : ${v}`);
                if(k>=offset && k<(offset+limit)) selectedEntries[k] = +v;
            });
            return selectedEntries.map((id)=> items.get(+id)).filter((v,k)=>v || false);
        }
    );
};

export const makeLocalGetByAttributeSelector = () =>{
    return createSelector(
        [(state) => state.get("items")],
        (items) => {
            //console.log("create getPlusBabiesSelector");
            return createSelector([
                    (name,value) => name,
                    (name,value) => value
                ], (name,value) => {
                    let selectedEntries = [];
                    console.log(items);
                    items.valueSeq().forEach(v =>{
                        if(v.get(name) == value){
                            selectedEntries.push(v);
                        }
                    });
                    return selectedEntries;
                }
            );
        }
    )
};

export const makeGetPlusBabiesSelector = () =>{
    return createSelector(
        [(state) => state.get("babyItemIds"),(state) => state.get("items"),(state) => state.get("searchCache")],
        (babyItemIds,items,searchCache) => {
            //console.log("create getPlusBabiesSelector");
            return createSelector([
                    (searchBag,extraIds,expandedIds) => JSON.stringify(SearchBagUtil.getCoreBag(searchBag)),
                    (searchBag,extraIds,expandedIds) => (searchBag.offset),
                    (searchBag,extraIds,expandedIds) => (searchBag.limit),
                    (searchBag,extraIds,expandedIds) => (searchBag.order),
                    (searchBag,extraIds=[]) => (extraIds.join(',')),
                    (searchBag,extraIds=[],expandedIds=[]) => (JSON.stringify(expandedIds))
                ], (coreBagKey, offset, limit, order,extraIds,expandedIds) => {
                    /*console.log("call getPlusBabiesSelector");
                    console.log(items);
                    // get selector
                    console.log(searchCache);
                    console.log(coreBagKey);
                    console.log(order);
                    console.log("extraIds");
                    console.log(extraIds);*/
                    const searchCacheEntry = searchCache.get(coreBagKey);
                    expandedIds = JSON.parse(expandedIds);
                console.log("expandedIds");
                    console.log(expandedIds);
                    let selectedEntries = [];

                    // 1 regular articles by get
                    if (!!searchCacheEntry) {
                        let indexMap = searchCacheEntry.get("indexMap");
                        indexMap = (order === SearchBagUtil.ASC) ? indexMap :
                            SearchBagUtil.invertIndexMap(indexMap, searchCacheEntry.get("total"));

                        indexMap.forEach((v, k) => {
                            if (k >= offset && k < (offset + limit)){
                                selectedEntries.push(+v);
                                let thisSubIds = expandedIds[v];
                                console.log("thisSubIds");
                                console.log(thisSubIds);
                                if(typeof thisSubIds !== 'undefined'){
                                    thisSubIds.forEach(sv =>{
                                        selectedEntries.push(+sv);
                                        }
                                    );
                                }
                            }
                        });
                        selectedEntries = selectedEntries.map((id) => items.get(+id)).filter((v, k) => v || false);
                        console.log(selectedEntries);
                    }
                    // 2 add extra Ids
                    extraIds = extraIds.split(',');
                    extraIds.forEach((k)=>{
                        if (items.has(+k) || false) selectedEntries.push(items.get(+k));
                    });



                    // 3 add babies
                    babyItemIds.keySeq().forEach((k) => {
                        if (items.has(+k) || false) selectedEntries.push(items.get(+k));
                    });
                    return selectedEntries;
                }
            );
        }
    )
};


export const makeGetTotalSelector = () =>{
    return createSelector(
        [(state) => state.get("items"),(state) => state.get("searchCache")],
        (items,searchCache) => (searchBag) => {
            const searchCacheEntry = searchCache.get(JSON.stringify(SearchBagUtil.getCoreBag(searchBag)));
            if(! searchCacheEntry) return -1;
            return searchCacheEntry.get("total");
        }
    );
};

export const totalSelector2 = createSelector(
    [(state) => state.get("items"),(state) => state.get("searchCache")],
    (items,searchCache) => (searchBag) => {
        const searchCacheEntry = searchCache.get(JSON.stringify(SearchBagUtil.getCoreBag(searchBag)));
        if(! searchCacheEntry) return -1;
        return searchCacheEntry.get("total");
    }
);

export const getPendingSelector = createSelector(
    [(state) => state.get("items"),(state) => state.get("pendingIds")],
    (items,pendingIds) => (uid) => (pendingIds.has(uid))?items.get(+pendingIds.get(uid)):null
);

export const makeGetPendingSelector = () =>{
    return createSelector(
        [(state) => state.get("items"),(state) => state.get("pendingIds")],
        (items,pendingIds) => (uid) => (pendingIds.has(uid))?items.get(+pendingIds.get(uid)):null
    );
};

export const getPendingTotalSelector = createSelector(
    [(state) => state.get("entitiesToPost")],
    (entitiesToPost) => () => {
        let count = 0;
        entitiesToPost.valueSeq().forEach((v)=>{
            /*console.log("counting entities to post");
            console.log(v);*/
            count = count + v.size;
        });
        return count;
    }
);

export const makeGetPendingTotalSelector = () =>{
    return createSelector(
        [(state) => state.get("entitiesToPost")],
        (entitiesToPost) => () => {
            let count = 0;
            entitiesToPost.valueSeq().forEach((v)=>{
                /*console.log("counting entities to post");
                console.log(v);*/
                count = count + v.size;
            });
            return count;
        }
    );
};

export const makeGetFormSelector = () =>{
    return createSelector(
        [(state) => (state)],
        (state) => {
                return createSelector([(componentUid)=>componentUid], (componentUid) => {
                    return state.get(componentUid);
                });
        }
    );
};


export const entitiesSelector = createSelector(
    [(state) => state],
    (state) => {
        let entities = {};
        WAOs.entrySeq().forEach(entry => {
                entities[entry[0]]= {};
                state.getIn([entry[0],"items"]).forEach((v,k)=>{
                    /*console.log(v);
                    console.log(k);*/
                    entities[entry[0]][k] = v;
                });
            }
        );
        return entities;
    }
);