
const SearchBagUtil = {
    ASC:'ASC',
    DESC:'DESC',
    getCoreBag:function(searchBag){
        const {search,sort} = searchBag;
        return {
            search:search,
            sort:sort
        };
    },
    invertIndexMap:function(indexMap,total){
        let invertedIndexMap = new Map();

        indexMap.forEach((v,k)=>{
            invertedIndexMap.set(total-k-1,v);
        });
        return invertedIndexMap;
    }
};

export default SearchBagUtil;