import WAOs from '../util/WAOs';

const getAllGroupsFromMapping = function(mapping){
    let groups = {};
    Object.keys(mapping).forEach((group)=>{
        groups[group] = true;
    });
    return groups;
};

/**
 * @param waoType string
 * @param groups array
 * @returns array
 */
export const getAllPropertiesInGroups = function(waoType,groups){
    let properties = [];
    const mapping = WAOs.getIn([waoType,"mapping"]).toJS();
    if (!mapping) throw new Error("No metadata (schema or mapping) found for " + waoType + " WAO");

    Object.keys(mapping).forEach((group)=>{
        if(groups.includes(group)){
            properties= properties.concat(mapping[group]);
        }
    });
    return properties;
};

export const getDataToPost = function(waoType,object,groups = true){
    if (!object) return null;
    console.log(`getDataToPost : ${waoType}`);
    console.log(groups);
    console.log(object);
    const mapping = WAOs.getIn([waoType,"mapping"]).toJS();
    const schema = WAOs.getIn([waoType,"schema"]).schema;

    if(!mapping || !schema) throw new Error("No metadata (schema or mapping) found for " + waoType + " WAO");

    if(typeof groups !== 'object') groups=getAllGroupsFromMapping(mapping);
    else if(typeof groups.minimal === 'undefined') groups.minimal = true;

    let keys = {};

    console.log(groups);
    console.log(object);
    console.log(mapping);
    console.log(schema);

    for (let group in groups){
        if(typeof mapping[group] === 'undefined')
            throw new Error("Group " + group + " undefined for " + waoType + " WAO");
        mapping[group].forEach(function(key){
            keys[key] = groups[group];
        });
    }

    let copy = {};
    Object.keys(keys).forEach((key) => {
        if(typeof object[key] === 'object' && typeof schema[key] !== 'undefined'){
            copy[key] = getDataToPost(schema[key]._key,object[key],keys[key]);
        }
        else{
            copy[key] = object[key];
        }
    });
    copy.postedGroups = groups;
    return copy;
};