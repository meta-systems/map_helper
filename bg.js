chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    chrome.pageAction.setIcon({tabId: tab.id,path:"icon.png"});
    chrome.pageAction.setTitle({tabId: tab.id,title:"Другие карты"});

    var url_parts = tab.url.split( '/' ); // разбиваем весь урл на массив с помощью слеша
    var host = url_parts[2]; // берем третий элемент этого массива - домен:     http://domain.ru/map
    var host_parts = host.split( '.' ); // разбиваем домен на состовные части точкой
    var host_clean = host_parts[host_parts.length-2]; // берем основной домен (yandex, google, bestmaps)

    if(
        ['bestmaps', 'openstreetmap', 'here', 'wikimapia'].indexOf(host_clean) != -1 ||
        (host_clean == 'google' && url_parts[3] == 'maps') ||
        (host_clean == 'yandex' && url_parts[3] == 'maps') ||
        (host_clean == 'bing' && url_parts[3] == 'maps')
        //(host_clean == 'yandex' && host_parts[host_parts.length-3] == 'maps')
    ) {
        chrome.pageAction.show(tab.id);
    }
});

/* 
 chrome.tabs.onCreated.addListener(function(tab) {
 // console.log(tab.id);
 chrome.pageAction.setIcon({tabId: tab.id,path:"icon.png"});
 chrome.pageAction.setTitle({tabId: tab.id,title:"Альтернативные карты"});
 chrome.pageAction.show(tab.id);
 });

 if(/bestmaps|openstreetmap|here|wikimapia/.test(url)||
 /google|maps/.test(url)||
 /yandex|maps/.test(url)||
 /bing|mapspreview/.test(url)||
 /panaramio|map/.test(url)
 )

 */

