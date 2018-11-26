import {createSelector} from "reselect/lib/index";
import SearchBagUtil from "../util/SearchBagUtil";
import WAOs from "../util/WAOs";
const Imm = require("immutable");

export const getNotificationsSelector = createSelector(
    [(state) => state.get("notifications")],
    (notifications) => (senderKey) => notifications.get(senderKey)
);

export const getPendingTotalSelector = createSelector(
    [(state) => state.get("entitiesToPost")],
    (entitiesToPost) => () => {
        let count = 0;
        entitiesToPost.valueSeq().forEach((v)=>{
            console.log("counting entities to post");
            console.log(v);
            count = count + v.size;
        });
        return count;
    }
);

export const getOneByIdSelector = createSelector(
    [(state) => state.get("items")],
    (items) => (id) => items.get(+id)
);
export const getByIdsSelector = createSelector(
    [(state) => state.get("items")],
    (items) => (ids) => ids.map(id => items.get(+id))
);
export const getSelector = createSelector(
    [(state) => state.get("items"),(state) => state.get("searchCache")],
    (items,searchCache) => (searchBag) => {
        const searchCacheEntry = searchCache.get(JSON.stringify(SearchBagUtil.getCoreBag(searchBag)));
        const {offset,limit} = searchBag;
        if(! searchCacheEntry) return [];
        let indexMap = searchCacheEntry.get("indexMap");
        indexMap = (searchBag.order===SearchBagUtil.ASC)?indexMap:
            SearchBagUtil.invertIndexMap(indexMap,searchCacheEntry.get("total"));
        //console.log("proto new GetSelector");
        let selectedEntries = [];
        indexMap.forEach((v,k)=>{
            //console.log(`k : ${k}, v : ${v}`);
            if(k>=offset && k<(offset+limit)) selectedEntries.push(v);
        });
        //console.log(selectedEntries);

        return selectedEntries.map((id)=> items.get(+id));
    }
);
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

export const entitiesSelector = createSelector(
    [(state) => state],
    (state) => {
        let entities = {};
        WAOs.entrySeq().forEach(entry => {
                entities[entry[0]]= {};
                state.getIn([entry[0],"items"]).forEach((v,k)=>{
                    console.log(v);
                    console.log(k);
                    entities[entry[0]][k] = v;
                });
            }
        );
        return entities;
    }
);