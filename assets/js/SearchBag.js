
/**
 * @param search
 * @param sort
 * @param order
 * @param offset
 * @param limit
 * @returns object
 */
const SearchBag = function(search={},sort='id',order='DESC',offset=0,limit=100){
    return {
        search : search,
        sort : sort,
        order : order,
        offset : offset,
        limit : limit
    }
}

export default SearchBag;