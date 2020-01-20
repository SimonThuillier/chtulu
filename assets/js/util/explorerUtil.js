import HDate from "./HDate";
import {LEFT, RIGHT} from "./geometry";
import dU from "./date";
import {createSelector} from "reselect/lib/index";
import L from "leaflet";


export const articleIsOpen = (displayedArticles,id) => {
    if(!displayedArticles.has(+id)) return false;
    return displayedArticles.get(+id).isOpen;
};

export const defaultHInterval = new HDate("2", new Date(2000, 1, 1), new Date());

/** @doc HBExplorer is bounded to [1/1/-9999;now] and it's minimum size is 3 days
 * this function hence check a wanted hInterval and returns it or a properly constrained
 * hInterval to avoid HBexplorer errors
 */
export const getConstrainedHInterval = hInterval => {
    // minimum length constraint
    if (hInterval.getIntervalSize() < 3) {
        hInterval = new HDate(
            "2",
            dU.addDay(dU.clone(hInterval.endDate), -3),
            hInterval.endDate
        );
    }
    // max limit to now
    const maxDate = dU.stripHours(new Date());
    if (hInterval.endDate > maxDate) {
        hInterval = new HDate(
            "2",
            dU.addDay(dU.clone(maxDate), -hInterval.getIntervalSize()),
            dU.clone(maxDate)
        );
    }
    // min limit
    const minDate = dU.stripHours(new Date(-9999, 0, 1, 0, 0, 0, 0));
    if (hInterval.beginDate < minDate) {
        hInterval = new HDate(
            "2",
            dU.clone(minDate),
            dU.addDay(dU.clone(minDate), +hInterval.getIntervalSize())
        );
    }
    //console.log(hInterval.endDate);
    return hInterval;
};

export const getHIntervalFromArticles = (articles) => {

    let minDate=null;
    let maxDate = null;

    let articleMinDate = new Date(-4000, 1, 1);
    let articleMaxDate = new Date();

    //console.log(articles);
    (articles || []).forEach(article => {
        articleMinDate = (article.beginHDate && article.beginHDate.beginDate) || new Date(-4000, 1, 1);
        articleMaxDate = (article.endHDate && article.endHDate.endDate) || new Date();

        minDate =
            minDate !== null ? new Date(Math.min(articleMinDate.getTime(), minDate.getTime())):dU.clone(articleMinDate);
        maxDate =
            maxDate !== null ? new Date(Math.max(articleMaxDate.getTime(), maxDate.getTime())):dU.clone(articleMaxDate);

    });

    console.log(`minDate : ${minDate}`);
    console.log(`maxDate : ${maxDate}`);

    if(minDate ===null || maxDate===null) return null;
    return (new HDate("2", dU.addDay(minDate,-1),maxDate)).multiply(1.03);
};

export const getInvisibles = (articles, hInterval) => {
    // articles non visibles
    let leftInvisibles = 0;
    let rightInvisibles = 0;
    let verticalInvisibles = 0;
    let minDate = hInterval.getMiddleDate();
    let maxDate = hInterval.getMiddleDate();
    (articles || []).
    filter(article => {return !!article.beginHDate;}).
    forEach(article => {
        if (article.beginHDate.beginDate < hInterval.beginDate)
            leftInvisibles = leftInvisibles + 1;
        if (article.beginHDate.endDate > hInterval.endDate)
            rightInvisibles = rightInvisibles + 1;

        minDate =
            minDate !== null
                ? new Date(
                Math.min(minDate.getTime(), article.beginHDate.beginDate.getTime())
                )
                : dU.clone(article.beginHDate.beginDate);

        maxDate =
            maxDate !== null
                ? new Date(
                Math.max(maxDate.getTime(), article.beginHDate.endDate.getTime())
                )
                : dU.clone(article.beginHDate.endDate);
    });

    let invisibles = {};
    invisibles[LEFT] = { number: leftInvisibles, minDate: minDate };
    invisibles[RIGHT] = { number: rightInvisibles, maxDate: maxDate };

    return invisibles;
};

// for both ongoing translating and zooming speed increase with time speed = acceleration^elapsedTime
// this function returns the resulting integration
export const getIntegratedSpeed = (acceleration, time) => {
    const { exp, log, floor } = Math;
    return (1 / log(acceleration)) * (exp(time * log(acceleration)) - 1);
};


