chrome.tabs.query({
    'active': true,
    'lastFocusedWindow': true
}, function (tabs) {

    var url = tabs[0].url;
    var url_parts = url.split( '/' );
    var host = url_parts[2];
    var host_parts = host.split( '.' );
    var host_clean = host_parts[host_parts.length-2];

    var coord = new Array();
    var zoom;

    var coordarray = url.match(/-?[0-9]{0,3}\.[0-9]{6}/ig); //универсальная функция для поиска координат

    console.log(coordarray);

    //YANDEX

    if(/(yandex.*maps)/.test(url)){   //ищем яндекс И мапс применяя метод test

        coord[1] = coordarray[1]; // не переварачиваем координаты. у яндекса широта-долгота наооборот будь он неладен...
        coord[0] = coordarray[0];

        var zoomya = url.match(/z=[0-9]{1,2}/ig);  //ищем z=XX

        zoom = zoomya[0].slice(2); //  убираем z=
        console.log(zoom);
        // GOOGLE
    }
    if(/(google.*maps)/.test(url)) {   //ищем гугл И мапс применяя метод test

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
       }

        // BING


    } else if(/bing.*maps||mapspreview/.test(url)) {

        var link = document.getElementById("MapControl_MapControl");

        // BESTMAPS
    } else if (host_clean == 'bestmaps'){

        var provider_string_0 = url.split( '.ru/map/' )[1]; // разбиваем урл на две части подстрокой '.ru/map/'
        var provider_string = provider_string_0.split('/'); // разбиваем правую часть урла слешом

        var length = provider_string.length;
        var param = '';

        zoom = provider_string[2];

        coord[1] = provider_string[3];
        coord[0] = provider_string[4];


        // OSM
    } else if (host_clean == 'openstreetmap'){

        var provider_string_0 = url.split( '#' )[1];
        var provider_string_00 = provider_string_0.split('=')[1];
        var provider_string = provider_string_00.split('/');

        zoom = provider_string[0];

        coord[1] = provider_string[1];
        coord[0] = provider_string[2];

        document.getElementById("osm").className='hidden';


    } // HERE

    else if (host_clean == 'here'){

        var provider_string_0 = url.split( '/?map=' )[1];
        var provider_string = provider_string_0.split(',');

        zoom = provider_string[2];

        coord[1] = provider_string[0];
        coord[0] = provider_string[1];

        if(provider_string[5] == 'normal.day'){
            document.getElementById("here_map").className='hidden';
        } else {
            document.getElementById("here").className='hidden';
        }


        // WIKIMAPIA

    } else if (host_clean == 'wikimapia') {

        coord[1] = coordarray[0];
        coord[0] = coordarray[1];

        var zoomwiki = url.match(/z=[0-9]{1,2}/ig);

        zoom = zoomwiki[0].slice(2);

        if (url.match(/&m=w/ig)) {
            document.getElementById("wikimapia_map").className = 'hidden';
        } else {
            document.getElementById("wikimapia").className = 'hidden';

    }
    }

    if(zoom && coord && coord.length == 2){  // переменные не заменят элементы пока не заполнятся все 3 пораметра
        // original

        document.getElementById("yandex").href='http://maps.yandex.ru/?ll='+coord[0]+'%2C'+coord[1]+'&z='+zoom+'&l=sat%2Cskl';
        document.getElementById("yandex_map").href='http://maps.yandex.ru/?ll='+coord[0]+'%2C'+coord[1]+'&z='+zoom+'&l=map';

        document.getElementById("google").href='https://google.com/maps/?ll='+coord[1]+','+coord[0]+'&spn=2.414984,2.568054&t=h&z='+zoom;
        document.getElementById("google_map").href='https://google.com/maps/?ll='+coord[1]+','+coord[0]+'&spn=2.414984,2.568054&t=m&z='+zoom;

        document.getElementById("wikimapia").href='http://wikimapia.org/#lang=ru&lat='+coord[1]+'&lon='+coord[0]+'&z='+zoom+'&m=b';
        document.getElementById("wikimapia_map").href='http://wikimapia.org/#lang=ru&lat='+coord[1]+'&lon='+coord[0]+'&z='+zoom+'&m=m';

        document.getElementById("here").href='http://here.com/'+coord[1]+','+coord[0]+','+zoom+',satellite';
        document.getElementById("here_map").href='http://here.com/'+coord[1]+','+coord[0]+','+zoom+',normal';

        document.getElementById("bing").href='http://www.bing.com/maps/?v=2&cp='+coord[1]+'~'+coord[0]+'&lvl='+zoom+'&sty=h';
        document.getElementById("bing_map").href='http://www.bing.com/maps/?v=2&cp='+coord[1]+'~'+coord[0]+'&lvl='+zoom+'&sty=r';

        document.getElementById("osm").href='http://www.openstreetmap.org/#map='+zoom+'/'+coord[1]+'/'+coord[0];
        document.getElementById("topo").href='http://maps.vlasenko.net/?lon='+coord[0]+'&lat='+coord[1];
        //document.getElementById("mail").href='http://maps.mail.ru/?z='+zoom+'&ll='+coord[0]+','+coord[1];

        // bestmaps

        document.getElementById("bestmaps_y").href='http://bestmaps.ru/map/yandex/hybrid/'+zoom+'/' + coord[1]+'/'+coord[0]+'/';
        document.getElementById("bestmaps_y_map").href='http://bestmaps.ru/map/yandex/map/'+zoom+'/' + coord[1]+'/'+coord[0]+'/';

        document.getElementById("bestmaps_g").href='http://bestmaps.ru/map/google/hybrid/'+zoom+'/' + coord[1]+'/'+coord[0]+'/';
        document.getElementById("bestmaps_g_map").href='http://bestmaps.ru/map/google/map/'+zoom+'/' + coord[1]+'/'+coord[0]+'/';

        document.getElementById("bestmaps_bing").href='http://bestmaps.ru/map/bing/aerial/'+zoom+'/' + coord[1]+'/'+coord[0]+'/';
        document.getElementById("bestmaps_here").href='http://bestmaps.ru/map/here/hybrid/'+zoom+'/' + coord[1]+'/'+coord[0]+'/';

        document.getElementById("bestmaps_osm").href='http://bestmaps.ru/map/osm/Mapnik/'+zoom+'/' + coord[1]+'/'+coord[0]+'/';
        document.getElementById("bestmaps_2gis").href='http://bestmaps.ru/map/2gis/map/'+zoom+'/' + coord[1]+'/'+coord[0]+'/';

        // coord
        document.getElementById("lat").innerText = coord[1];
        document.getElementById("lon").innerText = coord[0];

        // GE
        document.getElementById("earth_kml").href='http://bestmaps.ru/kml_generate/?lat='+coord[1]+'&lon='+coord[0];
    } else {

        //console.error('Coord not found');
    }
    //chrome.tabs.create({url: '}, function(){});
});

function onWindowLoad() {

    console.log('popup.js  onWindowLoad()');

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


/* 
 // Run when document's DOM is ready.
 document.addEventListener('DOMContentLoaded', function () {
 });
 */