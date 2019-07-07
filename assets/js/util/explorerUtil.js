import HDate from "./HDate";
import {LEFT, RIGHT} from "./geometry";
import dU from "./date";


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

    /*console.log(`minDate : ${minDate}`);
    console.log(`maxDate : ${maxDate}`);*/

    if(minDate ===null || maxDate===null) return null;
    return new HDate("2", dU.addDay(minDate,-1),maxDate);
};

export const getInvisibles = (articles, hInterval) => {
    // articles non visibles
    let leftInvisibles = 0;
    let rightInvisibles = 0;
    let verticalInvisibles = 0;
    let minDate = hInterval.getMiddleDate();
    let maxDate = hInterval.getMiddleDate();
    (articles || []).forEach(article => {
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

export const AVAILABLE_THEMES = {
    EDITOR: `EDITOR`,
    SIDEVIEW: `SIDEVIEW`,
    VERTICAL: `VERTICAL`
};