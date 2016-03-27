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

    if(host_clean == 'yandex' && host_parts[host_parts.length-3] == 'maps'){

        var provider_string_0 = url.split( '?' )[1];
        var provider_string = provider_string_0.split('&');

        var length = provider_string.length;
        var param = '';

        for (var i = 0; i < length; i++) {

            param = provider_string[i].split('=')[0];

            // map type
            if(param == 'z'){
                zoom = provider_string[i].split('=')[1];
            }

            if(param == 'l'){
                var mt = provider_string[i].split('=')[1].split('%2C')[0];
            }

            // coord
            if(param == 'll'){
                coord = provider_string[i].split('=')[1].split('%2C'); // массив
            }

        }

        if(mt == 'sat'){
            document.getElementById("yandex").className='hidden';
        } else {
            document.getElementById("yandex_map").className='hidden';
        }


        // GOOGLE
    } else if (host_clean == 'google' && url_parts[3] == 'maps'){

        if(url_parts.length >= 5 && url_parts[4]){
            var url_coord_data = url_parts[4].split(',');
            if(url_coord_data && url_coord_data.length >= 3){
                coord[0] = url_coord_data[1];
                coord[1] = url_coord_data[0].substr(1); // удаляем собаку в первом сегменте @
                var zoom_type = url_coord_data[2].slice(-1);
                switch (zoom_type){
                    case 'z':
                        zoom = parseInt( url_coord_data[2].slice(0, -1) ); // slice 0, -1 отрезает самый последний символ строки
                        break;

                    case 'm':
                        var meters = url_coord_data[2].slice(0, -1);
                        zoom = getCoordinatesFromMeters(meters);
                        break;

                    default:
                        throw new SyntaxError("Zoom type not found");
                }
            }
        }
        document.getElementById("google").className='hidden';

        // BING
    } else if(host_clean == 'bing' && url_parts[3] == 'maps'){
        var provider_string_0 = url.split( '?' )[1];
        var provider_string = provider_string_0.split('&');

        var length = provider_string.length;
        var param = '';

        for (var i = 0; i < length; i++) {
            param = provider_string[i].split('=')[0];
            // zoom
            if(param == 'lvl'){
                zoom = provider_string[i].split('=')[1];
            }
            // map type
            if(param == 'sty'){
                var mt = provider_string[i].split('=')[1].split('%2C')[0];
            }
            // coord
            if(param == 'cp'){
                coord = provider_string[i].split('=')[1].split('~'); // массив
            }
        }

        if(mt == 'h'){
            document.getElementById("bing").className='hidden';
        } else {
            document.getElementById("bing_map").className='hidden';
        }

        // BESTMAPS
    } else if (host_clean == 'bestmaps'){

        var provider_string_0 = url.split( '#' )[1];
        var provider_string = provider_string_0.split('&');

        var length = provider_string.length;
        var param = '';

        for (var i = 0; i < length; i++) {

            param = provider_string[i].split('=')[0];

            // zoom
            if(param == 'z'){
                zoom = provider_string[i].split('=')[1];
            }

            // map type
            if(param == 't'){
                var mt = provider_string[i].split('=')[1].split('%2C')[0];
            }

            // lat
            if(param == 'lat'){ var lat = provider_string[i].split('=')[1]; }

            // lon
            if(param == 'lon'){ var lon = provider_string[i].split('=')[1]; }
        }

        coord[1] = lat;
        coord[0] = lon;

        if(mt == 'hybrid'){
            // document.getElementById("bestmaps").className='hidden';
        }

        // OSM
    } else if (host_clean == 'openstreetmap'){

        var provider_string_0 = url.split( '#' )[1];
        var provider_string_00 = provider_string_0.split('=')[1];
        var provider_string = provider_string_00.split('/');

        zoom = provider_string[0];

        coord[1] = provider_string[1];
        coord[0] = provider_string[2];

        document.getElementById("osm").className='hidden';


        // HERE
    } else if (host_clean == 'here'){

        var provider_string_0 = url.split( '/' )[3];
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
    } else if (host_clean == 'wikimapia'){

        var provider_string_0 = url.split( '#' )[1];
        var provider_string = provider_string_0.split('&');

        var length = provider_string.length;
        var param = '';

        for (var i = 0; i < length; i++) {

            param = provider_string[i].split('=')[0];

            // zoom
            if(param == 'z'){
                var zoom = provider_string[i].split('=')[1];
            }

            // lat
            if(param == 'lat'){
                var lat = provider_string[i].split('=')[1];
            }

            // lon
            if(param == 'lon'){
                var lon = provider_string[i].split('=')[1];
            }


            // map type
            if(param == 'm'){
                var mt = provider_string[i].split('=')[1].split('%2C')[0];
                if(mt == 'b'){
                    document.getElementById("wikimapia").className='hidden';
                } else {
                    document.getElementById("wikimapia_map").className='hidden';
                }
            }
        }
        coord[0] = lon;
        coord[1] = lat;
    }

    if(zoom && coord && coord.length == 2){
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

        document.getElementById("bestmaps_y").href='http://bestmaps.ru/map?k=yandex#t=hybrid&' + 'lat='+coord[1]+'&lon='+coord[0]+'&z=' + zoom;
        document.getElementById("bestmaps_y_map").href='http://bestmaps.ru/map?k=yandex#t=map&' + 'lat='+coord[1]+'&lon='+coord[0]+'&z=' + zoom;

        document.getElementById("bestmaps_g").href='http://bestmaps.ru/map?k=google#t=hybrid&' + 'lat='+coord[1]+'&lon='+coord[0]+'&z=' + zoom;
        document.getElementById("bestmaps_g_map").href='http://bestmaps.ru/map?k=google#t=map&' + 'lat='+coord[1]+'&lon='+coord[0]+'&z=' + zoom;

        document.getElementById("bestmaps_ovi").href='http://bestmaps.ru/map?k=ovi#t=hybrid&' + 'lat='+coord[1]+'&lon='+coord[0]+'&z=' + zoom;
        document.getElementById("bestmaps_ovi_map").href='http://bestmaps.ru/map?k=ovi#t=map&' + 'lat='+coord[1]+'&lon='+coord[0]+'&z=' + zoom;

        document.getElementById("bestmaps_2gis").href='http://bestmaps.ru/map?k=2gis#t=map&' + 'lat='+coord[1]+'&lon='+coord[0]+'&z=' + zoom;

        // coord
        document.getElementById("lat").innerText = coord[1];
        document.getElementById("lon").innerText = coord[0];

        // GE
        document.getElementById("earth_kml").href='http://bestmaps.ru/kml_generate/?lat='+coord[1]+'&lon='+coord[0];
    } else {
        console.error('Coord not found');
    }
    //chrome.tabs.create({url: '}, function(){});
});

function getCoordinatesFromMeters(meters)
{
    if(meters < 533){
        return 17;

    } else if(meters < 1066){
        return 16;

    } else if(meters < 2132){
        return 15;

    } else if(meters < 4267){
        return 14;

    } else if(meters < 8539){
        return 13;

    } else if(meters < 17074){
        return 12;

    } else if(meters < 34153){
        return 11;

    } else if(meters < 68230){
        return 10;

    } else {
        return 9;
    }
}
/* 
 // Run when document's DOM is ready.
 document.addEventListener('DOMContentLoaded', function () {
 });
 */