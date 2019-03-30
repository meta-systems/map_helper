var set_coordinates = function (coord, zoom) {
    if(zoom && coord && coord.length == 2){  // переменные не заменят элементы пока не заполнятся все 3 параметра
        
        // SAT
        document.getElementById("google").href='https://google.com/maps/?ll='+coord[1]+','+coord[0]+'&spn=2.414984,2.568054&t=h&z='+zoom;
        document.getElementById("yandex").href='http://maps.yandex.ru/?ll='+coord[0]+'%2C'+coord[1]+'&z='+zoom+'&l=sat%2Cskl'; // reverse
        document.getElementById("bing").href='http://www.bing.com/maps/?v=2&cp='+coord[1]+'~'+coord[0]+'&lvl='+zoom+'&sty=h';
        document.getElementById("here").href='https://wego.here.com/'+coord[1]+','+coord[0]+','+Math.round(zoom)+',satellite';
        document.getElementById("esri").href='http://bestmaps.ru/map/osm/WorldImagery/'+zoom+'/' + coord[1]+'/'+coord[0]+'/';
        
        // MAP
        document.getElementById("google_map").href='https://google.com/maps/?ll='+coord[1]+','+coord[0]+'&spn=2.414984,2.568054&t=m&z='+zoom;
        document.getElementById("yandex_map").href='http://maps.yandex.ru/?ll='+coord[0]+'%2C'+coord[1]+'&z='+zoom+'&l=map'; // reverse
        document.getElementById("osm").href='http://www.openstreetmap.org/#map='+zoom+'/'+coord[1]+'/'+coord[0];
        // debug
        // document.getElementById("osm").setAttribute('title', 'http://www.openstreetmap.org/#map='+zoom+'/'+coord[1]+'/'+coord[0]);

        document.getElementById("gis2").href='https://beta.2gis.ru/?m='+coord[0]+'%2C'+coord[1]+'%2F'+Math.round(zoom); // при переходе из маппилари 2гис не понимает дробного зума, REVERSE
        document.getElementById("wiki").href='http://wikimapia.org/#lang=ru&lat='+coord[1]+'&lon='+coord[0]+'&z='+zoom+'&m=ys';
        document.getElementById("nakarte").href='https://nakarte.me/#m='+zoom+'/'+coord[1]+'/'+coord[0]+'&l=O/K';

        // OSM & tools
        document.getElementById("chepetsk").href='http://xn--e1aaps0bc.net/?zoom='+zoom+'&lat='+coord[1]+'&lon='+coord[0];
        document.getElementById("sputnik").href='http://maps.sputnik.ru/?lat='+coord[1]+'&lng='+coord[0]+'&zoom='+zoom;
        document.getElementById("topo").href='https://opentopomap.org/#map='+Math.round(zoom)+'/'+coord[1]+'/'+coord[0];
        document.getElementById("osm_by").href='http://openstreetmap.by/#'+zoom+'/'+coord[1]+'/'+coord[0];
        document.getElementById("brouter").href='http://brouter.de/brouter-web/#map='+zoom+'/'+coord[1]+'/'+coord[0]+'/OpenStreetMap';
        document.getElementById("qwant").href='https://www.qwant.com/maps/#map='+zoom+'/'+coord[1]+'/'+coord[0]+'';
        document.getElementById("mapy").href='https://mapy.cz/?x='+coord[0]+'&y='+coord[1]+'&z='+zoom;
        document.getElementById("osm_ru").href='http://openstreetmap.ru/#map='+zoom+'/'+coord[1]+'/'+coord[0];
        document.getElementById("navitel").href='http://maps.navitel.su/api/map.html?zoom='+zoom+'&lat='+coord[1]+'&lon='+coord[0];
        document.getElementById("flickr").href='https://loc.alize.us/#/geo:'+coord[1]+','+coord[0]+','+zoom+',/';
        document.getElementById("bestmaps").href='http://bestmaps.ru/map/osm/map/'+zoom+'/' + coord[1]+'/'+coord[0]+'/';
        document.getElementById("mapillary").href='https://www.mapillary.com/app/?lat='+coord[1]+'&lng='+coord[0]+'&z='+zoom+'';
        document.getElementById("strava").href='https://www.strava.com/heatmap#'+zoom+'/'+coord[0]+'/'+coord[1]+'/hot/all'; // reverse coordinates
        document.getElementById("waze").href='https://www.waze.com/ru/livemap?zoom='+zoom+'&lat='+coord[1]+'&lon='+coord[0]+''; //

        // Cadastre
        var meters_xy = degrees2meters(coord[0], coord[1]);
        document.getElementById("kadastr").href='https://pkk5.rosreestr.ru/#x='+meters_xy[0]+'&y='+meters_xy[1]+'&z='+zoom+'&app=search&opened=1';


        var jlat = parseFloat(coord[1]),
            jlon = parseFloat(coord[0]);
        if(!isNaN(jlat) && !isNaN(jlon)) {
            var power = zoom < 18 ? 18 - zoom : 0;
            var multiplier = zoom < 15
                ? 0.03 // zoom0-14: max area for a city
                : 0.002 * Math.pow(2, power);
            var jsom_params = [
                'left=' + (jlon - multiplier * 3),
                'right=' + (jlon + multiplier * 3),
                'top=' + (jlat + multiplier),
                'bottom=' + (jlat - multiplier)
            ];
            document.getElementById("josm").href='http://127.0.0.1:8111/load_and_zoom?' + jsom_params.join('&');
            document.getElementById("josm").addEventListener('click', function(e){
                if(document.getElementById("body").classList.contains('edit_mode')) {
                    return false;
                }

                fetch(this.href)
                    .then(function(response) {
                        window.close();
                    })
                    .catch(function(err) {
                        alert(chrome.i18n.getMessage('josm_missing'));
                    });
            });
        }
        // coordinates
        document.getElementById("coord_input").value  = coord[1] + ', ' + coord[0];
        document.getElementById("zoom_status").innerText  = Math.round(zoom * 100) / 100;
        document.getElementById("zoom_status").classList.add("zoom_visible");

        // GE
        // FIXME: link for a new Bestmaps version will be changed
        document.getElementById("earth_kml").href='https://bestmaps.ru/test/kml_generate/index.php?lat='+coord[1]+'&lon='+coord[0];

        document.getElementById("body").classList.remove("coordinates_hidden");
        document.getElementById('compare_start_js').classList.remove("hidden");
        console.log(coord);
    }
    else {
        document.getElementById("body").classList.add("coordinates_hidden");
        document.getElementById('compare_link_js').classList.add("hidden");
        return;
    }


    function build_compare_link(){
        var bm_aliases = {
            'yandex': 'yandex/hybrid',
            'here': 'here/sat',
            'wiki': 'osm/Wikimapia',
            'bing': 'bing/satellite',
            'esri': 'osm/WorldImagery',
            'mapbox': 'osm/map',
            'yandex_map': 'yandex/map',
            'gis2': '2gis/map',
            'osm': 'osm/map',
            'topo': 'osm/opentopomap',
            'sputnik': 'osm/sputnik'
        };
        var bm_url = 'https://bestmaps.ru/map/';
        var providers = document.querySelectorAll('.compare_item');
        providers.forEach(function (provider, index) {
            if(index > 2) {
                return;
            }
            if(index > 0) {
                bm_url = bm_url + '/map'+(index+1)+'/';
            }
            if(provider.id in bm_aliases) {
                bm_url = bm_url + bm_aliases[provider.id];
            }
        });
        bm_url = bm_url + '/'+zoom+'/'+coord[1]+'/'+coord[0];

        console.log(bm_url);
        var win = window.open(bm_url, '_blank');
    }

    // Compare link
    document.getElementById("compare_link_js").addEventListener("click", function(){
        build_compare_link();
    });


    // Compare link (green)
    document.getElementById("compare_proceed_js").addEventListener("click", function(){
        build_compare_link();
    });
};

