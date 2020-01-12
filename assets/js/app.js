
require('../css/app.css');
require('bootstrap3/dist/css/bootstrap.min.css');
require('admin-lte/dist/css/AdminLTE.min.css');
require('admin-lte/dist/css/skins/skin-blue.min.css');
require('font-awesome/css/font-awesome.css');
require('icheck/skins/square/blue.css');
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
//require('bootstrap-table/dist/bootstrap-table.css');
window.L = require('leaflet');
require('leaflet/dist/leaflet.css');
// stupid hack so that leaflet's images work after going through webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: `${window.location.origin}/build/images/marker-icon-2x.png`,
    iconUrl: `${window.location.origin}/build/images/marker-icon.png`,
    shadowUrl: `${window.location.origin}/build/images/marker-shadow.png`
});
require('leaflet-draw/dist/leaflet.draw.css');


require('react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css');

window.jQuery = window.$ = require('jquery');
window.d3 = require('d3');
require('leaflet-draw');
window.React = require('react');
window.ReactDOM = require('react-dom');
require('react-router-dom');

require('bootstrap3/dist/js/bootstrap.js');
require('admin-lte/dist/js/adminlte.js');
require('jquery-slimscroll/jquery.slimscroll.min.js');
require('fastclick/lib/fastclick.js');
require('bootstrap-table/dist/bootstrap-table.js');
require('icheck');
