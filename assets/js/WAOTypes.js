
/**
 * @class WAO
 */
const waoPrototype = {
    waoType: "rootWao",
    cacheLength:100,
    mapping: {},
    dependencies:{},
    pendingModification:false,
    finalize : function(groups=true){console.log("vanillaFinalize")},
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
    }
};

const defaultPrototypes = {
    /**
     * @class Article
     */
    article:{
        cacheLength:100,
        dependencies:{detailImageResource:"resourceImage"},
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
                    this.beginHDate = hb.util.HDate.prototype.parseFromJson(jsonStr);
                }
                if(this.hasEndDate && this.endHDate !== null && this.endHDate !== ''){
                    if(typeof this.endHDate === "object"){jsonStr = JSON.stringify(this.endHDate);}
                    else{jsonStr = this.endHDate;}
                    this.endHDate = hb.util.HDate.prototype.parseFromJson(jsonStr);
                }
                else{this.endHDate = null;}
            }
            if(groups === true || (typeof groups === 'object' && groups.hasOwnProperty('hteRange'))){
                if(this.hteRange !== null){
                    if(typeof this.hteRange === "object"){jsonStr = JSON.stringify(this.hteRange);}
                    else{jsonStr = this.hteRange;}
                    this.hteRange = hb.util.HDate.prototype.parseFromJson(jsonStr);
                }
                if(this.detailImageResource === "") this.detailImageResource = null;
                if(this.detailImageResource !== null){
                    if(typeof this.detailImageResource === "string"){
                        this.detailImageResource = JSON.parse(this.detailImageResource);
                    }
                }
            }
        }
    },
    /**
     * @class ResourceGeometry
     */
    resourceGeometry : {
        cacheLength:50,
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

let prototypes = {};
const mappingDivs = document.getElementsByClassName('hb-wao-mapping');

for (let i = 0; i < mappingDivs.length; ++i) {
    let item = mappingDivs[i];
    let type = item.getAttribute('id').replace('hb-mapping-','');
    let concreteDtoPrototype = Object.create(waoPrototype);
    concreteDtoPrototype.mapping = JSON.parse(item.getAttribute('data-mapping'));
    concreteDtoPrototype.waoType = type;
    prototypes[type] = concreteDtoPrototype;
}
Object.keys(prototypes).forEach(function(key,index) {
    if(defaultPrototypes.hasOwnProperty(key)) Object.assign(prototypes[key],defaultPrototypes[key]);
    Object.freeze(prototypes[key]);
});

export default prototypes;