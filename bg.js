﻿chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    chrome.pageAction.setIcon({tabId: tab.id, path:"icon16-grey.png"});
    chrome.pageAction.setTitle({tabId: tab.id,title:"Map Helper"});

    var url = tab.url;
    if(url) {
        var url_parts = url.split('/'); // разбиваем весь урл на массив с помощью слеша
        var host = url_parts[2]; // берем 2 элемент этого массива - домен:     http://domain.ru/map
        var host_parts = host.split('.'); // разбиваем домен на состовные части точкой
        var host_clean = host_parts[host_parts.length - 2]; // берем основной домен (yandex, google, bestmaps)

        if (['bestmaps', 'openstreetmap', 'here', 'wikimapia', 'loadmap', '2gis', 'brouter', 'qwant', 'mapillary', 'waze',
                'strava', 'nakarte', 'xn--e1aaps0bc', 'opentopomap', 'navitel', 'airbnb', 'cellmapper', 'antiborschevik', 'wikimap'].indexOf(host_clean) != -1
            || /(google.*maps)/.test(url)
            || /(yandex.*maps)/.test(url)
            || /bing.*maps/.test(url)
            || /maps\.sputnik\.ru/.test(url)
            || /mapy\.cz/.test(url)
            || /loc\.alize\.us/.test(url)
            || /rosreestr\.ru/.test(url)
        ) {
            chrome.pageAction.setIcon({tabId: tab.id, path: "icon16.png"});
        }
    }
    chrome.pageAction.show(tab.id);

});