export const sortArticlesChronogically = createSelector(
    [(articles) =>articles],
    (articles)=> {
        let sortedArticles = [...articles];

        sortedArticles = sortedArticles
            .filter(article => {return !!article.beginHDate;})
            .sort( (a, b) =>{return a.beginHDate.beginDate.getTime() - b.beginHDate.beginDate.getTime();});
        console.log("sortArticles");

        const index = sortedArticles.map((a)=>a.beginHDate.beginDate.getTime());
        return {sortedArticles:sortedArticles,index:index};
    }
);

export const getNeighbourArticleChronogically = (articles,currentId,sense) => {
    const {sortedArticles,index} = sortArticlesChronogically(articles);
    const currentIndex = sortedArticles.findIndex((element)=>{
        return +element.get('id') === +currentId}
    );

    if(currentIndex === -1) return null;

    if(sense === 1){
        if(currentIndex >= (sortedArticles.length-1) ) return null;
        const element = sortedArticles[currentIndex+1];
        return element;
    }
    else {
        if(currentIndex <= 0 ) return null;
        const element = sortedArticles[currentIndex-1];
        return element;
    }
};



export const getLastBegunArticle = (articles,date) => {
    const {sortedArticles,index} = sortArticlesChronogically(articles);
    if(sortedArticles.length < 1) return null;

    const currentDateTime = date.getTime();
    const calculus = index.filter((time)=>(time-currentDateTime<=0));

    if(calculus.length <1) return sortedArticles[0];
    const maxTime = Math.max.apply(null, calculus);
    const wantedIndex = index.findIndex((v)=>(v===maxTime));

    return sortedArticles[wantedIndex];
};


export const getOneByIdSelector = createSelector(
    [(state) => state.get("items")],
    (items) => (id) => {
        if(items.has(+id)) return items.get(+id);
        return null;
    }
);


export const AVAILABLE_THEMES = {
    EDITOR: `EDITOR`,
    SIDEVIEW: `SIDEVIEW`,
    VERTICAL: `VERTICAL`
};

export const AVAILABLE_AREAS = {
    CONTENT: `CONTENT`,
    MAP: `MAP`,
    TIME: `TIME`
};

/** analyze abstract of an article and returns temporal data from it
 * @returns array
 * */

export const getTimeDataFromAbstract = createSelector(
    [(article) =>article],
    (article)=> {

        const text = article.abstract;

        //const regex = /<icon[^>]+id="([^"]+)"[^>]+data-hdate="([^"]+)"[^>]*>[^>]+<\/icon>(.{400})(?!<icon[^>][^>]+data-hdate=")/g;
        const regex = /(<icon[^>]+id="([^"]+)"[^>]+data-hdate="([^"]+)"[^>]*>[^>]+<\/icon>)/g;
        //console.log(text);
        let array = [...text.matchAll(regex)];
        //console.log(array);
        //console.log(Array.from(array, x => x.index));
        //console.log(results);

        let marks = array.map((value)=>{
            const index = value['index'];
            const id = value[2];
            const hDateKey = value[3].replace(/&quot;/gi,'"');

            const html = text.substr(index+value[1].length,400);
            const hDate = HDate.prototype.parseFromJson(hDateKey);
            const duration = hDate.getIntervalSize();

            return {
                index:index,
                id:id,
                hDate:hDate,
                html:html,
                duration:duration
            };
        });

        marks = marks.concat(getTimedGeoData(article));

        // get GeoData set in time too
        marks.sort((a,b)=>{
            return a.hDate.compare(b.hDate);
        });
        console.log('marks : ' ,marks);
        return marks;
    }
);

/** analyze abstract of an article and returns temporal data from it
 * @returns array
 * */
