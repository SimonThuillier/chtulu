require('../css/app.css');
require('bootstrap3/dist/css/bootstrap.min.css');
require('admin-lte/dist/css/AdminLTE.min.css');
require('admin-lte/dist/css/skins/skin-blue.min.css');
require('font-awesome/css/font-awesome.css');
require('icheck/skins/square/blue.css');
require('jquery-ui/themes/base/all.css');
require('bootstrap-table/dist/bootstrap-table.css');
require('leaflet/dist/leaflet.css');
require('../napoleon3.jpeg');
require('../bismarck.jpeg');
require('../hugo.jpeg');


$ = require('jquery');
jQuery = $;
d3 = require('d3');
L = require('leaflet');
React = require('react');
ReactDOM = require('react-dom');
require('react-router-dom');
// import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
RL = require('react-leaflet');

require('jquery-ui/ui/core.js');
require('jquery-ui/ui/widget.js');
require('jquery-ui/ui/widgets/dialog.js');

require('bootstrap3/dist/js/bootstrap.js');
require('admin-lte/dist/js/adminlte.js');
require('admin-lte/dist/js/demo.js');
require('jquery-slimscroll/jquery.slimscroll.min.js');
require('fastclick/lib/fastclick.js');
require('bootstrap-table/dist/bootstrap-table.js');
require('icheck');


// import the function from greet.js (the .js extension is optional)
// ./ (or ../) means to look for a local file
// hb = {util:{
//         cmn : require('./hb/util/common.js'),
//         trans : require('./hb/util/translation.js'),
//         date : require('./hb/util/date.js'),
//         symfony : require('./hb/util/symfony.js'),
//         dto : require('./hb/util/dto.js'),
//         geom : require('./hb/util/geometry.js'),
//         HDate : require('./hb/util/HDate.js'),
//         HTimeGrad : require('./hb/util/HTimeGrad.js'),
//         HTimeRange : require('./hb/util/HTimeRange.js'),
//     },
//     ui:{
//         misc : require('./hb/ui/misc.js'),
//         FormBuilder : require('./hb/ui/FormBuilder.js'),
//         SfFormMediator : require('./hb/ui/SfFormMediator.js'),
//         HDatePicker : require('./hb/ui/HDatePicker.js'),
//         detailBuilder : require('./hb/ui/detailBuilder.js'),
//         detailMediator : require('./hb/ui/detailMediator.js'),
//         HModal : require('./hb/ui/HModal.js'),
//         manager : require('./hb/ui/manager.js')
//     }
// };
hb = {util:{},ui:{}};
hb.util.cmn = require('./hb/util/common.js');
hb.util.trans = require('./hb/util/translation.js');
hb.util.date = require('./hb/util/date.js');
hb.util.symfony = require('./hb/util/symfony.js');
hb.util.dto = require('./hb/util/dto.js');
hb.util.geom = require('./hb/util/geometry.js');
hb.util.HDate = require('./hb/util/HDate.js');
hb.util.HTimeGrad = require('./hb/util/HTimeGrad.js');
hb.util.HTimeRange = require('./hb/util/HTimeRange.js');

hb.ui.misc = require('./hb/ui/misc.js');
hb.ui.FormBuilder = require('./hb/ui/FormBuilder.js');
hb.ui.SfFormMediator = require('./hb/ui/SfFormMediator.js');
hb.ui.HDatePicker = require('./hb/ui/HDatePicker.js');
hb.ui.detailBuilder = require('./hb/ui/detailBuilder.js');
hb.ui.detailMediator = require('./hb/ui/detailMediator.js');
hb.ui.HModal = require('./hb/ui/HModal.js');
hb.ui.HTimeExplorer = require('./hb/ui/HTimeExplorer.js');
hb.ui.HResourcePicker= require('./hb/ui/HResourcePicker.js');
hb.ui.manager = require('./hb/ui/manager.js');




// require('./hb/util/symfony.js');

$(function() {

    console.log("apply classes");
    hb.ui.manager.instanciateUniques();
    hb.ui.manager.applyClasses(null);
});

console.log(hb.ui.manager.get("hdatepicker"));

console.log(hb);

console.log('Hello Webpack Encore');

console.log('Lolilol');