/**
 * Zoom from google meters
 */
var getZoomFromMeters = function(meters) {
    if (meters < 50) {
        return 20;
    } else if (meters < 200) {
        return 19;
    } else if (meters < 350) {
        return 18;
    } else if (meters < 533) {
        return 17;
    } else if (meters < 1066) {
        return 16;
    } else if (meters < 2132) {
        return 15;
    } else if (meters < 4267) {
        return 14;
    } else if (meters < 8539) {
        return 13;
    } else if (meters < 17074) {
        return 12;
    } else if (meters < 34153) {
        return 11;
    } else if (meters < 68230) {
        return 10;
    } else {
        return 9;
    }
};

/**
 * @see https://gist.github.com/onderaltintas/6649521
 */
var meters2degress = function(x,y) {
    var lon = x *  180 / 20037508.34 ;
    //thanks magichim @ github for the correction
    var lat = Math.atan(Math.exp(y * Math.PI / 20037508.34)) * 360 / Math.PI - 90;
    return [lon, lat]
};
var degrees2meters = function(lon,lat) {
    // var x = lon * 20037508.34 / 180;
    // var y = Math.log(Math.tan((90 + lat) * Math.PI / 360)) / (Math.PI / 180);
    // y = y * 20037508.34 / 180;
    // return [x, y];
    var transformer = proj4('EPSG:4326','EPSG:3857');
    return transformer.forward([parseFloat(lon), parseFloat(lat)]);
};

