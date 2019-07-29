import {
    OverlayTrigger,
    Tooltip,
    Button,
    Glyphicon
} from 'react-bootstrap';
import React from 'react';


/**
 *
 * @param sense +1 or -1
 * @param target : an object {id,title} or null
 * @param switcher : function called when breadcrumb is clicked on
 * @returns {*}
 * @constructor
 */
export default ({sense,target,switcher}) => {
    const params = (+sense === 1)?
        {placement:'right',tooltipId:'next-tooltip',glyph:'menu-right'}:
        {placement:'left',tooltipId:'prev-tooltip',glyph:'menu-left'};

    if(target === null) return (<span>&nbsp;&nbsp;&nbsp;</span>);

    return (<OverlayTrigger
        placement={params.placement}
        overlay={
            <Tooltip id={params.tooltipId}>
                {target.title}
            </Tooltip>
        }>
        <Button onClick={() => {switcher(target.id)}}>
            <Glyphicon glyph={params.glyph} />
        </Button>
    </OverlayTrigger>);
};