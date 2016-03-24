chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    chrome.pageAction.setIcon({tabId: tab.id,path:"icon.png"});
    chrome.pageAction.setTitle({tabId: tab.id,title:"Другие карты"});

    var url_parts = tab.url.split( '/' );
    var host = url_parts[2];
    var host_parts = host.split( '.' );
    var host_clean = host_parts[host_parts.length-2];

    if(
        ['bestmaps', 'openstreetmap', 'here', 'wikimapia'].indexOf(host_clean) != -1 ||
        (host_clean == 'google' && url_parts[3] == 'maps') ||
        (host_clean == 'bing' && url_parts[3] == 'maps') ||
        (host_clean == 'yandex' && host_parts[host_parts.length-3] == 'maps')
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
 */

