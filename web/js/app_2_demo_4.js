(function(a,e){"use strict";var s=["skin-blue","skin-black","skin-red","skin-yellow","skin-purple","skin-green","skin-blue-light","skin-black-light","skin-red-light","skin-yellow-light","skin-purple-light","skin-green-light"],i=a("<div />",{"id":"control-sidebar-theme-demo-options-tab","class":"tab-pane active"});var u=a("<li />",{"class":"active"}).html("<a href='#control-sidebar-theme-demo-options-tab' data-toggle='tab'><i class='fa fa-wrench'></i></a>");a("[href='#control-sidebar-home-tab']").parent().before(u);var t=a("<div />");t.append("<h4 class='control-sidebar-heading'>Layout Options</h4><div class='form-group'><label class='control-sidebar-subheading'><input type='checkbox' data-layout='fixed' class='pull-right'/> Fixed layout</label><p>Activate the fixed layout. You can't use fixed and boxed layouts together</p></div><div class='form-group'><label class='control-sidebar-subheading'><input type='checkbox' data-layout='layout-boxed'class='pull-right'/> Boxed Layout</label><p>Activate the boxed layout</p></div><div class='form-group'><label class='control-sidebar-subheading'><input type='checkbox' data-layout='sidebar-collapse' class='pull-right'/> Toggle Sidebar</label><p>Toggle the left sidebar's state (open or collapse)</p></div><div class='form-group'><label class='control-sidebar-subheading'><input type='checkbox' data-enable='expandOnHover' class='pull-right'/> Sidebar Expand on Hover</label><p>Let the sidebar mini expand on hover</p></div><div class='form-group'><label class='control-sidebar-subheading'><input type='checkbox' data-controlsidebar='control-sidebar-open' class='pull-right'/> Toggle Right Sidebar Slide</label><p>Toggle between slide over content and push content effects</p></div><div class='form-group'><label class='control-sidebar-subheading'><input type='checkbox' data-sidebarskin='toggle' class='pull-right'/> Toggle Right Sidebar Skin</label><p>Toggle between dark and light skins for the right sidebar</p></div>");var l=a("<ul />",{"class":"list-unstyled clearfix"});var v=a("<li />",{style:"float:left; width: 33.33333%; padding: 5px;"}).append("<a href='javascript:void(0);' data-skin='skin-blue' style='display: block; box-shadow: 0 0 3px rgba(0,0,0,0.4)' class='clearfix full-opacity-hover'><div><span style='display:block; width: 20%; float: left; height: 7px; background: #367fa9;'></span><span class='bg-light-blue' style='display:block; width: 80%; float: left; height: 7px;'></span></div><div><span style='display:block; width: 20%; float: left; height: 20px; background: #222d32;'></span><span style='display:block; width: 80%; float: left; height: 20px; background: #f4f5f7;'></span></div></a><p class='text-center no-margin'>Blue</p>");l.append(v);var x=a("<li />",{style:"float:left; width: 33.33333%; padding: 5px;"}).append("<a href='javascript:void(0);' data-skin='skin-black' style='display: block; box-shadow: 0 0 3px rgba(0,0,0,0.4)' class='clearfix full-opacity-hover'><div style='box-shadow: 0 0 2px rgba(0,0,0,0.1)' class='clearfix'><span style='display:block; width: 20%; float: left; height: 7px; background: #fefefe;'></span><span style='display:block; width: 80%; float: left; height: 7px; background: #fefefe;'></span></div><div><span style='display:block; width: 20%; float: left; height: 20px; background: #222;'></span><span style='display:block; width: 80%; float: left; height: 20px; background: #f4f5f7;'></span></div></a><p class='text-center no-margin'>Black</p>");l.append(x);var k=a("<li />",{style:"float:left; width: 33.33333%; padding: 5px;"}).append("<a href='javascript:void(0);' data-skin='skin-purple' style='display: block; box-shadow: 0 0 3px rgba(0,0,0,0.4)' class='clearfix full-opacity-hover'><div><span style='display:block; width: 20%; float: left; height: 7px;' class='bg-purple-active'></span><span class='bg-purple' style='display:block; width: 80%; float: left; height: 7px;'></span></div><div><span style='display:block; width: 20%; float: left; height: 20px; background: #222d32;'></span><span style='display:block; width: 80%; float: left; height: 20px; background: #f4f5f7;'></span></div></a><p class='text-center no-margin'>Purple</p>");l.append(k);var y=a("<li />",{style:"float:left; width: 33.33333%; padding: 5px;"}).append("<a href='javascript:void(0);' data-skin='skin-green' style='display: block; box-shadow: 0 0 3px rgba(0,0,0,0.4)' class='clearfix full-opacity-hover'><div><span style='display:block; width: 20%; float: left; height: 7px;' class='bg-green-active'></span><span class='bg-green' style='display:block; width: 80%; float: left; height: 7px;'></span></div><div><span style='display:block; width: 20%; float: left; height: 20px; background: #222d32;'></span><span style='display:block; width: 80%; float: left; height: 20px; background: #f4f5f7;'></span></div></a><p class='text-center no-margin'>Green</p>");l.append(y);var g=a("<li />",{style:"float:left; width: 33.33333%; padding: 5px;"}).append("<a href='javascript:void(0);' data-skin='skin-red' style='display: block; box-shadow: 0 0 3px rgba(0,0,0,0.4)' class='clearfix full-opacity-hover'><div><span style='display:block; width: 20%; float: left; height: 7px;' class='bg-red-active'></span><span class='bg-red' style='display:block; width: 80%; float: left; height: 7px;'></span></div><div><span style='display:block; width: 20%; float: left; height: 20px; background: #222d32;'></span><span style='display:block; width: 80%; float: left; height: 20px; background: #f4f5f7;'></span></div></a><p class='text-center no-margin'>Red</p>");l.append(g);var b=a("<li />",{style:"float:left; width: 33.33333%; padding: 5px;"}).append("<a href='javascript:void(0);' data-skin='skin-yellow' style='display: block; box-shadow: 0 0 3px rgba(0,0,0,0.4)' class='clearfix full-opacity-hover'><div><span style='display:block; width: 20%; float: left; height: 7px;' class='bg-yellow-active'></span><span class='bg-yellow' style='display:block; width: 80%; float: left; height: 7px;'></span></div><div><span style='display:block; width: 20%; float: left; height: 20px; background: #222d32;'></span><span style='display:block; width: 80%; float: left; height: 20px; background: #f4f5f7;'></span></div></a><p class='text-center no-margin'>Yellow</p>");l.append(b);var h=a("<li />",{style:"float:left; width: 33.33333%; padding: 5px;"}).append("<a href='javascript:void(0);' data-skin='skin-blue-light' style='display: block; box-shadow: 0 0 3px rgba(0,0,0,0.4)' class='clearfix full-opacity-hover'><div><span style='display:block; width: 20%; float: left; height: 7px; background: #367fa9;'></span><span class='bg-light-blue' style='display:block; width: 80%; float: left; height: 7px;'></span></div><div><span style='display:block; width: 20%; float: left; height: 20px; background: #f9fafc;'></span><span style='display:block; width: 80%; float: left; height: 20px; background: #f4f5f7;'></span></div></a><p class='text-center no-margin' style='font-size: 12px'>Blue Light</p>");l.append(h);var f=a("<li />",{style:"float:left; width: 33.33333%; padding: 5px;"}).append("<a href='javascript:void(0);' data-skin='skin-black-light' style='display: block; box-shadow: 0 0 3px rgba(0,0,0,0.4)' class='clearfix full-opacity-hover'><div style='box-shadow: 0 0 2px rgba(0,0,0,0.1)' class='clearfix'><span style='display:block; width: 20%; float: left; height: 7px; background: #fefefe;'></span><span style='display:block; width: 80%; float: left; height: 7px; background: #fefefe;'></span></div><div><span style='display:block; width: 20%; float: left; height: 20px; background: #f9fafc;'></span><span style='display:block; width: 80%; float: left; height: 20px; background: #f4f5f7;'></span></div></a><p class='text-center no-margin' style='font-size: 12px'>Black Light</p>");l.append(f);var r=a("<li />",{style:"float:left; width: 33.33333%; padding: 5px;"}).append("<a href='javascript:void(0);' data-skin='skin-purple-light' style='display: block; box-shadow: 0 0 3px rgba(0,0,0,0.4)' class='clearfix full-opacity-hover'><div><span style='display:block; width: 20%; float: left; height: 7px;' class='bg-purple-active'></span><span class='bg-purple' style='display:block; width: 80%; float: left; height: 7px;'></span></div><div><span style='display:block; width: 20%; float: left; height: 20px; background: #f9fafc;'></span><span style='display:block; width: 80%; float: left; height: 20px; background: #f4f5f7;'></span></div></a><p class='text-center no-margin' style='font-size: 12px'>Purple Light</p>");l.append(r);var c=a("<li />",{style:"float:left; width: 33.33333%; padding: 5px;"}).append("<a href='javascript:void(0);' data-skin='skin-green-light' style='display: block; box-shadow: 0 0 3px rgba(0,0,0,0.4)' class='clearfix full-opacity-hover'><div><span style='display:block; width: 20%; float: left; height: 7px;' class='bg-green-active'></span><span class='bg-green' style='display:block; width: 80%; float: left; height: 7px;'></span></div><div><span style='display:block; width: 20%; float: left; height: 20px; background: #f9fafc;'></span><span style='display:block; width: 80%; float: left; height: 20px; background: #f4f5f7;'></span></div></a><p class='text-center no-margin' style='font-size: 12px'>Green Light</p>");l.append(c);var n=a("<li />",{style:"float:left; width: 33.33333%; padding: 5px;"}).append("<a href='javascript:void(0);' data-skin='skin-red-light' style='display: block; box-shadow: 0 0 3px rgba(0,0,0,0.4)' class='clearfix full-opacity-hover'><div><span style='display:block; width: 20%; float: left; height: 7px;' class='bg-red-active'></span><span class='bg-red' style='display:block; width: 80%; float: left; height: 7px;'></span></div><div><span style='display:block; width: 20%; float: left; height: 20px; background: #f9fafc;'></span><span style='display:block; width: 80%; float: left; height: 20px; background: #f4f5f7;'></span></div></a><p class='text-center no-margin' style='font-size: 12px'>Red Light</p>");l.append(n);var p=a("<li />",{style:"float:left; width: 33.33333%; padding: 5px;"}).append("<a href='javascript:void(0);' data-skin='skin-yellow-light' style='display: block; box-shadow: 0 0 3px rgba(0,0,0,0.4)' class='clearfix full-opacity-hover'><div><span style='display:block; width: 20%; float: left; height: 7px;' class='bg-yellow-active'></span><span class='bg-yellow' style='display:block; width: 80%; float: left; height: 7px;'></span></div><div><span style='display:block; width: 20%; float: left; height: 20px; background: #f9fafc;'></span><span style='display:block; width: 80%; float: left; height: 20px; background: #f4f5f7;'></span></div></a><p class='text-center no-margin' style='font-size: 12px;'>Yellow Light</p>");l.append(p);t.append("<h4 class='control-sidebar-heading'>Skins</h4>");t.append(l);i.append(t);a("#control-sidebar-home-tab").after(i);S();function d(l){a("body").toggleClass(l);e.layout.fixSidebar();if(l=="layout-boxed")e.controlSidebar._fix(a(".control-sidebar-bg"));if(a("body").hasClass("fixed")&&l=="fixed"){e.pushMenu.expandOnHover();e.layout.activate()};e.controlSidebar._fix(a(".control-sidebar-bg"));e.controlSidebar._fix(a(".control-sidebar"))};function o(l){a.each(s,function(l){a("body").removeClass(s[l])});a("body").addClass(l);w("skin",l);return!1};function w(a,l){if(typeof(Storage)!=="undefined"){localStorage.setItem(a,l)}
else{window.alert("Please use a modern browser to properly view this template!")}};function m(a){if(typeof(Storage)!=="undefined"){return localStorage.getItem(a)}
else{window.alert("Please use a modern browser to properly view this template!")}};function S(){var l=m("skin");if(l&&a.inArray(l,s))o(l);a("[data-skin]").on("click",function(l){if(a(this).hasClass("knob"))return;l.preventDefault();o(a(this).data("skin"))});a("[data-layout]").on("click",function(){d(a(this).data("layout"))});a("[data-controlsidebar]").on("click",function(){d(a(this).data("controlsidebar"));var l=!e.options.controlSidebarOptions.slide;e.options.controlSidebarOptions.slide=l;if(!l)a(".control-sidebar").removeClass("control-sidebar-open")});a("[data-sidebarskin='toggle']").on("click",function(){var l=a(".control-sidebar");if(l.hasClass("control-sidebar-dark")){l.removeClass("control-sidebar-dark");l.addClass("control-sidebar-light")}
else{l.removeClass("control-sidebar-light");l.addClass("control-sidebar-dark")}});a("[data-enable='expandOnHover']").on("click",function(){a(this).attr("disabled",!0);e.pushMenu.expandOnHover();if(!a("body").hasClass("sidebar-collapse"))a("[data-layout='sidebar-collapse']").click()});if(a("body").hasClass("fixed")){a("[data-layout='fixed']").attr("checked","checked")};if(a("body").hasClass("layout-boxed")){a("[data-layout='layout-boxed']").attr("checked","checked")};if(a("body").hasClass("sidebar-collapse")){a("[data-layout='sidebar-collapse']").attr("checked","checked")}}})(jQuery,$.AdminLTE);