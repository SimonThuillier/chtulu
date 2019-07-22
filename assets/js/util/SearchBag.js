import SearchBagUtil from './SearchBagUtil';


/**
 * @param search
 * @param sort
 * @param order
 * @param offset
 * @param limit
 * @returns object
 */
const SearchBag = function(search={},sort='id',order=SearchBagUtil.DESC,offset=0,limit=2){
    return {
        search : search,
        sort : sort,
        order : order,
        offset : offset,
        limit : limit
    }
};

export default SearchBag;