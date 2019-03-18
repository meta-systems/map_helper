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
        // document.getElementById("here_map").href='https://wego.here.com/'+coord[1]+','+coord[0]+','+zoom+',normal';

        document.getElementById("bing").href='http://www.bing.com/maps/?v=2&cp='+coord[1]+'~'+coord[0]+'&lvl='+zoom+'&sty=h';
        // document.getElementById("bing_map").href='http://www.bing.com/maps/?v=2&cp='+coord[1]+'~'+coord[0]+'&lvl='+zoom+'&sty=r';

        document.getElementById("2gis").href='https://beta.2gis.ru/?m='+coord[0]+'%2C'+coord[1]+'%2F'+zoom;

        document.getElementById("osm").href='http://www.openstreetmap.org/#map='+zoom+'/'+coord[1]+'/'+coord[0];
        document.getElementById("josm").href='http://127.0.0.1:8111/load_and_zoom?left=-115.4347819&right=-115.42748&bottom=35.549581590&top=35.5529160';
        //document.getElementById("topo").href='http://maps.vlasenko.net/?lon='+coord[0]+'&lat='+coord[1];
        document.getElementById("topo").href='http://loadmap.net/ru?qq='+coord[1]+'%20'+coord[0]+'&z='+(zoom>15?15:zoom)+'&s=-1&c=41&g=1';
        //document.getElementById("mail").href='http://maps.mail.ru/?z='+zoom+'&ll='+coord[0]+','+coord[1];

        // bestmaps
        document.getElementById("esri").href='http://bestmaps.ru/map/osm/WorldImagery/'+zoom+'/' + coord[1]+'/'+coord[0]+'/';

        // document.getElementById("bestmaps_y").href='http://bestmaps.ru/map/yandex/hybrid/'+zoom+'/' + coord[1]+'/'+coord[0]+'/';
        // document.getElementById("bestmaps_y_map").href='http://bestmaps.ru/map/yandex/map/'+zoom+'/' + coord[1]+'/'+coord[0]+'/';

        //document.getElementById("bestmaps_g").href='http://bestmaps.ru/map/google/hybrid/'+zoom+'/' + coord[1]+'/'+coord[0]+'/';
        //document.getElementById("bestmaps_g_map").href='http://bestmaps.ru/map/google/map/'+zoom+'/' + coord[1]+'/'+coord[0]+'/';

        // document.getElementById("bestmaps_bing").href='http://bestmaps.ru/map/bing/aerial/'+zoom+'/' + coord[1]+'/'+coord[0]+'/';
        // document.getElementById("bestmaps_here").href='http://bestmaps.ru/map/here/hybrid/'+zoom+'/' + coord[1]+'/'+coord[0]+'/';

        // document.getElementById("bestmaps_osm").href='http://bestmaps.ru/map/osm/Mapnik/'+zoom+'/' + coord[1]+'/'+coord[0]+'/';
        // document.getElementById("bestmaps_2gis").href='http://bestmaps.ru/map/2gis/map/'+zoom+'/' + coord[1]+'/'+coord[0]+'/';

        // coord
        document.getElementById("lat").innerText = coord[1];
        document.getElementById("lon").innerText = coord[0];

        // GE
        // FIXME: link for a new Bestmaps version will be changed
        document.getElementById("earth_kml").href='http://bestmaps.ru/test/kml_generate/index.php?lat='+coord[1]+'&lon='+coord[0];

        document.getElementsByClassName("coordLine")[0].classList.remove("hidden");
    }
    else {
        document.getElementsByClassName("coordLine")[0].classList.add("hidden");
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
            //'mapbox': '',
            'yandex_map': 'yandex/map',
            '2gis': '2gis/map',
            'osm': 'osm/map'
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
    if(request.coords.lat && request.coords.lon && (is_bing || is_loadmap)) {
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
    }
    // OSM
    else if (host_clean === 'openstreetmap'){

        var provider_string_0 = url.split( '#' )[1];
        var provider_string_00 = provider_string_0.split('=')[1];
        var provider_string = provider_string_00.split('/');

        zoom = provider_string[0];

        coord[1] = provider_string[1];
        coord[0] = provider_string[2];

        document.getElementById("osm").className='selected';

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
        } else {
            document.getElementById("here_map").className='selected';
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
        document.getElementById("topo").className = 'selected';
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

    set_coordinates(coord, zoom);
    //chrome.tabs.create({url: '}, function(){});
});

function onWindowLoad() {

    //console.log('popup.js  onWindowLoad()');

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
            chbx_parent.classList.add("provider_hidden");
            chbx.checked = false;
        }

        chbx.addEventListener('click', function(event) {
            if(chbx.checked) {
                chbx_parent.classList.remove("provider_hidden");
                localStorage.setItem(chbx_key, true);
            }
            else {
                chbx_parent.classList.add("provider_hidden");
                localStorage.setItem(chbx_key, false);
            }
        });
    });

    var check_section_labels = function () {
        var section_labels = document.querySelectorAll('.section_label');
        section_labels.forEach(function (section_label) {
            var section_shown = false;
            var providersEl = section_label.nextElementSibling;
            providersEl.childNodes.forEach(function (providerLink) {
                if(providerLink.tagName !== 'A') {
                    return;
                }
                if(!providerLink.classList.contains('provider_hidden')) {
                    section_shown = true;
                }

                providerLink.onclick = function () {
                    if(document.getElementById('body').classList.contains('compare_mode')) {

                        providerLink.classList.toggle('compare_item');
                        
                        // document.querySelector('.preview_' + providerLink.id).classList.add('preview_active');
                        
                        console.log('.preview_' + providerLink.getAttribute('id'));
                        console.log('.preview_' + providerLink.id);

                        if(providerLink.classList.contains('compare_item')) {
                            providerLink.classList.remove('compare_item');
                        }
                        else if(document.querySelectorAll('.compare_item').length < 3) {
                            providerLink.classList.add('compare_item');
                        }
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

    // Edit settings
    document.querySelector('#edit').addEventListener('click', function(event) {
        document.getElementById("body").classList.toggle("edit_mode");
        check_section_labels();
    });

    // Save settings
    document.querySelector('#settings_save_js').addEventListener('click', function(event) {
        document.getElementById("body").classList.remove("edit_mode");
        check_section_labels();
    });

    // Compare mode
    document.getElementById("compare_start_js").addEventListener("click", function(){
        this.classList.toggle("compare_btn_started");
        document.getElementById("body").classList.toggle("compare_mode");
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
