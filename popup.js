var set_coordinates = function (coord, zoom) {
    if(zoom && coord && coord.length == 2){  // переменные не заменят элементы пока не заполнятся все 3 пораметра
        // original

        document.getElementById("yandex").href='http://maps.yandex.ru/?ll='+coord[0]+'%2C'+coord[1]+'&z='+zoom+'&l=sat%2Cskl';
        document.getElementById("yandex_map").href='http://maps.yandex.ru/?ll='+coord[0]+'%2C'+coord[1]+'&z='+zoom+'&l=map';

        document.getElementById("google").href='https://google.com/maps/?ll='+coord[1]+','+coord[0]+'&spn=2.414984,2.568054&t=h&z='+zoom;
        document.getElementById("google_map").href='https://google.com/maps/?ll='+coord[1]+','+coord[0]+'&spn=2.414984,2.568054&t=m&z='+zoom;

        document.getElementById("wiki").href='http://wikimapia.org/#lang=ru&lat='+coord[1]+'&lon='+coord[0]+'&z='+zoom+'&m=ys';
        // document.getElementById("wikimapia_map").href='http://wikimapia.org/#lang=ru&lat='+coord[1]+'&lon='+coord[0]+'&z='+zoom+'&m=m';

        document.getElementById("here").href='https://wego.here.com/'+coord[1]+','+coord[0]+','+zoom+',satellite';

        document.getElementById("bing").href='http://www.bing.com/maps/?v=2&cp='+coord[1]+'~'+coord[0]+'&lvl='+zoom+'&sty=h';

        document.getElementById("2gis").href='https://beta.2gis.ru/?m='+coord[0]+'%2C'+coord[1]+'%2F'+zoom;

        document.getElementById("osm").href='http://www.openstreetmap.org/#map='+zoom+'/'+coord[1]+'/'+coord[0];
        document.getElementById("josm").href='http://127.0.0.1:8111/load_and_zoom?left=-115.4347819&right=-115.42748&bottom=35.549581590&top=35.5529160';
        //document.getElementById("topo").href='http://maps.vlasenko.net/?lon='+coord[0]+'&lat='+coord[1];
        document.getElementById("loadmap").href='http://loadmap.net/ru?qq='+coord[1]+'%20'+coord[0]+'&z='+(zoom>15?15:zoom)+'&s=-1&c=41&g=1';

        document.getElementById("chepetsk").href='http://xn--e1aaps0bc.net/?zoom='+zoom+'&lat='+coord[1]+'&lon='+coord[0];
        document.getElementById("sputnik").href='http://maps.sputnik.ru/?lat='+coord[1]+'&lng='+coord[0]+'&zoom='+zoom;
        document.getElementById("topo").href='https://opentopomap.org/#map='+zoom+'/'+coord[1]+'/'+coord[0];
        document.getElementById("osm_by").href='http://openstreetmap.by/#'+zoom+'/'+coord[1]+'/'+coord[0];
        document.getElementById("mapy").href='https://mapy.cz/?x='+coord[0]+'&y='+coord[1]+'&z='+zoom;
        document.getElementById("osm_ru").href='http://openstreetmap.ru/#map='+zoom+'/'+coord[1]+'/'+coord[0];
        document.getElementById("navitel").href='http://maps.navitel.su/api/map.html?zoom='+zoom+'&lat='+coord[1]+'&lon='+coord[0];
        document.getElementById("flickr").href='https://loc.alize.us/#/geo:'+coord[1]+','+coord[0]+','+zoom+',/';

        // bestmaps
        document.getElementById("esri").href='http://bestmaps.ru/map/osm/WorldImagery/'+zoom+'/' + coord[1]+'/'+coord[0]+'/';
        document.getElementById("bestmaps").href='http://bestmaps.ru/map/osm/map/'+zoom+'/' + coord[1]+'/'+coord[0]+'/';

        // coord
        // document.getElementById("lat").innerText = coord[1];
        // document.getElementById("lon").innerText = coord[0];

        document.getElementById("coord_input").value  = coord[1] + ', ' + coord[0];

        // GE
        // FIXME: link for a new Bestmaps version will be changed
        document.getElementById("earth_kml").href='http://bestmaps.ru/test/kml_generate/index.php?lat='+coord[1]+'&lon='+coord[0];

        document.getElementsByClassName("coordLine")[0].classList.remove("hidden");
        document.getElementById('compare_start_js').classList.remove("hidden");
    }
    else {
        document.getElementsByClassName("coordLine")[0].classList.add("hidden");
        document.getElementById('compare_link_js').classList.add("hidden");
        return;
    }

    // Compare link
    document.getElementById("compare_link_js").addEventListener("click", function(){
        var bm_aliases = {
            'yandex': 'yandex/hybrid',
            'here': 'here/sat',
            'wiki': 'osm/Wikimapia',
            'bing': 'bing/satellite',
            'esri': 'osm/WorldImagery',
            'mapbox': 'osm/map',
            'yandex_map': 'yandex/map',
            '2gis': '2gis/map',
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
    });
};

var url;

//listen for call from content_script(browser scope)
chrome.runtime.onMessage.addListener(function(request, sender) {

    var is_bing = /bing.*maps/.test(url);
    var is_loadmap = /loadmap\.net/.test(url);
    var is_chepetsk = /xn--e1aaps0bc\.net/.test(url);
    var is_navitel = /maps\.navitel\.su/.test(url);
    if(request.coords.lat && request.coords.lon && (is_bing || is_loadmap || is_chepetsk || is_navitel)) {
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
            document.getElementById("yandex").className='selected';
        }
        else {
            document.getElementById("yandex_map").className='selected';
        }

    }
    // GOOGLE
    else if(/(google.*maps)/.test(url)) {   //ищем гугл И мапс применяя метод test

        coord[1] = coordarray[0];
        coord[0] = coordarray[1];

        if (zoommpercent = url.match(/[0-9]{0,2}\.[0-9]{2}z/ig)){ //если зум в процентах-это карта -- ищем 123456m

            zoom = zoommpercent[0].slice(0, -4);

        }

       if (zoommeters = url.match(/([0-9]{2,8}m)/ig)){  //если зум в метрах-это спутинк -- ищем 123456m

            var meters = zoommeters[0].slice(0, -1); //режем м

            zoom = getzoom(meters);// функция для преобразования M -> Zoom (ну убирай в подвал)

            function getzoom(meters) {
                if (meters < 533) {
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
            }

           document.getElementById("google").className='selected';
       }
       else {
           document.getElementById("google_map").className='selected';
       }
    }
    // BING
    else if(/bing.*maps/.test(url)) { // /bing.*maps||mapspreview/

        document.getElementById("bing").className='selected';
    }
    // BESTMAPS
    else if (host_clean === 'bestmaps'){

        var matches = url.match(/\/(\d+)\/([\d.]+)\/([\d.]+)/);
        if(matches !== null) {
            zoom = matches[1];
            coord[1] = matches[2];
            coord[0] = matches[3];
        }

        if(/map\/osm\/WorldImagery/.test(url)) {
            document.getElementById("esri").className='selected';
        }
        else if(/map/.test(url)) {
            document.getElementById("bestmaps").className='selected';
        }
    }
    else if(/openstreetmap\.by/.test(url)) {
        var map_matches = url.match(/#([\d.]+)\/([\d.]+)\/([\d.]+)/);
        if(map_matches !== null) {
            zoom = map_matches[1];
            coord[1] = map_matches[2];
            coord[0] = map_matches[3];
        }

        document.getElementById("osm_by").className='selected';
    }
    // OSM
    else if (host_clean === 'openstreetmap'){

        var map_matches = url.match(/map=(\d+)\/([\d.]+)\/([\d.]+)/);
        if(map_matches !== null) {
            zoom = map_matches[1];
            coord[1] = map_matches[2];
            coord[0] = map_matches[3];
        }

        if(/openstreetmap\.ru/.test(url)) {
            document.getElementById("osm_ru").className = 'selected';
        }
        else {
            document.getElementById("osm").className = 'selected';

            var chang_matches = url.match(/changeset\/(\d+)/);
            var achavi_url = 'http://nrenner.github.io/achavi/';
            if(chang_matches !== null) {
                document.getElementById("achavi").href = achavi_url + '?changeset=' + chang_matches[1];
                document.getElementById("achavi").classList.remove("provider_hidden");
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
            document.getElementById("here").className='selected';
        }

    }
    // WIKIMAPIA
    else if (host_clean === 'wikimapia') {

        coord[1] = coordarray[0];
        coord[0] = coordarray[1];

        var zoomwiki = url.match(/z=[0-9]{1,2}/ig);

        zoom = zoomwiki[0].slice(2);

        document.getElementById("wiki").className = 'selected';
        /*
        if (url.match(/&m=w/ig)) {
            document.getElementById("wikimapia_map").className = 'selected';
        }
        */
    }
    //Loadmap
    else if (host_clean === 'loadmap') {
        document.getElementById("loadmap").className = 'selected';
    }
    //2gis
    else if (host_clean === '2gis') {
        document.getElementById("2gis").className = 'selected';

        var matches = url.match(/m=([\d.]+)%2C([\d.]+)%2F([\d.]+)/);
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
            document.getElementById("achavi").classList.remove("provider_hidden");
            document.getElementById("achavi").classList.add("provider_special");
        }
    }
    //chepetsk
    else if (host_clean === 'xn--e1aaps0bc') {
        document.getElementById("chepetsk").className='selected';
    }
    else if(/maps\.sputnik\.ru/.test(url)) {
        var lat_matches = url.match(/lat=([\d.]+)/);
        var lng_matches = url.match(/lng=([\d.]+)/);
        var zoom_matches = url.match(/zoom=([\d.]+)/);
        if(lat_matches && lng_matches && zoom_matches) {
            zoom = zoom_matches[1];
            coord[1] = lat_matches[1];
            coord[0] = lng_matches[1];
        }
        document.getElementById("sputnik").className='selected';
    }
    else if(/mapy\.cz/.test(url)) {
        var lat_matches = url.match(/y=([\d.]+)/);
        var lng_matches = url.match(/x=([\d.]+)/);
        var zoom_matches = url.match(/z=([\d.]+)/);
        if(lat_matches && lng_matches && zoom_matches) {
            zoom = zoom_matches[1];
            coord[1] = lat_matches[1];
            coord[0] = lng_matches[1];
        }
        document.getElementById("mapy").className='selected';
    }
    else if (host_clean === 'opentopomap') {
        var map_matches = url.match(/map=(\d+)\/([\d.]+)\/([\d.]+)/);
        if(map_matches !== null) {
            zoom = map_matches[1];
            coord[1] = map_matches[2];
            coord[0] = map_matches[3];
        }
        document.getElementById("topo").className='selected';
    }
    else if(/maps\.navitel\.su/.test(url)) {
        document.getElementById("navitel").className='selected';
    }
    else if(/loc\.alize\.us/.test(url)) {
        document.getElementById("flickr").className='selected';
        var map_matches = url.match(/geo:([\d.]+),([\d.]+),(\d+)/);
        if(map_matches !== null) {
            zoom = map_matches[3];
            coord[1] = map_matches[1];
            coord[0] = map_matches[2];
        }
    }

    set_coordinates(coord, zoom);
    //chrome.tabs.create({url: '}, function(){});
});

function onWindowLoad() {

    var lang = chrome.i18n.getUILanguage();
    document.querySelectorAll('[data-message]').forEach(function (lang_el) {
        var attr_val = lang_el.getAttribute('data-message');
        var message = chrome.i18n.getMessage(attr_val);
        if(message) {
            lang_el.innerText = message;
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
            chbx_parent.classList.remove("provider_hidden");
            localStorage.setItem(chbx_key, true);
        }
        else {

            // при удалении слоев сбрасываем информацию из режима сравнения
            chbx_parent.classList.add("provider_hidden");
            chbx_parent.classList.remove("compare_item");
            document.querySelector('#body').classList.remove('compare_1');
            document.querySelector('#body').classList.remove('compare_2');
            document.querySelector('#body').classList.remove('compare_3');
            localStorage.setItem(chbx_key, false);
        }
    };

    var chbx_all = document.querySelectorAll('.chbx');
    chbx_all.forEach(function (chbx) {
        var chbx_parent = chbx.parentElement;
        var chbx_key = chbx_parent.id;
        var show_val = localStorage.getItem(chbx_key);
        if(show_val === 'true') {
            chbx_parent.classList.remove("provider_hidden");
            chbx.checked = true;
        }
        else if(show_val === 'false') {
            // provider is special for this page, so show it anyway
            if(!chbx_parent.classList.contains('provider_special')) {
                chbx_parent.classList.add("provider_hidden");
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
                if(!providerLink.classList.contains('provider_hidden')
                        && (!is_compare_mode || !providerLink.classList.contains('compare_disabled'))) {
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


    // Compare mode
    document.getElementById("compare_start_js").addEventListener("click", function(){
        document.getElementById("body").classList.toggle("compare_mode");
        document.getElementById("body").classList.remove("edit_mode");

        document.querySelector("#edit").classList.remove('menu_active');
        this.classList.toggle("menu_active");
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
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError.message);
        }
    });

}

window.onload = onWindowLoad;
