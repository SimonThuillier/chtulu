const Imm = require("immutable");
import { normalize, schema } from 'normalizr';
import HDate from './HDate';

/**
 * @class WAO
 */
const waoPrototype = {
    pendingModification:false,
    initialValues:null,
    toRemove:false,
    isDirty : function(rec){
        return (rec.initialValues && rec.initialValues.size>0);
    },
    isNew : function(rec){
        return (+rec.get("id") < 0);
    },
    getPartial : function(groups = true){
        console.log(this);
        console.log(groups);
        if(typeof groups !== 'object' || !this.mapping) return this;
        let keys = {};
        for (let group in groups){
            if(typeof this.mapping[group] === 'undefined')
                throw new Error("Group " + group + " undefined for " + this.waoType + " WAO");
            this.mapping[group].forEach(function(item){
                keys[item] = groups[group];
            });
        }

        let copy = {};
        Object.keys(keys).forEach((item) => {
            if(typeof keys[item] === 'object' && typeof this[item].getPartial !== 'undefined'){
                copy[item] = this[item].getPartial(keys[item]);
            }
            else{
                //console.log(this[item]);
                copy[item] = this[item];
            }
        });
        return copy;
    },
    receiveRecord: function(rec) {
        return (rec.has("loadedGroups")?rec:rec.set("loadedGroups",{minimal:true}));
    },
    oldId:0,
    loadedGroups:{minimal:true},
    postedGroups:{},
};

const defaultPrototypes = {
    /**
     * @class Article
     */
    article:{
        /**
         * @doc : function aimed to finalize constitution of new HArticle created by parsing JSon
         */
        finalize : function(groups=true){
            console.log(groups);
            let jsonStr = null;
            if(groups === true || (typeof groups === 'object' && groups.hasOwnProperty('date'))){
                if(this.beginHDate !== null){
                    if(typeof this.beginHDate === "object"){jsonStr = JSON.stringify(this.beginHDate);}
                    else{jsonStr = this.beginHDate;}
                    this.beginHDate = HDate.prototype.parseFromJson(jsonStr);
                }
                if(this.hasEndDate && this.endHDate !== null && this.endHDate !== ''){
                    if(typeof this.endHDate === "object"){jsonStr = JSON.stringify(this.endHDate);}
                    else{jsonStr = this.endHDate;}
                    this.endHDate = HDate.prototype.parseFromJson(jsonStr);
                }
                else{this.endHDate = null;}
            }
            if(groups === true || (typeof groups === 'object' && groups.hasOwnProperty('hteRange'))){
                if(this.hteRange !== null){
                    if(typeof this.hteRange === "object"){jsonStr = JSON.stringify(this.hteRange);}
                    else{jsonStr = this.hteRange;}
                    this.hteRange = HDate.prototype.parseFromJson(jsonStr);
                }
                if(this.detailImageResource === "") this.detailImageResource = null;
                if(this.detailImageResource !== null){
                    if(typeof this.detailImageResource === "string"){
                        this.detailImageResource = JSON.parse(this.detailImageResource);
                    }
                }
            }
        },
        receiveRecord: function(rec){
            //console.log("article receiveRecord");
            //console.log(rec);
            if(rec.has("beginHDate") && rec.get("beginHDate") !== null){
                rec = rec.set("beginHDate",HDate.prototype.parseFromJson(JSON.stringify(rec.get("beginHDate"))));
            }
            if(rec.has("endHDate") && rec.get("endHDate") !== null){
                rec = rec
                    .set("endHDate",HDate.prototype.parseFromJson(JSON.stringify(rec.get("endHDate"))))
                    .set("hasEndDate",true);
            } else{ rec = rec.set("hasEndDate",false)}
            return (rec.has("loadedGroups")?rec:rec.set("loadedGroups",{minimal:true}));

        }
    },
    /**
     * @class ResourceGeometry
     */
    resourceGeometry : {
        getPointCoords(){
            if(typeof this.targetGeometry ==='undefined' ||
                typeof this.targetGeometry.value ==='undefined' ||
                typeof this.targetGeometry.value.type ==='undefined' ||
                this.targetGeometry.value.type !=='Point') return [0,0];
            return this.targetGeometry.value.coordinates;
        },
        getPointLat(){
            return this.getPointCoords()[0];
        },
        getPointLng(){
            return this.getPointCoords()[1];
        }
    }
};

const waoAppParam = {
    getInvalidateDuration : 60,
    removeCacheOnUnlock : false
};

const appParams = {
    articleType : {
        getInvalidateDuration : 6000,
        removeCacheOnUnlock : true
    }
};

const mappingDivs = document.getElementsByClassName("hb-wao-mapping");
const structureDivs = document.getElementsByClassName("hb-wao-structure");
let protoMap = Imm.Map();
for (let i = 0; i < mappingDivs.length; ++i) {
    let item = mappingDivs[i];
    let type = item.getAttribute("id").replace("hb-mapping-", "");
    let mapping = JSON.parse(item.getAttribute("data-mapping"));

    let prototype = {...waoPrototype};
    Object.keys(mapping).forEach(key =>{
        mapping[key].forEach(attribute =>{
            prototype[attribute] = null;
        });
    });
    prototype = Object.assign(prototype,defaultPrototypes[type] || {});

    let concreteDtoMap = Imm.Map();
    concreteDtoMap = Imm.Map()
        .set("schema",new schema.Entity(type, {},{ idAttribute: 'id' }))
        .set("mapping",
            Imm.fromJS(mapping)
        )
        .set("waoType", type)
        .set("appParams", Object.assign({...waoAppParam},appParams[type] || {}))
        .set("recordFactory",
            Imm.Record(prototype, type)
        );
    protoMap = protoMap.set(type, concreteDtoMap);
}

for (let i = 0; i < structureDivs.length; ++i) {
    let item = structureDivs[i];
    let type = item.getAttribute("id").replace("hb-structure-", "");
    let structure = JSON.parse(item.getAttribute("data-structure"));
    let normSchema = {};
    Object.keys(structure).forEach(key =>{
        normSchema[key] = protoMap.getIn([structure[key], "schema"]);
    });
    protoMap.getIn([type, "schema"]).define(normSchema);
    protoMap = protoMap.setIn(
        [type, "structure"],
        Imm.fromJS(structure)
    );
}

let groups = {};
protoMap.entrySeq().forEach(entry => {
    groups[entry[0]] = {};
});

Object.keys(groups).forEach(waoType => {
    let mapping = protoMap.getIn([waoType, "mapping"]);
    let struct = protoMap.getIn([waoType, "structure"]);
    mapping.entrySeq().forEach(entry => {
        let groupValue = true;
        if (struct.hasIn([entry[0]])) {
            console.log(struct.getIn([entry[0]]));
            groupValue = struct.getIn([entry[0]]);
            //protoMap.getIn([struct.getIn([entry[0]]), "mapping"]).toJS();
        }
        groups[waoType][entry[0]] = groupValue;
    });
});
Object.keys(groups).forEach(waoType => {
    let thisWao = groups[waoType];
    Object.keys(thisWao).forEach(waoGroups => {
        if (thisWao[waoGroups] !== true) {
            thisWao[waoGroups] = groups[thisWao[waoGroups]];
        }
    });
});

Object.keys(groups).forEach(waoType => {
    protoMap = protoMap.setIn([waoType, "groups"], Imm.fromJS(groups[waoType]));
});

console.log("protoMap");
console.log(protoMap.toJS());
console.log("article groups");
console.log(JSON.stringify(protoMap.getIn(["article","groups"]).toJS()));

export default protoMap;