var url;

// для карт, у которых нет координат в урле, пробрасываем их из content_script.js
// listen for call from content_script(browser scope)
chrome.runtime.onMessage.addListener(function(request, sender) {

    var is_bing = /bing.*maps/.test(url);
    var is_loadmap = /loadmap\.net/.test(url);
    var is_chepetsk = /xn--e1aaps0bc\.net/.test(url);
    var is_navitel = /maps\.navitel\.su/.test(url);
    var is_waze = /waze\.com/.test(url);
    if(request.coords.lat && request.coords.lon && (is_bing || is_loadmap || is_chepetsk || is_navitel || is_waze)) {
        set_coordinates([request.coords.lon, request.coords.lat], request.coords.zoom);
    }

});

chrome.tabs.query({
    'active': true,
    'lastFocusedWindow': true
}, function (tabs) {

    url = tabs[0].url;
    var url_parts = url.split( '/' );
    var host = url_parts[2];
    var host_parts = host.split( '.' );
    var host_clean = host_parts[host_parts.length-2];

    var coord = new Array();
    var zoom;

    var coordarray = url.match(/-?[0-9]{0,3}\.[0-9]{6}/ig); //универсальная функция для поиска координат

    // console.log(coordarray);

    //YANDEX
    if(/(yandex.*maps)/.test(url)){   //ищем яндекс И мапс применяя метод test

        coord[1] = coordarray[1]; // не переварачиваем координаты. у яндекса широта-долгота наооборот будь он неладен...
        coord[0] = coordarray[0];

        var zoomya = url.match(/z=[0-9]{1,2}/ig);  //ищем z=XX

        zoom = zoomya[0].slice(2); //  убираем z=

        if(/sat/.test(url)) {
            // document.getElementById("yandex").className='selected';
            document.querySelector("#yandex").classList.add('selected');
        }
        else {
            // document.getElementById("yandex_map").className='selected';
            document.querySelector("#yandex_map").classList.add('selected');
        }

    }
    // GOOGLE
    else if(/(google.*maps)/.test(url)) {   //ищем гугл И мапс применяя метод test
        var map_matches = url.match(/(-?[\d.]+),(-?[\d.]+),([\d.]+)z/);
        if(map_matches !== null) {
            zoom = map_matches[3];
            coord[1] = map_matches[1];
            coord[0] = map_matches[2];
            document.querySelector("#google_map").classList.add('selected');
        }

        var sat_matches = url.match(/(-?[\d.]+),(-?[\d.]+),([\d.]+)(m|a)/);
        if(sat_matches !== null) {
            var meters = sat_matches[3];
            coord[1] = sat_matches[1];
            coord[0] = sat_matches[2];
            zoom = getZoomFromMeters(meters);// функция для преобразования M -> Zoom
            document.querySelector("#google").classList.add('selected');
        }
    }
    // BING
    else if(/bing.*maps/.test(url)) { // /bing.*maps||mapspreview/

        // document.getElementById("bing").className='selected';
        document.querySelector("#bing").classList.add('selected');

    }
    // BESTMAPS
    else if (host_clean === 'bestmaps'){

        var matches = url.match(/\/(\d+)\/(-?[\d.]+)\/(-?[\d.]+)/);
        if(matches !== null) {
            zoom = matches[1];
            coord[1] = matches[2];
            coord[0] = matches[3];
        }

        if(/map\/osm\/WorldImagery/.test(url)) {
            // document.getElementById("esri").className='selected';
            document.querySelector("#esri").classList.add('selected');
        }
        else if(/map/.test(url)) {
            // document.getElementById("bestmaps").className='selected'; // ломает классы
            document.querySelector("#bestmaps").classList.add('selected');
        }
    }
    // brouter
    else if(/brouter\.de/.test(url)) {
        var map_matches = url.match(/brouter-web\/#map=([\d.]+)\/(-?[\d.]+)\/(-?[\d.]+)/);
        if(map_matches !== null) {
            zoom = map_matches[1];
            coord[1] = map_matches[2];
            coord[0] = map_matches[3];
        }

        document.querySelector("#brouter").classList.add('selected');
    }
    // qwant 
    else if(/qwant\.com/.test(url)) {

        // https://www.qwant.com/maps/#map=18.00/57.8163132/28.3294716
        // https://www.qwant.com/maps/place/osm:node:4176691489@_#map=18.00/57.8163132/28.3294716

        var map_matches = url.match(/#map=([\d.]+)\/(-?[\d.]+)\/(-?[\d.]+)/);

        if(map_matches !== null) {
            zoom = map_matches[1];
            coord[1] = map_matches[2];
            coord[0] = map_matches[3];
        }

        document.querySelector("#qwant").classList.add('selected');
    }
    // strava 
    else if(/strava\.com/.test(url)) {
        
        var map_matches = url.match(/heatmap#([\d.]+)\/(-?[\d.]+)\/(-?[\d.]+)/);

        if(map_matches !== null) {
            zoom = map_matches[1];
            coord[0] = map_matches[2];
            coord[1] = map_matches[3];
        }

        document.querySelector("#strava").classList.add('selected');
    }
    // waze
    else if(/waze\.com/.test(url)) {
        document.getElementById("waze").classList.add('selected');
    }
    // mapillary
    else if(/mapillary\.com/.test(url)) {

        var lat_matches = url.match(/lat=(-?[\d.]+)/);
        var lng_matches = url.match(/lng=(-?[\d.]+)/);
        var zoom_matches = url.match(/z=([\d.]+)/);
        if(lat_matches && lng_matches && zoom_matches) {
            zoom = zoom_matches[1];
            coord[1] = lat_matches[1];
            coord[0] = lng_matches[1];
        }
        document.getElementById("mapillary").classList.add('selected');
    }
    // OSM BY
    else if(/openstreetmap\.by/.test(url)) {
        var map_matches = url.match(/#([\d.]+)\/(-?[\d.]+)\/(-?[\d.]+)/);
        if(map_matches !== null) {
            zoom = map_matches[1];
            coord[1] = map_matches[2];
            coord[0] = map_matches[3];
        }

        document.querySelector("#osm_by").classList.add('selected');
    }
    // OSM
    else if (host_clean === 'openstreetmap'){
        var map_matches = url.match(/map=(\d+)\/(-?[\d.]+)\/(-?[\d.]+)/);
        if(map_matches !== null) {
            zoom = map_matches[1];
            coord[1] = map_matches[2];
            coord[0] = map_matches[3];
        }

        if(/openstreetmap\.ru/.test(url)) {
            document.querySelector("#osm_ru").classList.add('selected');

        }
        else {
            document.querySelector("#osm").classList.add('selected');

            var chang_matches = url.match(/changeset\/(\d+)/);
            var achavi_url = 'http://nrenner.github.io/achavi/';
            if(chang_matches !== null) {
                document.getElementById("achavi").href = achavi_url + '?changeset=' + chang_matches[1];
                document.getElementById("achavi").classList.remove("phidden");
                document.getElementById("achavi").classList.add("provider_special");
            }
        }
    }
    // HERE
    else if (host_clean === 'here'){

        var provider_string_0 = url.split( '/?map=' )[1];
        var provider_string = provider_string_0.split(',');

        zoom = provider_string[2];

        coord[1] = provider_string[0];
        coord[0] = provider_string[1];

        if(/satellite/.test(url)){
            // document.getElementById("here").className='selected';
            document.querySelector("#here").classList.add('selected');

        }

    }

    // WIKIMAPIA
    else if (host_clean === 'wikimapia') {

        coord[1] = coordarray[0];
        coord[0] = coordarray[1];

        var zoomwiki = url.match(/z=[0-9]{1,2}/ig);

        zoom = zoomwiki[0].slice(2);

        // document.getElementById("wiki").className = 'selected';
        document.querySelector("#wiki").classList.add('selected');
        /*
        if (url.match(/&m=w/ig)) {
            document.querySelector("#wikimapia_map").classList.add('selected');
        }
        */
    }

    // 2gis
    else if (host_clean === '2gis') {
        document.getElementById("gis2").classList.add('selected');
        // document.querySelector("#2gis").classList.add('selected'); // не работает из-за двойки

        var matches = url.match(/m=(-?[\d.]+)%2C(-?[\d.]+)%2F([\d.]+)/);
        if(matches !== null) {
            zoom = matches[3];
            coord[1] = matches[2];
            coord[0] = matches[1];
        }
    }
    //achavi
    else if (host_clean === 'github') {
        var matches = url.match(/changeset=(\d+)/);
        var osm_url = 'https://www.openstreetmap.org/changeset/';
        if(matches !== null) {
            document.getElementById("achavi").href = osm_url + matches[1];
            //document.getElementById("achavi").className='selected';
            document.getElementById("achavi").classList.remove("phidden");
            document.getElementById("achavi").classList.add("provider_special");
        }
    }

    // chepetsk
    else if (host_clean === 'xn--e1aaps0bc') {
        // document.getElementById("chepetsk").className='selected';
        document.querySelector("#chepetsk").classList.add('selected');
    }

    // sputnik
    else if(/maps\.sputnik\.ru/.test(url)) {
        var lat_matches = url.match(/lat=(-?[\d.]+)/);
        var lng_matches = url.match(/lng=(-?[\d.]+)/);
        var zoom_matches = url.match(/zoom=([\d.]+)/);
        if(lat_matches && lng_matches && zoom_matches) {
            zoom = zoom_matches[1];
            coord[1] = lat_matches[1];
            coord[0] = lng_matches[1];
        }
        document.getElementById("sputnik").classList.add('selected');
    }

    // mapy.cz
    else if(/mapy\.cz/.test(url)) {
        var lat_matches = url.match(/y=(-?[\d.]+)/);
        var lng_matches = url.match(/x=(-?[\d.]+)/);
        var zoom_matches = url.match(/z=([\d.]+)/);
        if(lat_matches && lng_matches && zoom_matches) {
            zoom = zoom_matches[1];
            coord[1] = lat_matches[1];
            coord[0] = lng_matches[1];
        }
        // document.getElementById("mapy").className='selected';
        document.querySelector("#mapy").classList.add('selected');
    }

    // opentopomap
    else if (host_clean === 'opentopomap') {
        var map_matches = url.match(/map=(\d+)\/(-?[\d.]+)\/(-?[\d.]+)/);
        if(map_matches !== null) {
            zoom = map_matches[1];
            coord[1] = map_matches[2];
            coord[0] = map_matches[3];
        }
        document.querySelector("#topo").classList.add('selected');
    }

    // nakarte
    else if (host_clean === 'nakarte') {
        // https://nakarte.me/#m=14/55.84012/30.29068&l=O/K
        var map_matches = url.match(/#m=(\d+)\/(-?[\d.]+)\/(-?[\d.]+)/);
        if(map_matches !== null) {
            zoom = map_matches[1];
            coord[1] = map_matches[2];
            coord[0] = map_matches[3];
        }
        document.querySelector("#nakarte").classList.add('selected');
    }

    else if(/rosreestr\.ru/.test(url)) {
        // pkk5.rosreestr.ru/#x=3147486.520932528&y=7927544.820504406&z=18
        var x_matches = url.match(/x=(-?[\d.]+)/);
        var y_matches = url.match(/y=(-?[\d.]+)/);
        var zoom_matches = url.match(/z=([\d.]+)/);
        if(x_matches && y_matches && zoom_matches) {
            coord = meters2degress(x_matches[1], y_matches[1]);
            zoom = zoom_matches[1];
        }
    }

    // navitel
    else if(/maps\.navitel\.su/.test(url)) {
        document.querySelector("#navitel").classList.add('selected');
    }
    else if(/loc\.alize\.us/.test(url)) {
        document.querySelector("#flickr").classList.add('selected');
        var map_matches = url.match(/geo:(-?[\d.]+),(-?[\d.]+),(\d+)/);
        if(map_matches !== null) {
            zoom = map_matches[3];
            coord[1] = map_matches[1];
            coord[0] = map_matches[2];
        }
    }
    if(coord && coord.length == 2){
        console.log('FOUND, write coordinates to localStorage');
        localStorage.setItem('lat', coord[1]);
        localStorage.setItem('lon', coord[0]);
        localStorage.setItem('zoom', zoom);
    } else {
        console.log('coordinates not found, get from localStorage');
        console.log(localStorage.getItem('lat'));
        coord[1] = localStorage.getItem('lat');
        coord[0] = localStorage.getItem('lon');
        zoom = localStorage.getItem('zoom');
    }
    console.log(coord);
    
    set_coordinates(coord, zoom);
    //chrome.tabs.create({url: '}, function(){});
});

function onWindowLoad() {

    // i18n
    var lang = chrome.i18n.getUILanguage();
    
    if(lang != 'ru'){
        document.querySelectorAll('.locale_ru input').forEach(function (el) {
            el.parentNode.classList.add('phidden');
            el.checked = false;
        });
    }

    document.querySelectorAll('[data-msg]').forEach(function (lang_el) {
        var attr_val = lang_el.getAttribute('data-msg');
        var message = chrome.i18n.getMessage(attr_val);
        if(message) {
            lang_el.innerText = message;
        }
    });
    document.querySelectorAll('[title]').forEach(function (lang_el) {
        var attr_val = lang_el.getAttribute('title');
        var message = chrome.i18n.getMessage(attr_val);
        if(message) {
            lang_el.setAttribute('title', message);
        }
    });

    // copy title
    document.getElementById("coord_copy").onclick = function() {

        document.querySelector('#coord_input').select();
        try {
            let successful = document.execCommand('copy');
        } catch(e) {}
        document.querySelector('#coord_input').blur();
        return false;
    };

    var setting_checkbox_handler = function (chbx) {
        var chbx_parent = chbx.parentElement;
        var chbx_key = chbx_parent.id;
        if(chbx.checked) {
            chbx_parent.classList.remove("phidden");
            localStorage.setItem(chbx_key, true);
        }
        else {

            // при удалении слоев сбрасываем информацию из режима сравнения
            chbx_parent.classList.add("phidden");
            chbx_parent.classList.remove("compare_item");
            document.querySelector('#body').classList.remove('compare_1');
            document.querySelector('#body').classList.remove('compare_2');
            document.querySelector('#body').classList.remove('compare_3');
            localStorage.setItem(chbx_key, false);
        }
    };

    var chbx_all = document.querySelectorAll('.providers input');
    chbx_all.forEach(function (chbx) {
        var chbx_parent = chbx.parentElement;
        var chbx_key = chbx_parent.id;
        var show_val = localStorage.getItem(chbx_key);
        if(show_val === 'true') {
            chbx_parent.classList.remove("phidden");
            chbx.checked = true;
        }
        else if(show_val === 'false') {
            // provider is special for this page, so show it anyway
            if(!chbx_parent.classList.contains('provider_special')) {
                chbx_parent.classList.add("phidden");
            }
            chbx.checked = false;
        }

        chbx.addEventListener('click', function(event) {
            setting_checkbox_handler(chbx);
        });
    });

    var check_section_labels = function () {
        var section_labels = document.querySelectorAll('.section_label');
        section_labels.forEach(function (section_label) {
            var section_shown = false;
            var providersEl = section_label.nextElementSibling;
            var is_compare_mode = document.getElementById('body').classList.contains('compare_mode');
            providersEl.childNodes.forEach(function (providerLink) {
                if(providerLink.tagName !== 'A') {
                    return;
                }
                if(!providerLink.classList.contains('phidden')
                        && (!is_compare_mode || !providerLink.classList.contains('no_comp'))) {
                    section_shown = true;
                }

                providerLink.onclick = function (event) {
                    if(document.getElementById('body').classList.contains('compare_mode')) {

                        var preview = document.querySelector('.preview_' + providerLink.id);

                        // remove from compare
                        if(providerLink.classList.contains('compare_item')) {
                            providerLink.classList.remove('compare_item');
                            if(preview) {
                                preview.classList.remove('preview_active');
                            }
                            // document.querySelector('#body').classList.remove('compare_3');

                            if(document.querySelectorAll('.compare_item').length){
                                document.querySelector('#body').classList.remove('compare_1');
                                document.querySelector('#body').classList.remove('compare_2');
                                document.querySelector('#body').classList.remove('compare_3');
                                document.querySelector('#body').classList.add('compare_'+document.querySelectorAll('.compare_item').length);
                            } else {
                                document.querySelector('#body').classList.remove('compare_1');
                            }
                        }

                        // add to compare
                        else if(document.querySelectorAll('.compare_item').length < 3) {
                            providerLink.classList.add('compare_item');

                            if(preview) {
                                preview.classList.add('preview_active');
                            }

                            if(document.querySelectorAll('.compare_item').length === 3){
                                // document.querySelector('#body').classList.add('compare_3');
                            }
                            if(document.querySelectorAll('.compare_item').length){
                                document.querySelector('#body').classList.remove('compare_1');
                                document.querySelector('#body').classList.remove('compare_2');
                                document.querySelector('#body').classList.add('compare_'+document.querySelectorAll('.compare_item').length);
                            }
                        }
                        return false;
                    }

                    if(document.getElementById('body').classList.contains('edit_mode') && event.target.tagName !== 'INPUT') {
                        var chbx = providerLink.firstElementChild;
                        chbx.checked = !chbx.checked;
                        setting_checkbox_handler(chbx);
                        return false;
                    }

                    if(providerLink.id === 'josm') {
                        return false;
                    }
                };
            });
            if(section_shown) {
                section_label.classList.remove('section_hidden');
            }
            else {
                section_label.classList.add('section_hidden');
            }
        });
    };
    check_section_labels();


    // Compare cancel
    document.getElementById("compare_cancel_js").addEventListener("click", function(){
        document.getElementById("body").classList.remove("compare_mode");
    });

    // Compare mode
    document.getElementById("compare_start_js").addEventListener("click", function(){
        document.getElementById("body").classList.toggle("compare_mode");
        document.getElementById("body").classList.remove("edit_mode");

        // document.querySelector("#edit").classList.remove('menu_active');
        // this.classList.toggle("menu_active");
        check_section_labels();
    });

    // Edit settings
    document.querySelector('#edit').addEventListener('click', function(event) {
        document.getElementById("body").classList.toggle("edit_mode");
        document.getElementById("body").classList.remove("compare_mode");
        check_section_labels();
    });

    // Save settings
    document.querySelector('#settings_save_js').addEventListener('click', function(event) {
        document.getElementById("body").classList.remove("edit_mode");
        check_section_labels();
    });



    chrome.tabs.executeScript(null, {
        file: "content_script.js"
    }, function() {
        // If you try and inject into an extensions page or the webstore/NTP you'll get an error
        /*
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError.message);
        }
        */
    });

}

window.onload = onWindowLoad;

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-122809-34']);
_gaq.push(['_trackPageview']);

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();


function trackButton(e) {
    _gaq.push(['_trackEvent', e.target.id, 'clicked']);
};

var buttons = document.querySelectorAll('.providers a, #coord_copy, #coord_input, .link_with_icon, #settings_save_js');
for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', trackButton);
}