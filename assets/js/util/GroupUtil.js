import WAOs from '../util/WAOs';

const GroupUtil = {
    /**
     * @doc merge two groups together returning the result
     * by convention boolean true can be used as a clap to require all groups from a nested attribute
     * @param base object|boolean|undefined
     * @param toMerge object|boolean|undefined
     * @return object|boolean
     */
    merge: function(base, toMerge) {
        if (typeof base === "undefined" || typeof toMerge === "boolean")
            return toMerge;
        if (typeof toMerge === "undefined" || typeof base === "boolean")
            return base;

        /*console.log("merging groups");
        console.log(base);
        console.log(toMerge);*/

        let merged = {};
        Object.keys(base).forEach(key => {
            merged[key] = GroupUtil.merge(base[key], toMerge[key]);
        });
        Object.keys(toMerge).forEach(key => {
            merged[key] = merged[key] || toMerge[key];
        });
        return merged;
    },
    /**
     * @doc get all items from base that are not present in toCompare
     * @param type
     * @param base object|boolean|undefined
     * @param toCompare object|boolean|undefined
     * @return object
     */
    leftDiff: function(type, base, toCompare) {
        if (typeof base === "undefined") return {};
        if (typeof toCompare === "undefined") return base;
        let groups = type;
        if (typeof groups === "string") groups = WAOs.getIn([type, "groups"]);
        let diff = {};

        //console.log('groupUtil : ',type,base,toCompare,groups);

        if (typeof base === "boolean") base = groups.toJS();
        Object.keys(base).forEach(key => {
            if (typeof toCompare[key] === "undefined") diff[key] = base[key];
            else if (typeof toCompare[key] === "object") {
                let subDiff = {};
                if (typeof groups ==="object" && groups.has(key)){
                    subDiff = GroupUtil.leftDiff(
                        groups.get(key),
                        base[key],
                        toCompare[key]
                    );
                }
                    //throw `Group ${key} isn't valid, please remove or edit it`;

                if (Object.keys(subDiff).length > 0) diff[key] = subDiff;
            }
        });
        return diff;
    },
    /**
     * @doc get all items present both in base and toCompare
     * @param type
     * @param base object|boolean|undefined
     * @param toCompare object|boolean|undefined
     * @return object|boolean
     */
    intersect: function(type, base, toCompare) {
        if (typeof base === "undefined" || typeof toCompare === "undefined") return {};
        if (typeof base === "boolean" || typeof toCompare === "boolean") return true;
        let groups = type;
        if (typeof groups === "string") groups = WAOs.getIn([type, "groups"]);
        let inter = {};

        if (typeof base === "boolean") base = groups.toJS();
        Object.keys(base).forEach(key => {
            if (typeof toCompare[key] === "boolean") inter[key] = base[key];
            else if (typeof toCompare[key] === "object") {
                if (!groups.has(key))
                    throw `Group ${key} isn't valid, please remove or edit it`;
                let subInter = GroupUtil.intersect(
                    groups.get(key),
                    base[key],
                    toCompare[key]
                );
                if (Object.keys(subInter).length > 0) diff[key] = subInter;
            }
        });
        return inter;
    }
};

export default GroupUtil;