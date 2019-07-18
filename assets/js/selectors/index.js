import {createSelector} from "reselect/lib/index";
import SearchBagUtil from "../util/SearchBagUtil";
import WAOs from "../util/WAOs";
const Imm = require("immutable");

const getItems = (state) => state.get("items");


export const getNotificationsSelector = createSelector(
    [(state) => state.get("notifications")],
    (notifications) => (senderKey) => notifications.get(senderKey)
);

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

export const getNextNewIdSelector = createSelector(
    [(state) => state.get("nextNewId")],
    (nextNewId) => () => nextNewId
);
export const getBabiesSelector = createSelector(
    [(state) => state.get("babyItemIds"),(state) => state.get("items")],
    (babyItemIds,items) => () => {
        let babies = [];
        babyItemIds.keySeq().forEach((k)=>{
            if(items.has(+k) || false) babies.push(items.get(+k));
        });
        return babies;
    }
);

const getList = (state) => state.getIn(['main', 'goods']);
const getSorted = (state) => state.getIn(['main', 'sorted']);
export const getGoods = createSelector(
    getList,
    getSorted,
    (list, sorted) => {
        return sorted ? list.sort((a, b) => {
            const aPrice = a.get('price');
            const bPrice = b.get('price');
            if (aPrice < bPrice) { return -1; }
            if (aPrice > bPrice) { return 1; }
            if (aPrice === bPrice) { return 0; }
        }) : list;
    }
)

export const getNewlyCreatedIdSelector = createSelector(
    [(state) => state.get("createdItemIds")],
    (createdItemIds) => (id) => {

        if(createdItemIds.has(+id)) return createdItemIds.get(+id);
        return null;
    }
);

export const getOneByIdSelector = createSelector(
    getItems,
    (items) => (id) => {
        if(!items.has(+id)) return null;
        items.get(+id);
    }
);
export const getByIdsSelector = createSelector(
    [(state) => state.get("items")],
    (items) => (ids) => ids.map(id => items.get(+id)).filter((v,k)=>v || false)
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
        let selectedEntries = [];

        indexMap.forEach((v,k)=>{
            // console.log(`k : ${k}, v : ${v}`);
            if(k>=offset && k<(offset+limit)) selectedEntries[k] = +v;
        });
        return selectedEntries.map((id)=> items.get(+id)).filter((v,k)=>v || false);
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
                    /*console.log(v);
                    console.log(k);*/
                    entities[entry[0]][k] = v;
                });
            }
        );
        return entities;
    }
);