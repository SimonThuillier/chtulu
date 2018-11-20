const Imm = require("immutable");


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
        //console.log("invert map");
        //console.log(indexMap);
        //console.log(total);
        let invertedIndexMap = Imm.Map();

        indexMap.forEach((v,k)=>{
            //console.log(`v : ${v} , k : ${k}`);
            invertedIndexMap = invertedIndexMap.set(total-k-1,v);
        });

        return invertedIndexMap;
    }
};

export default SearchBagUtil;