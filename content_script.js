
function content_helper() {

    var lat, lon, zoom;

    /*
     * Loadmap: getting coords from GoogleAPI logo
     */
    var gmEl = document.getElementsByClassName("gm-style");
    var openLayersEl = document.getElementsByClassName("olControlPermalink");
    if(gmEl.length) {
        var gmLink = gmEl[0].children[2].children[0];
        var gmUrl = gmLink.href;
        var q_str = gmUrl.split('?')[1];

        q_str.split('&').forEach(function (value) {
            var pair = value.split('=');
            if(pair[0] === 'z') {
                zoom = pair[1];
            }
            else if(pair[0] === 'll') {
                var gcoord = pair[1].split(',');
                lat = gcoord[0];
                lon = gcoord[1];
            }
        });
    }
    /*
     * Chepetsk OpenLayers permalink
     */
    else if(openLayersEl.length) {
        var olLink = openLayersEl[0].firstElementChild.href;
        var q_str = olLink.split('?')[1];

        q_str.split('&').forEach(function (value) {
            var pair = value.split('=');
            if(pair[0] === 'zoom') {
                zoom = pair[1];
            }
            else if(pair[0] === 'lat') {
                lat = pair[1];
            }
            else if(pair[0] === 'lon') {
                lon = pair[1];
            }
        });
    }
    /*
     * Bing: getting coords from LocalStorage
     */
    else {
        lat = localStorage.getItem("centerLatitude");
        lon = localStorage.getItem("centerLongitude");
        zoom = localStorage.getItem("zoom");
    }

    return {
        lat: lat,
        lon: lon,
        zoom: zoom
    };
}


chrome.runtime.sendMessage({
	action: "coords",
    coords: content_helper()
});