export const getGeoDataFromAbstract = createSelector(
    [(article) =>article],
    (article)=> {

        const text = article.abstract;

        const regex = /(<icon[^>]+id="([^"]+)"[^>]+data-hgeo="([^"]+)"[^>]*>[^>]+<\/icon>)/g;
        //console.log(text);
        let array = [...text.matchAll(regex)];
        //console.log(array);
        //console.log(Array.from(array, x => x.index));
        //console.log(results);

        const marks = array.map((value)=>{
            const index = value['index'];
            const id = value[2];
            const hGeoKey = value[3].replace(/&quot;/gi,'"');

            const html = text.substr(index+value[1].length,400);
            const hGeo = JSON.parse(hGeoKey);

            return {
                index:index,
                id:id,
                hGeo:hGeo,
                html:html
            };
        });

        return marks;
    }
);

/** analyse abstract of an article (use getGeoDataFromAbstract to do so) and returns temporal data from it
 * @returns array
 * **/
const getTimedGeoData = createSelector(
    [(article) =>article],
    (article)=> {

        const geoData = getGeoDataFromAbstract(article);
        const marks = [];

        geoData.forEach(({hGeo,html,id,index})=>{

            //this.geoMarkersIndex.set(id,{center:hGeo.center,zoom:hGeo.zoom});

            hGeo.drawnItems.features.forEach((feature)=>{
                if(!!feature.properties.hDate){
                    console.log('geoData with HDate',feature,feature.properties.hDate);

                    const html = feature.properties.title;
                    const hDate = HDate.prototype.parseFromJson(feature.properties.hDate);
                    const duration = hDate.getIntervalSize();

                    marks.push({
                        index:0,
                        id:id+'-'+feature.properties.id,
                        markerId:id,
                        hDate:hDate,
                        html:html,
                        duration:duration
                    });
                }


                /*feature.properties.iconId= id;
                console.log("add layers, feature=",feature);
                let geoJsonFeature = L.geoJson(feature);
                //if(!!feature.hDate)
                console.log("add layers, GeoJsonFeature=",geoJsonFeature);
                this.drawnItems.addLayer(geoJsonFeature);*/
            });


        });

        console.log('geoData=',marks);


        return marks;
    }
);

/** analyze abstract of an article and returns temporal data from it */

// https://www.dailymotion.com/video/x7qp1ro
// <iframe frameborder="0" width="480" height="270" src="https://www.dailymotion.com/embed/video/x7qp1ro" allowfullscreen allow="autoplay"></iframe>

// https://www.youtube.com/watch?v=jNQXAC9IVRw
// <iframe src="https://www.youtube.com/embed/jNQXAC9IVRw?loop=1&modestbranding=1" width=560 height=315 frameborder allowfullscreen></iframe>

const mediaRegex = /<figure[^>]*class="media"[^>]*>[^<]*<oembed[^>]*url="([^"]+)"[^>]*>[^<]*<\/oembed[^>]*>[^<]*<\/figure[^>]*>/g;

const urlYoutubeRegex = /.*www\.youtube\.com\/watch\?v=([^&?]+)/;
const urlDailymotionRegex = /.*www\.dailymotion\.com\/video\/([^&?]+)/;

export const getDecoratedAbstractForDetail = createSelector(
    [(abstract) =>abstract],
    (abstract)=> {

        let transformedAbstract = abstract;

        //console.log(text);
        let array = [...abstract.matchAll(mediaRegex)];
        console.log('media=',array);
        //console.log(Array.from(array, x => x.index));
        //console.log(results);

        array.forEach((match)=>{
            let figure = match[0];
            let url = match[1];
            let iframe;

            let particularMediaMatch;

            if((particularMediaMatch = urlYoutubeRegex.exec(url)) !== null) {
                iframe = `<p align="center" class="hb-media-iframe"><iframe src="https://www.youtube.com/embed/${particularMediaMatch[1]}" frameborder allowfullscreen></iframe></p>`;
                console.log('media, iframe youtube',iframe);
                transformedAbstract = transformedAbstract.replace(figure,iframe);
            }
            else if((particularMediaMatch = urlDailymotionRegex.exec(url)) !== null) {
                iframe = `<p align="center" class="hb-media-iframe"><iframe src="https://www.dailymotion.com/embed/video/${particularMediaMatch[1]}" frameborder allowfullscreen></iframe></p>`;
                console.log('media, iframe dailymotion',iframe);
                transformedAbstract = transformedAbstract.replace(figure,iframe);
            }
        });

        return transformedAbstract;
    }
);

